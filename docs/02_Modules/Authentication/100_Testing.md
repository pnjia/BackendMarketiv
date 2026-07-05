# Authentication — Testing

## Register

- UMKM register dengan data valid → akun terbuat + profil terisi.
- Creator register dengan Google OAuth → akun terbuat + profil creator.
- Register dengan email duplikat → error validasi.
- Register UMKM tanpa nomor HP → error validasi.

## Login

- Login dengan kredensial valid → session terbuat.
- Login UMKM via Google OAuth → ditolak (khusus creator).

## Reset Password

- Input email terdaftar → link reset terkirim.
- Reset password → dapat login dengan password baru.
