# Authentication — Business Rules

## Role & Routing

- Role ditentukan lewat query string saat register: `?role=umkm` atau `?role=creator`.
  - Register: `/register?role=umkm`, `/register?role=creator`.
- Login tidak perlu query role — role sudah tersimpan di database.

## Data Registrasi per Role

- **UMKM** wajib mengisi:
  - Manual: Nama Usaha, Kategori Usaha, Email, **Nomor HP**, Password.
  - Google OAuth: Nama Usaha, Kategori Usaha, **Nomor HP** (email & nama dari Google).
  - Nomor HP **wajib** untuk UMKM (tidak wajib untuk Creator).
- **Creator** mengisi:
  - Manual: Nama Lengkap, Email, Password.
  - Google OAuth: langsung jadi (data dari Google).

## Google OAuth

- Google OAuth tersedia untuk **UMKM** dan **Creator**.
- UMKM via Google OAuth tetap harus mengisi data tambahan (Nama Usaha, Kategori, Nomor HP) setelah redirect.
- Creator via Google OAuth langsung jadi tanpa isi data tambahan.

## Reset Password

- Forgot Password: pengguna memasukkan email → sistem mengirim link reset → pengguna membuka email → reset password → login.

## Lihat Juga

- [40_User_Flow.md](40_User_Flow.md) — urutan langkah lengkap.
