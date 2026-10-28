<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
require_http_method('GET', 'POST', 'PUT', 'DELETE');

try {
    if ($method === 'GET') {
        $products = database()->query(
            'SELECT id, name, type, category, price, original_price, color, description, images, is_new
             FROM products ORDER BY id'
        )->fetchAll();

        $products = array_map(static function (array $product): array {
            return [
                'id' => (int) $product['id'],
                'nama' => $product['name'],
                'tipe' => $product['type'],
                'kat' => $product['category'],
                'harga' => (int) $product['price'],
                'normal' => (int) $product['original_price'],
                'warna' => $product['color'],
                'deskripsi' => $product['description'],
                'gambar' => json_decode($product['images'], true) ?: [],
                'baru' => (int) $product['is_new'],
            ];
        }, $products);
        json_response(['products' => $products]);
    }

    require_admin();
    verify_csrf();
    $input = json_input();
    $pdo = database();

    if ($method === 'POST') {
        $product = clean_product_input($input);
        $statement = $pdo->prepare(
            'INSERT INTO products (name, type, category, price, original_price, color, description, images, is_new)
             VALUES (:name, :type, :category, :price, :original_price, :color, :description, :images, :is_new)'
        );
        $statement->execute([
            'name' => $product['nama'],
            'type' => $product['tipe'],
            'category' => $product['kat'],
            'price' => $product['harga'],
            'original_price' => $product['harga_normal'],
            'color' => $product['warna'],
            'description' => $product['deskripsi'],
            'images' => json_encode($product['gambar'], JSON_THROW_ON_ERROR),
            'is_new' => $product['baru'],
        ]);
        json_response(['id' => (int) $pdo->lastInsertId()], 201);
    }

    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id === null || $id < 1) {
        json_response(['error' => 'ID produk tidak valid.'], 422);
    }

    if ($method === 'PUT') {
        $product = clean_product_input($input);
        $statement = $pdo->prepare(
            'UPDATE products
             SET name = :name, type = :type, category = :category, price = :price,
                 original_price = :original_price, color = :color, description = :description,
                 images = :images, is_new = :is_new
             WHERE id = :id'
        );
        $statement->execute([
            'name' => $product['nama'],
            'type' => $product['tipe'],
            'category' => $product['kat'],
            'price' => $product['harga'],
            'original_price' => $product['harga_normal'],
            'color' => $product['warna'],
            'description' => $product['deskripsi'],
            'images' => json_encode($product['gambar'], JSON_THROW_ON_ERROR),
            'is_new' => $product['baru'],
            'id' => $id,
        ]);
        if ($statement->rowCount() === 0) {
            $exists = $pdo->prepare('SELECT 1 FROM products WHERE id = :id');
            $exists->execute(['id' => $id]);
            if (!$exists->fetchColumn()) {
                json_response(['error' => 'Produk tidak ditemukan.'], 404);
            }
        }
        json_response(['ok' => true]);
    }

    if ($method === 'DELETE') {
        $statement = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $statement->execute(['id' => $id]);
        if ($statement->rowCount() === 0) {
            json_response(['error' => 'Produk tidak ditemukan.'], 404);
        }
        json_response(['ok' => true]);
    }

} catch (InvalidArgumentException $exception) {
    json_response(['error' => $exception->getMessage()], 422);
} catch (PDOException $exception) {
    error_log((string) $exception);
    json_response(['error' => 'Penyimpanan produk sedang mengalami gangguan.'], 500);
} catch (RuntimeException $exception) {
    json_response(['error' => $exception->getMessage()], 503);
} catch (Throwable $exception) {
    error_log((string) $exception);
    json_response(['error' => 'Permintaan produk gagal diproses.'], 500);
}
