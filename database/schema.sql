CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,
    price INT UNSIGNED NOT NULL,
    original_price INT UNSIGNED NOT NULL,
    color CHAR(7) NOT NULL DEFAULT '#1C1C1E',
    description TEXT NOT NULL,
    images TEXT NOT NULL,
    is_new TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_category (category),
    INDEX idx_products_new (is_new)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_content (
    content_key VARCHAR(80) NOT NULL PRIMARY KEY,
    content_page VARCHAR(30) NOT NULL,
    label VARCHAR(120) NOT NULL,
    content_value TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_content_page (content_page)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS banners (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle TEXT NOT NULL,
    button_text VARCHAR(100) NOT NULL DEFAULT 'Belanja sekarang',
    button_link VARCHAR(255) NOT NULL DEFAULT 'pages/produk.html?kat=Baru',
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_banners_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200) NOT NULL,
    link VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (id, name, subtitle, link, image_url, sort_order, is_active) VALUES
(1, 'Atasan', 'Kaos dan kemeja', 'pages/produk.html?kat=Atasan', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 1, 1),
(2, 'Bawahan', 'Chino, cargo, jogger', 'pages/produk.html?kat=Bawahan', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 2, 1),
(3, 'Aksesori', 'Topi dan tas', 'pages/produk.html?kat=Aksesori', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', 3, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

CREATE TABLE IF NOT EXISTS articles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL DEFAULT '',
    link_url VARCHAR(500) NULL DEFAULT '',
    link_label VARCHAR(200) NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_articles_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO articles (id, title, summary, image_url, link_url, link_label, sort_order, is_active) VALUES
(1, 'Cara memilih ukuran kaos oversize', 'Ukur badan, lalu cocokkan dengan panduan ukuran sebelum membeli.', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', '', '', 1, 1),
(2, 'Merawat celana chino agar awet', 'Cuci dengan air dingin dan jemur di tempat teduh.', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', '', '', 2, 1),
(3, 'Padu padan kemeja rayon untuk harian', 'Padukan kemeja rayon dengan chino atau cargo untuk gaya santai.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', '', '', 3, 1),
(4, 'SEO dasar: bantu pelanggan menemukan halaman toko', 'Gunakan judul yang jelas dan tautan yang mudah diikuti. SEO membantu mesin pencari memahami situs, bukan menjamin peringkat pertama.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', 'Google Search Central — SEO Starter Guide', 4, 1),
(5, 'Tulis konten yang berguna bagi calon pembeli', 'Jawab pertanyaan pelanggan dengan informasi asli dan bermanfaat. Tulis untuk pembaca, bukan hanya mesin pencari.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', 'Google Search Central — Creating Helpful Content', 5, 1),
(6, 'Perjalanan belanja pelanggan bisa online dan offline', 'Pelanggan mencari cara belanja yang praktis, baik online maupun di toko. Sediakan informasi produk, pengiriman, dan lokasi dengan jelas.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', 'https://business.google.com/en-all/think/consumer-insights/indonesia-search-trends-consumer-behavior/', 'Think with Google — Indonesia Search Trends & Consumer Behavior', 6, 1),
(7, 'Mengenal perjalanan Erigo', 'Erigo menceritakan perjalanannya dari penjualan online hingga kolaborasi dan peragaan busana internasional.', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', 'https://erigostore.co.id/pages/about', 'Erigo — About Us', 7, 1),
(8, 'Identitas Erigo: gaya kasual untuk anak muda', 'Erigo menghadirkan pakaian kasual hingga semi-formal untuk pria dan wanita dengan fokus pada kenyamanan.', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', 'https://erigostore.co.id/pages/branding', 'Erigo — Branding', 8, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO products (id, name, type, category, price, original_price, color, description, images, is_new) VALUES
(1, 'Kaos oversize Garis Hitam', 'T-shirt oversize', 'Atasan', 99000, 249000, '#1C1C1E', 'Kaos oversize untuk gaya sehari-hari.', '[]', 1),
(2, 'Kaos contrast stitch Putih', 'T-shirt', 'Atasan', 89000, 199000, '#C9C6BE', 'Kaos kasual dengan detail jahitan kontras.', '[]', 0),
(3, 'Kemeja rayon saku Terakota', 'Short shirt', 'Atasan', 139000, 199000, '#A8553A', 'Kemeja rayon untuk tampilan santai.', '[]', 1),
(4, 'Kemeja oxford Biru Dongker', 'Oxford shirt', 'Atasan', 169000, 259000, '#24304F', 'Kemeja oxford untuk gaya kasual rapi.', '[]', 0),
(5, 'Chino flexi fit Hitam', 'Chino pants', 'Bawahan', 179000, 449000, '#2B2B2B', 'Celana chino untuk tampilan kasual.', '[]', 1),
(6, 'Relax chino Khaki', 'Relax chino', 'Bawahan', 239000, 339000, '#B39B72', 'Celana chino potongan santai.', '[]', 0),
(7, 'Cargo pants Olive', 'Cargo pants', 'Bawahan', 229000, 399000, '#5B6240', 'Celana cargo untuk aktivitas sehari-hari.', '[]', 1),
(8, 'Jogger flexi fit Abu', 'Jogger pants', 'Bawahan', 189000, 329000, '#7A7D83', 'Celana jogger untuk gaya kasual.', '[]', 0),
(9, 'Jaket parka adventure', 'Parka jacket', 'Outer', 299000, 499000, '#3E4A3B', 'Jaket parka sebagai lapisan tambahan.', '[]', 1),
(10, 'Jaket coach Hitam', 'Coach jacket', 'Outer', 259000, 389000, '#161616', 'Jaket coach untuk gaya sehari-hari.', '[]', 0),
(11, 'Topi baseball polos', 'Cap', 'Aksesori', 79000, 129000, '#4A4F5C', 'Topi baseball polos sebagai aksesori kasual.', '[]', 0),
(12, 'Tote bag kanvas', 'Tote bag', 'Aksesori', 69000, 99000, '#D8CFBC', 'Tas tote kanvas untuk membawa kebutuhan harian.', '[]', 0)
ON DUPLICATE KEY UPDATE id = VALUES(id);

INSERT INTO page_content (content_key, content_page, label, content_value) VALUES
('shared.brand', 'shared', 'Nama toko', 'ERIGO STORE'),
('shared.promo', 'shared', 'Pengumuman header', 'Gratis ongkir semua pesanan. Belanja min Rp150.000 diskon Rp10.000, min Rp250.000 diskon Rp20.000.'),
('shared.nav_home', 'shared', 'Menu beranda', 'Beranda'),
('shared.nav_new', 'shared', 'Menu koleksi baru', 'Koleksi baru'),
('shared.nav_tops', 'shared', 'Menu atasan', 'Atasan'),
('shared.nav_bottoms', 'shared', 'Menu bawahan', 'Bawahan'),
('shared.nav_accessories', 'shared', 'Menu aksesori', 'Aksesori'),
('shared.nav_contact', 'shared', 'Menu customer service', 'Customer Service'),
('shared.nav_account', 'shared', 'Menu akun', 'Akun'),
('shared.nav_cart', 'shared', 'Menu keranjang', 'Keranjang'),
('shared.footer_description', 'shared', 'Deskripsi toko di footer', 'Brand fashion kasual untuk gaya hidup urban. Nyaman dipakai, rapi dilihat.'),
('shared.footer_help', 'shared', 'Judul bagian bantuan', 'Bantuan'),
('shared.footer_faq', 'shared', 'Tautan FAQ', 'FAQ'),
('shared.footer_payment', 'shared', 'Tautan pembayaran', 'Cara pembayaran'),
('shared.footer_returns', 'shared', 'Tautan pengembalian', 'Penukaran dan pengembalian'),
('shared.footer_products', 'shared', 'Judul bagian produk', 'Produk'),
('shared.footer_newsletter', 'shared', 'Judul newsletter', 'Kabar terbaru'),
('shared.footer_email', 'shared', 'Placeholder email newsletter', 'Email kamu'),
('shared.footer_subscribe', 'shared', 'Tombol newsletter', 'Kirim'),
('shared.footer_copyright', 'shared', 'Teks hak cipta', 'Situs demo untuk tugas kuliah.'),
('home.hero_title', 'home', 'Judul utama', 'Koleksi baru: cargo dan parka'),
('home.hero_text', 'home', 'Deskripsi utama', 'Bahan lentur, adem, dan ringan untuk aktivitas seharian. Gratis ongkir ke seluruh Indonesia.'),
('home.hero_button', 'home', 'Tombol utama', 'Belanja sekarang'),
('home.category_tops', 'home', 'Keterangan kategori atasan', 'Kaos dan kemeja'),
('home.category_bottoms', 'home', 'Keterangan kategori bawahan', 'Chino, cargo, jogger'),
('home.category_accessories', 'home', 'Keterangan kategori aksesori', 'Topi dan tas'),
('home.latest_title', 'home', 'Judul produk terbaru', 'Terbaru di Sandang Kota'),
('home.all_products', 'home', 'Tombol semua produk', 'Lihat semua produk'),
('home.perks_title', 'home', 'Judul keuntungan belanja', 'Kenapa belanja di website kami'),
('home.shipping_title', 'home', 'Judul keuntungan ongkir', 'Gratis ongkir'),
('home.shipping_text', 'home', 'Keterangan keuntungan ongkir', 'Semua pesanan dikirim tanpa biaya ongkir.'),
('home.returns_title', 'home', 'Judul penukaran', 'Jaminan return dan refund'),
('home.returns_text', 'home', 'Keterangan penukaran', 'Salah ukuran? Tukar atau kembalikan dalam 7 hari.'),
('home.voucher_title', 'home', 'Judul voucher', 'Voucher otomatis'),
('home.voucher_text', 'home', 'Keterangan voucher', 'Diskon Rp10.000 min belanja Rp150.000, dan Rp20.000 min Rp250.000.'),
('home.blog_title', 'home', 'Judul artikel', 'Artikel dan referensi'),
('products.title', 'products', 'Judul katalog', 'Semua produk'),
('products.search', 'products', 'Placeholder pencarian', 'Cari produk'),
('products.sort_latest', 'products', 'Pilihan urutan terbaru', 'Urutkan: terbaru'),
('products.sort_low', 'products', 'Pilihan harga terendah', 'Harga terendah'),
('products.sort_high', 'products', 'Pilihan harga tertinggi', 'Harga tertinggi'),
('products.empty', 'products', 'Pesan produk tidak ditemukan', 'Tidak ada produk yang cocok. Coba kata kunci atau kategori lain.'),
('cart.title', 'cart', 'Judul keranjang', 'Keranjang belanja'),
('cart.empty', 'cart', 'Pesan keranjang kosong', 'Keranjang masih kosong.'),
('cart.shop', 'cart', 'Tombol mulai belanja', 'Mulai belanja'),
('cart.col_product', 'cart', 'Kolom produk', 'Produk'),
('cart.col_price', 'cart', 'Kolom harga', 'Harga'),
('cart.col_quantity', 'cart', 'Kolom jumlah', 'Jumlah'),
('cart.col_subtotal', 'cart', 'Kolom subtotal', 'Subtotal'),
('cart.discount', 'cart', 'Label voucher', 'Voucher belanja'),
('cart.shipping', 'cart', 'Label ongkir', 'Ongkir'),
('cart.free', 'cart', 'Keterangan ongkir gratis', 'Gratis'),
('cart.total', 'cart', 'Label total', 'Total'),
('cart.checkout', 'cart', 'Tombol pesan WhatsApp', 'Pesan lewat WhatsApp'),
('contact.locations', 'contact', 'Judul lokasi toko', 'Lokasi toko'),
('contact.jakarta_name', 'contact', 'Nama toko Jakarta', 'Sandang Kota Jakarta'),
('contact.jakarta_address', 'contact', 'Alamat toko Jakarta', 'Jl. Contoh Raya No. 12, Jakarta Selatan. Buka setiap hari 10.00 sampai 21.00.'),
('contact.bandung_name', 'contact', 'Nama toko Bandung', 'Sandang Kota Bandung'),
('contact.bandung_address', 'contact', 'Alamat toko Bandung', 'Jl. Contoh Asia No. 5, Bandung. Buka setiap hari 10.00 sampai 21.00.'),
('contact.heading', 'contact', 'Judul kontak', 'Hubungi kami'),
('contact.name', 'contact', 'Label nama', 'Nama'),
('contact.message', 'contact', 'Label pesan', 'Pesan'),
('contact.submit', 'contact', 'Tombol kirim pesan', 'Kirim lewat WhatsApp')
ON DUPLICATE KEY UPDATE content_key = VALUES(content_key);
