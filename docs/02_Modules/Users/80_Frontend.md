# Users — Frontend

## Halaman

### Profile UMKM

- Tampilan profil bisnis (nama, kategori, deskripsi, kota, kontak, TikTok opsional, logo).
- Tombol Edit Profile.

### Profile Creator

- Tampilan profil (display name, bio, avatar, rating, followers).
- Daftar akun sosial TikTok (username, followers).
- Daftar portofolio.
- Rate card (dari modul RateCards).
- Tombol Chat.

### Edit Profile

- Form dinamis sesuai role.
- Field TikTok untuk UMKM bersifat opsional; tidak ada field website pada MVP.
- Upload logo/avatar.
- Tambah/hapus akun sosial TikTok (Creator).
- Tambah/hapus portofolio (Creator: title, description, thumbnailUrl, portfolioUrl).

### Onboarding

- Wizard onboarding tidak mewajibkan upload logo UMKM.
- Wizard onboarding tidak mewajibkan tambah portfolio Creator.
- Penambahan logo dan portfolio dilakukan dari halaman profil setelah onboarding selesai.

### Browse Creator

- Grid/list card Creator.
- Filter: platform MVP (TikTok), kota.
- Search bar.

## Komponen

- `ProfileCard` — ringkasan profil.
- `SocialAccountList` — daftar akun sosial TikTok pada MVP.
- `PortfolioGrid` — grid portofolio.
- `CreatorCard` — card untuk halaman discovery.
- `SearchFilter` — filter pencarian Creator.
