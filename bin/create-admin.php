<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$email = '';
foreach ($argv as $argument) {
    if (str_starts_with($argument, '--email=')) {
        $email = strtolower(trim(substr($argument, 8)));
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Gunakan: php bin/create-admin.php --email=admin@example.com\n");
    exit(1);
}

function read_admin_password(): string
{
    fwrite(STDOUT, 'Kata sandi admin (min. 12 karakter): ');

    if (PHP_OS_FAMILY === 'Windows') {
        $command = 'powershell -NoProfile -Command "$s=Read-Host -AsSecureString; $b=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($s); try {[Runtime.InteropServices.Marshal]::PtrToStringBSTR($b)} finally {[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b)}"';
        $process = proc_open($command, [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        if (!is_resource($process)) {
            throw new RuntimeException('Tidak dapat membuka prompt kata sandi.');
        }
        fclose($pipes[0]);
        $password = trim((string) stream_get_contents($pipes[1]));
        fclose($pipes[1]);
        $error = trim((string) stream_get_contents($pipes[2]));
        fclose($pipes[2]);
        $status = proc_close($process);
        if ($status !== 0 || $error !== '') {
            throw new RuntimeException('Prompt kata sandi gagal: ' . $error);
        }
        return $password;
    }

    $isTerminal = function_exists('stream_isatty') && stream_isatty(STDIN);
    if ($isTerminal) {
        exec('stty -echo');
    }
    try {
        $password = trim((string) fgets(STDIN));
    } finally {
        if ($isTerminal) {
            exec('stty echo');
            fwrite(STDOUT, PHP_EOL);
        }
    }
    return $password;
}

try {
    $password = read_admin_password();
    if (strlen($password) < 12 || strlen($password) > 200) {
        throw new InvalidArgumentException('Kata sandi harus terdiri dari 12 sampai 72 byte.');
    }

    $statement = database()->prepare(
        "INSERT INTO users (name, email, password_hash, role)
         VALUES (:name, :email, :password_hash, 'admin')
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin'"
    );
    $statement->execute([
        'name' => 'Administrator',
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);
    fwrite(STDOUT, "Akun admin siap: {$email}\n");
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . PHP_EOL);
    exit(1);
}
