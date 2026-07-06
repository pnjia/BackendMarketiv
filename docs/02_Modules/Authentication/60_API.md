# Authentication — API

## Service Layer (Client SDK)

Fungsi-fungsi berikut dipanggil langsung dari frontend Next.js via **Appwrite Client SDK (Auth)**. Berjalan di browser user.

---

### `registerUMKM()` — [Client SDK]

Input:

```json
{
  "businessName": "",
  "category": "",
  "email": "",
  "phone": "",
  "password": ""
}
```

### `registerCreator()` — [Client SDK]

Input:

```json
{
  "name": "",
  "email": "",
  "password": ""
}
```

### Register Process (kedua role)

```text
Create Appwrite Auth User   (kedua role boleh via Google OAuth)
↓
Create Profile              (umkm_profiles / creator_profiles)
↓
Create Wallet
```

> Pembuatan Wallet juga dipicu otomatis oleh event `users.create` — lihat [90_Events.md](90_Events.md) dan `../Payments/90_Events.md`.

---

### `loginUser(email, password, role)` — [Client SDK]

### `loginWithGoogle()` — [Client SDK]

Khusus Creator.

Return data login:

```json
{
  "user": {},
  "profile": {},
  "wallet": {}
}
```

---

### `forgotPassword(email)` — [Client SDK]

Kirim link reset password.

---

## Appwrite Functions (Server-side)

Module ini tidak memiliki REST API publik sendiri. Operasi server-side yang diperlukan module Authentication dijalankan lewat Appwrite Functions dan didokumentasikan di [70_Backend.md](70_Backend.md).

---

## Lihat Juga

- [30_Business_Rules.md](30_Business_Rules.md) — aturan validasi input.
- Skema profil: [Users/50_Database.md](../Users/50_Database.md).
