# Workflow: Campaign Pay-Per-View (PPV)

## Purpose

Siklus penuh campaign viral/PPV: UMKM membuat campaign + AI brief, mempublikasikan, creator claim & submit konten, AI fraud check, UMKM approve, reward masuk pending wallet creator.

## Modules Involved

- [Campaigns](../02_Modules/Campaigns/00_Index.md) — campaign, brief, claim, submission, reward.
- [AI](../02_Modules/AI/00_Index.md) — generate brief & fraud precheck.
- [Users](../02_Modules/Users/00_Index.md) — file manager & storage kuota (upload asset campaign).
- [Payments](../02_Modules/Payments/00_Index.md) — wallet & transaksi reward.
- [Notifications](../02_Modules/Notifications/00_Index.md) — notifikasi creator & UMKM.

## Trigger

UMKM `Create Campaign` dari dashboard (Campaign Viral).

## Step-by-step Flow

1. **Campaigns** — UMKM isi Basic Info → Upload Asset → AI Brief → Reward (budget, CPM, min/max views, creator limit). Status awal `draft`.

   **Upload Asset** memiliki dua opsi sumber:
   - **Internal (storage)** — Upload via File Manager (`Users/uploadFile()`). File disimpan di Appwrite Storage dan terikat kuota user (default 100 MB). Metadata dictat di `user_files` dengan `purpose = campaign_asset` lalu `campaign_assets` dengan `source = storage`.
   - **External URL** — Input link Google Drive, Dropbox, atau CDN publik. Dicatat di `campaign_assets` dengan `source = external_url`. Tidak terikat kuota storage internal. Hanya menerima protokol `https`.
2. **AI** — `generateBrief()` menghasilkan Hook, CTA, Hashtag, Script, Guideline; UMKM dapat edit lalu simpan.
3. **Campaigns** — `publishCampaign()`: status `draft → active`.
4. **Event `campaigns.status (draft→active)`** memicu `campaign-published`.
5. **Notifications** — Notifikasi "Campaign baru tersedia" ke creator eligible; update search/feed index.
6. **Campaigns** — Creator discover → baca brief → checklist rules → `claimCampaign()` (FCFS). Validasi: belum claim, campaign active, profil lengkap, limit belum penuh.
7. **Event `campaign_claims.create`** memicu `campaign-claimed` → buat `campaign_assignments` → **Notifications** notify UMKM.
8. **Campaigns** — Creator produksi & posting → `createSubmission()` (platform, username, URL, caption).
9. **Event `submissions.create`** memicu `ai-fraud-precheck` (detail di [40_Submission_Fraud.md](40_Submission_Fraud.md)).
10. **Campaigns** — Jika lolos/disetujui, UMKM `approveSubmission()`: status `pending → approved`.
11. **Event `submissions.status (pending→approved)`** memicu `calculate-campaign-reward`.
12. **Payments** — Hitung reward (views × CPM), buat `wallet_transactions` (`type: campaign_reward`), pindah saldo ke **pending balance** creator.
13. Saat tracking selesai, pending balance creator → available (lihat [Payments](../02_Modules/Payments/00_Index.md)).

## Events / Functions

- `campaigns.status (draft→active)` → `campaign-published`
- `campaign_claims.create` → `campaign-claimed`
- `submissions.create` → `ai-fraud-precheck`
- `submissions.status (pending→approved)` → `calculate-campaign-reward`
- Lihat: [`../02_Modules/Campaigns/90_Events.md`](../02_Modules/Campaigns/90_Events.md), [`../02_Modules/AI/90_Events.md`](../02_Modules/AI/00_Index.md).

## Edge Cases

- Claim limit tercapai → claim baru ditolak (FCFS).
- Campaign di-pause → tidak ada claim baru, tracking tetap jalan; resume membuka claim lagi.
- Campaign di-stop → tidak ada claim baru, tracking diselesaikan → completed.
- Submission auto-reject oleh AI (lihat [40_Submission_Fraud.md](40_Submission_Fraud.md)).
- Budget habis sebelum max views → reward dibatasi budget.
- **Upload asset via File Manager ditolak** jika kuota user penuh (`usedBytes + file.size > quotaBytes`). UMKM harus menghapus file lama dulu atau beralih ke external URL.
- **External URL tidak valid** jika bukan protokol `https` atau URL tidak bisa diakses creator — sistem tetap menyimpan, tetapi tidak ada jaminan aksesibilitas.

## Links

- [Campaigns](../02_Modules/Campaigns/00_Index.md)
- [Users](../02_Modules/Users/00_Index.md)
- [AI](../02_Modules/AI/00_Index.md)
- [Payments](../02_Modules/Payments/00_Index.md)
- [Notifications](../02_Modules/Notifications/00_Index.md)
- [Submission & Fraud workflow](40_Submission_Fraud.md)
