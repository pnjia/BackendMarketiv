# Payments — Frontend

## Halaman

### Wallet Dashboard

- Tampilkan `balance` (tersedia) dan `pendingBalance`.
- Riwayat transaksi (type, amount, date, status).
- Tombol Top Up (UMKM) / Tarik Dana (Creator).

### Top Up

- Form input amount.
- Panggil `createPayment()` untuk membuat payment Midtrans.
- Redirect/open Snap Midtrans menggunakan `snapToken` atau `redirectUrl` dari server.
- Tampilkan status menunggu sampai webhook Midtrans mengubah payment menjadi `paid`.

### Withdrawal

- Form: amount, payout method (`bank` atau `ewallet`), provider name, account number/phone, account name.
- Validasi: min amount, balance cukup, metode valid, data tujuan pencairan lengkap.
- Riwayat withdrawal.

### Admin: Withdrawal Review

- Daftar withdrawal pending.
- Tampilkan metode pencairan, provider, nomor rekening/akun, nama pemilik, dan riwayat withdrawal creator.
- Approve dengan catatan/bukti transfer atau reject dengan alasan wajib.

## Komponen

- `WalletCard` — ringkasan saldo.
- `TransactionList` — daftar transaksi.
- `WithdrawForm` — form tarik dana.
- `AdminWithdrawReview` — panel admin untuk review withdrawal.
