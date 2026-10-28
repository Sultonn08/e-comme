<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: DENY');
    header('Cache-Control: no-store');
}

function start_app_session(): void
{
    security_headers();
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}

function json_response(array $data, int $status = 200): never
{
    security_headers();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_input(): array
{
    $data = json_decode((string) file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function current_user(): ?array
{
    start_app_session();
    if (!isset($_SESSION['user']['id'])) {
        return null;
    }

    $statement = database()->prepare('SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1');
    $statement->execute(['id' => (int) $_SESSION['user']['id']]);
    $user = $statement->fetch();
    if (!$user) {
        unset($_SESSION['user']);
        return null;
    }

    $_SESSION['user'] = [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ];
    return $_SESSION['user'];
}

function require_admin(): array
{
    $user = current_user();
    if ($user === null || ($user['role'] ?? '') !== 'admin') {
        json_response(['error' => 'Akses admin diperlukan.'], 403);
    }
    return $user;
}

function verify_csrf(): void
{
    start_app_session();
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($provided) || !is_string($expected) || $expected === '' || !hash_equals($expected, $provided)) {
        json_response(['error' => 'Sesi formulir kedaluwarsa. Muat ulang halaman dan coba lagi.'], 419);
    }
}

function require_http_method(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        json_response(['error' => 'Metode permintaan tidak didukung.'], 405);
    }
}

function clean_product_input(array $input): array
{
    $name = trim((string) ($input['nama'] ?? ''));
    $type = trim((string) ($input['tipe'] ?? ''));
    $category = trim((string) ($input['kat'] ?? ''));
    $description = trim((string) ($input['deskripsi'] ?? ''));
    $color = strtoupper(trim((string) ($input['warna'] ?? '')));
    $price = filter_var($input['harga'] ?? null, FILTER_VALIDATE_INT);
    $normalPrice = filter_var($input['harga_normal'] ?? null, FILTER_VALIDATE_INT);
    $categories = ['Atasan', 'Bawahan', 'Outer', 'Aksesori'];

    if ($name === '' || strlen($name) > 160 || $type === '' || strlen($type) > 100) {
        throw new InvalidArgumentException('Nama dan tipe produk wajib diisi.');
    }
    if (!in_array($category, $categories, true)) {
        throw new InvalidArgumentException('Kategori produk tidak valid.');
    }
    if (
        $price === false
        || $normalPrice === false
        || $price < 1
        || $normalPrice < $price
        || $price > 4294967295
        || $normalPrice > 4294967295
    ) {
        throw new InvalidArgumentException('Harga produk tidak valid.');
    }
    if (!preg_match('/^#[0-9A-F]{6}$/', $color)) {
        throw new InvalidArgumentException('Warna harus menggunakan format hex, misalnya #1C1C1E.');
    }
    if (strlen($description) > 2000) {
        throw new InvalidArgumentException('Deskripsi maksimal 2.000 karakter.');
    }

    $images = $input['gambar'] ?? [];
    if (is_string($images)) {
        $images = preg_split('/\R/', $images) ?: [];
    }
    if (!is_array($images) || count($images) > 8) {
        throw new InvalidArgumentException('Galeri produk maksimal 8 gambar.');
    }
    $images = array_values(array_map(
        static fn ($path): string => trim((string) $path),
        $images
    ));

    foreach ($images as $path) {
        if ($path === '') {
            continue;
        }
        $isLocalPath = preg_match('/^assets\/img\/produk\/[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp)$/i', $path);
        $isExternalUrl = preg_match('/^https:\/\/[^\s"\'<>]{1,400}$/i', $path);
        if (strlen($path) > 500 || (!$isLocalPath && !$isExternalUrl)) {
            throw new InvalidArgumentException('Path gambar harus berupa path lokal assets/img/produk/ atau URL https:// yang valid.');
        }
    }

    return [
        'nama' => $name,
        'tipe' => $type,
        'kat' => $category,
        'harga' => $price,
        'harga_normal' => $normalPrice,
        'warna' => $color,
        'deskripsi' => $description,
        'gambar' => $images,
        'baru' => !empty($input['baru']) ? 1 : 0,
    ];
}
