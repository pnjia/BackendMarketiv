# Offers — Testing

## Pembuatan Offer

- UMKM membuat offer dalam conversation → offer tersimpan.
- Creator mencoba membuat offer → ditolak (hanya UMKM).
- Offer dengan field wajib kosong → error validasi.

## Accept / Reject

- Creator accept → status `accepted`, order terbuat.
- Creator reject → status `rejected`.
- UMKM accept/reject offer milik sendiri → ditolak (hanya Creator).

## Order Creation

- Offer accepted → otomatis membuat order dengan `amount = price`.
- Order memiliki referensi `offerId` yang benar.
