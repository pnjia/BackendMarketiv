# Orders — Backend

## Appwrite Functions

### create-escrow-on-payment

- **Trigger**: `payments.status` `pending → paid`.
- **Aksi**: buat escrow, set order `escrow`, notifikasi Creator.

### release-escrow-on-approve

- **Trigger**: `deliverables.status` → `approved`.
- **Aksi**: rilis escrow, saldo ke wallet Creator, order `completed`, catat transaksi.

### upload-deliverable

- **Trigger**: dipanggil API `uploadDeliverable()`.
- **Aksi**:
  - Jika `source = storage`: panggil File Manager (`Users/validate-and-upload`) dengan `purpose = deliverable` dan `referenceId = orderId`, lalu catat `fileId` di deliverable.
  - Jika `source = external_url`: simpan URL langsung, tidak terikat kuota.
  - Buat deliverable dengan version auto-increment.

## Aturan Backend

- Deliverable version di-auto-increment per upload.
- Revision hanya dapat diminta jika `jumlah revisi < revisionLimit`.
- Validasi kepemilikan: hanya UMKM terkait yang dapat approve/reject.
- Deliverable `source = storage` wajib memiliki `fileId` yang valid dan milik creator seller.
- Deliverable `source = external_url` wajib protokol `https`.
