<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
require_http_method('POST');
require_admin();
verify_csrf();

$productId = filter_var($_POST['product_id'] ?? null, FILTER_VALIDATE_INT);
if ($productId === false || $productId === null || $productId < 1) {
    json_response(['error' => 'ID produk tidak valid.'], 422);
}
$slot = filter_var($_POST['slot'] ?? null, FILTER_VALIDATE_INT);
if ($slot === false || $slot === null || $slot < 0 || $slot > 3) {
    json_response(['error' => 'Pilih slot tampilan gambar yang valid.'], 422);
}
if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    json_response(['error' => 'Pilih satu gambar untuk tampilan ini.'], 422);
}
$file = $_FILES['image'];

$pdo = null;
$savedFiles = [];
try {
    $pdo = database();
    $pdo->beginTransaction();
    $statement = $pdo->prepare('SELECT images FROM products WHERE id = :id FOR UPDATE');
    $statement->execute(['id' => $productId]);
    $existing = $statement->fetch();
    if (!$existing) {
        $pdo->rollBack();
        json_response(['error' => 'Produk tidak ditemukan.'], 404);
    }

    $images = json_decode($existing['images'], true);
    $images = is_array($images) ? $images : [];
    if (count($images) > 8) {
        $pdo->rollBack();
        json_response(['error' => 'Satu produk maksimal memiliki 8 gambar.'], 422);
    }

    $mimeExtensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    $uploadDirectory = dirname(__DIR__) . '/assets/img/produk/' . $productId;
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
        throw new RuntimeException('Folder gambar produk tidak dapat dibuat.');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);

    $error = (int) $file['error'];
    if ($error !== UPLOAD_ERR_OK) {
        throw new InvalidArgumentException('Gambar gagal diunggah (kode ' . $error . ').');
    }
    if ((int) $file['size'] < 1 || (int) $file['size'] > 5 * 1024 * 1024) {
        throw new InvalidArgumentException('Gambar harus berukuran maksimal 5 MB.');
    }
    $temporaryPath = (string) $file['tmp_name'];
    $mimeType = $finfo->file($temporaryPath);
    if (!isset($mimeExtensions[$mimeType])) {
        throw new InvalidArgumentException('Format gambar yang didukung: JPG, PNG, dan WebP.');
    }
    $dimensions = getimagesize($temporaryPath);
    if (
        $dimensions === false
        || $dimensions[0] < 1
        || $dimensions[1] < 1
        || $dimensions[0] * $dimensions[1] > 25000000
    ) {
        throw new InvalidArgumentException('Dimensi gambar tidak valid atau melebihi 25 megapiksel.');
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $mimeExtensions[$mimeType];
    $destination = $uploadDirectory . '/' . $filename;
    if (!move_uploaded_file($temporaryPath, $destination)) {
        throw new RuntimeException('Gambar gagal disimpan ke folder produk.');
    }
    $savedFiles[] = $destination;
    while (count($images) <= $slot) {
        $images[] = '';
    }
    $images[$slot] = 'assets/img/produk/' . $productId . '/' . $filename;

    $update = $pdo->prepare('UPDATE products SET images = :images WHERE id = :id');
    $update->execute([
        'images' => json_encode($images, JSON_THROW_ON_ERROR),
        'id' => $productId,
    ]);
    $pdo->commit();
    json_response(['images' => $images]);
} catch (InvalidArgumentException $exception) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    foreach ($savedFiles as $savedFile) if (is_file($savedFile)) unlink($savedFile);
    json_response(['error' => $exception->getMessage()], 422);
} catch (RuntimeException $exception) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    foreach ($savedFiles as $savedFile) if (is_file($savedFile)) unlink($savedFile);
    json_response(['error' => $exception->getMessage()], 503);
} catch (Throwable $exception) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    foreach ($savedFiles as $savedFile) if (is_file($savedFile)) unlink($savedFile);
    error_log((string) $exception);
    json_response(['error' => 'Unggah gambar produk gagal. Periksa konfigurasi server dan folder media.'], 500);
}
