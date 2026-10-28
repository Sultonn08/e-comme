const productsBody = document.getElementById("admin-products");
const messageBox = document.getElementById("admin-message");
const editor = document.getElementById("product-editor");
const form = document.getElementById("product-form");
const contentForm = document.getElementById("content-form");
const contentFields = document.getElementById("content-fields");
const contentMessage = document.getElementById("content-message");
const bannersBody = document.getElementById("admin-banners");
const bannerEditor = document.getElementById("banner-editor");
const bannerForm = document.getElementById("banner-form");
const bannerMessage = document.getElementById("banner-message");
const categoriesBody = document.getElementById("admin-categories");
const categoryEditor = document.getElementById("category-editor");
const categoryForm = document.getElementById("category-form");
const categoryMessage = document.getElementById("category-message");
const articlesBody = document.getElementById("admin-articles");
const articleEditor = document.getElementById("article-editor");
const articleForm = document.getElementById("article-form");
const articleMessage = document.getElementById("article-message");
let csrfToken = "";
let products = [];
let banners = [];
let categories = [];
let articles = [];
const pageLabels = {
  shared: "Header dan footer",
  home: "Beranda dan artikel",
  products: "Katalog dan detail produk",
  cart: "Keranjang",
  contact: "Kontak dan lokasi toko",
  account: "Login dan registrasi",
  admin: "Dashboard admin"
};
let siteContent = {};
const contentText = (key, fallback) => siteContent[key] ?? fallback;

function applySiteContent() {
  document.querySelectorAll("[data-content]").forEach(element => {
    element.textContent = contentText(element.dataset.content, element.textContent);
  });
  document.querySelectorAll("[data-content-placeholder]").forEach(element => {
    element.placeholder = contentText(element.dataset.contentPlaceholder, element.placeholder);
  });
  document.querySelectorAll("[data-content-aria-label]").forEach(element => {
    element.setAttribute("aria-label", contentText(element.dataset.contentAriaLabel, element.getAttribute("aria-label")));
  });
  pageLabels.account = contentText("admin.group_account", pageLabels.account);
  pageLabels.admin = contentText("admin.group_dashboard", pageLabels.admin);
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Permintaan gagal (${response.status}).`);
  return data;
}

async function getCsrfToken() {
  const response = await fetch("../api/auth.php?action=csrf", { headers: { Accept: "application/json" } });
  const data = await readResponse(response);
  csrfToken = data.csrfToken;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

function renderProducts() {
  document.getElementById("product-count").textContent = products.length;
  productsBody.innerHTML = products.length ? products.map(product => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="color-dot" style="background:${escapeHTML(product.warna)};flex-shrink:0"></span>
          <div>
            <div style="font-weight:600">${escapeHTML(product.nama)}</div>
            <div style="font-size:.75rem;color:var(--admin-muted)">${escapeHTML(product.tipe)}</div>
          </div>
        </div>
      </td>
      <td><span style="font-size:.82rem">${escapeHTML(product.kat)}</span></td>
      <td style="font-weight:700">${formatRupiah(product.harga)}</td>
      <td><span class="badge ${product.baru ? 'badge-new' : 'badge-active'}">${escapeHTML(contentText(product.baru ? "admin.status_new" : "admin.status_active", product.baru ? "Baru" : "Aktif"))}</span></td>
      <td><div class="actions">
        <button class="btn btn-secondary btn-sm" type="button" data-edit="${Number(product.id)}">${escapeHTML(contentText("admin.edit", "Edit"))}</button>
        <button class="danger-button" type="button" data-delete="${Number(product.id)}">${escapeHTML(contentText("admin.delete", "Hapus"))}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--admin-muted)">${escapeHTML(contentText("admin.no_products", "Belum ada produk."))}</td></tr>`;
}

async function loadProducts() {
  const response = await fetch("../api/products.php", { headers: { Accept: "application/json" } });
  const data = await readResponse(response);
  products = data.products;
}

