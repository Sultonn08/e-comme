
const PV = false;

const TOKO = {
  nama: "mmk",
  wa: "6287861553558"
};

const PRODUK = [
  {
    id: 1,
    nama: "Kaos oversize Garis Hitam",
    tipe: "T-shirt oversize",
    kat: "Atasan",
    harga: 99000,
    normal: 249000,
    warna: "#1C1C1E",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2E8OhGEZYvXUha5m8sP1WxXkAgcNc8ggqUcHubmTXfQ&s=10",
    baru: 1
  },
  {
    id: 2,
    nama: "Kaos contrast stitch Putih",
    tipe: "T-shirt",
    kat: "Atasan",
    harga: 89000,
    normal: 199000,
    warna: "#C9C6BE",
    foto: "assets/img/produk/kaos-putih.jpg"
  },
  {
    id: 3,
    nama: "Kemeja rayon saku Terakota",
    tipe: "Short shirt",
    kat: "Atasan",
    harga: 139000,
    normal: 199000,
    warna: "#A8553A",
    foto: "assets/img/produk/kemeja-terakota.jpg",
    baru: 1
  },
  {
    id: 4,
    nama: "Kemeja oxford Biru Dongker",
    tipe: "Oxford shirt",
    kat: "Atasan",
    harga: 169000,
    normal: 259000,
    warna: "#24304F",
    foto: "assets/img/produk/kemeja-oxford-dongker.jpg"
  },
  {
    id: 5,
    nama: "Chino flexi fit Hitam",
    tipe: "Chino pants",
    kat: "Bawahan",
    harga: 179000,
    normal: 449000,
    warna: "#2B2B2B",
    foto: "assets/img/produk/chino-hitam.jpg",
    baru: 1
  },
  {
    id: 6,
    nama: "Relax chino Khaki",
    tipe: "Relax chino",
    kat: "Bawahan",
    harga: 239000,
    normal: 339000,
    warna: "#B39B72",
    foto: "assets/img/produk/relax-chino-khaki.jpg"
  },
  {
    id: 7,
    nama: "Cargo pants Olive",
    tipe: "Cargo pants",
    kat: "Bawahan",
    harga: 229000,
    normal: 399000,
    warna: "#5B6240",
    foto: "assets/img/produk/cargo-olive.jpg",
    baru: 1
  },
  {
    id: 8,
    nama: "Jogger flexi fit Abu",
    tipe: "Jogger pants",
    kat: "Bawahan",
    harga: 189000,
    normal: 329000,
    warna: "#7A7D83",
    foto: "assets/img/produk/jogger-abu.jpg"
  },
  {
    id: 9,
    nama: "Jaket parka adventure",
    tipe: "Parka jacket",
    kat: "Outer",
    harga: 299000,
    normal: 499000,
    warna: "#3E4A3B",
    foto: "assets/img/produk/jaket-parka.jpg",
    baru: 1
  },
  {
    id: 10,
    nama: "Jaket coach Hitam",
    tipe: "Coach jacket",
    kat: "Outer",
    harga: 259000,
    normal: 389000,
    warna: "#161616",
    foto: "assets/img/produk/jaket-coach-hitam.jpg"
  },
  {
    id: 11,
    nama: "Topi baseball polos",
    tipe: "Cap",
    kat: "Aksesori",
    harga: 79000,
    normal: 129000,
    warna: "#4A4F5C",
    foto: "assets/img/produk/topi-baseball.jpg"
  },
  {
    id: 12,
    nama: "Tote bag kanvas",
    tipe: "Tote bag",
    kat: "Aksesori",
    harga: 69000,
    normal: 99000,
    warna: "#D8CFBC",
    foto: "assets/img/produk/tote-bag-kanvas.jpg"
  }
];

