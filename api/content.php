<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
require_once __DIR__ . '/../includes/content.php';
require_http_method('GET', 'PUT');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (($_GET['admin'] ?? '') === '1') {
            require_admin();
            $definitions = content_definitions();
            $values = get_site_content();
            $fields = [];
            foreach ($definitions as $key => $definition) {
                $fields[] = [
                    'key' => $key,
                    'page' => $definition['page'],
                    'label' => $definition['label'],
                    'value' => $values[$key],
                ];
            }
            json_response(['fields' => $fields]);
        }

        json_response(['content' => get_site_content()]);
    }

    require_admin();
    verify_csrf();
    $input = json_input();
    $values = $input['content'] ?? null;
    $definitions = content_definitions();

    if (!is_array($values) || $values === []) {
        json_response(['error' => 'Tidak ada teks yang dikirim untuk disimpan.'], 422);
    }

    $statement = database()->prepare(
        'INSERT INTO page_content (content_key, content_page, label, content_value)
         VALUES (:content_key, :content_page, :label, :content_value)
         ON DUPLICATE KEY UPDATE
             content_page = VALUES(content_page),
             label = VALUES(label),
             content_value = VALUES(content_value)'
    );

    $pdo = database();
    $pdo->beginTransaction();
    foreach ($values as $key => $value) {
        if (!is_string($key) || !isset($definitions[$key]) || !is_string($value)) {
            throw new InvalidArgumentException('Teks yang dikirim tidak valid.');
        }
        if (strlen($value) > 2000) {
            throw new InvalidArgumentException('Setiap teks maksimal 2.000 byte.');
        }
        $definition = $definitions[$key];
        $statement->execute([
            'content_key' => $key,
            'content_page' => $definition['page'],
            'label' => $definition['label'],
            'content_value' => trim($value),
        ]);
    }
    $pdo->commit();
    json_response(['ok' => true, 'content' => get_site_content()]);
} catch (InvalidArgumentException $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    json_response(['error' => $exception->getMessage()], 422);
} catch (PDOException $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    error_log((string) $exception);
    json_response(['error' => 'Penyimpanan teks halaman gagal. Periksa tabel page_content.'], 500);
} catch (RuntimeException $exception) {
    json_response(['error' => $exception->getMessage()], 503);
}
