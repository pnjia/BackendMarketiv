# Payments — Backend

Dokumen ini khusus untuk Appwrite Functions dan aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Functions

### create-payment

- **Trigger**: callable dari frontend saat UMKM checkout order atau top up.
- **Aksi**: validasi user/order/amount, buat dokumen `payments`, panggil Midtrans, simpan `snapToken` dan/atau `redirectUrl`.
- **Env wajib**: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_ENV`.

### midtrans-webhook

- **Trigger**: HTTP notification dari Midtrans.
- **Aksi**: validasi `signature_key` Midtrans dengan SHA-512 (`order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY`), cocokkan `gateway_reference`, validasi nominal, update status payment secara idempotent.
- **Efek sukses**: status payment `pending → paid`, lalu alur escrow/deposit berjalan dari event `payments.status`.

### create-user-wallet

- **Trigger**: `users.create`.
- **Aksi**: buat dokumen `wallets` (`balance = 0`, `pendingBalance = 0`).

### create-escrow

- **Trigger**: `payments.status` `pending → paid`.
- **Aksi**: buat escrow (`held`), lock dana, update order status.

### release-escrow

- **Trigger**: `deliverables.status` → `approved`.
- **Aksi**: rilis escrow, tambah balance wallet Creator, catat transaksi `release`, update order.

### process-withdrawal (Admin)

- **Manual/Trigger**: admin approve.
- **Aksi**: set withdrawal `processed`, kurangi balance, kirim dana.

## Aturan Backend

- Minimum withdrawal amount (konfigurabel).
- Secret key Midtrans hanya disimpan sebagai environment variable Appwrite Function.
- Webhook Midtrans wajib valid signature dan nominal sebelum mengubah status payment.
- Handler webhook wajib idempotent terhadap notifikasi berulang.
- Payment yang sudah berstatus final (`paid`, `failed`, `expired`, `cancelled`) tidak boleh diturunkan statusnya oleh webhook berikutnya.
- `balance` tidak boleh negatif.
- Escrow hanya bisa diubah oleh system/admin — tidak ada akses user.
- Setiap mutasi saldo harus tercatat di `transactions`.