async function loadContent() {
  const response = await fetch("../api/content.php?admin=1", { headers: { Accept: "application/json" } });
  const data = await readResponse(response);
  siteContent = Object.fromEntries(data.fields.map(field => [field.key, field.value]));
  applySiteContent();
  const groups = data.fields.reduce((result, field) => {
    if (!result[field.page]) result[field.page] = [];
    result[field.page].push(field);
    return result;
  }, {});

  contentFields.innerHTML = Object.entries(groups).map(([page, fields]) => `
    <fieldset class="content-group">
      <legend>${escapeHTML(pageLabels[page] || page)}</legend>
      ${fields.map(field => `
        <label>${escapeHTML(field.label)}
          <textarea name="${escapeHTML(field.key)}" maxlength="2000" rows="2">${escapeHTML(field.value)}</textarea>
        </label>`).join("")}
    </fieldset>`).join("");
}

async function saveContent(event) {
  event.preventDefault();
  contentMessage.textContent = "";
  const content = Object.fromEntries(new FormData(contentForm));
  const response = await fetch("../api/content.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ content })
  });
  await readResponse(response);
  siteContent = { ...siteContent, ...content };
  applySiteContent();
  renderProducts();
  contentMessage.classList.remove("is-error");
  contentMessage.textContent = contentText("admin.content_saved", "Teks halaman berhasil disimpan.");
}

function openEditor(product = null) {
  form.reset();
  form.elements.id.value = product?.id ?? "";
  form.elements.nama.value = product?.nama ?? "";
  form.elements.tipe.value = product?.tipe ?? "";
  form.elements.kat.value = product?.kat ?? "Atasan";
  form.elements.harga.value = product?.harga ?? "";
  form.elements.harga_normal.value = product?.normal ?? "";
  form.elements.warna.value = product?.warna ?? "#1C1C1E";
  form.elements.deskripsi.value = product?.deskripsi ?? "";
  form.elements.gambar.value = JSON.stringify(product?.gambar ?? []);
  form.elements.baru.checked = Boolean(product?.baru);
  window.initializeProductImageSlots(document.getElementById("admin-image-slots"), {
    form,
    pathPrefix: "../",
    getProductId: () => Number(form.elements.id.value) || 0,
    getCsrfToken: () => csrfToken,
    setMessage: (message, isError = false) => {
      const editorMessage = document.getElementById("editor-message");
      editorMessage.textContent = message;
      editorMessage.classList.toggle("is-error", isError);
    }
  });
  document.getElementById("editor-title").textContent = contentText(product ? "admin.editor_edit" : "admin.editor_add", product ? "Edit produk" : "Tambah produk");
  document.getElementById("editor-message").textContent = "";
  editor.showModal();
}

async function saveProduct(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  values.baru = form.elements.baru.checked;
  values.gambar = JSON.parse(values.gambar || "[]");
  const id = values.id;
  delete values.id;
  const response = await fetch(`../api/products.php${id ? `?id=${encodeURIComponent(id)}` : ""}`, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(values)
  });
  const saved = await readResponse(response);
  const savedProduct = id ? null : products.find(product => product.id === saved.id);
  editor.close();
  messageBox.textContent = contentText(id ? "admin.product_updated" : "admin.product_added", id ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.");
  await loadProducts();
  if (!id) openEditor(products.find(product => product.id === saved.id) || savedProduct || null);
}

