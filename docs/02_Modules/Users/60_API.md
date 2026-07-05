# Users — API

## Service Layer (Client SDK)

Fungsi-fungsi berikut dipanggil langsung dari frontend Next.js via **Appwrite Client SDK (Database, Storage)**. Berjalan di browser user.

---

### `getProfile(userId)` — [Client SDK]

Mengembalikan profil sesuai role (umkm/creator).

### `updateProfile()` — [Client SDK]

Memperbarui field profil (deskripsi, kota, logo/avatar, dll.).

---

### `addSocialAccount()` — [Client SDK]

### `removeSocialAccount()` — [Client SDK]

Mengelola entri `creator_social_accounts` (satu creator banyak akun).

---

### `searchCreators(filter)` — [Client SDK]

Contoh filter:

```json
{
  "platform": "tiktok",
  "city": "sukabumi"
}
```

Memakai index pada `creator_profiles` (city, rating, totalFollowers) dan `creator_social_accounts` (platform, followers).

---

### `uploadFile()` — [Client SDK]

- **Input**: `{ file, purpose, referenceId? }`
- **Proses**: validasi kuota → upload ke Appwrite Storage → catat metadata ke `user_files` → update `user_storage_usage`.
- **Validasi**:
  - `usedBytes + file.size ≤ quotaBytes`.
  - Maks ukuran satu file: 20 MB.
  - Maks jumlah file: 100.
  - File type allowed: `image/*`, `video/*`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`.
- **Akses**: Authenticated user (owner).

### `deleteFile()` — [Client SDK]

- **Input**: `{ fileId }`
- **Proses**: validasi kepemilikan → hapus dari Appwrite Storage → soft delete metadata `user_files` (`status = deleted`, set `deletedAt`) → update `user_storage_usage`.
- **Akses**: Authenticated user (owner).

### `getMyFiles(filter)` — [Client SDK]

- **Input**: `{ purpose?, status? }`
- **Proses**: list file milik user.
- **Akses**: Authenticated user (owner).

### `getStorageUsage()` — [Client SDK]

- **Proses**: return `{ usedBytes, quotaBytes, fileCount }` untuk user.
- **Akses**: Authenticated user (owner).

---

## Appwrite Functions (Server-side)

Module ini tidak memiliki Appwrite Functions sendiri.

---

## Lihat Juga

- [50_Database.md](50_Database.md) — skema & index yang mendukung query ini.
- [30_Business_Rules.md](30_Business_Rules.md) — aturan profil & storage kuota.
