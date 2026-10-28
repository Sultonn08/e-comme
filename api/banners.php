<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'GET') {
        $isAdminQuery = ($_GET['admin'] ?? '') === '1';
        $pdo = database();
        
        if ($isAdminQuery) {
            require_admin();
            $stmt = $pdo->query('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
            $banners = $stmt->fetchAll();
        } else {
            $stmt = $pdo->query('SELECT id, title, subtitle, button_text, button_link, image_url, sort_order FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
            $banners = $stmt->fetchAll();
        }

        json_response(['banners' => $banners]);
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
            json_response(['error' => 'ID banner tidak valid.'], 422);
        }

        $stmt = $pdo->prepare('DELETE FROM banners WHERE id = :id');
        $stmt->execute(['id' => $id]);
        json_response(['message' => 'Banner berhasil dihapus.']);
    }

    // ── POST / PUT (Create or Update) ──
    if ($method === 'POST') {
        // Can be multipart (with file upload) or JSON
        $isMultipart = !empty($_FILES);
        $data = $isMultipart ? $_POST : json_input();

        $id = isset($data['id']) && $data['id'] !== '' ? filter_var($data['id'], FILTER_VALIDATE_INT) : null;
        $title = trim((string) ($data['title'] ?? ''));
        $subtitle = trim((string) ($data['subtitle'] ?? ''));
        $buttonText = trim((string) ($data['button_text'] ?? 'Belanja sekarang'));
        $buttonLink = trim((string) ($data['button_link'] ?? 'pages/produk.html?kat=Baru'));
        $imageUrl = trim((string) ($data['image_url'] ?? ''));
        $sortOrder = (int) ($data['sort_order'] ?? 0);
        $isActive = isset($data['is_active']) ? (int) (bool) $data['is_active'] : 1;

        if ($title === '') {
            json_response(['error' => 'Judul banner tidak boleh kosong.'], 422);
        }

        // Handle Image Upload if present
        if (isset($_FILES['image']) && is_array($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['image'];
            if ((int) $file['error'] !== UPLOAD_ERR_OK) {
                json_response(['error' => 'Gagal mengunggah gambar banner.'], 422);
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

            $uploadDir = dirname(__DIR__) . '/assets/img/banners';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                json_response(['error' => 'Gagal membuat folder banner.'], 500);
            }

            $filename = 'banner_' . bin2hex(random_bytes(8)) . '.' . $allowedMimes[$mime];
            $targetPath = $uploadDir . '/' . $filename;

            if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
                json_response(['error' => 'Gagal menyimpan file gambar.'], 500);
            }

            $imageUrl = 'assets/img/banners/' . $filename;
        }

        if ($imageUrl === '' && !$id) {
            json_response(['error' => 'Gambar banner atau URL gambar harus diisi.'], 422);
        }

        if ($id) {
            // Update
            if ($imageUrl !== '') {
                $stmt = $pdo->prepare('UPDATE banners SET title = :title, subtitle = :subtitle, button_text = :btn_text, button_link = :btn_link, image_url = :img, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':title' => $title,
                    ':subtitle' => $subtitle,
                    ':btn_text' => $buttonText,
                    ':btn_link' => $buttonLink,
                    ':img' => $imageUrl,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            } else {
                $stmt = $pdo->prepare('UPDATE banners SET title = :title, subtitle = :subtitle, button_text = :btn_text, button_link = :btn_link, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':title' => $title,
                    ':subtitle' => $subtitle,
                    ':btn_text' => $buttonText,
                    ':btn_link' => $buttonLink,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            }
            json_response(['message' => 'Banner berhasil diperbarui.']);
        } else {
            // Insert
            $stmt = $pdo->prepare('INSERT INTO banners (title, subtitle, button_text, button_link, image_url, sort_order, is_active) VALUES (:title, :subtitle, :btn_text, :btn_link, :img, :sort, :active)');
            $stmt->execute([
                ':title' => $title,
                ':subtitle' => $subtitle,
                ':btn_text' => $buttonText,
                ':btn_link' => $buttonLink,
                ':img' => $imageUrl,
                ':sort' => $sortOrder,
                ':active' => $isActive,
            ]);
            json_response(['message' => 'Banner berhasil ditambahkan.', 'id' => $pdo->lastInsertId()]);
        }
    }

    json_response(['error' => 'Metode HTTP tidak didukung.'], 405);
} catch (Throwable $e) {
    json_response(['error' => $e->getMessage()], 500);
}
