# Authentication — Testing

## Register

- UMKM register dengan data valid → akun terbuat + profil terisi.
- UMKM register dengan Google OAuth → redirect ke form data tambahan → akun terbuat + profil UMKM.
- Creator register dengan Google OAuth → akun terbuat + profil creator.
- Register dengan email duplikat → error validasi.
- Register UMKM tanpa nomor HP → error validasi.

## Login

- Login dengan kredensial valid → session terbuat.
- Login UMKM via Google OAuth → sukses.

## Reset Password

- Input email terdaftar → link reset terkirim.
- Reset password → dapat login dengan password baru.
