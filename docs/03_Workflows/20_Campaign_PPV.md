# Workflow: Campaign Pay-Per-View (PPV)

## Purpose

Siklus penuh campaign viral/PPV: UMKM membuat campaign + AI brief, mempublikasikan, creator claim & submit konten, AI fraud check, UMKM approve, reward masuk pending wallet creator.

## Modules Involved

- [Campaigns](../02_Modules/Campaigns/00_Index.md) — campaign, brief, asset, claim, submission, reward.
- [AI](../02_Modules/AI/00_Index.md) — generate brief & fraud detection.
- [Users](../02_Modules/Users/00_Index.md) — file manager & storage kuota (upload asset campaign).
- [Payments](../02_Modules/Payments/00_Index.md) — wallet & transaksi reward.
- [Notifications](../02_Modules/Notifications/00_Index.md) — notifikasi creator & UMKM.

## Trigger

UMKM klik `Buat Campaign` dari dashboard (tipe Campaign Viral).

## Data Model — Collection yang Terlibat

| Collection | Modul | Aksi |
|---|---|---|
| `campaigns` | Campaigns | CRUD utama |
| `campaign_assets` | Campaigns | insert asset campaign |
| `campaign_briefs` | Campaigns | insert brief (AI/manual) |
| `campaign_claims` | Campaigns | insert saat creator claim |
| `campaign_submissions` | Campaigns | insert saat creator submit |
| `fraud_checks` | Campaigns | insert hasil AI fraud |
| `user_files` | Users | insert saat upload asset via File Manager |
| `user_storage_usage` | Users | update kuota |
| `ai_requests` | AI | insert log request |
| `wallets` | Payments | update pendingBalance |
| `transactions` | Payments | insert transaksi reward |
| `notifications` | Notifications | insert notifikasi |

## Step-by-step Flow

### Tahap 1: Create Campaign (UMKM)

1. **Campaigns** — UMKM isi **Basic Info**: title, category, platforms[], description. Untuk MVP, `platforms[]` wajib hanya berisi `tiktok`.
2. **Campaigns** — **Upload Asset** (dua opsi):
   - **Internal (storage)**: via File Manager (`uploadFile()` dengan `purpose = campaign_asset`, `referenceId = campaignId`). File disimpan di Appwrite Storage. Metadata di `user_files` + `campaign_assets` (`source = storage`). Terikat kuota 100 MB user.
   - **External URL**: input link Google Drive/Dropbox/CDN publik. Dicatat di `campaign_assets` (`source = external_url`). Tidak terikat kuota. Hanya protokol `https`.
3. **AI** (opsional) — UMKM klik "Generate Brief": `generateBrief()` → AI hasilkan Hook, CTA, Hashtag, Script, Guideline. UMKM dapat edit lalu simpan ke `campaign_briefs`.
4. **Campaigns** — Atur **Reward**: budget, rewardPer1000Views (CPM), minViews?, maxViews?, claimLimit.
5. Status awal campaign: `draft`.

### Tahap 2: Publish Campaign

6. **Campaigns** — UMKM `publishCampaign()`: status `draft → active`, set `publishedAt`.
7. **Event `campaigns.status (draft→active)`** memicu function **`campaign-published`**.
8. **Notifications** — Buat notifikasi "Campaign baru tersedia" untuk creator eligible (berdasarkan platform/kategori).
9. **Campaigns** — Campaign tampil di Job Board (query `status = active ORDER BY publishedAt DESC`).

### Tahap 3: Claim Campaign (Creator)

10. **Campaigns** — Creator browsing Job Board → filter/kategori → klik campaign → baca brief & requirements.
11. **Campaigns** — Creator `claimCampaign(campaignId)`.
12. **Validasi backend** (semua harus lolos):
    - `campaign.status === 'active'`
    - `creator.isProfileCompleted === true`
    - Belum ada claim untuk `campaignId + creatorId` (unique constraint).
    - `campaign.totalClaims < campaign.claimLimit`.
13. **Campaigns** — Buat `campaign_claims`: `{ campaignId, creatorId, status: 'claimed' }`. Increment `campaign.totalClaims`.
14. **Event `campaign_claims.create`** memicu function **`campaign-claimed`**.
15. **Notifications** — Notifikasi ke UMKM: "{creatorName} mengklaim campaign-mu".

### Tahap 4: Submit Content (Creator)

16. **Campaigns** — Creator produksi konten & posting ke TikTok. Instagram, Facebook, YouTube, dan platform lain berada di luar MVP.
17. **Campaigns** — `createSubmission({ claimId, campaignId, platform, postUrl, caption?, views, engagement? })`.
18. **Campaigns** — Buat `campaign_submissions`: `{ ..., status: 'pending' }`.
19. **Event `campaign_submissions.create`** memicu function **`ai-fraud-precheck`**.
20. Lanjut ke [40_Submission_Fraud.md](40_Submission_Fraud.md) untuk detail fraud check.

### Tahap 5: Fraud Check & Review

21. **AI** — `ai-fraud-precheck` menjalankan validasi: URL valid, dapat diakses, tidak duplikat, cocok platform TikTok.
22. **AI** — Hitung `fraudScore` (0–100). Tulis `fraud_checks` + update `campaign_submissions.fraudScore/fraudStatus`.
23. **Routing berdasarkan score:**
    - **0–30 (Low Risk)**: auto-approve → submission langsung `approved`.
    - **31–70 (Medium Risk)**: submission tetap `pending`, masuk Fraud Queue Admin.
    - **71–100 (High Risk)**: auto-reject → submission `rejected`.
