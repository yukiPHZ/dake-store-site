(function attachDakeStoreMarketObserver(root) {
  "use strict";

  const analyticsConsentKey = "market_observer_analytics_consent";
  const legacyOptOutKey = "market_observer_opt_out";
  const boundKey = "__DAKE_STORE_MARKET_OBSERVER_BOUND__";
  const viewKey = "__DAKE_STORE_VIEWED_ITEMS__";
  const safeCtaIds = new Set([
    "store_home",
    "products",
    "product_detail",
    "app_detail",
    "dake_home",
    "tools",
    "ai",
    "gis",
    "labs",
    "games",
    "peakheadz",
    "legal",
    "privacy",
    "terms",
  ]);
  const safeCtaGroups = new Set(["store_header", "product_card", "product_detail", "footer_network", "footer_legal", "content"]);

  const PRIVACY_NOTICE = [
    "Google Analytics 4 is used only after explicit opt-in.",
    "Analytics are off by default.",
    "We do not send raw query strings, URL hashes, product descriptions, purchase information, Stripe Payment Link URLs, BOOTH URLs, names, email addresses, phone numbers, addresses, input text, output text, clipboard text, secrets, credentials, or tokens.",
    "See https://policies.google.com/technologies/partner-sites for Google's explanation.",
  ].join(" ");

  function routeConfig() {
    return root.DakeStoreMarketObserverConfig || {};
  }

  function runtimePackage() {
    return root.MarketObserverRuntimePackage || {};
  }

  function routeProfile() {
    const config = routeConfig();
    const pack = runtimePackage();
    if (config.projectId && pack.profiles && pack.profiles[config.projectId]) return pack.profiles[config.projectId];
    if (pack.profile && pack.profile.project_id === config.projectId) return pack.profile;
    return null;
  }

  function consentOptions() {
    return {
      locale: "ja",
      detailsSelector: ".analytics-privacy",
      settingsContainerSelector: ".analytics-privacy-body",
      privacyUrl: "/privacy/",
    };
  }

  function consentApi() {
    return root.MarketObserverConsent || null;
  }

  function readAnalyticsConsent() {
    const api = consentApi();
    if (api && typeof api.read === "function") return api.read().state;
    try {
      if (!root.localStorage) return "unavailable";
      if (root.localStorage.getItem(legacyOptOutKey) === "true") {
        root.localStorage.setItem(analyticsConsentKey, "denied");
        root.localStorage.removeItem(legacyOptOutKey);
        return "denied";
      }
      const value = root.localStorage.getItem(analyticsConsentKey);
      if (value === "granted" || value === "denied") return value;
      return "unknown";
    } catch (_error) {
      return "unavailable";
    }
  }

  function ensurePrivacyPanel() {
    const document = root.document;
    if (!document || document.querySelector(".analytics-privacy")) return;
    const footer = document.querySelector(".site-footer") || document.body;
    if (!footer) return;
    const details = document.createElement("details");
    details.className = "analytics-privacy";
    details.innerHTML = [
      "<summary>アクセス解析について</summary>",
      '<div class="analytics-privacy-body">',
      "<p>DAKE Storeでは、明示的に許可された場合だけGoogle Analytics 4を使用し、匿名の利用状況を確認します。Analytics are off by default.</p>",
      "<p>送信する可能性があるイベントは、page_view、view_item、select_item、stripe_outbound、booth_outbound、cta_click、client_exceptionです。</p>",
      "<p>入力内容、出力内容、clipboard本文、氏名、メールアドレス、電話番号、住所、購入情報、商品説明全文、raw query strings、URL hash、Stripe Payment Link URLs、BOOTH URLは送信しません。</p>",
      '<p>選択の保存にはlocalStorageを使います。許可は任意で、いつでも撤回できます。Google Signalsと広告パーソナライズはOFFです。Googleによるデータ利用の説明は <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Googleのページ</a> を確認してください。</p>',
      '<div class="analytics-opt-out" aria-live="polite">',
      '<span id="market-observer-consent-status">アクセス解析：未選択</span>',
      '<button id="market-observer-consent-allow" class="market-observer-consent-button" type="button">許可する</button>',
      '<button id="market-observer-consent-deny" class="market-observer-consent-button" type="button">許可しない</button>',
      "</div>",
      "</div>",
    ].join("");
    footer.appendChild(details);
  }

  function initializeMarketObserver() {
    ensurePrivacyPanel();
    if (root.MarketObserverConsent && typeof root.MarketObserverConsent.mount === "function") {
      root.MarketObserverConsent.mount(consentOptions());
    }
    try {
      if (readAnalyticsConsent() !== "granted") return { ok: false, reason: "consent_not_granted" };
      const pack = runtimePackage();
      const profile = routeProfile();
      const config = routeConfig();
      if (!root.MarketObserver || !pack.runtimeSchema || !profile || !config.measurementId) {
        return { ok: false, reason: "missing_runtime_or_config" };
      }
      const result = root.MarketObserver.init({
        measurementId: config.measurementId,
        runtimeSchema: pack.runtimeSchema,
        profile,
        runtimeSchemaHash: pack.runtimeSchemaHash,
        profileHash: pack.profileHashes?.[profile.project_id] || pack.profileHash,
        transport: config.transport,
      });
      if (result.ok) root.MarketObserver.trackPageView();
      return result;
    } catch (_error) {
      return { ok: false, reason: "tracker_init_exception" };
    }
  }

  function createActionToken(prefix) {
    if (root.crypto?.randomUUID) return root.crypto.randomUUID();
    const randomPart = root.crypto?.getRandomValues
      ? Array.from(root.crypto.getRandomValues(new Uint32Array(4)), (value) => value.toString(16)).join("")
      : Math.random().toString(36).slice(2);
    return `${prefix || "store"}-${Date.now().toString(36)}-${randomPart}`;
  }

  function safeProductId(product) {
    const value = typeof product === "string" ? product : product && product.id;
    const normalized = String(value || "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);
    return /^[a-z][a-z0-9_]{2,79}$/.test(normalized) ? normalized : "";
  }

  function itemCategory(product) {
    const value = typeof product === "string" ? product : product && product.type;
    const normalized = String(value || "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 64);
    return /^[a-z][a-z0-9_-]{1,63}$/.test(normalized) ? normalized : "";
  }

  function extractBoothItemId(url) {
    try {
      const parsed = new URL(url, root.location && root.location.href ? root.location.href : "https://store.dakeapp.com/");
      const match = parsed.hostname === "peakheadz.booth.pm" ? parsed.pathname.match(/^\/items\/([0-9A-Za-z_-]{1,80})\/?$/) : null;
      return match ? match[1] : "";
    } catch (_error) {
      return "";
    }
  }

  function track(eventName, parameters, options) {
    try {
      if (!root.MarketObserver || typeof root.MarketObserver.track !== "function") return { ok: false, reason: "tracker_missing" };
      return root.MarketObserver.track(eventName, parameters, options || {});
    } catch (_error) {
      return { ok: false, reason: "track_exception" };
    }
  }

  function productParameters(productOrDataset) {
    const product_id = safeProductId(productOrDataset && (productOrDataset.marketObserverProductId || productOrDataset.id || productOrDataset));
    const item_category = itemCategory(productOrDataset && (productOrDataset.marketObserverItemCategory || productOrDataset.type));
    const params = {};
    if (product_id) params.product_id = product_id;
    if (item_category) params.item_category = item_category;
    return params;
  }

  function trackViewItem(product) {
    const parameters = productParameters(product);
    if (!parameters.product_id) return { ok: false, reason: "missing_product_id" };
    const viewed = root[viewKey] || new Set();
    root[viewKey] = viewed;
    if (viewed.has(parameters.product_id)) return { ok: false, reason: "deduped" };
    viewed.add(parameters.product_id);
    return track("view_item", parameters, { actionToken: `view:${parameters.product_id}` });
  }

  function trackSelectItem(dataset) {
    const parameters = productParameters(dataset || {});
    if (!parameters.product_id) return { ok: false, reason: "missing_product_id" };
    return track("select_item", parameters, { actionToken: createActionToken("select_item") });
  }

  function normalizePath(pathname) {
    let path = pathname || "/";
    if (!path.startsWith("/")) path = `/${path}`;
    path = path.replace(/\/{2,}/g, "/");
    if (!path.endsWith("/")) {
      const last = path.split("/").pop();
      if (last && !last.includes(".")) path = `${path}/`;
    }
    return path;
  }

  function closestGroup(anchor) {
    if (!anchor || typeof anchor.closest !== "function") return "content";
    if (anchor.closest(".site-header")) return "store_header";
    if (anchor.closest(".product-card")) return "product_card";
    if (anchor.closest(".product-detail")) return "product_detail";
    if (anchor.closest(".footer-network")) return "footer_network";
    if (anchor.closest(".footer-legal")) return "footer_legal";
    return "content";
  }

  function ctaEvent(ctaId, anchor, destinationType) {
    if (!safeCtaIds.has(ctaId)) return null;
    const parameters = {
      cta_id: ctaId,
      cta_group: safeCtaGroups.has(closestGroup(anchor)) ? closestGroup(anchor) : "content",
    };
    if (destinationType) parameters.destination_type = destinationType;
    return { eventName: "cta_click", parameters };
  }

  function classifyAnchor(anchor) {
    if (!anchor || typeof anchor.getAttribute !== "function") return null;
    if (anchor.dataset && anchor.dataset.marketObserverEvent === "select_item") {
      return { eventName: "select_item", parameters: productParameters(anchor.dataset) };
    }
    const href = anchor.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
    let url;
    try {
      url = new URL(href, root.location && root.location.href ? root.location.href : "https://store.dakeapp.com/");
    } catch (_error) {
      return null;
    }
    const host = url.hostname.toLowerCase();
    const path = normalizePath(url.pathname || "/");

    if (host === "buy.stripe.com") {
      return {
        eventName: "stripe_outbound",
        parameters: Object.assign(productParameters(anchor.dataset || {}), {
          destination_host: "buy.stripe.com",
          destination_path_class: "payment_link",
        }),
      };
    }
    if (host === "peakheadz.booth.pm") {
      const booth_item_id = extractBoothItemId(url.href);
      return {
        eventName: "booth_outbound",
        parameters: Object.assign(productParameters(anchor.dataset || {}), {
          booth_item_id,
          destination_host: "peakheadz.booth.pm",
          destination_path_class: "item_detail",
        }),
      };
    }
    if (host === "dakeapp.com" && path.startsWith("/apps/")) return ctaEvent("app_detail", anchor, "internal");
    if (host === "dakeapp.com") return ctaEvent("dake_home", anchor, "internal");
    if (host === "tools.dakeapp.com") return ctaEvent("tools", anchor, "internal");
    if (host === "ai.dakeapp.com") return ctaEvent("ai", anchor, "internal");
    if (host === "gis.dakeapp.com") return ctaEvent("gis", anchor, "internal");
    if (host === "labs.dakeapp.com") return ctaEvent("labs", anchor, "internal");
    if (host === "games.dakeapp.com") return ctaEvent("games", anchor, "internal");
    if (host === "peakheadz.com") return ctaEvent("peakheadz", anchor);

    const sameSite = host === "store.dakeapp.com" || (root.location && host === root.location.hostname.toLowerCase());
    if (!sameSite) return null;
    if (path === "/") return ctaEvent("store_home", anchor, "internal");
    if (path === "/products/") return ctaEvent("products", anchor, "internal");
    if (path === "/product/") return ctaEvent("product_detail", anchor, "internal");
    if (path === "/legal/") return ctaEvent("legal", anchor, "internal");
    if (path === "/privacy/") return ctaEvent("privacy", anchor, "internal");
    if (path === "/terms/") return ctaEvent("terms", anchor, "internal");
    return null;
  }

  function trackNavigation(anchor) {
    const classified = classifyAnchor(anchor);
    if (!classified) return { ok: false, reason: "not_trackable" };
    if (classified.eventName === "select_item") return trackSelectItem(anchor.dataset || {});
    return track(classified.eventName, classified.parameters, {
      actionToken: createActionToken(classified.eventName),
    });
  }

  function bindNavigationTracking() {
    const document = root.document;
    if (!document || root[boundKey]) return;
    root[boundKey] = true;
    document.addEventListener("click", (event) => {
      const target = event && event.target;
      const anchor = target && typeof target.closest === "function" ? target.closest("a[href]") : null;
      if (!anchor) return;
      trackNavigation(anchor);
    }, true);
  }

  function start() {
    const result = initializeMarketObserver();
    bindNavigationTracking();
    return result;
  }

  root.DakeStoreMarketObserver = {
    start,
    initializeMarketObserver,
    trackNavigation,
    trackViewItem,
    safeProductId,
    itemCategory,
    extractBoothItemId,
    createActionToken,
    privacyNotice: PRIVACY_NOTICE,
  };

  start();
})(typeof window !== "undefined" ? window : globalThis);
