# Chat — Concepts

## Istilah

- **Conversation** — ruang chat antara satu UMKM dan satu Content Creator.
- **Realtime** — mekanisme pengiriman pesan instan via Appwrite Realtime tanpa polling.
- **Message Type** — tipe pesan MVP: `text`, `image`, `file`, `offer`, `system`.
- **Attachment** — gambar atau dokumen ringan sebagai referensi negosiasi offer; disimpan di Storage bucket `chat-attachments`.

## Konsep

- Satu percakapan per pasangan UMKM+Creator (unique constraint).
- Pesan `offer` merujuk ke custom offer di modul Offers.
- Pesan `system` dibuat otomatis oleh sistem (bukan user).
- Attachment dibatasi untuk konteks negosiasi offer, bukan file sharing umum.
- Denormalisasi `lastMessage` pada conversation untuk performa daftar chat.