async function deleteProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product || !window.confirm(contentText("admin.delete_confirm", 'Hapus produk "{name}"?').replace("{name}", product.nama))) return;
  const response = await fetch(`../api/products.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken }
  });
  await readResponse(response);
  messageBox.textContent = contentText("admin.product_deleted", "Produk berhasil dihapus.");
  await loadProducts();
}

async function loadBanners() {
  try {
    const response = await fetch("../api/banners.php?admin=1", { headers: { Accept: "application/json" } });
    const data = await readResponse(response);
    banners = Array.isArray(data.banners) ? data.banners : [];
  } catch (e) {
    banners = [];
  }
}

function renderBanners() {
  const countEl = document.getElementById("banner-count");
  if (countEl) countEl.textContent = banners.length;
  if (!bannersBody) return;
  bannersBody.innerHTML = banners.length ? banners.map(banner => {
    const img = banner.image_url ? (banner.image_url.startsWith("http") ? banner.image_url : "../" + banner.image_url) : "";
    return `
      <tr>
        <td>
          <div style="width:84px;height:48px;border-radius:6px;overflow:hidden;background:#18181b;border:1px solid var(--admin-border);display:grid;place-items:center">
            ${img ? `<img src="${escapeHTML(img)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.src='';this.alt='Error'">` : `<span style="font-size:10px;color:var(--admin-muted)">No image</span>`}
          </div>
        </td>
        <td>
          <div style="font-weight:700;margin-bottom:2px">${escapeHTML(banner.title)}</div>
          <div style="font-size:.78rem;color:var(--admin-muted);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(banner.subtitle || "—")}</div>
        </td>
        <td>
          <div style="font-size:.85rem;font-weight:600">${escapeHTML(banner.button_text)}</div>
          <div style="font-size:.75rem;color:var(--admin-accent);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(banner.button_link)}</div>
        </td>
        <td style="font-weight:700">${Number(banner.sort_order)}</td>
        <td>
          <span class="badge ${banner.is_active ? 'badge-active' : 'badge-disabled'}" style="${banner.is_active ? '' : 'background:rgba(255,255,255,.08);color:var(--admin-muted)'}">
            ${banner.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" type="button" data-edit-banner="${Number(banner.id)}">Edit</button>
            <button class="danger-button" type="button" data-delete-banner="${Number(banner.id)}">Hapus</button>
          </div>
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--admin-muted)">Belum ada banner. Klik "+ Tambah Banner" untuk membuat banner promo.</td></tr>`;
}

function openBannerEditor(banner = null) {
  if (!bannerEditor || !bannerForm) return;
  document.getElementById("banner-id").value = banner?.id ?? "";
  document.getElementById("banner-title").value = banner?.title ?? "";
  document.getElementById("banner-subtitle").value = banner?.subtitle ?? "";
  document.getElementById("banner-button-text").value = banner?.button_text ?? "Belanja sekarang";
  document.getElementById("banner-button-link").value = banner?.button_link ?? "pages/produk.html?kat=Baru";
  document.getElementById("banner-sort-order").value = banner?.sort_order ?? (banners.length + 1);
  document.getElementById("banner-is-active").checked = banner ? Boolean(Number(banner.is_active)) : true;
  document.getElementById("banner-image-url").value = banner?.image_url ?? "";
  document.getElementById("banner-file-input").value = "";

  const previewBox = document.getElementById("banner-preview-box");
  const previewImg = document.getElementById("banner-preview-img");
  const mockTitle = document.getElementById("prev-mock-title");
  const mockSub = document.getElementById("prev-mock-sub");
  const mockBtn = document.getElementById("prev-mock-btn");

  if (mockTitle) mockTitle.textContent = banner?.title || "Judul Banner Promo";
  if (mockSub) mockSub.textContent = banner?.subtitle || "Deskripsi promo menarik toko...";
  if (mockBtn) mockBtn.textContent = banner?.button_text || "Belanja sekarang";

  const currentImg = banner?.image_url ? (banner.image_url.startsWith("http") ? banner.image_url : "../" + banner.image_url) : "";
  if (currentImg) {
    previewImg.src = currentImg;
    previewBox.classList.add("is-visible");
    previewBox.style.display = "block";
  } else {
    previewBox.classList.remove("is-visible");
    previewBox.style.display = "none";
  }

  document.getElementById("banner-editor-title").textContent = banner ? "Edit Banner Promo" : "Tambah Banner Baru";
  const modalMsg = document.getElementById("banner-modal-message");
  if (modalMsg) { modalMsg.textContent = ""; modalMsg.classList.remove("is-error"); }
  bannerEditor.showModal();
}

async function saveBanner(event) {
  event.preventDefault();
  const saveBtn = document.getElementById("save-banner-btn");
  const originalBtnText = saveBtn ? saveBtn.innerHTML : "💾 Simpan Banner";
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan…";
  }

  const formData = new FormData(bannerForm);
  formData.set("is_active", document.getElementById("banner-is-active").checked ? "1" : "0");

  const modalMsg = document.getElementById("banner-modal-message");
  try {
    const response = await fetch("../api/banners.php", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
      body: formData
    });
    const data = await readResponse(response);
    bannerEditor.close();
    bannerMessage.textContent = data.message || "Banner berhasil disimpan.";
    bannerMessage.classList.remove("is-error");
    await loadBanners();
    renderBanners();
  } catch (err) {
    if (modalMsg) {
      modalMsg.textContent = err.message;
      modalMsg.classList.add("is-error");
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
    }
  }
}

