const DATA_URL = "/assets/data/store_products.generated.json";
const APPS_DATA_URL = "/assets/data/apps.generated.json";

const state = {
  products: [],
  apps: [],
  filteredType: "all",
  sourcePolicy: "",
  doNotEdit: false,
};

const nullish = (value) => value === null || value === undefined || value === "";

const yen = (value) => {
  if (nullish(value)) return "価格未設定";
  const number = Number(value);
  if (Number.isFinite(number)) return `${number.toLocaleString("ja-JP")}円`;
  return String(value);
};

const typeLabel = (type) => {
  const labels = {
    app: "アプリ",
    pack: "Pack",
    shimarisu_pack: "SHIMARISU Pack",
  };
  return labels[type] || type || "unknown";
};

const text = (value, fallback = "未設定") => {
  if (Array.isArray(value)) return value.filter(Boolean).join(" / ") || fallback;
  return nullish(value) ? fallback : String(value);
};

const productInitial = (product) => {
  const title = text(product.short_title || product.title, "DAKE");
  return title.replace(/^Dake/i, "").trim().slice(0, 2) || "D";
};

const safeProductId = (product) => {
  const value = product && product.id;
  const normalized = String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
  return /^[a-z][a-z0-9_]{2,79}$/.test(normalized) ? normalized : "";
};

const itemCategory = (product) => {
  const normalized = String((product && product.type) || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
  return /^[a-z][a-z0-9_-]{1,63}$/.test(normalized) ? normalized : "";
};

const marketObserverProductAttrs = (product) => {
  const productId = safeProductId(product);
  const category = itemCategory(product);
  const attrs = [];
  if (productId) attrs.push(`data-market-observer-product-id="${escapeHtml(productId)}"`);
  if (category) attrs.push(`data-market-observer-item-category="${escapeHtml(category)}"`);
  return attrs.join(" ");
};

const imageCandidate = (product) => {
  const src = product.thumbnail || product.image;
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  if (product.id) return `/assets/images/products/${encodeURIComponent(product.id)}/thumbnail.jpg`;
  return "";
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const visual = (product, className) => {
  const src = imageCandidate(product);
  if (!src) {
    return `<div class="${className}" aria-hidden="true"><span>${productInitial(product)}</span></div>`;
  }
  return `<div class="${className}"><img src="${src}" alt="${escapeHtml(text(product.title, "商品画像"))}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${productInitial(product)}</span>';" /></div>`;
};

const statusLine = () => document.querySelector("#store-status");

const setStatus = (message) => {
  const node = statusLine();
  if (node) node.textContent = message;
};

const isPublicProduct = (product) =>
  product.status === "available" &&
  product.payment_status === "stripe_ready" &&
  Boolean(product.stripe_payment_link);

const purchaseAction = (product) => {
  if (!product.stripe_payment_link) return "";
  const trackingAttrs = marketObserverProductAttrs(product);
  return `<a class="action-link primary" href="${escapeHtml(product.stripe_payment_link)}" rel="noopener" target="_blank" ${trackingAttrs}>購入する</a>`;
};

const isPackProduct = (product) =>
  Boolean(product && (product.type === "pack" || product.type === "shimarisu_pack"));

const deliveryNotice = (product) => {
  if (!product || !product.stripe_payment_link) return "";
  if (isPackProduct(product)) {
    return `
      <p class="purchase-note">
        Stripe決済完了後の案内ページからPack ZIPをダウンロードできます。ZIPを解凍してご利用ください。
      </p>
    `;
  }
  return `
    <p class="purchase-note">
      Stripe決済完了後の案内ページからZIPをダウンロードできます。
    </p>
  `;
};

const formatMultiline = (value, fallback = "未設定") =>
  escapeHtml(text(value, fallback)).replaceAll("\n", "<br>");

const includedItemsSection = (product) => {
  const items = Array.isArray(product && product.included_items) ? product.included_items : [];
  if (!items.length) return "";
  const listItems = items
    .map((entry) => {
      const name = entry.item || entry.name || entry.folder || "";
      const role = entry.role || "";
      if (!name) return "";
      return `<li><strong>${escapeHtml(name)}</strong>${role ? ` — ${escapeHtml(role)}` : ""}</li>`;
    })
    .filter(Boolean)
    .join("");
  if (!listItems) return "";
  return `
    <h3>同梱アプリ・構成物</h3>
    <ul class="included-list">${listItems}</ul>
  `;
};

const tagList = (tags, className = "tag-list") => {
  const values = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (!values.length) return "";
  return `<div class="${className}">${values.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>`;
};

async function loadProducts() {
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  state.sourcePolicy = data.source_policy || "";
  state.doNotEdit = data.do_not_edit === true;
  state.products = (data.items || []).filter(isPublicProduct);
}

async function loadApps() {
  try {
    const response = await fetch(APPS_DATA_URL, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    state.apps = Array.isArray(data.apps) ? data.apps : [];
  } catch (_error) {
    state.apps = [];
  }
}

function productCard(product) {
  const detailUrl = `/product/?id=${encodeURIComponent(product.id)}`;
  const action = purchaseAction(product);
  const trackingAttrs = marketObserverProductAttrs(product);

  return `
    <article class="product-card" ${trackingAttrs}>
      ${visual(product, "product-visual")}
      <div class="product-body">
        <div class="meta-row">
          <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
          <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
        </div>
        <h2>${escapeHtml(text(product.title, "商品名未設定"))}</h2>
        <p>${escapeHtml(text(product.catch || product.description, "DAKEの商品です。"))}</p>
        <div class="price">${escapeHtml(yen(product.price))}</div>
        <div class="card-actions">
          <a class="action-link" href="${detailUrl}" data-market-observer-event="select_item" ${trackingAttrs}>詳細</a>
          ${action}
        </div>
      </div>
    </article>
  `;
}

function renderList() {
  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  const products = state.products.filter((item) => state.filteredType === "all" || item.type === state.filteredType);
  grid.innerHTML = products.map(productCard).join("");
  setStatus(`${products.length}件を表示中`);
}

function setupFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      state.filteredType = button.dataset.filter || "all";
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderList();
    });
  });
}

