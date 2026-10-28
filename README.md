# Sandang Kota

Situs toko demo berbasis PHP, MySQL, HTML, CSS, dan JavaScript tanpa proses build.

## Struktur folder

```text
.
├── index.html
├── pages/
│   ├── produk.html
│   ├── keranjang.html
│   ├── kontak.html
│   └── akun.php
├── admin/
│   └── index.php
├── api/
│   ├── auth.php
│   ├── content.php
│   ├── products.php
│   └── product-images.php
├── bin/
│   ├── create-admin.php
│   └── .htaccess
├── config/
│   ├── database.php
│   ├── local.php.example
│   └── .htaccess
├── database/
│   ├── schema.sql
│   └── migrate-content.sql
├── includes/
│   └── http.php
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── account.css
│   │   ├── admin.css
│   │   ├── inline-editor.css
│   │   └── components/
│   │       ├── header.css
│   │       ├── footer.css
│   │       └── product-image-slots.css
│   ├── js/
│   │   ├── script.js
│   │   ├── inline-editor.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── components/
│   │       ├── header.js
│   │       ├── footer.js
│   │       └── product-image-slots.js
│   └── img/
│       └── produk/
│           └── <id-produk>/
│               ├── 1.jpg
│               ├── 2.jpg
│               ├── 3.jpg
│               └── 4.jpg
└── php.ini
```

- `index.html` adalah halaman utama dan titik masuk situs; sajikan folder melalui server PHP agar katalog memakai data database.
- `pages/` berisi halaman selain halaman utama.
- `assets/css/style.css` dan `assets/js/script.js` menangani gaya dan fungsi halaman.
- `assets/css/components/` dan `assets/js/components/` berisi implementasi khusus header dan footer.
- `assets/img/produk/` adalah lokasi untuk gambar produk.
- `api/` menangani autentikasi sesi dan data katalog.
- `admin/` adalah dashboard produk yang memeriksa peran akun di server.
- Dashboard menyediakan bagian “Teks halaman” untuk mengedit tulisan beranda/artikel, katalog, keranjang, kontak, header/footer, halaman login/registrasi/akun, serta label dan pesan dashboard admin; perubahan disimpan di tabel `page_content`.
- Setelah masuk sebagai admin, beranda menyediakan toolbar edit langsung: klik teks yang bergaris putus-putus untuk mengubahnya, lalu tekan “Simpan perubahan”. Tombol “Edit produk” pada kartu beranda membuka formulir produk tanpa berpindah ke dashboard.
- `assets/js/inline-editor.js` mengaktifkan toolbar edit langsung hanya setelah server mengonfirmasi peran admin; penyimpanan teks dan produk tetap melewati API admin dengan token CSRF.
- `database/migrate-content.sql` membuat tabel teks halaman dan mengisi teks awal, termasuk untuk halaman akun dan dashboard admin. Aman dijalankan ulang: teks yang telah diedit tidak ditimpa.
- `pages/akun.php` menyediakan login/register yang sama untuk user dan admin; pendaftaran publik selalu membuat role `user`.
- `database/schema.sql` membuat tabel akun dan produk sekaligus mengisi 12 produk demo.
- `bin/create-admin.php` membuat atau menaikkan akun admin melalui terminal, bukan dari formulir publik.
- `config/local.php.example` adalah contoh konfigurasi. Salin menjadi `config/local.php` dan isi kredensial database di server; file kredensial tersebut dikecualikan dari Git.
- Di dashboard maupun editor produk langsung di beranda, foto diunggah terpisah ke slot **Tampilan depan**, **Tampilan belakang**, **Detail bahan**, dan **Detail produk**. Memilih file saja belum mengunggahnya: klik **Unggah** pada slot yang sesuai. Format JPG, PNG, atau WebP; maksimal 5 MB dan 25 megapiksel per foto.
- Dashboard memakai tampilan responsif untuk ringkasan, tabel katalog, formulir produk, serta editor teks halaman.
- Galeri detail produk memakai urutan gambar yang sama dengan empat slot unggah di editor. Simpan produk terlebih dahulu sebelum mengunggah foto.
- Klik kartu produk untuk membuka detail, memilih ukuran, dan menambahkannya ke keranjang. Pilihan ukuran tersimpan bersama item keranjang. Opsi ukuran belum mewakili ukuran resmi produk.
- `php.ini` dibiarkan di root karena digunakan sebagai konfigurasi hosting PHP/cPanel.

