# Users — Business Rules

## Kelengkapan Profil

- Setiap profil memiliki flag `isProfileCompleted`.
  - UMKM: default-nya dapat dianggap lengkap setelah onboarding wizard.
  - Creator: `isProfileCompleted` awalnya `false`; menjadi `true` setelah profil dilengkapi.
- Profil yang belum lengkap dapat memblokir aksi tertentu (mis. claim campaign membutuhkan profil lengkap).

## Data Pre-filled dari Registrasi

- **UMKM**: `businessName`, `category`, dan `phone` diisi saat Register dan ditampilkan pre-filled di onboarding.

## Akun Sosial Creator

- Satu creator dapat memiliki **banyak** akun sosial (`creator_social_accounts`), satu per platform (tiktok, instagram, youtube, dst.).
- Tiap akun menyimpan `followers`, `engagementRate`, dan flag `isVerified`.

## Data Denormalisasi (disengaja)

Disimpan langsung di `creator_profiles` agar dashboard & browse cepat, walau bisa dihitung dari collection lain:

- `totalFollowers` — agregat followers seluruh akun sosial.
- `totalOrders` — jumlah order selesai.
- `rating` — rating creator.

## Storage Kuota

- Setiap user memiliki kuota penyimpanan default **100 MB** (104.857.600 bytes) untuk file yang diupload ke Appwrite Storage.
- Kuota dihitung dari total `sizeBytes` seluruh `user_files` berstatus `active`.
- Upload ditolak jika `usedBytes + file.size > quotaBytes`.
- Maks ukuran satu file: **20 MB**.
- Maks jumlah file: **100** file aktif.
- File yang dihapus (soft delete) tidak dihitung dalam kuota dan jumlah file.
- Kuota dapat dinaikkan berdasarkan plan/subscription di masa depan.
- External URL (Google Drive, Dropbox, dll.) tidak terikat kuota — dikelola via modul Campaigns (`campaign_assets.source = external_url`).

## Lihat Juga

- [50_Database.md](50_Database.md) — atribut & index.
- [60_API.md](60_API.md) — operasi profil, pencarian creator, & file manager.
