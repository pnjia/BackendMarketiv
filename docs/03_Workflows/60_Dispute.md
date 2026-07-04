# Workflow: Dispute

## Purpose

Sengketa pada order rate card aktif diselesaikan admin dengan tiga opsi keputusan yang menentukan status escrow: rilis penuh ke creator, refund penuh ke UMKM, atau partial refund.

## Modules Involved

- [Orders](../02_Modules/Orders/00_Index.md) — order & status dispute.
- [Payments](../02_Modules/Payments/00_Index.md) — escrow release/refund, transaksi.
- [Chat](../02_Modules/Chat/00_Index.md) — bukti percakapan (admin review).
- [Users](../02_Modules/Users/00_Index.md) — data profil kedua pihak.
- [Notifications](../02_Modules/Notifications/00_Index.md) — notifikasi hasil dispute.
- Admin — review & keputusan final.

## Trigger

UMKM klik `Buka Sengketa` pada order aktif (`in_progress` / `revision`). Alasan dispute: `Konten Tidak Sesuai`, `Tidak Posting`, `Spam`, atau `Lainnya`.

## Data Model — Collection yang Terlibat

| Collection | Modul | Aksi |
|---|---|---|
| `orders` | Orders | update status jadi `disputed` |
| `escrows` | Payments | update status → `released` / `refunded` |
| `wallets` | Payments | update balance (creator dan/atau UMKM) |
| `transactions` | Payments | insert transaksi release/refund |
| `notifications` | Notifications | insert notifikasi hasil |

## Step-by-step Flow

### Tahap 1: Open Dispute

1. **Orders** — UMKM buka halaman detail order → klik "Buka Sengketa".
2. **Orders** — UMKM pilih alasan dari opsi: `Konten Tidak Sesuai`, `Tidak Posting`, `Spam`, `Lainnya`.
3. **Orders** — UMKM isi deskripsi keluhan (opsional) + upload bukti (screenshot, link).
4. **Orders** — Update `orders.status: in_progress/revision → disputed`.
5. **Notifications** — Notifikasi ke admin: "Sengketa baru — Order #{orderId} oleh {umkmName}".
6. **Notifications** — Notifikasi ke creator: "Sengketa dibuka pada order #{orderId} — admin akan mereview".

### Tahap 2: Admin Review

7. **Admin** — Buka **Dispute Queue** → lihat daftar sengketa `order.status = disputed`.
8. **Admin** — Review detail:
    - Order info: amount, status sebelum dispute, deliverable.
    - Riwayat chat (modul Chat) antara UMKM dan creator.
    - Bukti dari UMKM (deskripsi + file).
    - Tanggapan dari creator (admin bisa minta keterangan tambahan).
9. **Admin** — Evaluasi berdasarkan bukti dan aturan platform.

### Tahap 3: Keputusan Admin

10. **Admin** — Pilih salah satu keputusan:

    | Keputusan | Kondisi | Aksi Finansial |
    |---|---|---|
    | **Creator Win** | Creator sudah deliver sesuai brief & aturan | Escrow release penuh ke wallet creator |
    | **UMKM Win** | Creator gagal deliver / melanggar kesepakatan | Escrow refund penuh ke wallet UMKM |
    | **Partial Refund** | Kedua pihak sama-sama kurang / kompromi | Escrow dibagi: sebagian ke creator, sebagian refund UMKM |

11. **Admin** — Konfirmasi keputusan → sistem menjalankan aksi finansial.

### Tahap 4: Eksekusi Finansial

12. **Payments** — Eksekusi sesuai keputusan:

    **Jika Creator Win:**
    - `escrows.status: held → released`.
    - `wallets.escrowBalance -= amount` (keluar dari escrow).
    - `wallets.balance += amount` (masuk available balance creator).
    - `transactions.create`: `{ userId: creatorId, amount, type: 'release', referenceType: 'dispute', referenceId: orderId }`.

    **Jika UMKM Win:**
    - `escrows.status: held → refunded`.
    - `wallets.escrowBalance -= amount` (keluar dari escrow).
    - `wallets.balance += amount` (kembali ke available balance UMKM).
    - `transactions.create`: `{ userId: umkmId, amount, type: 'refund', referenceType: 'dispute', referenceId: orderId }`.

    **Jika Partial Refund:**
    - `escrows.status: held → released` (sebagian) + `escrows.status: held → refunded` (sebagian).
    - Hitung proporsi: `releaseAmount` + `refundAmount` = `escrow.amount`.
    - Transfer release ke creator + refund ke UMKM.
    - Dua transaksi: satu `release`, satu `refund`.

