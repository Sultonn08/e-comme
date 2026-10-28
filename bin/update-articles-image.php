<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

$pdo = database();

// Check if image_url column exists
$columns = $pdo->query("SHOW COLUMNS FROM articles LIKE 'image_url'")->fetchAll();
if (empty($columns)) {
    $pdo->exec("ALTER TABLE articles ADD COLUMN image_url VARCHAR(500) NOT NULL DEFAULT '' AFTER summary");
    echo "Added image_url column to articles table.\n";
} else {
    echo "image_url column already exists.\n";
}

// Update existing 8 articles with curated default images
$images = [
    1 => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    2 => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    3 => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    4 => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    5 => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    6 => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    7 => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    8 => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
];

$stmt = $pdo->prepare("UPDATE articles SET image_url = :img WHERE id = :id AND (image_url = '' OR image_url IS NULL)");
foreach ($images as $id => $img) {
    $stmt->execute([':img' => $img, ':id' => $id]);
}

// Ensure upload directory exists
$uploadDir = __DIR__ . '/../assets/img/articles';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
    echo "Created assets/img/articles directory.\n";
}

echo "Articles updated with images successfully.\n";
