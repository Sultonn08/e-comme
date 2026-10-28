<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';
security_headers();
$user = current_user();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title data-content="account.page_title">Akun - Sandang Kota</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/components/header.css">
    <link rel="stylesheet" href="../assets/css/components/footer.css">
    <link rel="stylesheet" href="../assets/css/account.css">
</head>
<body data-authenticated="<?= $user !== null ? 'true' : 'false' ?>" data-role="<?= htmlspecialchars($user['role'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
    <header class="account-header">
        <div class="wrap top">
            <a class="logo" href="../index.html" data-content="account.brand">ERIGO STORE</a>
            <a href="../index.html" data-content="account.back">Kembali ke toko</a>
        </div>
    </header>
    <main class="wrap account-main">
        <?php if ($user !== null): ?>
            <section class="account-card">
                <h1><span data-content="account.greeting">Halo,</span> <?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8') ?></h1>
                <p><?= htmlspecialchars($user['email'], ENT_QUOTES, 'UTF-8') ?></p>
                <p class="hint"><span data-content="account.role_label">Peran akun:</span> <span data-content="<?= $user['role'] === 'admin' ? 'account.role_admin' : 'account.role_user' ?>"><?= $user['role'] === 'admin' ? 'Admin' : 'User' ?></span></p>
                <?php if ($user['role'] === 'admin'): ?>
                    <a class="btn" href="../admin/index.php" data-content="account.dashboard">Buka dashboard admin</a>
                <?php else: ?>
                    <p data-content="account.user_notice">Akun ini dapat berbelanja. Akses dashboard admin hanya diberikan kepada akun admin.</p>
                <?php endif; ?>
                <button class="btn btn-secondary" type="button" id="logout" data-content="account.logout">Keluar</button>
                <p class="form-message" id="account-message" role="status"></p>
            </section>
        <?php else: ?>
            <section class="account-card">
                <h1 id="account-title" data-content="account.login_title">Masuk</h1>
                <p id="account-intro" data-content="account.intro">Masuk ke akun toko atau buat akun pelanggan.</p>
                <div class="account-tabs">
                    <button type="button" class="chip" id="show-login" aria-pressed="true" data-content="account.login_tab">Masuk</button>
                    <button type="button" class="chip" id="show-register" aria-pressed="false" data-content="account.register_tab">Daftar</button>
                </div>
                <form id="login-form">
                    <label><span data-content="account.email_label">Email</span><input type="email" name="email" autocomplete="email" required></label>
                    <label><span data-content="account.password_label">Kata sandi</span><input type="password" name="password" autocomplete="current-password" minlength="12" maxlength="72" required></label>
                    <button class="btn" type="submit" data-content="account.login_tab">Masuk</button>
                </form>
                <form id="register-form" hidden>
                    <label><span data-content="account.name_label">Nama</span><input name="nama" autocomplete="name" maxlength="100" required></label>
                    <label><span data-content="account.email_label">Email</span><input type="email" name="email" autocomplete="email" required></label>
                    <label><span data-content="account.password_label">Kata sandi</span><span data-content="account.password_hint"> (12–72 byte)</span><input type="password" name="password" autocomplete="new-password" minlength="12" maxlength="72" required></label>
                    <p class="hint" data-content="account.registration_note">Pendaftaran membuat akun pelanggan. Hak admin hanya dapat diberikan melalui proses khusus di server.</p>
                    <button class="btn" type="submit" data-content="account.create">Buat akun</button>
                </form>
                <p class="form-message" id="account-message" role="status"></p>
            </section>
        <?php endif; ?>
    </main>
    <script src="../assets/js/auth.js"></script>
</body>
</html>
