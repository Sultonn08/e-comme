function renderSiteHeader(storeName, navigationLinks, homeUrl, cartUrl, accountUrl, productsUrl, text) {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const links = navigationLinks
    .map(({ label, url, key }) => `<a href="${escape(url)}"><span${key ? ` data-content="${escape(key)}"` : ""}>${escape(label)}</span></a>`)
    .join("");

  document.getElementById("hdr").innerHTML = `
    <div class="promo" data-content="shared.promo">${escape(text.promo)}</div>
    <div class="wrap top">
      <a class="logo" href="${escape(homeUrl)}"><span data-content="shared.brand">${escape(storeName)}</span></a>
      <nav aria-label="Menu utama">${links}</nav>
      <div class="header-right">
        <form class="site-search" action="${escape(productsUrl)}" method="get" role="search">
          <label class="visually-hidden" for="site-search-input">${escape(text.searchLabel)}</label>
          <input id="site-search-input" type="search" name="q" placeholder="${escape(text.search)}" aria-label="${escape(text.searchLabel)}" data-content-placeholder="products.search" data-content-aria-label="products.search">
          <button type="submit" aria-label="${escape(text.searchButton)}">
            <svg class="header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span class="search-btn-text" data-content="shared.search_button">${escape(text.searchButton)}</span>
          </button>
        </form>
        <div class="account-nav">
          <a class="account-link" href="${escape(accountUrl)}" title="${escape(text.account)}" aria-label="${escape(text.account)}">
            <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="nav-text" data-content="shared.nav_account">${escape(text.account)}</span>
          </a>
          <a class="cart" href="${escape(cartUrl)}" title="${escape(text.cart)}" aria-label="${escape(text.cart)}">
            <div class="cart-icon-wrapper">
              <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span class="badge" id="badge">0</span>
            </div>
            <span class="nav-text" data-content="shared.nav_cart">${escape(text.cart)}</span>
          </a>
        </div>
      </div>
    </div>`;
}
