# Payments — Testing

## Midtrans Payment Gateway

- `create-payment` membuat dokumen `payments` status `pending` dan mengembalikan `snapToken`/`redirectUrl` Midtrans.
- Frontend tidak menerima atau menyimpan Midtrans secret key.
- Webhook Midtrans dengan signature valid mengubah status payment menjadi `paid`.
- Webhook Midtrans dengan signature/amount invalid ditolak dan tidak mengubah payment.
- Webhook berulang untuk `gateway_reference` yang sama tidak menggandakan escrow, deposit, atau ledger transaction.
- Webhook untuk payment yang sudah final tidak menurunkan status payment.

## Wallet

- Wallet terbuat otomatis saat user register.
- Satu user hanya punya satu wallet.
- Balance tidak bisa negatif.

## Transaction

- Setiap mutasi saldo tercatat di `transactions`.
- Tipe transaksi sesuai definisi (deposit, withdrawal, dll).
- ReferenceId mengarah ke dokumen terkait.

## Escrow

- Escrow terbuat saat payment sukses (status `held`).
- Release escrow → balance Creator bertambah.
- Refund escrow → balance UMKM kembali.
- Escrow tidak bisa diubah oleh user.

## Withdrawal

- Withdrawal valid (balance cukup, min amount terpenuhi) → status `pending`.
- Withdrawal invalid (balance kurang) → error.
- Admin approve → balance berkurang, status `processed`.
- Admin reject → balance dikembalikan, status `rejected`.
