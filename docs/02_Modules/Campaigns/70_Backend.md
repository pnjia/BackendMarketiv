# Campaigns — Backend

Dokumen ini khusus untuk Appwrite Functions dan aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Functions

### campaign-published

- **Trigger**: `campaigns.status` `draft → active`.
- **Aksi**: set `publishedAt`, kirim notifikasi ke creator eligible.

### campaign-claimed

- **Trigger**: `campaign_claims.create`.
- **Aksi**: validasi claim limit & duplikasi, update `totalClaims`, notifikasi UMKM.

### ai-fraud-precheck

- **Trigger**: `campaign_submissions.create`.
- **Aksi**: panggil AI Fraud Detection, tulis hasil ke `fraud_checks` & update submission.

### calculate-campaign-reward

- **Trigger**: `campaign_submissions.status` `pending → approved`.
- **Aksi**: hitung reward, update `spentAmount` & `remainingBudget`, buat transaksi ke pending balance creator.

## Backend Helpers

### upload-campaign-asset

- **Trigger**: dipanggil frontend saat upload asset campaign.
- **Aksi**: panggil File Manager `uploadFile()` (modul Users) hanya dengan file, lalu buat `campaign_assets` dengan `source = storage` dan `fileId` dari hasil upload.
- **Catatan**: helper ini bukan Appwrite Function event-driven.

## Aturan Backend

- Unique constraint `campaignId + creatorId` pada claim (backend validation).
- Cek `status = active`, `isProfileCompleted = true`, `totalClaims < claimLimit`.
- Asset `source = storage` wajib memiliki `fileId` yang valid dan milik owner campaign.
- Asset `source = external_url` wajib protokol `https`.
