function renderSiteFooter(storeName, contactUrl, products, onSubscribe, text) {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const helpLinks = [
    ["shared.footer_faq", text.faq],
    ["shared.footer_payment", text.payment],
    ["shared.footer_returns", text.returns]
  ]
    .map(([key, label]) => `<a href="${escape(contactUrl)}" data-content="${key}">${escape(label)}</a>`)
    .join("");
  const productLinks = products
    .map(({ label, url, key }) => `<a href="${escape(url)}"><span data-content="${escape(key)}">${escape(label)}</span></a>`)
    .join("");

  document.getElementById("ftr").innerHTML = `
    <div class="wrap">
      <div class="fgrid">
        <div>
          <h3 data-content="shared.brand">${escape(storeName)}</h3>
          <p data-content="shared.footer_description">${escape(text.description)}</p>
        </div>
        <div><h3 data-content="shared.footer_help">${escape(text.help)}</h3>${helpLinks}</div>
        <div><h3 data-content="shared.footer_products">${escape(text.products)}</h3>${productLinks}</div>
        <div>
          <h3 data-content="shared.footer_newsletter">${escape(text.newsletter)}</h3>
          <form id="nl">
            <input type="email" required placeholder="${escape(text.email)}" aria-label="${escape(text.email)}" data-content-placeholder="shared.footer_email">
            <button class="btn" data-content="shared.footer_subscribe">${escape(text.subscribe)}</button>
          </form>
        </div>
      </div>
      <p class="copy">© ${new Date().getFullYear()} ${escape(storeName)}. <span data-content="shared.footer_copyright">${escape(text.copyright)}</span></p>
    </div>`;

  document.getElementById("nl").onsubmit = event => {
    event.preventDefault();
    event.target.reset();
    onSubscribe();
  };
}
