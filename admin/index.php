<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
security_headers();
$user = current_user();
if ($user === null) {
    header('Location: ../pages/akun.php');
    exit;
}
if (($user['role'] ?? '') !== 'admin') {
    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="id"><head><meta charset="utf-8"><title>Akses ditolak</title>
    <link rel="stylesheet" href="../assets/css/admin.css"></head>
    <body style="display:grid;place-items:center;min-height:100vh;text-align:center;gap:12px">
      <div>
        <div style="font-size:3rem;margin-bottom:16px">🚫</div>
        <h1 style="font-size:1.5rem;margin-bottom:8px">Akses Ditolak</h1>
        <p style="color:var(--admin-muted);margin-bottom:20px">Dashboard hanya tersedia untuk akun admin.</p>
        <a href="../pages/akun.php" style="background:var(--admin-accent);color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Kembali ke akun</a>
      </div>
    </body></html>
    <?php
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title data-content="admin.page_title">Dashboard Admin — ERIGO STORE</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
    <link rel="stylesheet" href="../assets/css/admin.css?v=20261023e">
    <link rel="stylesheet" href="../assets/css/components/product-image-slots.css">
</head>
<body>
<div class="admin-layout">

    <!-- ══ SIDEBAR ══ -->
    <aside class="admin-sidebar">
        <div class="admin-sidebar-brand">
            <a class="brand-logo" href="../index.html" title="Lihat toko">
                <div class="brand-icon">E</div>
                <div>
                    <div class="brand-name" data-content="admin.brand">ERIGO STORE</div>
                    <div class="brand-sub">Dashboard Admin</div>
                </div>
            </a>
        </div>

        <nav class="admin-sidebar-nav" aria-label="Navigasi admin">
            <span class="nav-label">Menu</span>
            <button class="nav-item active" type="button" data-admin-tab="products" aria-pressed="true">
                <span>📦</span>
                <span data-content="admin.tab_products">Produk</span>
            </button>
            <button class="nav-item" type="button" data-admin-tab="banners" aria-pressed="false">
                <span>🖼️</span>
                <span>Banner Promo</span>
            </button>
            <button class="nav-item" type="button" data-admin-tab="categories" aria-pressed="false">
                <span>🏷️</span>
                <span>Kategori Beranda</span>
            </button>
            <button class="nav-item" type="button" data-admin-tab="articles" aria-pressed="false">
                <span>📰</span>
                <span>Artikel & Referensi</span>
            </button>
            <button class="nav-item" type="button" data-admin-tab="content" aria-pressed="false">
                <span>✏️</span>
                <span data-content="admin.tab_content">Teks Halaman</span>
            </button>

            <span class="nav-label">Toko</span>
            <a class="nav-item" href="../index.html">
                <span>🏠</span>
                <span data-content="admin.view_store">Lihat toko</span>
            </a>
            <a class="nav-item" href="../pages/produk.html">
                <span>🛍️</span>
                <span>Katalog</span>
            </a>
        </nav>

        <div class="admin-sidebar-footer">
            <div class="sidebar-user">
                <div class="sidebar-avatar"><?= strtoupper(substr(htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8'), 0, 1)) ?></div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name"><?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8') ?></div>
                    <span class="sidebar-user-role">Admin</span>
                </div>
            </div>
        </div>
    </aside>

    <!-- ══ KONTEN KANAN ══ -->
    <div class="admin-right">

        <!-- Topbar -->
        <header class="admin-topbar">
            <span class="topbar-title" data-content="admin.heading">Dashboard Admin</span>
            <div class="topbar-actions">
                <button class="btn btn-secondary btn-sm" id="new-product" type="button" data-content="admin.add_product">+ Tambah Produk</button>
                <button class="btn btn-secondary btn-sm" id="admin-logout" type="button" data-content="admin.logout">Keluar</button>
            </div>
        </header>

        <!-- Tabs -->
        <nav class="admin-tabs" aria-label="Bagian dashboard">
            <button class="chip" type="button" data-admin-tab="products" aria-pressed="true" data-content="admin.tab_products">📦 Produk</button>
            <button class="chip" type="button" data-admin-tab="banners" aria-pressed="false">🖼️ Banner Promo</button>
            <button class="chip" type="button" data-admin-tab="categories" aria-pressed="false">🏷️ Kategori Beranda</button>
            <button class="chip" type="button" data-admin-tab="articles" aria-pressed="false">📰 Artikel</button>
            <button class="chip" type="button" data-admin-tab="content" aria-pressed="false" data-content="admin.tab_content">✏️ Teks Halaman</button>
        </nav>

        <!-- Konten utama -->
        <main class="admin-main">

            <!-- ── PANEL PRODUK ── -->
            <section data-admin-panel="products">
                <!-- Summary -->
                <div class="dashboard-summary">
                    <div>
                        <p class="hint" data-content="admin.products_managed">Produk dikelola</p>
                        <strong id="product-count">—</strong>
                    </div>
                    <div>
                        <p class="hint" data-content="admin.signed_in">Login sebagai</p>
                        <strong><?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8') ?></strong>
                    </div>
                    <button class="btn" id="new-product-2" type="button" data-content="admin.add_product">+ Tambah Produk</button>
                </div>

                <!-- Pesan status -->
                <p class="admin-message" id="admin-message" role="status"></p>

                <!-- Tabel produk -->
                <div class="panel-card">
                    <div class="admin-title">
                        <h1 data-content="admin.products_title">Manajemen Produk</h1>
                        <p data-content="admin.products_description">Perubahan disimpan ke database katalog.</p>
                    </div>
                    <div class="table-scroll">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th data-content="admin.col_product">Produk</th>
                                    <th data-content="admin.col_category">Kategori</th>
                                    <th data-content="admin.col_price">Harga</th>
                                    <th data-content="admin.col_status">Status</th>
                                    <th data-content="admin.col_actions">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="admin-products">
                                <tr><td colspan="5" style="text-align:center;padding:32px;color:var(--admin-muted)" data-content="admin.loading_products">Memuat produk…</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ── PANEL BANNER PROMO ── -->
            <section data-admin-panel="banners" hidden>
                <div class="dashboard-summary">
                    <div>
                        <p class="hint">Banner Dikelola</p>
                        <strong id="banner-count">—</strong>
                    </div>
                    <div>
                        <p class="hint">Animasi Slider</p>
                        <strong style="color:#22c55e">⚡ Aktif (Transisi Otomatis)</strong>
                    </div>
                    <button class="btn" id="new-banner" type="button">+ Tambah Banner</button>
                </div>

                <p class="admin-message" id="banner-message" role="status"></p>

                <div class="panel-card">
                    <div class="admin-title">
                        <h1>Kelola Banner & Slider Beranda</h1>
                        <p>Atur gambar, judul, teks tombol, dan tautan promo banner yang tampil di beranda toko.</p>
                    </div>
                    <div class="table-scroll">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Banner</th>
                                    <th>Judul & Teks</th>
                                    <th>Tombol & Tautan</th>
                                    <th>Urutan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="admin-banners">
                                <tr><td colspan="6" style="text-align:center;padding:32px;color:var(--admin-muted)">Memuat banner…</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ── PANEL KATEGORI BERANDA ── -->
            <section data-admin-panel="categories" hidden>
                <p class="admin-message" id="category-message" role="status"></p>
                <div class="panel-card">
                    <div class="admin-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                        <div>
                            <h1>Kelola Kategori Beranda</h1>
                            <p>Atur gambar latar, nama kategori, dan keterangan subjudul pada kartu beranda.</p>
                        </div>
                        <button class="btn btn-sm" id="new-category" type="button">+ Tambah Kategori</button>
                    </div>
                    <div class="table-scroll">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Gambar</th>
                                    <th>Kategori</th>
                                    <th>Keterangan Subjudul</th>
                                    <th>Tautan Tujuan</th>
                                    <th>Urutan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="admin-categories">
                                <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--admin-muted)">Memuat kategori…</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ── PANEL ARTIKEL & REFERENSI ── -->
            <section data-admin-panel="articles" hidden>
                <p class="admin-message" id="article-message" role="status"></p>
                <div class="panel-card">
                    <div class="admin-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                        <div>
                            <h1>Kelola Artikel & Referensi</h1>
                            <p>Perbarui judul, ringkasan isi artikel, serta tautan link dan label sumber yang tampil di beranda.</p>
                        </div>
                        <button class="btn btn-sm" id="new-article" type="button">+ Tambah Artikel</button>
                    </div>
                    <div class="table-scroll">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Judul Artikel</th>
                                    <th>Ringkasan Isi</th>
                                    <th>Link & Label Sumber</th>
                                    <th>Urutan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="admin-articles">
                                <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--admin-muted)">Memuat artikel…</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ── PANEL TEKS HALAMAN ── -->
            <section data-admin-panel="content" hidden>
                <p class="admin-message" id="content-message" role="status"></p>
                <div class="panel-card">
                    <div class="admin-title">
                        <h1 data-content="admin.content_title">Kelola Teks Halaman</h1>
                        <p data-content="admin.content_description">Perbarui tulisan di beranda, katalog, keranjang, kontak, header, footer, halaman akun, dan dashboard admin.</p>
                    </div>
                    <div style="padding:24px">
                        <form id="content-form" class="content-editor">
                            <div id="content-fields">
                                <p style="color:var(--admin-muted)" data-content="admin.loading_content">Memuat teks halaman…</p>
                            </div>
                            <button class="btn" type="submit" data-content="admin.save_content" style="width:fit-content">💾 Simpan Semua Teks</button>
                        </form>
                    </div>
                </div>
            </section>

        </main>
    </div><!-- /.admin-right -->
