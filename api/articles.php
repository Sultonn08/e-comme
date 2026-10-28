<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // ── GET ARTICLES ──
    if ($method === 'GET') {
        $isAdminQuery = ($_GET['admin'] ?? '') === '1';
        $pdo = database();

        if ($isAdminQuery) {
            require_admin();
            $stmt = $pdo->query('SELECT * FROM articles ORDER BY sort_order ASC, id ASC');
            $articles = $stmt->fetchAll();
        } else {
            $stmt = $pdo->query('SELECT id, title, summary, image_url, link_url, link_label, sort_order FROM articles WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
            $articles = $stmt->fetchAll();
        }

        json_response(['articles' => $articles]);
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
            json_response(['error' => 'ID artikel tidak valid.'], 422);
        }

        $stmt = $pdo->prepare('DELETE FROM articles WHERE id = :id');
        $stmt->execute(['id' => $id]);
        json_response(['message' => 'Artikel berhasil dihapus.']);
    }

    // ── POST / PUT (Create or Update) ──
    if ($method === 'POST') {
        $isMultipart = !empty($_FILES);
        $data = $isMultipart ? $_POST : json_input();

        $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
        $title = trim((string) ($data['title'] ?? ''));
        $summary = trim((string) ($data['summary'] ?? ''));
        $imageUrl = trim((string) ($data['image_url'] ?? ''));
        $linkUrl = trim((string) ($data['link_url'] ?? ''));
        $linkLabel = trim((string) ($data['link_label'] ?? ''));
        $sortOrder = (int) ($data['sort_order'] ?? 0);
        $isActive = isset($data['is_active']) ? (int) (bool) $data['is_active'] : 1;

        if ($title === '') {
            json_response(['error' => 'Judul artikel tidak boleh kosong.'], 422);
        }

        if ($summary === '') {
            json_response(['error' => 'Isi atau ringkasan artikel tidak boleh kosong.'], 422);
        }

        // Handle Image Upload if present
        if (isset($_FILES['image']) && is_array($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['image'];
            if ((int) $file['error'] !== UPLOAD_ERR_OK) {
                json_response(['error' => 'Gagal mengunggah gambar artikel.'], 422);
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

            $uploadDir = dirname(__DIR__) . '/assets/img/articles';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                json_response(['error' => 'Gagal membuat folder gambar artikel.'], 500);
            }

            $filename = 'art_' . bin2hex(random_bytes(8)) . '.' . $allowedMimes[$mime];
            $targetPath = $uploadDir . '/' . $filename;

            if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
                json_response(['error' => 'Gagal menyimpan file gambar artikel.'], 500);
            }

            $imageUrl = 'assets/img/articles/' . $filename;
        }

        // If link url is given but label is empty, provide a clean default
        if ($linkUrl !== '' && $linkLabel === '') {
            $linkLabel = 'Baca selengkapnya';
        }

        if ($id) {
            // Update
            if ($imageUrl !== '') {
                $stmt = $pdo->prepare('UPDATE articles SET title = :title, summary = :summary, image_url = :img, link_url = :link_url, link_label = :link_label, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':title' => $title,
                    ':summary' => $summary,
                    ':img' => $imageUrl,
                    ':link_url' => $linkUrl,
                    ':link_label' => $linkLabel,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            } else {
                $stmt = $pdo->prepare('UPDATE articles SET title = :title, summary = :summary, link_url = :link_url, link_label = :link_label, sort_order = :sort, is_active = :active WHERE id = :id');
                $stmt->execute([
                    ':title' => $title,
                    ':summary' => $summary,
                    ':link_url' => $linkUrl,
                    ':link_label' => $linkLabel,
                    ':sort' => $sortOrder,
                    ':active' => $isActive,
                    ':id' => $id,
                ]);
            }

            json_response(['message' => 'Artikel berhasil diperbarui.']);
        }

        // Insert new
        $stmt = $pdo->prepare('INSERT INTO articles (title, summary, image_url, link_url, link_label, sort_order, is_active) VALUES (:title, :summary, :img, :link_url, :link_label, :sort, :active)');
        $stmt->execute([
            ':title' => $title,
            ':summary' => $summary,
            ':img' => $imageUrl,
            ':link_url' => $linkUrl,
            ':link_label' => $linkLabel,
            ':sort' => $sortOrder,
            ':active' => $isActive,
        ]);

        json_response(['message' => 'Artikel baru berhasil ditambahkan.', 'id' => (int) $pdo->lastInsertId()], 201);
    }

    json_response(['error' => 'Metode HTTP tidak didukung.'], 405);
} catch (Throwable $e) {
    json_response(['error' => $e->getMessage()], 500);
}