const BLOG = [
  {
    judul: "Cara memilih ukuran kaos oversize",
    ringkasan: "Ukur badan, lalu cocokkan dengan panduan ukuran sebelum membeli."
  },
  {
    judul: "Merawat celana chino agar awet",
    ringkasan: "Cuci dengan air dingin dan jemur di tempat teduh."
  },
  {
    judul: "Padu padan kemeja rayon untuk harian",
    ringkasan: "Padukan kemeja rayon dengan chino atau cargo untuk gaya santai."
  },
  {
    judul: "SEO dasar: bantu pelanggan menemukan halaman toko",
    ringkasan: "Gunakan judul yang jelas dan tautan yang mudah diikuti. SEO membantu mesin pencari memahami situs, bukan menjamin peringkat pertama.",
    sumber: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    labelSumber: "Google Search Central — SEO Starter Guide"
  },
  {
    judul: "Tulis konten yang berguna bagi calon pembeli",
    ringkasan: "Jawab pertanyaan pelanggan dengan informasi asli dan bermanfaat. Tulis untuk pembaca, bukan hanya mesin pencari.",
    sumber: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    labelSumber: "Google Search Central — Creating Helpful Content"
  },
  {
    judul: "Perjalanan belanja pelanggan bisa online dan offline",
    ringkasan: "Pelanggan mencari cara belanja yang praktis, baik online maupun di toko. Sediakan informasi produk, pengiriman, dan lokasi dengan jelas.",
    sumber: "https://business.google.com/en-all/think/consumer-insights/indonesia-search-trends-consumer-behavior/",
    labelSumber: "Think with Google — Indonesia Search Trends & Consumer Behavior"
  },
  {
    judul: "Mengenal perjalanan Erigo",
    ringkasan: "Erigo menceritakan perjalanannya dari penjualan online hingga kolaborasi dan peragaan busana internasional.",
    sumber: "https://erigostore.co.id/pages/about",
    labelSumber: "Erigo — About Us"
  },
  {
    judul: "Identitas Erigo: gaya kasual untuk anak muda",
    ringkasan: "Erigo menghadirkan pakaian kasual hingga semi-formal untuk pria dan wanita dengan fokus pada kenyamanan.",
    sumber: "https://erigostore.co.id/pages/branding",
    labelSumber: "Erigo — Branding"
  }
];
let SITE_CONTENT = {};
const text = (key, fallback = "") => Object.prototype.hasOwnProperty.call(SITE_CONTENT, key) ? SITE_CONTENT[key] : fallback;
function applyPageTitle() {
  const page = document.body.dataset.page;
  const titleKey = page === "home" ? "home.page_title" : page === "produk" ? "products.page_title" : page === "cart" ? "cart.page_title" : page === "kontak" ? "contact.page_title" : null;
  if (titleKey && SITE_CONTENT[titleKey]) document.title = SITE_CONTENT[titleKey];
}
const rp = n => "Rp" + n.toLocaleString("id-ID");
const ROOT = document.body.dataset.page === "home" ? "" : "../";
const U = (p, a) => PV ? "#" + p + (a ? "/" + a : "") : p === "index" ? ROOT + "index.html" : p === "akun" ? ROOT + "pages/akun.php" : (ROOT ? "" : "pages/") + p + ".html" + (a ? "?kat=" + encodeURIComponent(a) : "");
const KAT = () => PV ? decodeURIComponent(location.hash.split("/")[1] || "") : (new URLSearchParams(location.search).get("kat") || "");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const getCart = () => { try { return JSON.parse(localStorage.getItem("cart")) || {} } catch (e) { return {} } };
const saveCart = c => { try { localStorage.setItem("cart", JSON.stringify(c)) } catch (e) { } badge() };
const count = () => Object.values(getCart()).reduce((a, b) => a + b, 0);
function badge() { const b = document.getElementById("badge"); if (b) b.textContent = count() }
function toast(t) { const e = document.createElement("div"); e.className = "toast"; e.setAttribute("role", "status"); e.textContent = t; document.body.append(e); setTimeout(() => e.remove(), 1800) }
function add(id, size = "One size") { const c = getCart(), key = `${id}:${size}`; c[key] = (c[key] || 0) + 1; saveCart(c); toast("Ditambahkan ke keranjang") }
function renderSiteHeader(storeName, navigationLinks, homeUrl, cartUrl, accountUrl, productsUrl, text) {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const links = navigationLinks
    .map(({ label, url, key }) => `<a href="${escape(url)}"><span${key ? ` data-content="${escape(key)}"` : ""}>${escape(label)}</span></a>`)
    .join("");

  const hdr = document.getElementById("hdr");
  if (!hdr) return;
  hdr.innerHTML = `
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
function layout() {
  const storeName = text("shared.brand", TOKO.nama);
  const kategori = [["shared.nav_new", "Baru", "Koleksi baru"], ["shared.nav_tops", "Atasan", "Atasan"], ["shared.nav_bottoms", "Bawahan", "Bawahan"], ["shared.nav_accessories", "Aksesori", "Aksesori"]];
  renderSiteHeader(storeName, [
    { key: "shared.nav_home", label: text("shared.nav_home", "Beranda"), url: U("index") },
    ...kategori.map(([key, kat, fallback]) => ({ key, label: text(key, fallback), url: U("produk", kat) })),
    { key: "shared.nav_contact", label: text("shared.nav_contact", "Customer Service"), url: U("kontak") }
  ], U("index"), U("keranjang"), U("akun"), U("produk"), {
    promo: text("shared.promo", "Gratis ongkir semua pesanan. Belanja min Rp150.000 diskon Rp10.000, min Rp250.000 diskon Rp20.000."),
    account: text("shared.nav_account", "Akun"), cart: text("shared.nav_cart", "Keranjang"),
    search: text("products.search", "Cari produk"), searchLabel: text("products.search", "Cari produk"), searchButton: "Cari"
  });
  renderSiteFooter(storeName, U("kontak"), [
    { key: "shared.nav_tops", label: text("shared.nav_tops", "Atasan"), url: U("produk", "Atasan") },
    { key: "shared.nav_bottoms", label: text("shared.nav_bottoms", "Bawahan"), url: U("produk", "Bawahan") },
    { key: "shared.nav_accessories", label: text("shared.nav_accessories", "Aksesori"), url: U("produk", "Aksesori") }
  ], () => toast("Terima kasih, email kamu sudah terdaftar"), {
    description: text("shared.footer_description", "Brand fashion kasual untuk gaya hidup urban. Nyaman dipakai, rapi dilihat."),
    help: text("shared.footer_help", "Bantuan"), faq: text("shared.footer_faq", "FAQ"),
    payment: text("shared.footer_payment", "Cara pembayaran"), returns: text("shared.footer_returns", "Penukaran dan pengembalian"),
    products: text("shared.footer_products", "Produk"), newsletter: text("shared.footer_newsletter", "Kabar terbaru"),
    email: text("shared.footer_email", "Email kamu"), subscribe: text("shared.footer_subscribe", "Kirim"),
    copyright: text("shared.footer_copyright", "Situs demo untuk tugas kuliah.")
  });
  document.querySelectorAll("[data-content]").forEach(element => {
    const value = SITE_CONTENT[element.dataset.content];
    if (value !== undefined) element.textContent = value;
  });
  document.querySelectorAll("[data-content-placeholder]").forEach(element => {
    const value = SITE_CONTENT[element.dataset.contentPlaceholder];
    if (value !== undefined) element.placeholder = value;
  });
  document.querySelectorAll("[data-content-aria-label]").forEach(element => {
    const value = SITE_CONTENT[element.dataset.contentAriaLabel];
    if (value !== undefined) element.setAttribute("aria-label", value);
  });
  applyPageTitle();
  badge()
}
function deskripsiProduk(x) {
  if (x.kat === "Atasan") return `${x.nama} adalah pilihan atasan untuk gaya sehari-hari.`;
  if (x.kat === "Bawahan") return `${x.nama} mudah dipadukan untuk tampilan kasual.`;
  if (x.kat === "Outer") return `${x.nama} bisa menjadi lapisan tambahan untuk gaya harian.`;
  return `${x.nama} melengkapi kebutuhan aksesori sehari-hari.`
}
function kartu(x) {
  const d = Math.round((1 - x.harga / x.normal) * 100);
  // Ambil gambar dari array gambar (API) atau string foto (fallback)
  const imgSrc = (() => {
    if (Array.isArray(x.gambar) && x.gambar[0]) return ROOT + x.gambar[0];
    if (x.foto) return x.foto.startsWith('http') ? x.foto : ROOT + x.foto;
    return '';
  })();
  return `<article class="card" data-product-id="${Number(x.id)}">
  <button class="product-open" type="button" onclick="detailProduk(${Number(x.id)})" aria-label="Lihat detail ${escapeHTML(x.nama)}">
    <span class="thumb" style="background:${escapeHTML(x.warna)}">
      <span class="off">-${d}%</span>
      ${imgSrc ? `<img class="thumb-img" src="${escapeHTML(imgSrc)}" alt="${escapeHTML(x.nama)}" onerror="this.style.display='none'">` : ''}
      <span class="photo-hint">Lihat detail</span>
    </span>
    <span class="product-info"><strong>${escapeHTML(x.nama)}</strong><span><span class="price">${rp(Number(x.harga))}</span> <s>${rp(Number(x.normal))}</s></span></span>
  </button>
  <button class="btn" type="button" onclick="detailProduk(${Number(x.id)})">${escapeHTML(text("products.view", "Lihat detail & pilih ukuran"))}</button>
</article>`
}
function detailProduk(id) {
  const x = PRODUK.find(item => item.id === id), dialog = document.getElementById("product-detail");
  if (!x || !dialog) return;
  const galleryLabels = ["Tampilan depan", "Tampilan belakang", "Detail bahan", "Detail produk"];
  const sizes = x.kat === "Aksesori" ? ["One size"] : ["S", "M", "L", "XL", "XXL"];
  const resolveSrc = raw => (!raw ? "" : raw.startsWith("http") ? raw : ROOT + raw);
  const allSlides = galleryLabels.map((label, i) => ({ src: resolveSrc((x.gambar || [])[i]), label })).filter(s => s.src);
  let cur = 0;
  const slideAt = i => allSlides[i] || null;

  // ── Render dialog ──
  dialog.innerHTML = `<button class="detail-close" type="button" onclick="document.getElementById('product-detail').close()" aria-label="Tutup detail">×</button>
  <div class="detail-layout">
    <div class="product-gallery">
      <div class="gallery-main" id="gallery-main" style="--product-color:${escapeHTML(x.warna)}">
        <img class="gallery-main-img" ${allSlides[0] ? `src="${escapeHTML(allSlides[0].src)}"` : 'hidden'} alt="${escapeHTML(x.nama)}" onerror="this.style.opacity='.2'" title="Klik untuk perbesar">
        ${allSlides.length > 1 ? `
        <button class="gallery-prev" type="button" aria-label="Sebelumnya" disabled>&#8249;</button>
        <button class="gallery-next" type="button" aria-label="Berikutnya">&#8250;</button>
        <span class="gallery-counter">1 / ${allSlides.length}</span>` : ""}
        ${allSlides.length ? `<button class="gallery-zoom-btn" type="button" aria-label="Perbesar">&#x26F6;</button>` : ""}
      </div>
      <div class="gallery-thumbs" aria-label="Galeri">${galleryLabels.map((label, i) => { const s = resolveSrc((x.gambar || [])[i]); return `<button type="button" class="gallery-thumb${i === 0 ? " active" : ""}" style="--product-color:${escapeHTML(x.warna)}" data-idx="${i}" aria-label="${label}"><img ${s ? `src="${escapeHTML(s)}"` : 'hidden'} alt="" onerror="this.hidden=true"><span>${label}</span></button>`; }).join("")}</div>
    </div>
    <div class="product-description">
      <p class="hint">${escapeHTML(x.kat)} · ${escapeHTML(x.tipe)}</p>
      <h2>${escapeHTML(x.nama)}</h2>
      <p class="price">${rp(Number(x.harga))} <s>${rp(Number(x.normal))}</s></p>
      <p>${escapeHTML(x.deskripsi || deskripsiProduk(x))}</p>
      <label for="product-size">${escapeHTML(text("products.choose_size", "Pilih ukuran"))}</label>
      <select id="product-size">${sizes.map(s => `<option value="${s}">${s}</option>`).join("")}</select>
      <p class="hint">${escapeHTML(text("products.size_note", "Pilihan ukuran tersedia."))}</p>
      <button class="btn" type="button" id="detail-add">${escapeHTML(text("products.add_cart", "Tambah ke keranjang"))}</button>
    </div>
  </div>`;

  // ── Update slide ──
  const goTo = (idx) => {
    cur = Math.max(0, Math.min(idx, allSlides.length - 1));
    const sl = slideAt(cur);
    const main = dialog.querySelector("#gallery-main");
    const img = main?.querySelector(".gallery-main-img");
    if (img) { img.src = sl?.src || ""; img.hidden = !sl; img.style.opacity = "1"; }
    const counter = main?.querySelector(".gallery-counter");
    if (counter) counter.textContent = `${cur + 1} / ${allSlides.length}`;
    const prev = main?.querySelector(".gallery-prev");
    const next = main?.querySelector(".gallery-next");
    if (prev) prev.disabled = cur === 0;
    if (next) next.disabled = cur >= allSlides.length - 1;
    dialog.querySelectorAll(".gallery-thumb").forEach((btn, i) => btn.classList.toggle("active", i === cur));
  };

  // ── Lightbox (pakai <dialog> agar masuk top-layer di atas modal produk) ──
  const openLightbox = (startIdx) => {
    let li = startIdx;
    // Reuse atau buat elemen dialog lightbox
    let lb = document.getElementById("lightbox-dialog");
    if (!lb) { lb = document.createElement("dialog"); lb.id = "lightbox-dialog"; lb.className = "lb-dialog"; document.body.appendChild(lb); }
    const render = () => {
      const sl = allSlides[li];
      lb.innerHTML = `
      ${allSlides.length > 1 ? `<button class="lb-prev" aria-label="Sebelumnya">&#8249;</button>` : ""}
      <div class="lb-body">
        <img src="${escapeHTML(sl?.src || "")}" alt="${escapeHTML(sl?.label || "")}">
        <p class="lb-label">${escapeHTML(sl?.label || "")}${allSlides.length > 1 ? ` &nbsp;·&nbsp; ${li + 1}/${allSlides.length}` : ""}</p>
      </div>
      ${allSlides.length > 1 ? `<button class="lb-next" aria-label="Berikutnya">&#8250;</button>` : ""}
      <button class="lb-close" aria-label="Tutup">×</button>`;
      lb.querySelector(".lb-close").onclick = () => lb.close();
      lb.querySelector(".lb-prev")?.addEventListener("click", () => { if (li > 0) { li--; render(); } });
      lb.querySelector(".lb-next")?.addEventListener("click", () => { if (li < allSlides.length - 1) { li++; render(); } });
      // klik backdrop (luar konten)
      lb.onclick = (e) => { if (e.target === lb) lb.close(); };
    };
    render();
    if (!lb.open) lb.showModal();
    const onKey = e => {
      if (e.key === "Escape") {/* dialog handles Escape natively */ }
      if (e.key === "ArrowLeft" && li > 0) { li--; render(); }
      if (e.key === "ArrowRight" && li < allSlides.length - 1) { li++; render(); }
    };
    lb.addEventListener("keydown", onKey);
    lb.addEventListener("close", () => lb.removeEventListener("keydown", onKey), { once: true });
  };

  // ── Events ──
  dialog.querySelector(".gallery-prev")?.addEventListener("click", () => goTo(cur - 1));
  dialog.querySelector(".gallery-next")?.addEventListener("click", () => goTo(cur + 1));
  dialog.querySelector(".gallery-main-img")?.addEventListener("click", () => { if (allSlides.length) openLightbox(cur); });
  dialog.querySelector(".gallery-zoom-btn")?.addEventListener("click", () => { if (allSlides.length) openLightbox(cur); });
  dialog.querySelectorAll(".gallery-thumb").forEach((btn, i) => btn.addEventListener("click", () => goTo(i)));
  dialog.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") goTo(cur - 1);
    if (e.key === "ArrowRight") goTo(cur + 1);
  });
  dialog.querySelector("#detail-add").onclick = () => { add(id, dialog.querySelector("#product-size").value); dialog.close(); };
  dialog.showModal();
}
let storeBanners = [
  {
    title: "Koleksi Baru: Cargo & Streetwear",
    subtitle: "Bahan lentur, adem, dan ringan untuk aktivitas seharian. Gratis ongkir ke seluruh Indonesia.",
    button_text: "Belanja Sekarang",
    button_link: "pages/produk.html?kat=Baru",
    image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Urban Casual & Oversize Edition",
    subtitle: "Desain minimalis modern dengan potongan santai untuk gaya hidup anak muda kekinian.",
    button_text: "Lihat Atasan",
    button_link: "pages/produk.html?kat=Atasan",
    image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Diskon Otomatis Setiap Belanja",
    subtitle: "Voucher otomatis: Belanja min Rp150.000 diskon Rp10.000, min Rp250.000 diskon Rp20.000.",
    button_text: "Katalog Lengkap",
    button_link: "pages/produk.html",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
  }
];

async function loadStoreBanners() {
  try {
    const res = await fetch(`${ROOT}api/banners.php`, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.banners) && data.banners.length > 0) {
        storeBanners = data.banners;
      }
    }
  } catch (e) {
    // Keep fallback banners
  }
}

let storeCategories = [
  { id: 1, name: "Atasan", subtitle: "Kaos dan kemeja", link: "pages/produk.html?kat=Atasan", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Bawahan", subtitle: "Chino, cargo, jogger", link: "pages/produk.html?kat=Bawahan", image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Aksesori", subtitle: "Topi dan tas", link: "pages/produk.html?kat=Aksesori", image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80" }
];

async function loadStoreCategories() {
  try {
    const res = await fetch(`${ROOT}api/categories.php`, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        storeCategories = data.categories;
      }
    }
  } catch (e) {
    // Keep fallback categories
  }
}

function renderHomeCategories() {
  const container = document.getElementById("home-categories");
  if (!container || !storeCategories || !storeCategories.length) return;
  container.innerHTML = storeCategories.map(cat => {
    const img = cat.image_url.startsWith("http") ? cat.image_url : ROOT + cat.image_url;
    return `
      <a class="cat" href="${escapeHTML(cat.link || "pages/produk.html?kat=" + encodeURIComponent(cat.name))}">
        <img class="cat-bg" src="${escapeHTML(img)}" alt="${escapeHTML(cat.name)}" loading="lazy">
        <div class="cat-overlay"></div>
        <div class="cat-content">
          <span class="cat-title">${escapeHTML(cat.name)}</span>
          <span class="cat-sub">${escapeHTML(cat.subtitle || "")}</span>
          <span class="cat-badge">Jelajahi &rarr;</span>
        </div>
      </a>`;
  }).join("");
}

let storeArticles = [
  { id: 1, title: "Cara memilih ukuran kaos oversize", summary: "Ukur badan, lalu cocokkan dengan panduan ukuran sebelum membeli.", link_url: "", link_label: "", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Merawat celana chino agar awet", summary: "Cuci dengan air dingin dan jemur di tempat teduh.", link_url: "", link_label: "", image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Padu padan kemeja rayon untuk harian", summary: "Padukan kemeja rayon dengan chino atau cargo untuk gaya santai.", link_url: "", link_label: "", image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "SEO dasar: bantu pelanggan menemukan halaman toko", summary: "Gunakan judul yang jelas dan tautan yang mudah diikuti. SEO membantu mesin pencari memahami situs, bukan menjamin peringkat pertama.", link_url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", link_label: "Google Search Central — SEO Starter Guide", image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Tulis konten yang berguna bagi calon pembeli", summary: "Jawab pertanyaan pelanggan dengan informasi asli dan bermanfaat. Tulis untuk pembaca, bukan hanya mesin pencari.", link_url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", link_label: "Google Search Central — Creating Helpful Content", image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Perjalanan belanja pelanggan bisa online dan offline", summary: "Pelanggan mencari cara belanja yang praktis, baik online maupun di toko. Sediakan informasi produk, pengiriman, dan lokasi dengan jelas.", link_url: "https://business.google.com/en-all/think/consumer-insights/indonesia-search-trends-consumer-behavior/", link_label: "Think with Google — Indonesia Search Trends & Consumer Behavior", image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Mengenal perjalanan Erigo", summary: "Erigo menceritakan perjalanannya dari penjualan online hingga kolaborasi dan peragaan busana internasional.", link_url: "https://erigostore.co.id/pages/about", link_label: "Erigo — About Us", image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Identitas Erigo: gaya kasual untuk anak muda", summary: "Erigo menghadirkan pakaian kasual hingga semi-formal untuk pria dan wanita dengan fokus pada kenyamanan.", link_url: "https://erigostore.co.id/pages/branding", link_label: "Erigo — Branding", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" }
];

async function loadStoreArticles() {
  try {
    const res = await fetch(`${ROOT}api/articles.php`, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        storeArticles = data.articles;
      }
    }
  } catch (e) {
    // Keep fallback
  }
}

function renderHomeArticles() {
  const container = document.getElementById("blog");
  if (!container || !storeArticles || !storeArticles.length) return;
  container.innerHTML = storeArticles.map(article => {
    const rawImg = article.image_url || "";
    const img = rawImg ? (rawImg.startsWith("http") ? rawImg : ROOT + rawImg) : "";
    return `<article class="post">
      ${img ? `<div class="post-thumb"><img src="${escapeHTML(img)}" alt="${escapeHTML(article.title)}" loading="lazy"></div>` : ""}
      <div class="post-body">
        <h3>${escapeHTML(article.title)}</h3>
        <p>${escapeHTML(article.summary)}</p>
        ${article.link_url ? `<a class="source-link" href="${escapeHTML(article.link_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(article.link_label || "Baca selengkapnya")} &rarr;</a>` : ""}
      </div>
    </article>`;
  }).join("");
}

function initHeroSlider() {
  const sliderEl = document.getElementById("hero-slider");
  const dotsEl = document.getElementById("hero-dots");
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");
  if (!sliderEl) return;

  const slides = storeBanners;
  if (!slides || !slides.length) return;

  sliderEl.innerHTML = slides.map((slide, idx) => {
    const img = slide.image_url.startsWith("http") ? slide.image_url : ROOT + slide.image_url;
    return `
      <div class="hero-slide${idx === 0 ? " active" : ""}" style="background-image: linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.78) 100%), url('${escapeHTML(img)}');">
        <div class="wrap hero-slide-content">
          <span class="hero-tag">Special Promo</span>
          <h1>${escapeHTML(slide.title)}</h1>
          <p>${escapeHTML(slide.subtitle || "")}</p>
          <a class="btn inv hero-cta" href="${escapeHTML(slide.button_link || "pages/produk.html")}">${escapeHTML(slide.button_text || "Belanja sekarang")}</a>
        </div>
      </div>`;
  }).join("");

  if (dotsEl) {
    dotsEl.innerHTML = slides.map((_, idx) => `<button type="button" class="hero-dot${idx === 0 ? " active" : ""}" data-idx="${idx}" aria-label="Slide ${idx + 1}"></button>`).join("");
  }

  let curSlide = 0;
  let timer = null;

  const goToSlide = (idx) => {
    curSlide = (idx + slides.length) % slides.length;
    sliderEl.querySelectorAll(".hero-slide").forEach((sl, i) => sl.classList.toggle("active", i === curSlide));
    dotsEl?.querySelectorAll(".hero-dot").forEach((dt, i) => dt.classList.toggle("active", i === curSlide));
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    timer = setInterval(() => goToSlide(curSlide + 1), 5000);
  };

  const stopAutoPlay = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };

  prevBtn?.addEventListener("click", () => { goToSlide(curSlide - 1); startAutoPlay(); });
  nextBtn?.addEventListener("click", () => { goToSlide(curSlide + 1); startAutoPlay(); });

  dotsEl?.querySelectorAll(".hero-dot").forEach(btn => {
    btn.addEventListener("click", () => {
      goToSlide(Number(btn.dataset.idx));
      startAutoPlay();
    });
  });

  const section = document.querySelector(".hero-slider-section");
  section?.addEventListener("mouseenter", stopAutoPlay);
  section?.addEventListener("mouseleave", startAutoPlay);

  startAutoPlay();
}

function homePage() {
  initHeroSlider();
  renderHomeCategories();
  renderHomeArticles();
  document.getElementById("terbaru").innerHTML = PRODUK.filter(x => x.baru).concat(PRODUK.filter(x => !x.baru)).slice(0, 8).map(kartu).join("");
  document.dispatchEvent(new CustomEvent("store:home-rendered"));
  document.dispatchEvent(new CustomEvent("store:products-rendered", { detail: { products: PRODUK } }))
}
function produkPage() {
  const g = document.getElementById("list"), q = document.getElementById("site-search-input"), s = document.getElementById("sort"), ch = document.getElementById("chips"); let k = KAT();
  q.value = new URLSearchParams(location.search).get("q") || "";
  const K = [["", "products.category_all", "Semua"], ["Baru", "shared.nav_new", "Baru"], ["Atasan", "shared.nav_tops", "Atasan"], ["Bawahan", "shared.nav_bottoms", "Bawahan"], ["Outer", "products.category_outer", "Outer"], ["Aksesori", "shared.nav_accessories", "Aksesori"]];
  const r = () => {
    ch.innerHTML = K.map(([category, key, fallback]) => `<button class="chip" aria-pressed="${category === k}" data-k="${escapeHTML(category)}">${escapeHTML(text(key, fallback))}</button>`).join("");
    ch.querySelectorAll("button").forEach(b => b.onclick = () => { k = b.dataset.k; r() });
    let d = PRODUK.filter(x => (k === "Baru" ? x.baru : !k || x.kat === k) && (x.nama + x.tipe).toLowerCase().includes(q.value.toLowerCase()));
    if (s.value === "lo") d.sort((a, b) => a.harga - b.harga); if (s.value === "hi") d.sort((a, b) => b.harga - a.harga);
    g.innerHTML = d.length ? d.map(kartu).join("") : `<div class="empty">${escapeHTML(text("products.empty", "Tidak ada produk yang cocok. Coba kata kunci atau kategori lain."))}</div>`
  };
  q.oninput = s.onchange = r; r()
}
function cartPage() {
  const box = document.getElementById("cart"), c = getCart(), items = Object.entries(c).map(([key, qty]) => {
    const [id, size] = key.split(":");
    return { product: PRODUK.find(x => x.id === Number(id)), size: size || "Ukuran belum dipilih", key, qty }
  }).filter(item => item.product);
  if (!items.length) { box.innerHTML = `<div class="empty"><p>${escapeHTML(text("cart.empty", "Keranjang masih kosong."))}</p><p><a class="btn" href="${U("produk")}">${escapeHTML(text("cart.shop", "Mulai belanja"))}</a></p></div>`; return }
  const sub = items.reduce((a, item) => a + item.product.harga * item.qty, 0), dis = sub >= 250000 ? 20000 : sub >= 150000 ? 10000 : 0, total = sub - dis;
  box.innerHTML = `<table><thead><tr><th>${escapeHTML(text("cart.col_product", "Produk"))}</th><th>${escapeHTML(text("cart.col_price", "Harga"))}</th><th>${escapeHTML(text("cart.col_quantity", "Jumlah"))}</th><th>${escapeHTML(text("cart.col_subtotal", "Subtotal"))}</th></tr></thead><tbody>${items.map(({ product: x, size, key, qty }) => `<tr><td>${escapeHTML(x.nama)}<br><small>${escapeHTML(text("cart.item_size", "Ukuran"))}: ${escapeHTML(size)}</small></td><td>${rp(x.harga)}</td><td><div class="qty"><button aria-label="Kurangi ${escapeHTML(x.nama)}" data-cart-key="${escapeHTML(key)}" data-cart-delta="-1">−</button>${qty}<button aria-label="Tambah ${escapeHTML(x.nama)}" data-cart-key="${escapeHTML(key)}" data-cart-delta="1">+</button></div></td><td>${rp(x.harga * qty)}</td></tr>`).join("")}</tbody></table>
<dl class="sum"><dt>${escapeHTML(text("cart.subtotal", "Subtotal"))}</dt><dd>${rp(sub)}</dd><dt>${escapeHTML(text("cart.discount", "Voucher belanja"))}</dt><dd>${dis ? "-" + rp(dis) : escapeHTML(text("cart.discount_unavailable", "Belum berlaku"))}</dd><dt>${escapeHTML(text("cart.shipping", "Ongkir"))}</dt><dd>${escapeHTML(text("cart.free", "Gratis"))}</dd><dt class="t">${escapeHTML(text("cart.total", "Total"))}</dt><dd class="t">${rp(total)}</dd></dl>
<p class="hint">${escapeHTML(sub < 150000 ? text("cart.discount_hint_1", "Tambah {amount} lagi untuk diskon Rp10.000.").replace("{amount}", rp(150000 - sub)) : sub < 250000 ? text("cart.discount_hint_2", "Tambah {amount} lagi untuk diskon Rp20.000.").replace("{amount}", rp(250000 - sub)) : text("cart.discount_hint_max", "Diskon maksimal sudah terpakai."))}</p>
<a class="btn wide" id="co" href="#">${escapeHTML(text("cart.checkout", "Pesan lewat WhatsApp"))}</a>`;
  const t = "Halo " + TOKO.nama + ", saya ingin memesan:\n" + items.map(({ product: x, size, qty }) => `- ${x.nama} (ukuran ${size}) x${qty} (${rp(x.harga * qty)})`).join("\n") + "\nDiskon: " + rp(dis) + "\nTotal: " + rp(total);
  document.getElementById("co").href = "https://wa.me/" + TOKO.wa + "?text=" + encodeURIComponent(t);
  box.querySelectorAll("[data-cart-key]").forEach(button => button.onclick = () => ubah(button.dataset.cartKey, Number(button.dataset.cartDelta)))
}
function ubah(key, d) { const c = getCart(); c[key] = (c[key] || 0) + d; if (c[key] <= 0) delete c[key]; saveCart(c); cartPage() }
function kontakPage() {
  const form = document.getElementById("f");
  if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    const f = e.target;
    const nama = (f.nama?.value || "").trim();
    const telepon = (f.telepon?.value || "").trim();
    const topik = (f.topik?.value || "Pertanyaan Umum").trim();
    const pesan = (f.pesan?.value || "").trim();

    let textMsg = `Halo Customer Service ${text("shared.brand", TOKO.nama)},\n`;
    textMsg += `Nama: ${nama}\n`;
    if (telepon) textMsg += `No. WhatsApp: ${telepon}\n`;
    textMsg += `Topik: ${topik}\n\n`;
    textMsg += `Pesan / Kendala:\n${pesan}`;

    const waUrl = "https://wa.me/" + TOKO.wa + "?text=" + encodeURIComponent(textMsg);
    window.open(waUrl, "_blank") || (location.href = waUrl);
  };
}
async function loadStoreProducts() {
  try {
    const response = await fetch(`${ROOT}api/products.php`, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error("Format katalog server tidak valid.");
    PRODUK.splice(0, PRODUK.length, ...data.products);
  } catch (error) {
    console.warn("Katalog server tidak tersedia; memakai katalog demo lokal.", error);
  }
}
async function loadSiteContent() {
  try {
    const response = await fetch(`${ROOT}api/content.php`, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.content || typeof data.content !== "object") throw new Error("Format teks situs tidak valid.");
    SITE_CONTENT = data.content;
  } catch (error) {
    console.warn("Teks database tidak tersedia; memakai teks bawaan halaman.", error);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadStoreProducts(), loadSiteContent(), loadStoreBanners(), loadStoreCategories(), loadStoreArticles()]); layout(); const m = document.body.dataset.page;
  if (m === "home") homePage(); if (m === "produk") produkPage(); if (m === "cart") cartPage(); if (m === "kontak") kontakPage()
});