</div><!-- /.admin-layout -->

<!-- ══ MODAL EDITOR PRODUK ══ -->
<dialog id="product-editor" class="product-editor">
    <form id="product-form">
        <div class="editor-heading">
            <h2 id="editor-title" data-content="admin.editor_add">Tambah Produk</h2>
            <button type="button" id="close-editor" aria-label="Tutup">×</button>
        </div>

        <input type="hidden" name="id">
        <p class="admin-message" id="editor-message" role="status"></p>

        <label>
            <span data-content="admin.product_name">Nama Produk</span>
            <input name="nama" maxlength="160" required placeholder="Contoh: Kaos Oversize Hitam">
        </label>

        <div class="field-row">
            <label>
                <span data-content="admin.product_type">Tipe</span>
                <input name="tipe" maxlength="100" required placeholder="Contoh: T-shirt oversize">
            </label>
            <label>
                <span data-content="admin.product_category">Kategori</span>
                <select name="kat" required>
                    <option data-content="shared.nav_tops">Atasan</option>
                    <option data-content="shared.nav_bottoms">Bawahan</option>
                    <option data-content="products.category_outer">Outer</option>
                    <option data-content="shared.nav_accessories">Aksesori</option>
                </select>
            </label>
        </div>

        <div class="field-row">
            <label>
                <span data-content="admin.price_sale">Harga Jual (Rp)</span>
                <input name="harga" type="number" min="0" step="1000" required placeholder="99000">
            </label>
            <label>
                <span data-content="admin.price_normal">Harga Normal (Rp)</span>
                <input name="harga_normal" type="number" min="0" step="1000" required placeholder="199000">
            </label>
        </div>

        <label>
            <span data-content="admin.card_color">Warna Kartu</span>
            <input name="warna" type="color" value="#1C1C1E" required>
        </label>

        <label>
            <span data-content="admin.product_description">Deskripsi</span>
            <textarea name="deskripsi" rows="3" maxlength="2000" placeholder="Deskripsi singkat produk…"></textarea>
        </label>

        <input type="hidden" name="gambar" value="[]">
        <fieldset class="product-image-manager">
            <legend>Foto Produk per Tampilan</legend>
            <p class="hint" style="margin:8px 0 12px">Pilih dan unggah foto secara terpisah untuk setiap tampilan. Format JPG, PNG, atau WebP; maksimal 5 MB per foto.</p>
            <div class="product-image-slots" id="admin-image-slots"></div>
        </fieldset>

        <label class="checkbox-row">
            <input name="baru" type="checkbox" value="1">
            <span data-content="admin.mark_new">Tandai sebagai produk baru</span>
        </label>

        <p class="hint" data-content="admin.image_help">JPG, PNG, atau WebP; maks. 5 MB per foto dan 8 foto per produk. Produk baru harus disimpan terlebih dahulu sebelum foto diunggah.</p>

        <button class="btn" type="submit" data-content="admin.save_product" style="width:100%">💾 Simpan Produk</button>
    </form>
