# Rate Cards — Backend

Dokumen ini khusus untuk aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Aturan Backend

- Validasi kepemilikan: hanya Creator pemilik yang dapat mengubah rate card.
- Saat publish, validasi minimal satu paket telah ditambahkan.
- Search creators memanfaatkan index pada `creator_profiles` (city, rating, totalFollowers) dan `creator_social_accounts` (platform, followers). Pada MVP, filter platform hanya `tiktok`.
- Direct order dari paket: `packageId` direferensi oleh order (lihat `../Orders/50_Database.md`).
