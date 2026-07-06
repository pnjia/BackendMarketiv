# Campaigns — User Flow

## Alur UMKM

```text
Buat Campaign (draft)
  ├─ Basic Info (judul, kategori, platform TikTok, deskripsi)
  ├─ Upload Asset
  │    ├─ Internal (storage) — upload via File Manager, terikat kuota 100 MB
  │    └─ External URL — link Google Drive / Dropbox / CDN, bebas kuota
  ├─ Generate Brief via AI (opsional)
  └─ Atur Reward (budget, CPM, min/max views, claim limit)
↓
Publish Campaign → active
↓
Tunggu Creator Claim
↓
Review Submission
  ├─ Approve → Reward dihitung → pending balance creator
  └─ Reject → submission ditolak
```

## Alur Creator

```text
Browse Job Board (campaign active)
↓
Pilih Campaign → Claim
↓
Validasi: profil lengkap, belum claim, claim limit tersedia
↓
Buat Konten TikTok → Submit URL TikTok
↓
Fraud Check (otomatis)
↓
Tunggu Approve / Reject dari UMKM
```
