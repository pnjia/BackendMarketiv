# Workflow: Registration & Onboarding

## Purpose

Membawa user baru (UMKM atau Creator) dari form pendaftaran sampai akun siap pakai: terverifikasi, punya profil, punya wallet, kuota storage, dan menerima welcome notification.

## Modules Involved

- [Authentication](../02_Modules/Authentication/00_Index.md) — pembuatan akun Appwrite Auth, verifikasi email, role routing.
- [Users](../02_Modules/Users/00_Index.md) — profil UMKM/Creator, storage kuota.
- [Payments](../02_Modules/Payments/00_Index.md) — pembuatan wallet.
- [Notifications](../02_Modules/Notifications/00_Index.md) — welcome notification.

## Trigger

User submit form pendaftaran dari halaman Landing Page:
- `Daftar UMKM` → `/register?role=umkm`
- `Daftar Creator` → `/register?role=creator` (opsi Google OAuth)

## Data Model — Collection yang Terlibat

| Collection | Modul | Aksi |
|---|---|---|
| Appwrite Auth | Authentication | create user |
| `users` | Users | insert row (mirror Auth) |
| `umkm_profiles` / `creator_profiles` | Users | insert row |
| `user_storage_usage` | Users | insert row (quota 100 MB) |
| `wallets` | Payments | insert row (saldo 0) |
| `notifications` | Notifications | insert welcome notification |

## Step-by-step Flow

### Tahap 1: Register

1. **Authentication** — User pilih role: `umkm` atau `creator` → routing ke form sesuai role.
2. **Authentication** — Submit form:
   - UMKM: `registerUMKM({ businessName, category, email, phone, password })`.
   - Creator: `registerCreator({ name, email, password })` atau via Google OAuth.
3. **Authentication** — Appwrite Auth membuat user (`account.create()`), role tercatat di collection `users`.
4. **Authentication** — Kirim link verifikasi email via Appwrite Auth (`account.createVerification()`), **valid 10 menit**.
5. User diarahkan ke halaman **Check Inbox** + opsi "Kirim Ulang Link" bila kedaluwarsa.
6. **Event `users.create`** terpicu (dari Appwrite Auth).

### Tahap 2: Event-Driven Setup (users.create)

7. **Function `create-user-profile`** membaca data user dari event.
8. **Users** — Buat profil sesuai role:
   - `umkm_profiles`: `{ userId, businessName, category, phone, isProfileCompleted: false }`.
   - `creator_profiles`: `{ userId, displayName, isProfileCompleted: false }`.
9. **Users** — Inisialisasi `user_storage_usage`: `{ userId, usedBytes: 0, quotaBytes: 104857600, fileCount: 0 }`.
10. **Payments** — Buat dokumen `wallets`: `{ userId, balance: 0, pendingBalance: 0 }`.
11. **Notifications** — Buat notifikasi `{ userId, title: "Selamat datang di Marketiv", type: "system" }`, terkirim in-app + email.

### Tahap 3: Verifikasi & Login

12. User klik link di email → **Authentication** `verifyEmailToken()` → status `email terverifikasi`.
13. Jika link kedaluwarsa (>10 menit), user klik "Kirim Ulang" → resend verification link.
14. Setelah terverifikasi, user login: `loginUser(email, password, role)`.
15. Response login berisi `{ user, profile, wallet }`.
16. Redirect ke wizard onboarding (detail di [Users 40_User_Flow](../02_Modules/Users/40_User_Flow.md)).

### Tahap 4: Onboarding (dipisah dari workflow ini)

17. **Users** — Wizard onboarding sesuai role:
    - UMKM: isi deskripsi, kota, alamat, social media, upload logo.
    - Creator: isi bio, kota, avatar, tambah akun sosial & portfolio.
18. `isProfileCompleted` di-set `true` setelah wizard selesai.

## State Transitions

```text
Form Submitted → Appwrite Auth Created → Email Sent (pending verification)
                                                      ↓
                                          Link Clicked → Email Verified
                                                      ↓
                                          users.create (event)
                                                      ↓
                                          Profile + Wallet + Storage + Notification Created
                                                      ↓
                                          Login → Onboarding Wizard → Profile Completed
```

## Events / Functions

| Trigger | Function | Aksi |
|---|---|---|
| `users.create` | `create-user-profile` | Buat profile + `user_storage_usage` + wallet + welcome notification |

- Lihat: [Authentication/90_Events](../02_Modules/Authentication/90_Events.md), [Users/70_Backend](../02_Modules/Users/70_Backend.md), [Payments/90_Events](../02_Modules/Payments/90_Events.md).

## Validation Rules per Langkah

| Langkah | Validasi | Gagal → |
|---|---|---|
| Register UMKM | `phone` wajib diisi | Error form, tidak submit |
| Register | Email unik (Appwrite Auth) | Error "Email sudah terdaftar" |
| Register Creator via Google OAuth | Role = creator | UMKM tidak bisa Google OAuth |
| Verifikasi email | Link valid < 10 menit | Tampilkan opsi "Kirim Ulang" |
| Login | Email + password cocok | Error login |
| Create profile | `users.create` event | Idempotent — tidak duplikat |
| Create wallet | `users.create` event | Idempotent — tidak duplikat |

## Notifikasi

| Titik | Notifikasi | Penerima |
|---|---|---|
| Setelah profile + wallet dibuat | "Selamat datang di Marketiv" (system) | User baru |

## Edge Cases

- Link verifikasi kedaluwarsa (>10 menit) → user pakai opsi kirim ulang; link baru terkirim, valid 10 menit lagi.
- Email sudah terdaftar → registrasi ditolak (validasi Appwrite Auth).
- Google OAuth hanya untuk Creator — UMKM tidak dapat login via Google.
- Wallet/profil idempoten — function `create-user-profile` harus cek eksistensi sebelum insert agar tidak duplikat jika event terpicu ulang.
- `users.create` event gagal → retry mechanism Appwrite Function; jika tetap gagal, admin harus manual check.
- Onboarding bisa dilewati (skip) — user tetap bisa akses dashboard meski `isProfileCompleted = false`, namun fitur tertentu terblokir (claim campaign, dll.).

## Links

- [Authentication](../02_Modules/Authentication/00_Index.md)
- [Users](../02_Modules/Users/00_Index.md)
- [Payments](../02_Modules/Payments/00_Index.md)
- [Notifications](../02_Modules/Notifications/00_Index.md)
- [Campaign PPV workflow](20_Campaign_PPV.md)
