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

const visual = (product, className) => {
  const src = imageCandidate(product);
  if (!src) {
    return `<div class="${className}" aria-hidden="true">${productInitial(product)}</div>`;
  }
  return `<div class="${className}"><img src="${src}" alt="${escapeHtml(text(product.title, "商品画像"))}" loading="lazy" onerror="this.parentElement.textContent='${productInitial(product)}';"></div>`;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const statusLine = () => document.querySelector("#store-status");

const setStatus = (message) => {
  const node = statusLine();
  if (node) node.textContent = message;
};

const purchaseAction = (product) => {
  if (product.stripe_payment_link) {
    return `<a class="action-link primary" href="${escapeHtml(product.stripe_payment_link)}" rel="noopener" target="_blank">Stripeで購入</a>`;
  }
  if (product.booth_url) {
    return `<a class="action-link primary" href="${escapeHtml(product.booth_url)}" rel="noopener" target="_blank">BOOTHで見る</a>`;
  }
  return `<span class="action-link" aria-disabled="true">準備中</span>`;
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

  return `
    <article class="product-card">
      ${visual(product, "product-visual")}
      <div class="product-body">
        <div class="meta-row">
          <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
          <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
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

  const suffix = state.doNotEdit ? " generated JSON / 手編集禁止" : " generated JSON";
  setStatus(`${products.length}件を表示中（全${state.products.length}件 / ${suffix}）`);
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
  const release = product.github_release_url
    ? `<a class="action-link" href="${escapeHtml(product.github_release_url)}" rel="noopener" target="_blank">GitHub Release</a>`
    : "";

  detail.innerHTML = `
    ${visual(product, "detail-visual")}
    <section class="detail-panel">
      <div class="meta-row">
        <span class="pill">${escapeHtml(typeLabel(product.type))}</span>
        <span class="pill">${escapeHtml(text(product.category, "カテゴリ未設定"))}</span>
      </div>
      <h2>${escapeHtml(text(product.title, "商品名未設定"))}</h2>
      <p>${escapeHtml(text(product.catch || product.description, "説明準備中"))}</p>
      <div class="price">${escapeHtml(yen(product.price))}</div>
      <div class="detail-actions">${action}${release}</div>
      <p class="source-note">購入後のダウンロード案内は商品ごとの案内に従ってください。現在、一部商品はBOOTH導線またはGitHub Releaseでの配布を併用しています。</p>
      <ul class="detail-list">
        <li><b>説明</b>${escapeHtml(text(product.description, "説明準備中"))}</li>
        <li><b>payment_status</b>${escapeHtml(text(product.payment_status, "preparing"))}</li>
        <li><b>Stripe Payment Link</b>${escapeHtml(product.stripe_payment_link ? "設定あり" : "未設定")}</li>
        <li><b>BOOTH URL</b>${escapeHtml(text(product.booth_url, "準備中"))}</li>
        <li><b>GitHub Release</b>${escapeHtml(text(product.github_release_url, "未設定"))}</li>
        <li><b>download_url</b>${escapeHtml(text(product.download_url, "未確定"))}</li>
      </ul>
      <div class="tag-list">${(product.tags || []).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
      <p class="source-note">source_original: ${escapeHtml(text(product.source_original, "未設定"))}</p>
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
