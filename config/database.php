<?php
declare(strict_types=1);

$localConfigPath = __DIR__ . '/local.php';
$localConfig = is_file($localConfigPath) ? require $localConfigPath : [];
$localConfig = is_array($localConfig) ? $localConfig : [];

function database(): PDO
{
    global $localConfig;

    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $setting = static function (string $name, string $default = '') use ($localConfig): string {
        $value = getenv($name);
        return $value !== false ? $value : (string) ($localConfig[$name] ?? $default);
    };

    $host = $setting('DB_HOST', '127.0.0.1');
    $port = $setting('DB_PORT', '3306');
    $name = $setting('DB_NAME');
    $user = $setting('DB_USER');
    $password = $setting('DB_PASSWORD');

    if ($name === '' || $user === '') {
        throw new RuntimeException('Database belum dikonfigurasi. Isi DB_NAME dan DB_USER.');
    }

    $connection = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    return $connection;
}
