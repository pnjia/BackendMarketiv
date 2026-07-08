# AI — Backend

Dokumen ini khusus untuk Appwrite Functions AI dan aturan integrasinya. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Functions

### ai-brief

- **Trigger**: HTTP (dipanggil dari frontend UMKM).
- **Proses**: terima `campaignId` → ambil data campaign → kirim ke Gemini API → kembalikan brief terstruktur.
- **Output**: `{ objective, contentAngle, cta, detail, doAndDont }`.

### ai-fraud-precheck

- **Trigger**: Database event `campaign_submissions.create`.
- **Proses**: terima `submissionId` → validasi URL, duplikasi, platform → hitung `fraudScore` → tulis `fraud_checks` + update submission.
- **Output**: `{ score, status }`.

## Integrasi Eksternal

- **Gemini API** — satu-satunya integrasi eksternal. API key disimpan sebagai environment variable Appwrite Function.
