# Chat — Testing

## Conversation

- Membuat conversation baru untuk pasangan unik → berhasil.
- Membuat conversation untuk pasangan yang sudah ada → mengembalikan conversation existing.

## Pesan

- Kirim pesan text → tersimpan, realtime terkirim.
- Kirim pesan image valid ≤ 5 MB → upload Storage berhasil, message tersimpan dengan `attachmentUrl`.
- Kirim pesan file valid ≤ 10 MB → upload Storage berhasil, message tersimpan dengan `attachmentUrl`.
- Kirim attachment dengan format/ukuran tidak valid → ditolak.
- Kirim pesan sebagai non-participant → ditolak.

## Offer dari Chat

- UMKM membuat offer → pesan tipe `offer` terkirim + dokumen offers terbuat.
- Creator tidak bisa membuat offer (tombol tidak tampil).

## Realtime

- UI penerima update dalam 1 detik setelah pesan dikirim.

## Di Luar MVP

- Multi-file upload tidak tersedia.
- Read receipt, unread counter, dan typing indicator tidak tersedia.