24. **Admin** (untuk Medium Risk) — Review Fraud Queue → Approve / Reject / Ban Creator.
25. **Campaigns** — UMKM juga tetap dapat `approveSubmission()` / `rejectSubmission()` untuk submission yang masih `pending`.

### Tahap 6: Reward Calculation

26. **Event `campaign_submissions.status (pending→approved)`** memicu function **`calculate-campaign-reward`**.
27. **Payments** — Hitung reward:
    ```
    reward = floor((views / 1000) × rewardPer1000Views)
    // Batasi oleh sisa budget: reward = min(reward, remainingBudget)
    ```
28. **Payments** — Update wallet creator: `pendingBalance += reward`.
29. **Payments** — Buat `transactions`: `{ userId: creatorId, amount: reward, type: 'release', referenceType: 'campaign_submission' }`.
30. **Campaigns** — Update denormalisasi: `campaigns.spentAmount += reward`, `campaigns.remainingBudget = budget - spentAmount`.
31. **Notifications** — Notifikasi ke creator: "Reward campaign {title} sudah masuk ke pending balance".

## State Transitions

```text
CAMPAIGN:    draft → active → paused/completed
CLAIM:       claimed → submitted → approved | rejected
SUBMISSION:  pending → approved | rejected
FRAUD_CHECK: running → safe | review | rejected
WALLET:      pendingBalance += reward → (later → available)
```

## Events / Functions

| Trigger | Function | Aksi |
|---|---|---|
| `campaigns.status (draft→active)` | `campaign-published` | Notifikasi creator eligible, update job board |
| `campaign_claims.create` | `campaign-claimed` | Validasi, notifikasi UMKM |
| `campaign_submissions.create` | `ai-fraud-precheck` | Fraud detection & routing |
| `campaign_submissions.status (pending→approved)` | `calculate-campaign-reward` | Hitung reward, update wallet + campaign counters |

## Validation Rules per Langkah

| Langkah | Validasi | Gagal → |
|---|---|---|
| Upload asset storage | `usedBytes + file.size ≤ quotaBytes` | Error "Kuota penuh" |
| Upload asset storage | `file.size ≤ 20 MB`, `fileCount < 100` | Error batas file |
| Upload asset external | URL harus `https://` | Error format URL |
| Create campaign | `platforms[]` hanya berisi `tiktok` pada MVP | Error platform belum didukung |
| Claim campaign | `isProfileCompleted === true` | Error "Lengkapi profil dulu" |
| Claim campaign | `totalClaims < claimLimit` | Error "Claim limit penuh" |
| Claim campaign | Unique `campaignId + creatorId` | Error "Sudah claim" |
| Create submission | Claim harus `claimed` status | Error |
| Create submission | `platform = tiktok` dan URL domain TikTok valid | Error platform/URL belum didukung |
| Approve/reject submission | Submission harus `pending` | Error status |
| Calculate reward | `remainingBudget > 0` | Reward = 0 jika budget habis |

## Notifikasi

| Titik | Notifikasi | Penerima |
|---|---|---|
| Campaign published | "Campaign baru tersedia" | Creator eligible |
| Campaign claimed | "{creator} mengklaim campaign" | UMKM pemilik |
| Submission created | "Submission baru masuk" | UMKM |
| Submission approved (auto/admin) | "Submission disetujui" | Creator |
| Submission rejected (auto/admin) | "Submission ditolak" | Creator |
| Reward calculated | "Reward {amount} masuk pending wallet" | Creator |

## Edge Cases

- **Claim limit tercapai** → claim baru ditolak dengan error (FCFS).
- **Campaign di-pause** — `status: paused` → tidak ada claim baru, tracking tetap jalan. Resume → `active` lagi, claim dibuka.
- **Campaign di-stop** — `status: completed` → tidak ada claim baru, submission existing tetap diproses.
- **Submission auto-reject oleh AI** — lihat [40_Submission_Fraud.md](40_Submission_Fraud.md).
- **Budget habis sebelum max views** → reward dibatasi `remainingBudget`.
- **Upload asset via File Manager ditolak** jika kuota user penuh. UMKM harus hapus file lama atau beralih ke external URL.
- **External URL tidak valid** — sistem tetap menyimpan, tetapi tidak ada jaminan aksesibilitas; creator yang akan report jika link rusak.
- **Creator appeal atas auto-reject** — admin review sebagai dispute terpisah (lihat [60_Dispute.md](60_Dispute.md) untuk pola serupa).
- **Reward < 1** — jika views < 1000 dan rewardPer1000Views kecil → reward dibulatkan ke bawah, minimal 0 (tidak ada transaksi jika 0).

## Links

- [Campaigns](../02_Modules/Campaigns/00_Index.md)
- [Users](../02_Modules/Users/00_Index.md)
- [AI](../02_Modules/AI/00_Index.md)
- [Payments](../02_Modules/Payments/00_Index.md)
- [Notifications](../02_Modules/Notifications/00_Index.md)
- [Submission & Fraud workflow](40_Submission_Fraud.md)
- [Registration workflow](10_Registration.md)