async function deleteBanner(id) {
  const b = banners.find(item => item.id === id);
  if (!b || !window.confirm(`Hapus banner "${b.title}"?`)) return;
  const response = await fetch(`../api/banners.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken, "Content-Type": "application/json" }
  });
  await readResponse(response);
  bannerMessage.textContent = "Banner berhasil dihapus.";
  bannerMessage.classList.remove("is-error");
  await loadBanners();
  renderBanners();
}

// ── CATEGORIES MANAGEMENT ──
async function loadCategories() {
  const response = await fetch("../api/categories.php?admin=1", { headers: { Accept: "application/json" } });
  const data = await readResponse(response);
  categories = data.categories;
}

function renderCategories() {
  if (!categoriesBody) return;
  categoriesBody.innerHTML = categories.length ? categories.map(cat => {
    const img = cat.image_url.startsWith("http") ? cat.image_url : "../" + cat.image_url;
    return `
      <tr>
        <td>
          <img src="${escapeHTML(img)}" alt="${escapeHTML(cat.name)}" style="width:68px;height:44px;object-fit:cover;border-radius:6px;border:1px solid var(--admin-border);display:block">
        </td>
        <td>
          <div style="font-weight:700">${escapeHTML(cat.name)}</div>
        </td>
        <td>
          <div style="font-size:.85rem;color:var(--admin-muted)">${escapeHTML(cat.subtitle || "—")}</div>
        </td>
        <td>
          <span style="font-size:.78rem;font-family:monospace;background:var(--admin-surface);padding:3px 7px;border-radius:4px">${escapeHTML(cat.link)}</span>
        </td>
        <td style="font-weight:700">${Number(cat.sort_order)}</td>
        <td>
          <span class="badge ${cat.is_active ? 'badge-active' : 'badge-disabled'}" style="${cat.is_active ? '' : 'background:rgba(255,255,255,.08);color:var(--admin-muted)'}">
            ${cat.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" type="button" data-edit-category="${Number(cat.id)}">Edit</button>
            <button class="danger-button" type="button" data-delete-category="${Number(cat.id)}">Hapus</button>
          </div>
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--admin-muted)">Belum ada kategori. Klik "+ Tambah Kategori" untuk membuat kartu kategori.</td></tr>`;
}

function openCategoryEditor(cat = null) {
  if (!categoryEditor || !categoryForm) return;
  document.getElementById("category-id").value = cat?.id ?? "";
  document.getElementById("category-name").value = cat?.name ?? "";
  document.getElementById("category-subtitle").value = cat?.subtitle ?? "";
  document.getElementById("category-link").value = cat?.link ?? (cat ? "" : "pages/produk.html?kat=");
  document.getElementById("category-sort-order").value = cat?.sort_order ?? (categories.length + 1);
  document.getElementById("category-is-active").checked = cat ? Boolean(Number(cat.is_active)) : true;
  document.getElementById("category-image-url").value = cat?.image_url ?? "";
  document.getElementById("category-file-input").value = "";

  const previewBox = document.getElementById("category-preview-box");
  const previewImg = document.getElementById("category-preview-img");
  const mockTitle = document.getElementById("cat-mock-title");
  const mockSub = document.getElementById("cat-mock-sub");

  if (mockTitle) mockTitle.textContent = cat?.name || "Nama Kategori";
  if (mockSub) mockSub.textContent = cat?.subtitle || "Keterangan subjudul...";

  const currentImg = cat?.image_url ? (cat.image_url.startsWith("http") ? cat.image_url : "../" + cat.image_url) : "";
  if (currentImg) {
    previewImg.src = currentImg;
    previewBox.classList.add("is-visible");
    previewBox.style.display = "block";
  } else {
    previewBox.classList.remove("is-visible");
    previewBox.style.display = "none";
  }

  document.getElementById("category-editor-title").textContent = cat ? "Edit Kategori Beranda" : "Tambah Kategori Baru";
  const modalMsg = document.getElementById("category-modal-message");
  if (modalMsg) { modalMsg.textContent = ""; modalMsg.classList.remove("is-error"); }
  categoryEditor.showModal();
}

async function saveCategory(event) {
  event.preventDefault();
  const saveBtn = document.getElementById("save-category-btn");
  const originalBtnText = saveBtn ? saveBtn.innerHTML : "💾 Simpan Kategori";
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan…";
  }

  const formData = new FormData(categoryForm);
  formData.set("is_active", document.getElementById("category-is-active").checked ? "1" : "0");

  const modalMsg = document.getElementById("category-modal-message");
  try {
    const response = await fetch("../api/categories.php", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
      body: formData
    });
    const data = await readResponse(response);
    categoryEditor.close();
    categoryMessage.textContent = data.message || "Kategori berhasil disimpan.";
    categoryMessage.classList.remove("is-error");
    await loadCategories();
    renderCategories();
  } catch (err) {
    if (modalMsg) {
      modalMsg.textContent = err.message;
      modalMsg.classList.add("is-error");
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
    }
  }
}

