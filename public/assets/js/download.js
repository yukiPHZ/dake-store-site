(() => {
  const pending = document.querySelector("#download-pending");
  const ready = document.querySelector("#download-ready");
  const error = document.querySelector("#download-error");
  const product = document.querySelector("#download-product");
  const link = document.querySelector("#download-link");

  const showError = () => {
    pending.hidden = true;
    ready.hidden = true;
    error.hidden = false;
  };

  const verify = async () => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
    if (!sessionId) {
      showError();
      return;
    }

    try {
      const query = `session_id=${encodeURIComponent(sessionId)}`;
      const response = await fetch(`/api/download-status?${query}`, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("purchase_not_verified");
      const data = await response.json();
      if (!data.title) throw new Error("purchase_not_verified");

      product.textContent = data.title;
      link.href = `/api/download?${query}`;
      pending.hidden = true;
      error.hidden = true;
      ready.hidden = false;
      window.history.replaceState({}, "", "/download/");
    } catch (_error) {
      showError();
    }
  };

  verify();
})();
