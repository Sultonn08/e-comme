<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

$pdo = database();

$pdo->exec("
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
");

$count = (int) $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
if ($count === 0) {
    $stmt = $pdo->prepare("INSERT INTO categories (id, name, subtitle, link, image_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([1, 'Atasan', 'Kaos dan kemeja', 'pages/produk.html?kat=Atasan', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 1, 1]);
    $stmt->execute([2, 'Bawahan', 'Chino, cargo, jogger', 'pages/produk.html?kat=Bawahan', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 2, 1]);
    $stmt->execute([3, 'Aksesori', 'Topi dan tas', 'pages/produk.html?kat=Aksesori', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', 3, 1]);
    echo "Table created and 3 categories inserted successfully.\n";
} else {
    echo "Categories table already exists with {$count} rows.\n";
}