async function deleteCategory(id) {
  const cat = categories.find(item => item.id === id);
  if (!cat || !window.confirm(`Hapus kategori "${cat.name}"?`)) return;
  const response = await fetch(`../api/categories.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken, "Content-Type": "application/json" }
  });
  await readResponse(response);
  categoryMessage.textContent = "Kategori berhasil dihapus.";
  categoryMessage.classList.remove("is-error");
  await loadCategories();
  renderCategories();
}

// ── ARTICLES MANAGEMENT ──
async function loadArticles() {
  const response = await fetch("../api/articles.php?admin=1", { headers: { Accept: "application/json" } });
  const data = await readResponse(response);
  articles = data.articles;
}

function renderArticles() {
  if (!articlesBody) return;
  articlesBody.innerHTML = articles.length ? articles.map(art => {
    const rawImg = art.image_url || "";
    const img = rawImg ? (rawImg.startsWith("http") ? rawImg : "../" + rawImg) : "";
    return `
      <tr>
        <td>
          ${img ? `<img src="${escapeHTML(img)}" alt="${escapeHTML(art.title)}" style="width:68px;height:46px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,.1);display:block">` : `<div style="width:68px;height:46px;border-radius:6px;background:rgba(255,255,255,.05);display:grid;place-items:center;color:var(--admin-muted);font-size:.7rem">No Foto</div>`}
        </td>
        <td>
          <div style="font-weight:700;color:#fff">${escapeHTML(art.title)}</div>
        </td>
        <td>
          <div style="font-size:.85rem;color:var(--admin-muted);max-width:320px;line-height:1.4">${escapeHTML(art.summary)}</div>
        </td>
        <td>
          ${art.link_url ? `
            <div>
              <a href="${escapeHTML(art.link_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--admin-accent2);font-size:.8rem;font-weight:600;text-decoration:underline">
                ${escapeHTML(art.link_label || art.link_url)}
              </a>
              <div style="font-size:.7rem;color:var(--admin-muted);font-family:monospace;overflow:hidden;text-overflow:ellipsis;max-width:200px">${escapeHTML(art.link_url)}</div>
            </div>` : '<span style="color:var(--admin-muted);font-size:.8rem">— Tidak ada link —</span>'}
        </td>
        <td style="font-weight:700">${Number(art.sort_order)}</td>
        <td>
          <span class="badge ${art.is_active ? 'badge-active' : 'badge-disabled'}" style="${art.is_active ? '' : 'background:rgba(255,255,255,.08);color:var(--admin-muted)'}">
            ${art.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" type="button" data-edit-article="${Number(art.id)}">Edit</button>
            <button class="danger-button" type="button" data-delete-article="${Number(art.id)}">Hapus</button>
          </div>
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--admin-muted)">Belum ada artikel. Klik "+ Tambah Artikel" untuk membuat artikel baru.</td></tr>`;
}

function openArticleEditor(art = null) {
  if (!articleEditor || !articleForm) return;
  document.getElementById("article-id").value = art?.id ?? "";
  document.getElementById("article-title").value = art?.title ?? "";
  document.getElementById("article-summary").value = art?.summary ?? "";
  document.getElementById("article-link-url").value = art?.link_url ?? "";
  document.getElementById("article-link-label").value = art?.link_label ?? "";
  document.getElementById("article-sort-order").value = art?.sort_order ?? (articles.length + 1);
  document.getElementById("article-is-active").checked = art ? Boolean(Number(art.is_active)) : true;
  document.getElementById("article-image-url").value = art?.image_url ?? "";
  const fileInput = document.getElementById("article-file-input");
  if (fileInput) fileInput.value = "";

  const mockTitle = document.getElementById("art-mock-title");
  const mockSummary = document.getElementById("art-mock-summary");
  const mockLink = document.getElementById("art-mock-link");
  const artPreviewImg = document.getElementById("art-preview-img");

  if (mockTitle) mockTitle.textContent = art?.title || "Judul Artikel";
  if (mockSummary) mockSummary.textContent = art?.summary || "Ringkasan isi artikel akan tampil di sini...";
  if (mockLink) {
    if (art?.link_url) {
      mockLink.textContent = (art.link_label || "Baca selengkapnya") + " \u2192";
      mockLink.href = art.link_url;
      mockLink.style.display = "inline-block";
    } else {
      mockLink.style.display = "none";
    }
  }

  const defaultImg = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80";
  const currentImg = art?.image_url ? (art.image_url.startsWith("http") ? art.image_url : "../" + art.image_url) : defaultImg;
  if (artPreviewImg) artPreviewImg.src = currentImg;

  document.getElementById("article-editor-title").textContent = art ? "Edit Artikel & Referensi" : "Tambah Artikel Baru";
  const modalMsg = document.getElementById("article-modal-message");
  if (modalMsg) { modalMsg.textContent = ""; modalMsg.classList.remove("is-error"); }
  articleEditor.showModal();
}

async function saveArticle(event) {
  event.preventDefault();
  const saveBtn = document.getElementById("save-article-btn");
  const originalBtnText = saveBtn ? saveBtn.innerHTML : "💾 Simpan Artikel";
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan…";
  }

  const modalMsg = document.getElementById("article-modal-message");
  try {
    const formData = new FormData(articleForm);
    formData.set("is_active", document.getElementById("article-is-active").checked ? "1" : "0");
    const response = await fetch("../api/articles.php", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken
      },
      body: formData
    });
    const data = await readResponse(response);
    articleEditor.close();
    articleMessage.textContent = data.message || "Artikel berhasil disimpan.";
    articleMessage.classList.remove("is-error");
    await loadArticles();
    renderArticles();
  } catch (err) {
    if (modalMsg) {
      modalMsg.textContent = err.message;
      modalMsg.classList.add("is-error");
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnText;
    }
  }
}

