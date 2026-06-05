const DATA_URL = "/assets/data/store_products.generated.json";

const state = {
  products: [],
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

const paymentState = (product) => {
  if (product.stripe_payment_link) {
    return { label: "Stripe対応", className: "payment-stripe", action: "Stripeで購入" };
  }
  if (product.booth_url) {
    return { label: "BOOTH", className: "payment-booth", action: "BOOTHで見る" };
  }
  return { label: "準備中", className: "payment-preparing", action: "準備中" };
};

const purchaseAction = (product) => {
  if (product.stripe_payment_link) {
    return `<a class="action-link primary" href="${escapeHtml(product.stripe_payment_link)}" rel="noopener" target="_blank">Stripeで購入</a>`;
  }
  if (product.booth_url) {
    return `<a class="action-link booth" href="${escapeHtml(product.booth_url)}" rel="noopener" target="_blank">BOOTHで見る</a>`;
  }
  return `<span class="action-link is-disabled" aria-disabled="true">準備中</span>`;
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
  state.products = (data.items || []).filter((item) => item.status === "available");
}

function productCard(product) {
  const detailUrl = `/product/?id=${encodeURIComponent(product.id)}`;
  const action = purchaseAction(product);
  const payment = paymentState(product);

  return `
    <article class="product-card">
      ${visual(product, "product-visual")}
      <div class="product-body">
        <div class="meta-row">
          <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
          <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
          <span class="pill payment-pill ${payment.className}">${escapeHtml(payment.label)}</span>
        </div>
        <h2>${escapeHtml(text(product.title, "商品名未設定"))}</h2>
        <p>${escapeHtml(text(product.catch || product.description, "説明準備中"))}</p>
        <div class="price">${escapeHtml(yen(product.price))}</div>
        <div class="card-actions">
          <a class="action-link" href="${detailUrl}">詳細</a>
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
  const payment = paymentState(product);
  const tags = tagList(product.tags);
  const disclaimer = text(product.disclaimer, "各ツールは作業補助を目的としたものです。重要なファイルは事前にバックアップしてください。");

  detail.innerHTML = `
    ${visual(product, "detail-visual")}
    <section class="detail-panel">
      <div class="meta-row">
        <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
        <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
        <span class="pill payment-pill ${payment.className}">${escapeHtml(payment.label)}</span>
      </div>
      <h2>${escapeHtml(text(product.title, "商品名未設定"))}</h2>
      <p class="detail-catch">${escapeHtml(text(product.catch || product.description, "説明準備中"))}</p>
      <div class="price">${escapeHtml(yen(product.price))}</div>
      ${tags}
      <div class="detail-actions">${action}</div>
      <p class="purchase-note">購入後の案内は、決済サービスまたは商品ページの案内に従ってください。一部の商品はBOOTHでの配布を併用しています。</p>
      <div class="detail-copy">
        <h3>説明</h3>
        <p>${escapeHtml(text(product.description, "説明準備中"))}</p>
        <h3>注意事項</h3>
        <p>${escapeHtml(disclaimer)}</p>
      </div>
    </section>
  `;
  setStatus("商品詳細を表示しています。");
}

async function main() {
  try {
    await loadProducts();
    setupFilters();
    renderList();
    renderDetail();
  } catch (error) {
    console.error(error);
    setStatus("商品情報を読み込めませんでした。");
  }
}

main();
