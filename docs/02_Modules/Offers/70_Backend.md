# Offers — Backend

## Appwrite Functions

### create-order-from-offer

- **Trigger**: `offers.status` `pending → accepted`.
- **Aksi**: buat dokumen `orders` (status `pending_payment`), notifikasi UMKM untuk pembayaran.

## Aturan Backend

- Validasi: hanya UMKM yang dapat membuat offer.
- Validasi: hanya Creator (peserta percakapan) yang dapat accept/reject.
- Saat accept, value `price` dari offer digunakan sebagai `amount` order.
