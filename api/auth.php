<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
start_app_session();

$action = (string) ($_GET['action'] ?? '');

if ($action === 'csrf' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
    json_response(['csrfToken' => $_SESSION['csrf_token'], 'user' => current_user()]);
}

if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(['user' => current_user()]);
}

require_http_method('POST');
verify_csrf();
$input = json_input();

try {
    if ($action === 'register') {
        $name = trim((string) ($input['nama'] ?? ''));
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');

        if ($name === '' || strlen($name) > 100) {
            json_response(['error' => 'Nama wajib diisi dan maksimal 100 karakter.'], 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
            json_response(['error' => 'Alamat email tidak valid.'], 422);
        }
        if (strlen($password) < 12 || strlen($password) > 72) {
            json_response(['error' => 'Kata sandi harus terdiri dari 12 sampai 72 byte.'], 422);
        }

        $statement = database()->prepare(
            'INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :password_hash, "user")'
        );
        $statement->execute([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int) database()->lastInsertId(),
            'name' => $name,
            'email' => $email,
            'role' => 'user',
        ];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        json_response(['user' => $_SESSION['user']]);
    }

    if ($action === 'login') {
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');
        $statement = database()->prepare(
            'SELECT id, name, email, password_hash, role FROM users WHERE email = :email LIMIT 1'
        );
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_response(['error' => 'Email atau kata sandi salah.'], 401);
        }

        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        json_response(['user' => $_SESSION['user']]);
    }

    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => $params['samesite'] ?? 'Lax',
            ]);
        }
        session_destroy();
        json_response(['ok' => true]);
    }

    json_response(['error' => 'Aksi autentikasi tidak dikenal.'], 404);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        json_response(['error' => 'Email tersebut sudah terdaftar.'], 409);
    }
    error_log((string) $exception);
    json_response(['error' => 'Layanan akun sedang mengalami gangguan.'], 500);
} catch (RuntimeException $exception) {
    json_response(['error' => $exception->getMessage()], 503);
} catch (Throwable $exception) {
    error_log((string) $exception);
    json_response(['error' => 'Layanan akun sedang mengalami gangguan.'], 500);
}
