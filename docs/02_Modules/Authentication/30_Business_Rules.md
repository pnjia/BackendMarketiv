# Authentication — Business Rules

## Role & Routing

- Role ditentukan lewat query string: `?role=umkm` atau `?role=creator`.
  - Register: `/register?role=umkm`, `/register?role=creator`.
  - Login: `/login?role=umkm`, `/login?role=creator`.
- Role wajib diketahui sebelum proses register/login agar form dan profil yang dibuat sesuai.

## Data Registrasi per Role

- **UMKM** wajib mengisi: Nama Usaha, Kategori Usaha, Email, **Nomor HP**, Password.
  - Nomor HP **wajib** untuk UMKM (tidak wajib untuk Creator).
- **Creator** mengisi: Nama Lengkap, Email, Password — atau langsung via Google OAuth.

## Google OAuth

- Google OAuth Register/Login **khusus Content Creator**.
- UMKM hanya dapat login manual (email + password).

## Verifikasi Akun Sosial Creator

- Saat verifikasi akun sosial, sistem menghasilkan kode unik berformat **`MARKETIV-XXXX`**.
- Creator memasang kode di bio atau memposting story, lalu menekan Verify; sistem mengecek keberadaan kode untuk menandai akun terverifikasi.

## Reset Password

- Forgot Password: pengguna memasukkan email → sistem mengirim link reset → pengguna membuka email → reset password → login.

## Lihat Juga

- [40_User_Flow.md](40_User_Flow.md) — urutan langkah lengkap.
