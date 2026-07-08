# Campaigns — Testing

## Campaign

- UMKM membuat campaign → status `draft`.
- Budget < Rp50.000 → ditolak (validation error).
- Budget = Rp50.000 → berhasil.
- Publikasi tanpa top-up → ditolak (jika aturan top-up sebelum publish diterapkan).
- Top-up budget → payment dengan amount = budget + fee 5%.
- Publikasi setelah top-up → status `active`, muncul di job board.
- UMKM melihat campaign milik sendiri saja.

## Claim

- Creator claim campaign → status `claimed`.
- Claim duplikat (campaign + creator sama) → ditolak.
- Claim saat campaign paused/completed → ditolak.
- Claim melebihi `claimLimit` → ditolak.
- Creator dengan profil belum lengkap → ditolak.
- Claim expired karena tidak submit dalam `submissionDays` → status `expired`, `totalClaims` berkurang.
- Claim baru setelah slot kembali dari claim expired → berhasil.

## Submission

- Creator submit konten → status `pending`, fraud check otomatis berjalan.
- Fraud `safe` → auto-approve.
- Submit sebelum claim → error.
- UMKM approve → reward terhitung, balance creator bertambah.

## Denormalisasi

- `totalClaims`, `spentAmount`, `remainingBudget` akurat setelah setiap aksi.
