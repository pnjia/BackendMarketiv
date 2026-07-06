# Notifications — Backend

Dokumen ini khusus untuk Appwrite Functions dan aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Functions

### send-notification

- **Trigger**: `notifications.create`.
- **Proses**: baca data notifikasi → kirim in-app (via Realtime/query) + kirim email (via Appwrite Email / SMTP).
- **Kanal**:
  - In-App: user melihat di notification center.
  - Email: dikirim ke alamat email user.

## Arsitektur

```text
Modul X → notifications.create
↓
Function: send-notification
↓
In-App + Email
```

## Integrasi Eksternal

- **SMTP / Email Service** — untuk pengiriman email notifikasi.
- **WhatsApp / Push Notification** — future, belum diimplementasikan di MVP.