const sourceFolder = (product) => {
  const source = product.source_original || "";
  const parts = source.replaceAll("\\", "/").split("/");
  const originalIndex = parts.lastIndexOf("ORIGINAL.md");
  if (originalIndex > 0) return parts[originalIndex - 1];
  return "";
};

const normalizeKey = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9]+/g, "");

const findAppForProduct = (product) => {
  if (!product || product.type !== "app") return null;
  const productKeys = [
    product.source_original,
    sourceFolder(product),
    product.id,
  ].map(normalizeKey);

  return (
    state.apps.find((app) => {
      const appKeys = [
        app.source_original,
        app.folder_name,
        app.app_key,
        app.slug,
      ].map(normalizeKey);
      return productKeys.some((key) => key && appKeys.includes(key));
    }) || null
  );
};

const detailAction = (product) => {
  const app = findAppForProduct(product);
  if (!app || !app.detail_url) return "";
  return `<a class="action-link" href="${escapeHtml(app.detail_url)}">Detail</a>`;
};

const findProduct = (id) => {
  if (!id) return null;
  return (
    state.products.find((item) => item.id === id) ||
    state.products.find((item) => sourceFolder(item) === id) ||
    null
  );
};

function renderDetail() {
  const detail = document.querySelector("#product-detail");
  if (!detail) return;

  const id = new URLSearchParams(location.search).get("id");
  const product = findProduct(id);

  if (!id || !product) {
    setStatus("商品が見つかりませんでした。");
    detail.innerHTML = `<section class="detail-panel"><h2>商品が見つかりませんでした。</h2><p>商品一覧から選び直してください。</p><p><a class="action-link" href="/">Storeへ戻る</a></p></section>`;
    return;
  }

  document.title = `${text(product.title)} | DAKE Store`;
  const action = purchaseAction(product);
  const detailLink = detailAction(product);
  const tags = tagList(product.tags);
  const version = nullish(product.version) ? "" : `<span class="pill">v${escapeHtml(text(product.version))}</span>`;
  const disclaimer = text(product.disclaimer, "各ツールは作業補助を目的としたものです。重要なファイルは事前にバックアップしてください。");

  detail.innerHTML = `
    ${visual(product, "detail-visual")}
    <section class="detail-panel">
      <div class="meta-row">
        <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
        <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
        ${version}
      </div>
      <h2>${escapeHtml(text(product.title, "商品名未設定"))}</h2>
      <p class="detail-catch">${escapeHtml(text(product.catch || product.description, "DAKEの商品です。"))}</p>
      <div class="price">${escapeHtml(yen(product.price))}</div>
      ${tags}
      <div class="detail-actions">${detailLink}${action}</div>
      ${deliveryNotice(product)}
      <div class="detail-copy">
        <h3>説明</h3>
        <p>${formatMultiline(product.description, "DAKEの商品です。")}</p>
        ${includedItemsSection(product)}
        <h3>注意事項</h3>
        <p>${formatMultiline(disclaimer)}</p>
      </div>
    </section>
  `;
  setStatus("商品詳細を表示しています。");
  window.DakeStoreMarketObserver?.trackViewItem(product);
}

async function main() {
  try {
    await loadProducts();
    await loadApps();
    setupFilters();
    renderList();
    renderDetail();
  } catch (error) {
    console.error(error);
    setStatus("商品情報を読み込めませんでした。");
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    state,
    isPublicProduct,
    isPackProduct,
    purchaseAction,
    deliveryNotice,
    includedItemsSection,
    productCard,
    findProduct,
  };
}

if (typeof document !== "undefined") {
  main();
}