</dialog>

<!-- ══ MODAL EDITOR BANNER ══ -->
<dialog id="banner-editor" class="product-editor banner-dialog" aria-label="Editor Banner">
    <form id="banner-form" enctype="multipart/form-data">
        <div class="editor-heading">
            <div class="editor-heading-text">
                <h2 id="banner-editor-title">Tambah Banner</h2>
                <p class="editor-subtitle">Atur judul, gambar latar promo, dan link tombol beranda</p>
            </div>
            <button type="button" id="close-banner-editor" class="dialog-close-btn" aria-label="Tutup">×</button>
        </div>

        <input type="hidden" name="id" id="banner-id">
        <p class="admin-message" id="banner-modal-message" role="status"></p>

        <!-- Judul Utama -->
        <div class="banner-form-group">
            <label for="banner-title" class="form-label">
                <span>Judul Utama Banner</span>
                <span class="badge-req">*Wajib</span>
            </label>
            <input name="title" id="banner-title" placeholder="Contoh: Koleksi Baru: Cargo & Streetwear" required>
        </div>

        <!-- Deskripsi / Subjudul -->
        <div class="banner-form-group">
            <label for="banner-subtitle" class="form-label">
                <span>Deskripsi / Subjudul Promo</span>
                <span class="badge-req">Opsional</span>
            </label>
            <textarea name="subtitle" id="banner-subtitle" rows="3" placeholder="Contoh: Bahan lentur, adem, dan ringan untuk aktivitas seharian. Gratis ongkir ke seluruh Indonesia."></textarea>
        </div>

        <!-- Tombol & Tautan -->
        <div class="banner-field-row">
            <div class="banner-form-group">
                <label for="banner-button-text" class="form-label">
                    <span>Teks Tombol</span>
                    <span class="badge-req">*Wajib</span>
                </label>
                <input name="button_text" id="banner-button-text" value="Belanja sekarang" required placeholder="Contoh: Belanja sekarang">
            </div>
            <div class="banner-form-group">
                <label for="banner-button-link" class="form-label">
                    <span>Tautan Tombol</span>
                    <span class="badge-req">*Wajib</span>
                </label>
                <input name="button_link" id="banner-button-link" value="pages/produk.html?kat=Baru" required placeholder="pages/produk.html">
            </div>
        </div>

        <!-- Urutan & Status Aktif -->
        <div class="banner-field-row">
            <div class="banner-form-group">
                <label for="banner-sort-order" class="form-label">
                    <span>Urutan Tampil (Angka)</span>
                </label>
                <input type="number" name="sort_order" id="banner-sort-order" value="1" min="0" placeholder="1">
            </div>
            <div class="banner-form-group">
                <label class="form-label"><span>Status Banner</span></label>
                <label class="banner-checkbox-card" for="banner-is-active">
                    <input type="checkbox" name="is_active" id="banner-is-active" value="1" checked>
                    <span>Tampilkan di Beranda (Aktif)</span>
                </label>
            </div>
        </div>

        <!-- Panel Gambar Banner -->
        <div class="banner-image-panel">
            <div class="banner-image-panel-title">
                <h4>🖼️ Gambar Latar Banner</h4>
                <span>Rekomendasi rasio 16:9 atau 1920×800 px</span>
            </div>

            <!-- Upload File -->
            <div class="banner-form-group">
                <label class="form-label"><span>Unggah File dari Komputer/HP</span></label>
                <div class="banner-upload-box">
                    <input type="file" name="image" id="banner-file-input" accept="image/jpeg,image/png,image/webp">
                    <p class="hint" style="margin-top:4px">Format JPG, PNG, atau WebP (maks. 5 MB)</p>
                </div>
            </div>

            <div class="banner-or-divider">ATAU GUNAKAN TAUTAN URL</div>

            <!-- URL Input -->
            <div class="banner-form-group">
                <label for="banner-image-url" class="form-label"><span>Link URL Gambar (Web / Unsplash)</span></label>
                <input type="text" name="image_url" id="banner-image-url" placeholder="https://images.unsplash.com/... atau assets/img/banners/...">
            </div>

            <!-- Live Preview Card -->
            <div id="banner-preview-box" class="banner-preview-wrapper">
                <div class="banner-preview-header">
                    <span class="live-badge">Pratinjau Langsung Tampilan Beranda</span>
                    <span id="preview-ratio-label">16:9 / Landscape</span>
                </div>
                <div class="banner-preview-img-container">
                    <img id="banner-preview-img" src="" alt="Preview Banner">
                    <div class="banner-preview-overlay">
                        <span class="prev-tag">Special Promo</span>
                        <div class="prev-title" id="prev-mock-title">Judul Banner Promo</div>
                        <div class="prev-sub" id="prev-mock-sub">Deskripsi promo menarik toko...</div>
                        <span class="prev-btn" id="prev-mock-btn">Belanja sekarang</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tombol Aksi Modal -->
        <div class="banner-dialog-actions">
            <button type="button" class="btn btn-secondary" id="cancel-banner">Batal</button>
            <button class="btn" type="submit" id="save-banner-btn">💾 Simpan Banner</button>
        </div>
    </form>
