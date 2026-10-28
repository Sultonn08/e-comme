<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // ── GET CATEGORIES ──
    if ($method === 'GET') {
        $isAdminQuery = ($_GET['admin'] ?? '') === '1';
        $pdo = database();

        if ($isAdminQuery) {
            require_admin();
            $stmt = $pdo->query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
            $categories = $stmt->fetchAll();
        } else {
            $stmt = $pdo->query('SELECT id, name, subtitle, link, image_url, sort_order FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
            $categories = $stmt->fetchAll();
        }

        json_response(['categories' => $categories]);
    }

    // Write operations require admin & csrf
    require_admin();
    verify_csrf();

    $pdo = database();

    // ── DELETE ──
    if ($method === 'DELETE') {
        $input = json_input();
        $id = filter_var($input['id'] ?? ($_GET['id'] ?? null), FILTER_VALIDATE_INT);
        if (!$id || $id < 1) {
            json_response(['error' => 'ID kategori tidak valid.'], 422);
        }

        $stmt = $pdo->prepare('DELETE FROM categories WHERE id = :id');
        $stmt->execute(['id' => $id]);
        json_response(['message' => 'Kategori berhasil dihapus.']);
    }

    // ── POST / PUT (Create or Update) ──
    if ($method === 'POST') {
        $isMultipart = !empty($_FILES);
        $data = $isMultipart ? $_POST : json_input();

        $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
        $name = trim((string) ($data['name'] ?? ''));
        $subtitle = trim((string) ($data['subtitle'] ?? ''));
        $link = trim((string) ($data['link'] ?? ''));
        $imageUrl = trim((string) ($data['image_url'] ?? ''));
        $sortOrder = (int) ($data['sort_order'] ?? 0);
        $isActive = isset($data['is_active']) ? (int) (bool) $data['is_active'] : 1;

        if ($name === '') {
            json_response(['error' => 'Nama kategori tidak boleh kosong.'], 422);
        }

        // Handle Image Upload if present
        if (isset($_FILES['image']) && is_array($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['image'];
            if ((int) $file['error'] !== UPLOAD_ERR_OK) {
                json_response(['error' => 'Gagal mengunggah gambar kategori.'], 422);
            }
            if ((int) $file['size'] > 5 * 1024 * 1024) {
                json_response(['error' => 'Ukuran gambar maksimal 5 MB.'], 422);
            }

            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->file((string) $file['tmp_name']);
            $allowedMimes = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
            ];

            if (!isset($allowedMimes[$mime])) {
                json_response(['error' => 'Format gambar harus JPG, PNG, atau WebP.'], 422);
            }

            $uploadDir = dirname(__DIR__) . '/assets/img/categories';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                json_response(['error' => 'Gagal membuat folder gambar kategori.'], 500);
            }

            $filename = 'cat_' . bin2hex(random_bytes(8)) . '.' . $allowedMimes[$mime];
            $targetPath = $uploadDir . '/' . $filename;

            if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
                json_response(['error' => 'Gagal menyimpan file gambar.'], 500);
            }

            $imageUrl = 'assets/img/categories/' . $filename;
        }

        if ($imageUrl === '' && !$id) {
            json_response(['error' => 'Gambar kategori atau link URL gambar harus diisi.'], 422);
        }

        if ($link === '') {
            $link = 'pages/produk.html?kat=' . urlencode($name);
        }

        if ($id) {
            // Update
            if ($imageUrl !== '') {
                $stmt = $pdo->prepare('UPDATE categories SET name = :name, subtitle = :subtitle, link = :link, image_url = :img, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':name' => $name,
                    ':subtitle' => $subtitle,
                    ':link' => $link,
                    ':img' => $imageUrl,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            } else {
                $stmt = $pdo->prepare('UPDATE categories SET name = :name, subtitle = :subtitle, link = :link, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':name' => $name,
                    ':subtitle' => $subtitle,
                    ':link' => $link,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            }

            json_response(['message' => 'Kategori berhasil diperbarui.']);
        }

        // Insert new
        $stmt = $pdo->prepare('INSERT INTO categories (name, subtitle, link, image_url, sort_order, is_active) VALUES (:name, :subtitle, :link, :img, :sort, :active)');
        $stmt->execute([
            ':name' => $name,
            ':subtitle' => $subtitle,
            ':link' => $link,
            ':img' => $imageUrl,
            ':sort' => $sortOrder,
            ':active' => $isActive,
        ]);

        json_response(['message' => 'Kategori baru berhasil ditambahkan.', 'id' => (int) $pdo->lastInsertId()], 201);
    }

    json_response(['error' => 'Metode HTTP tidak didukung.'], 405);
} catch (Throwable $e) {
    json_response(['error' => $e->getMessage()], 500);
}
