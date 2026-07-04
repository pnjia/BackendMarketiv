# Chat — Overview

Chat menghubungkan UMKM dan Content Creator secara realtime menggunakan **Appwrite Realtime**. Dalam MVP, chat dibatasi sebagai ruang negosiasi sebelum kesepakatan dibuat lewat custom offer.

## Inti

- Komunikasi dua arah UMKM ↔ Creator dalam satu **conversation** (ruang chat).
- Pesan dikirim realtime sederhana: saat `messages.create`, subscriber UI penerima langsung ter-update tanpa polling.
- Attachment dasar tersedia untuk referensi negosiasi, dengan batas ukuran dan format yang ketat.
- MVP tidak mencakup typing indicator, read receipt, multi-file upload, voice note, atau fitur chat sosial lanjutan.

## Tipe Pesan

- `text` — pesan teks biasa.
- `image` — gambar referensi negosiasi (URL ke Storage).
- `file` — dokumen referensi negosiasi (URL ke Storage).
- `offer` — referensi custom offer yang dikirim UMKM di dalam chat (lihat `../Offers/`).
- `system` — pesan sistem (mis. notifikasi status).

## Tautan

- Custom offer yang dibuat di dalam percakapan → `../Offers/`.
- Skema & relasi koleksi → `50_Database.md`.