</dialog>

<!-- ══ MODAL EDITOR KATEGORI ══ -->
<dialog id="category-editor" class="product-editor banner-dialog" aria-label="Editor Kategori">
    <form id="category-form" enctype="multipart/form-data">
        <div class="editor-heading">
            <div class="editor-heading-text">
                <h2 id="category-editor-title">Tambah Kategori</h2>
                <p class="editor-subtitle">Atur gambar latar, nama kategori, dan link halaman produk</p>
            </div>
            <button type="button" id="close-category-editor" class="dialog-close-btn" aria-label="Tutup">×</button>
        </div>

        <input type="hidden" name="id" id="category-id">
        <p class="admin-message" id="category-modal-message" role="status"></p>

        <!-- Nama Kategori -->
        <div class="banner-form-group">
            <label for="category-name" class="form-label">
                <span>Nama Kategori</span>
                <span class="badge-req">*Wajib</span>
            </label>
            <input name="name" id="category-name" placeholder="Contoh: Atasan" required>
        </div>

        <!-- Keterangan Subjudul -->
        <div class="banner-form-group">
            <label for="category-subtitle" class="form-label">
                <span>Keterangan Subjudul</span>
                <span class="badge-req">Opsional</span>
            </label>
            <input name="subtitle" id="category-subtitle" placeholder="Contoh: Kaos dan kemeja">
        </div>

        <!-- Tautan Tujuan -->
        <div class="banner-form-group">
            <label for="category-link" class="form-label">
                <span>Tautan Halaman Produk</span>
                <span class="badge-req">*Wajib</span>
            </label>
            <input name="link" id="category-link" placeholder="Contoh: pages/produk.html?kat=Atasan" required>
        </div>

        <!-- Urutan & Status Aktif -->
        <div class="banner-field-row">
            <div class="banner-form-group">
                <label for="category-sort-order" class="form-label">
                    <span>Urutan Tampil (Angka)</span>
                </label>
                <input type="number" name="sort_order" id="category-sort-order" value="1" min="0" placeholder="1">
            </div>
            <div class="banner-form-group">
                <label class="form-label"><span>Status Tampil</span></label>
                <label class="banner-checkbox-card" for="category-is-active">
                    <input type="checkbox" name="is_active" id="category-is-active" value="1" checked>
                    <span>Tampilkan di Beranda (Aktif)</span>
                </label>
            </div>
        </div>

        <!-- Panel Gambar Kategori -->
        <div class="banner-image-panel">
            <div class="banner-image-panel-title">
                <h4>🖼️ Gambar Latar Kategori</h4>
                <span>Format JPG, PNG, atau WebP (maks. 5 MB)</span>
            </div>

            <!-- Upload File -->
            <div class="banner-form-group">
                <label class="form-label"><span>Unggah File Foto</span></label>
                <div class="banner-upload-box">
                    <input type="file" name="image" id="category-file-input" accept="image/jpeg,image/png,image/webp">
                    <p class="hint" style="margin-top:4px">Klik untuk memilih gambar dari perangkat</p>
                </div>
            </div>

            <div class="banner-or-divider">ATAU GUNAKAN TAUTAN URL</div>

            <!-- URL Input -->
            <div class="banner-form-group">
                <label for="category-image-url" class="form-label"><span>Link URL Gambar (Web / Unsplash)</span></label>
                <input type="text" name="image_url" id="category-image-url" placeholder="https://images.unsplash.com/... atau assets/img/categories/...">
            </div>

            <!-- Live Preview Card -->
            <div id="category-preview-box" class="banner-preview-wrapper">
                <div class="banner-preview-header">
                    <span class="live-badge">Pratinjau Kartu Kategori</span>
                    <span>Kartu Beranda</span>
                </div>
                <div class="banner-preview-img-container" style="height:150px">
                    <img id="category-preview-img" src="" alt="Preview Kategori">
                    <div class="banner-preview-overlay">
                        <div class="prev-title" id="cat-mock-title" style="font-size:1.15rem">Atasan</div>
                        <div class="prev-sub" id="cat-mock-sub">Kaos dan kemeja</div>
                        <span style="font-size:.72rem;font-weight:700;color:#c4b5fd">Jelajahi &rarr;</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tombol Aksi Modal -->
        <div class="banner-dialog-actions">
            <button type="button" class="btn btn-secondary" id="cancel-category">Batal</button>
            <button class="btn" type="submit" id="save-category-btn">💾 Simpan Kategori</button>
        </div>
    </form>