## Menjalankan dan menyiapkan admin

### Membuat database di cPanel

1. Masuk ke cPanel hosting, lalu buka **MySQL® Databases** (nama menu bisa sedikit berbeda).
2. Pada bagian **Create New Database**, isi nama, misalnya `sandang_kota`, lalu buat. cPanel biasanya menambahkan awalan akun hosting; catat nama lengkap yang ditampilkan, misalnya `akunhosting_sandang_kota`.
3. Buat user database pada bagian **MySQL Users**. Gunakan nama user dan kata sandi yang kuat, lalu simpan di tempat aman. Catat nama lengkap user karena cPanel juga bisa menambahkan awalan, misalnya `akunhosting_toko`.
4. Pada **Add User To Database**, pilih user dan database yang baru dibuat, lalu klik **Add**. Berikan izin yang diperlukan aplikasi (umumnya **ALL PRIVILEGES**) dan simpan.
5. Buka **phpMyAdmin** dari cPanel, pilih database yang baru dibuat pada panel kiri.
6. Pilih tab **Import**, pilih file `database/schema.sql` dari folder proyek, lalu klik **Import/Go**. File ini membuat tabel akun, produk, dan teks awal, serta menambahkan 12 produk demo.
7. Impor juga `database/migrate-content.sql` dengan langkah yang sama. Migrasi ini melengkapi teks CMS, termasuk teks halaman akun dan dashboard admin; aman dijalankan ulang dan tidak menimpa teks yang telah diedit.

### Menghubungkan proyek ke database

1. Salin `config/local.php.example` menjadi file baru bernama `config/local.php` (di folder `config`).
2. Edit `config/local.php` dan isi nilainya dengan informasi dari cPanel. Contoh berikut hanya format—ganti semua nilai contoh, dan jangan gunakan kata sandi contoh:

   ```php
   <?php
   return [
       'DB_HOST' => 'localhost',
       'DB_PORT' => '3306',
       'DB_NAME' => 'akunhosting_sandang_kota',
       'DB_USER' => 'akunhosting_toko',
       'DB_PASSWORD' => 'kata-sandi-user-database-anda',
   ];
   ```

   Gunakan host database yang diberikan penyedia hosting; pada sebagian hosting nilainya `localhost`, sementara hosting lain bisa memberikan host berbeda. Nama database/user harus nilai lengkap termasuk awalan cPanel. Ini adalah **kredensial database**, bukan email/kata sandi admin. Jangan bagikan atau unggah `config/local.php`.
3. Buka situs melalui hosting PHP/HTTPS. Untuk pengembangan lokal, jalankan dari folder proyek: `php -S 127.0.0.1:8000 -t .`, lalu buka `http://127.0.0.1:8000`. Jika konfigurasi benar, API katalog dan konten tidak lagi menampilkan pesan database belum dikonfigurasi.

### Membuat akun admin

1. Jika hosting menyediakan terminal/SSH, jalankan dari folder proyek: `php bin/create-admin.php --email=email-admin-anda@example.com`. Gunakan email yang Anda pilih; skrip akan meminta Anda membuat kata sandi.
2. Jika tidak ada terminal/SSH, daftar akun biasa melalui `/pages/akun.php`, lalu jadikan akun tersebut admin melalui tab **SQL** di phpMyAdmin dengan mengganti email di perintah berikut:

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'email-admin-anda@example.com';
   ```

   Gunakan cara ini hanya pada database milik Anda sendiri. Jangan menambahkan pilihan role admin pada formulir pendaftaran publik.
3. Masuk melalui `/pages/akun.php`, lalu buka `/admin/index.php` untuk mengelola produk dan teks. **Tidak ada email atau kata sandi admin bawaan**; kata sandinya adalah yang Anda pilih saat proses pembuatan akun.

Pastikan memakai HTTPS di hosting. Jangan menambahkan pilihan role pada form daftar. PHP 8.1+ dan PDO MySQL diperlukan.