async function deleteArticle(id) {
  const art = articles.find(item => item.id === id);
  if (!art || !window.confirm(`Hapus artikel "${art.title}"?`)) return;
  const response = await fetch(`../api/articles.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken, "Content-Type": "application/json" }
  });
  await readResponse(response);
  articleMessage.textContent = "Artikel berhasil dihapus.";
  articleMessage.classList.remove("is-error");
  await loadArticles();
  renderArticles();
}

function showError(error) {
  messageBox.textContent = error.message;
  messageBox.classList.add("is-error");
}

async function initializeDashboard() {
  try {
    await getCsrfToken();
    await Promise.all([loadProducts(), loadContent(), loadBanners(), loadCategories(), loadArticles()]);
    renderProducts();
    renderBanners();
    renderCategories();
    renderArticles();
    document.querySelectorAll("[data-admin-tab]").forEach(button => button.addEventListener("click", () => {
      const selected = button.dataset.adminTab;
      document.querySelectorAll("[data-admin-tab]").forEach(tab => {
        tab.setAttribute("aria-pressed", String(tab === button));
        tab.classList.toggle("active", tab.dataset.adminTab === selected);
      });
      document.querySelectorAll("[data-admin-panel]").forEach(panel => {
        panel.hidden = panel.dataset.adminPanel !== selected;
      });
    }));
    contentForm.addEventListener("submit", async event => {
      try { await saveContent(event); } catch (error) {
        event.preventDefault();
        contentMessage.classList.add("is-error");
        contentMessage.textContent = error.message;
      }
    });
    productsBody.addEventListener("click", async event => {
      const editButton = event.target.closest("[data-edit]");
      const deleteButton = event.target.closest("[data-delete]");
      try {
        if (editButton) openEditor(products.find(product => product.id === Number(editButton.dataset.edit)));
        if (deleteButton) await deleteProduct(Number(deleteButton.dataset.delete));
      } catch (error) { showError(error); }
    });
    form.addEventListener("submit", async event => {
      try { await saveProduct(event); } catch (error) {
        event.preventDefault();
        document.getElementById("editor-message").textContent = error.message;
        document.getElementById("editor-message").classList.add("is-error");
      }
    });
    document.getElementById("new-product").addEventListener("click", () => openEditor());
    document.getElementById("new-product-2")?.addEventListener("click", () => openEditor());
    document.getElementById("close-editor").addEventListener("click", () => editor.close());

    // ── Banner Event Listeners ──
    document.getElementById("new-banner")?.addEventListener("click", () => openBannerEditor());
    document.getElementById("close-banner-editor")?.addEventListener("click", () => bannerEditor.close());
    document.getElementById("cancel-banner")?.addEventListener("click", () => bannerEditor.close());
    bannerForm?.addEventListener("submit", saveBanner);
    bannersBody?.addEventListener("click", async event => {
      const editBtn = event.target.closest("[data-edit-banner]");
      const delBtn = event.target.closest("[data-delete-banner]");
      try {
        if (editBtn) openBannerEditor(banners.find(b => b.id === Number(editBtn.dataset.editBanner)));
        if (delBtn) await deleteBanner(Number(delBtn.dataset.deleteBanner));
      } catch (err) {
        bannerMessage.textContent = err.message;
        bannerMessage.classList.add("is-error");
      }
    });
    // Live preview sync
    const previewBox = document.getElementById("banner-preview-box");
    const previewImg = document.getElementById("banner-preview-img");
    const mockTitle = document.getElementById("prev-mock-title");
    const mockSub = document.getElementById("prev-mock-sub");
    const mockBtn = document.getElementById("prev-mock-btn");

    document.getElementById("banner-title")?.addEventListener("input", e => {
      if (mockTitle) mockTitle.textContent = e.target.value.trim() || "Judul Banner Promo";
    });
    document.getElementById("banner-subtitle")?.addEventListener("input", e => {
      if (mockSub) mockSub.textContent = e.target.value.trim() || "Deskripsi promo menarik toko...";
    });
    document.getElementById("banner-button-text")?.addEventListener("input", e => {
      if (mockBtn) mockBtn.textContent = e.target.value.trim() || "Belanja sekarang";
    });

    document.getElementById("banner-file-input")?.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          if (previewImg) previewImg.src = ev.target.result;
          if (previewBox) {
            previewBox.classList.add("is-visible");
            previewBox.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById("banner-image-url")?.addEventListener("input", e => {
      const url = e.target.value.trim();
      if (url) {
        if (previewImg) previewImg.src = url;
        if (previewBox) {
          previewBox.classList.add("is-visible");
          previewBox.style.display = "block";
        }
      }
    });

    // ── Category Event Listeners ──
    document.getElementById("new-category")?.addEventListener("click", () => openCategoryEditor());
    document.getElementById("close-category-editor")?.addEventListener("click", () => categoryEditor.close());
    document.getElementById("cancel-category")?.addEventListener("click", () => categoryEditor.close());
    categoryForm?.addEventListener("submit", saveCategory);
    categoriesBody?.addEventListener("click", async event => {
      const editBtn = event.target.closest("[data-edit-category]");
      const delBtn = event.target.closest("[data-delete-category]");
      try {
        if (editBtn) openCategoryEditor(categories.find(c => c.id === Number(editBtn.dataset.editCategory)));
        if (delBtn) await deleteCategory(Number(delBtn.dataset.deleteCategory));
      } catch (err) {
        categoryMessage.textContent = err.message;
        categoryMessage.classList.add("is-error");
      }
    });

    // Live category preview sync
    const catPreviewBox = document.getElementById("category-preview-box");
    const catPreviewImg = document.getElementById("category-preview-img");
    const catMockTitle = document.getElementById("cat-mock-title");
    const catMockSub = document.getElementById("cat-mock-sub");

    document.getElementById("category-name")?.addEventListener("input", e => {
      if (catMockTitle) catMockTitle.textContent = e.target.value.trim() || "Nama Kategori";
    });
    document.getElementById("category-subtitle")?.addEventListener("input", e => {
      if (catMockSub) catMockSub.textContent = e.target.value.trim() || "Keterangan subjudul...";
    });
    document.getElementById("category-file-input")?.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          if (catPreviewImg) catPreviewImg.src = ev.target.result;
          if (catPreviewBox) {
            catPreviewBox.classList.add("is-visible");
            catPreviewBox.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });
    document.getElementById("category-image-url")?.addEventListener("input", e => {
      const url = e.target.value.trim();
      if (url) {
        if (catPreviewImg) catPreviewImg.src = url;
        if (catPreviewBox) {
          catPreviewBox.classList.add("is-visible");
          catPreviewBox.style.display = "block";
        }
      }
    });

    // ── Article Event Listeners ──
    document.getElementById("new-article")?.addEventListener("click", () => openArticleEditor());
    document.getElementById("close-article-editor")?.addEventListener("click", () => articleEditor.close());
    document.getElementById("cancel-article")?.addEventListener("click", () => articleEditor.close());
    articleForm?.addEventListener("submit", saveArticle);
    articlesBody?.addEventListener("click", async event => {
      const editBtn = event.target.closest("[data-edit-article]");
      const delBtn = event.target.closest("[data-delete-article]");
      try {
        if (editBtn) openArticleEditor(articles.find(a => a.id === Number(editBtn.dataset.editArticle)));
        if (delBtn) await deleteArticle(Number(delBtn.dataset.deleteArticle));
      } catch (err) {
        articleMessage.textContent = err.message;
        articleMessage.classList.add("is-error");
      }
    });

    // Live article preview sync
    const artMockTitle = document.getElementById("art-mock-title");
    const artMockSummary = document.getElementById("art-mock-summary");
    const artMockLink = document.getElementById("art-mock-link");

    document.getElementById("article-title")?.addEventListener("input", e => {
      if (artMockTitle) artMockTitle.textContent = e.target.value.trim() || "Judul Artikel";
    });
    document.getElementById("article-summary")?.addEventListener("input", e => {
      if (artMockSummary) artMockSummary.textContent = e.target.value.trim() || "Ringkasan isi artikel akan tampil di sini...";
    });
    const updateArtMockLink = () => {
      if (!artMockLink) return;
      const url = (document.getElementById("article-link-url")?.value || "").trim();
      const label = (document.getElementById("article-link-label")?.value || "").trim();
      if (url) {
        artMockLink.textContent = (label || "Baca selengkapnya") + " \u2192";
        artMockLink.href = url;
        artMockLink.style.display = "inline-block";
      } else {
        artMockLink.style.display = "none";
      }
    };
    document.getElementById("article-link-url")?.addEventListener("input", updateArtMockLink);
    document.getElementById("article-link-label")?.addEventListener("input", updateArtMockLink);

    const artPreviewImg = document.getElementById("art-preview-img");
    document.getElementById("article-file-input")?.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          if (artPreviewImg) artPreviewImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    document.getElementById("article-image-url")?.addEventListener("input", e => {
      const url = e.target.value.trim();
      if (url && artPreviewImg) {
        artPreviewImg.src = url;
      }
    });

    document.getElementById("admin-logout").addEventListener("click", async () => {
      try {
        const response = await fetch("../api/auth.php?action=logout", {
          method: "POST",
          headers: { "X-CSRF-Token": csrfToken }
        });
        await readResponse(response);
        window.location.href = "../pages/akun.php";
      } catch (error) { showError(error); }
    });
  } catch (error) {
    showError(error);
  }
}

initializeDashboard();
