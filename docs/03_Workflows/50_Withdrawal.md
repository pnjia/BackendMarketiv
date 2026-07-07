# Workflow: Withdrawal

## Purpose

Creator menarik saldo available dari wallet ke bank/e-wallet, dengan validasi saldo & minimum amount, review admin, dan transfer manual sebelum status berubah menjadi processed.

## Modules Involved

- [Payments](../02_Modules/Payments/00_Index.md) — wallet, withdrawal, transaksi.
- [Notifications](../02_Modules/Notifications/00_Index.md) — notifikasi status penarikan.
- Admin — review & eksekusi transfer.

## Trigger

Creator submit form `Tarik Dana` dari halaman Wallet (input: payoutMethod, providerName, accountNumber, accountName, amount).

## Data Model — Collection yang Terlibat

| Collection | Modul | Aksi |
|---|---|---|
| `wallets` | Payments | update balance (hold) |
| `withdrawals` | Payments | insert → update status |
| `transactions` | Payments | insert saat complete |
| `notifications` | Notifications | insert notifikasi |

## Step-by-step Flow

### Tahap 1: Request Withdrawal

1. **Payments** — Creator buka halaman Wallet → klik "Tarik Dana".
2. **Payments** — Tampilkan saldo available (`wallet.balance`), minimum withdraw amount (**Rp50.000**, konstanta sistem — lihat [ADR-007](../04_Decisions/ADR-007.md)).
3. **Payments** — Creator isi form: `{ payoutMethod, providerName, accountNumber, accountName, amount }`.
4. **Payments** — `requestWithdraw()` menjalankan validasi:
   - `wallet.balance >= amount`
   - `amount >= MINIMUM_WITHDRAW` (konstanta sistem = `Rp50.000` / `50.000`, lihat [ADR-007](../04_Decisions/ADR-007.md))
   - `amount > 0`
   - `payoutMethod` adalah `bank` atau `ewallet`
   - `providerName`, `accountNumber`, dan `accountName` terisi
5. **Jika validasi gagal** — tampilkan error: "Saldo tidak mencukupi" / "Minimum penarikan Rp50.000".
6. **Jika validasi lolos** — Buat `withdrawals`: `{ userId, amount, payoutMethod, providerName, accountNumber, accountName, status: 'pending' }`.
7. **Payments** — Kurangi `wallet.balance -= amount` (dana di-hold, tidak bisa dipakai transaksi lain).
8. **Event `withdrawals.create`** — (tidak memicu function spesifik; cukup trigger notifikasi).

### Tahap 2: Admin Review

9. **Notifications** — Notifikasi ke admin: "Withdrawal request baru — Rp{amount} oleh {creatorName}".
10. **Admin** — Buka **Withdrawal Queue** → lihat daftar request `status: pending`.
11. **Admin** — Review detail:
    - Data tujuan pencairan: metode, provider bank/e-wallet, nomor rekening/akun, nama pemilik.
    - Riwayat withdrawal creator sebelumnya.
    - Saldo creator saat ini.
12. **Admin** — Keputusan:

    | Keputusan | Aksi Sistem |
    |---|---|
    | **Approve** | Admin transfer manual via bank/e-wallet → `withdrawals.status: pending → processed` |
    | **Reject** | Beri alasan → `withdrawals.status: pending → rejected` |

### Tahap 3: Complete / Reject

13. **Jika Approve:**
    - Admin konfirmasi transfer sudah dilakukan dan dapat mengisi `adminNote`/`transferProofUrl`.
    - **Event `withdrawals.status (pending→processed)`** memicu function **`complete-withdrawal`**.
    - **Payments** — Update `wallet.withdrawn += amount` (opsional, tracking total penarikan).
    - **Payments** — Buat `transactions`: `{ userId, amount: -amount, type: 'withdrawal', referenceType: 'withdrawal', referenceId: withdrawalId }`.
    - **Notifications** — Notifikasi ke creator: "Penarikan Rp{amount} berhasil diproses — cek rekening/akunmu".

14. **Jika Reject:**
    - **Payments** — Kembalikan saldo: `wallet.balance += amount` (dana hold dikembalikan).
    - **Payments** — Tidak ada transaksi dicatat.
    - **Notifications** — Notifikasi ke creator: "Penarihan ditolak: {alasan admin}".

## State Transitions

```text
WITHDRAWAL:  pending → processed (approve)
                    → rejected  (reject)

WALLET:      balance -= amount (saat request) → balance += amount (jika reject)
                                                  withdrawn += amount (jika approve)
```

## Events / Functions

| Trigger | Function | Aksi |
|---|---|---|
| `withdrawals.create` | (notifikasi admin) | Push notifikasi ke admin |
| `withdrawals.status (pending→processed)` | `complete-withdrawal` | Catat transaksi, notifikasi creator |

## Validation Rules per Langkah

| Langkah | Validasi | Gagal → |
|---|---|---|
| Request withdrawal | `wallet.balance >= amount` | Error "Saldo tidak mencukupi" |
| Request withdrawal | `amount >= MINIMUM_WITHDRAW` | Error "Minimum withdraw Rp50.000" |
| Request withdrawal | `amount > 0` | Error "Jumlah tidak valid" |
| Request withdrawal | `payoutMethod` valid (`bank` atau `ewallet`) | Error "Metode penarikan tidak valid" |
| Request withdrawal | Data tujuan pencairan lengkap | Error "Lengkapi data penarikan" |
| Admin approve | Withdrawal harus `pending` | Error status |
| Admin reject | Admin wajib isi alasan | Form tidak bisa submit |

## Notifikasi

| Titik | Notifikasi | Penerima |
|---|---|---|
| Withdrawal requested | "Withdrawal request baru — Rp{amount}" | Admin |
| Withdrawal approved | "Penarikan Rp{amount} berhasil diproses — cek rekening/akun" | Creator |
| Withdrawal rejected | "Penarikan ditolak: {reason}" | Creator |

## Edge Cases

- **Saldo kurang dari amount** — ditolak saat validasi awal (sebelum buat record).
- **Amount di bawah minimum withdraw** — ditolak.
- **Reject admin** — saldo wajib dikembalikan penuh ke `wallet.balance` (invariant: tidak ada saldo hilang).
- **Hanya saldo available yang bisa ditarik** — `pendingBalance` dan `escrowBalance` tidak bisa ditarik.
- **Pending withdrawal ganda** — creator bisa memiliki banyak withdrawal request, tetapi total amount pending tidak boleh melebihi `wallet.balance`.
- **Transfer bank/e-wallet gagal** — jika admin sudah approve tetapi transfer gagal (rekening/akun salah, provider offline), admin dapat membatalkan: `withdrawals.status → rejected` dengan alasan "Transfer gagal", saldo dikembalikan.
- **Withdrawal diakses saat wallet dibekukan** — jika user `status: suspended`, withdrawal tidak bisa diajukan.

## Links

- [Payments](../02_Modules/Payments/00_Index.md)
- [Notifications](../02_Modules/Notifications/00_Index.md)
- [Dispute workflow](60_Dispute.md)
