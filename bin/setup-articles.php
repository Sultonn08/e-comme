<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

$pdo = database();

$pdo->exec("
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    link_url VARCHAR(500) NULL DEFAULT '',
    link_label VARCHAR(200) NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_articles_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$count = (int) $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
if ($count === 0) {
    $stmt = $pdo->prepare("INSERT INTO articles (id, title, summary, link_url, link_label, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $articles = [
        [1, 'Cara memilih ukuran kaos oversize', 'Ukur badan, lalu cocokkan dengan panduan ukuran sebelum membeli.', '', '', 1, 1],
        [2, 'Merawat celana chino agar awet', 'Cuci dengan air dingin dan jemur di tempat teduh.', '', '', 2, 1],
        [3, 'Padu padan kemeja rayon untuk harian', 'Padukan kemeja rayon dengan chino atau cargo untuk gaya santai.', '', '', 3, 1],
        [4, 'SEO dasar: bantu pelanggan menemukan halaman toko', 'Gunakan judul yang jelas dan tautan yang mudah diikuti. SEO membantu mesin pencari memahami situs, bukan menjamin peringkat pertama.', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', 'Google Search Central — SEO Starter Guide', 4, 1],
        [5, 'Tulis konten yang berguna bagi calon pembeli', 'Jawab pertanyaan pelanggan dengan informasi asli dan bermanfaat. Tulis untuk pembaca, bukan hanya mesin pencari.', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', 'Google Search Central — Creating Helpful Content', 5, 1],
        [6, 'Perjalanan belanja pelanggan bisa online dan offline', 'Pelanggan mencari cara belanja yang praktis, baik online maupun di toko. Sediakan informasi produk, pengiriman, dan lokasi dengan jelas.', 'https://business.google.com/en-all/think/consumer-insights/indonesia-search-trends-consumer-behavior/', 'Think with Google — Indonesia Search Trends & Consumer Behavior', 6, 1],
        [7, 'Mengenal perjalanan Erigo', 'Erigo menceritakan perjalanannya dari penjualan online hingga kolaborasi dan peragaan busana internasional.', 'https://erigostore.co.id/pages/about', 'Erigo — About Us', 7, 1],
        [8, 'Identitas Erigo: gaya kasual untuk anak muda', 'Erigo menghadirkan pakaian kasual hingga semi-formal untuk pria dan wanita dengan fokus pada kenyamanan.', 'https://erigostore.co.id/pages/branding', 'Erigo — Branding', 8, 1],
    ];

    foreach ($articles as $a) {
        $stmt->execute($a);
    }
    echo "Table articles created and 8 articles seeded successfully.\n";
} else {
    echo "Table articles already exists with {$count} rows.\n";
}