</dialog>

<!-- ══ MODAL EDITOR ARTIKEL ══ -->
<dialog id="article-editor" class="product-editor banner-dialog" aria-label="Editor Artikel">
    <form id="article-form" enctype="multipart/form-data">
        <div class="editor-heading">
            <div class="editor-heading-text">
                <h2 id="article-editor-title">Tambah Artikel</h2>
                <p class="editor-subtitle">Atur judul artikel, foto thumbnail, isi/ringkasan, dan tautan referensi beranda</p>
            </div>
            <button type="button" id="close-article-editor" class="dialog-close-btn" aria-label="Tutup">×</button>
        </div>

        <input type="hidden" name="id" id="article-id">
        <p class="admin-message" id="article-modal-message" role="status"></p>

        <!-- Judul Artikel -->
        <div class="banner-form-group">
            <label for="article-title" class="form-label">
                <span>Judul Artikel</span>
                <span class="badge-req">*Wajib</span>
            </label>
            <input name="title" id="article-title" placeholder="Contoh: Cara memilih ukuran kaos oversize" required>
        </div>

        <!-- Isi / Ringkasan -->
        <div class="banner-form-group">
            <label for="article-summary" class="form-label">
                <span>Ringkasan / Isi Singkat</span>
                <span class="badge-req">*Wajib</span>
            </label>
            <textarea name="summary" id="article-summary" rows="3" placeholder="Tuliskan isi atau ringkasan artikel..." required></textarea>
        </div>

        <!-- Panel Foto Thumbnail Artikel -->
        <div class="banner-image-panel">
            <div class="banner-image-panel-title">
                <h4>🖼️ Foto Thumbnail Artikel</h4>
                <span>Format landscape / 16:9 disarankan</span>
            </div>

            <!-- Upload File -->
            <div class="banner-form-group">
                <label class="form-label"><span>Unggah File dari Komputer/HP</span></label>
                <div class="banner-upload-box">
                    <input type="file" name="image" id="article-file-input" accept="image/jpeg,image/png,image/webp">
                    <p class="hint" style="margin-top:4px">Klik untuk memilih gambar dari perangkat</p>
                </div>
            </div>

            <div class="banner-or-divider">ATAU GUNAKAN TAUTAN URL</div>

            <!-- URL Input -->
            <div class="banner-form-group">
                <label for="article-image-url" class="form-label"><span>Link URL Gambar (Web / Unsplash)</span></label>
                <input type="text" name="image_url" id="article-image-url" placeholder="https://images.unsplash.com/... atau assets/img/articles/...">
            </div>
        </div>

        <!-- Link & Label Tautan -->
        <div class="banner-image-panel" style="background:var(--admin-surface);border:1px solid var(--admin-border);padding:16px;border-radius:10px">
            <div class="banner-image-panel-title" style="margin-bottom:12px">
                <h4>🔗 Link / Tautan Artikel (Opsional)</h4>
                <span>Tautan referensi atau website luar</span>
            </div>
            <div class="banner-form-group">
                <label for="article-link-url" class="form-label"><span>URL Tautan (Link Lengkap)</span></label>
                <input type="url" name="link_url" id="article-link-url" placeholder="https://developers.google.com/... atau https://erigostore.co.id/...">
            </div>
            <div class="banner-form-group" style="margin-top:10px">
                <label for="article-link-label" class="form-label"><span>Label Teks Tautan</span></label>
                <input name="link_label" id="article-link-label" placeholder="Contoh: Google Search Central — SEO Starter Guide">
            </div>
        </div>

        <!-- Urutan & Status Aktif -->
        <div class="banner-field-row">
            <div class="banner-form-group">
                <label for="article-sort-order" class="form-label">
                    <span>Urutan Tampil (Angka)</span>
                </label>
                <input type="number" name="sort_order" id="article-sort-order" value="1" min="0" placeholder="1">
            </div>
            <div class="banner-form-group">
                <label class="form-label"><span>Status Publikasi</span></label>
                <label class="banner-checkbox-card" for="article-is-active">
                    <input type="checkbox" name="is_active" id="article-is-active" value="1" checked>
                    <span>Tampilkan di Beranda (Aktif)</span>
                </label>
            </div>
        </div>

        <!-- Pratinjau Langsung Kartu Artikel -->
        <div class="banner-form-group">
            <label class="form-label"><span>Pratinjau Kartu Beranda</span></label>
            <div style="background:#09090d;border:1px solid var(--admin-border);border-top:3px solid var(--admin-accent);padding:0;border-radius:8px;overflow:hidden">
                <div id="art-preview-box" style="width:100%;height:160px;background:#181824;overflow:hidden;position:relative">
                    <img id="art-preview-img" src="" alt="Thumbnail" style="width:100%;height:100%;object-fit:cover;display:block">
                </div>
                <div style="padding:16px">
                    <h3 id="art-mock-title" style="font-size:1.05rem;font-weight:700;margin-bottom:6px;color:#fff">Judul Artikel</h3>
                    <p id="art-mock-summary" style="font-size:.85rem;color:var(--admin-muted);line-height:1.5;margin-bottom:8px">Ringkasan isi artikel akan tampil di sini...</p>
                    <a id="art-mock-link" href="#" style="font-size:.82rem;font-weight:600;color:var(--admin-accent2);text-decoration:underline;text-underline-offset:3px;display:none">Tautan Sumber &rarr;</a>
                </div>
            </div>
        </div>

        <!-- Tombol Aksi Modal -->
        <div class="banner-dialog-actions">
            <button type="button" class="btn btn-secondary" id="cancel-article">Batal</button>
            <button class="btn" type="submit" id="save-article-btn">💾 Simpan Artikel</button>
        </div>
    </form>
</dialog>

<script src="../assets/js/components/product-image-slots.js"></script>
<script src="../assets/js/admin.js?v=20261023f"></script>
</body>
</html>