13. **Orders** — Update order status:
    - Creator Win → `completed`.
    - UMKM Win / Partial → `refunded`.

### Tahap 5: Notifikasi

14. **Notifications** — Notifikasi ke UMKM + Creator:
    - "Sengketa order #{orderId} selesai — Keputusan: {Creator Win / UMKM Win / Partial Refund}".
15. Semua escrow balance menjadi 0 setelah resolusi.

## State Transitions

```text
ORDER STATUS:
  in_progress / revision → disputed → completed (creator win)
                                    → refunded (umkm win / partial)

ESCROW STATUS:
  held → released (creator win / porsi creator partial)
       → refunded (umkm win / porsi umkm partial)

WALLET:
  escrowBalance -= amount
  balance += amount (ke pihak yang menang)
```

## Events / Functions

| Trigger | Function | Aksi |
|---|---|---|
| Admin decision (creator win) | `release-escrow` | Release escrow penuh ke creator, order completed |
| Admin decision (umkm win) | `refund-escrow` | Refund escrow penuh ke UMKM, order refunded |
| Admin decision (partial) | `partial-release-escrow` | Bagi escrow sesuai proporsi |

Fungsi escrow yang sama dipakai dari alur normal [30_RateCard_Order.md](30_RateCard_Order.md), dengan parameter tambahan untuk mode dispute.

## Validation Rules per Langkah

| Langkah | Validasi | Gagal → |
|---|---|---|
| Open dispute | Order harus `in_progress` / `revision` | Error status |
| Open dispute | Hanya UMKM pemilik order | 403 Forbidden |
| Open dispute | Tidak boleh ada dispute lain di order yang sama | Error "Sengketa sudah ada" |
| Admin keputusan | Escrow harus `held` | Error status |
| Partial refund | `releaseAmount + refundAmount === escrow.amount` | Error "Jumlah tidak balance" |
| Complete | Setelah eksekusi, escrow balance = 0 | Invariant error |

## Notifikasi

| Titik | Notifikasi | Penerima |
|---|---|---|
| Dispute opened | "Sengketa baru — Order #{orderId}" | Admin |
| Dispute opened | "Sengketa dibuka pada order-mu" | Creator |
| Dispute resolved | "Sengketa selesai — {keputusan}" | UMKM + Creator |

## Edge Cases

- **Dispute hanya valid setelah pembayaran** — escrow harus `held`. Order `pending_payment` tidak bisa dispute.
- **Partial refund invariant** — `releaseAmount + refundAmount` harus sama persis dengan `escrow.amount`. Sistem wajib validasi.
- **Campaign Viral dispute** — creator appeal atas submission yang auto-reject oleh AI. Alur terpisah: creator hubungi admin → admin review → final decision. Tidak menggunakan escrow karena campaign PPV tidak punya escrow.
- **Creator tidak responsif saat dispute** — admin tetap bisa memutus berdasarkan bukti yang ada (unilateral decision).
- **Dispute setelah order completed** — tidak bisa; dispute hanya untuk order `in_progress` atau `revision`.
- **Admin butuh waktu lama** — tidak ada timeout otomatis; dispute tetap `disputed` sampai admin putuskan.
- **Keputusan admin final** — tidak ada banding. Jika ada ketidakpuasan, di luar platform.

## Links

- [Orders](../02_Modules/Orders/00_Index.md)
- [Payments](../02_Modules/Payments/00_Index.md)
- [Chat](../02_Modules/Chat/00_Index.md)
- [Notifications](../02_Modules/Notifications/00_Index.md)
- [RateCard Order workflow](30_RateCard_Order.md)
- [Submission Fraud workflow](40_Submission_Fraud.md) — appeal creator campaign
