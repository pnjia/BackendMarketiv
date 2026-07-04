# Modul Chat

Chat dasar untuk negosiasi offer antara UMKM dan Content Creator via Appwrite Realtime. Satu percakapan per pasangan UMKM+creator; MVP mendukung pesan `text`, `image`, `file`, `offer`, dan `system` dengan attachment terbatas. Modul ini memiliki data `conversations` dan `messages`.

## Daftar Dokumen

- `10_Overview.md` — Gambaran chat dasar negosiasi offer & tipe pesan MVP.
- `20_Concepts.md` — Istilah & konsep domain Chat.
- `30_Business_Rules.md` — Aturan satu percakapan per pasangan, denormalisasi lastMessage, tipe pesan MVP, attachment terbatas, realtime sederhana.
- `40_User_Flow.md` — Alur memulai percakapan, kirim pesan, buat offer dari chat.
- `50_Database.md` — Skema, relasi (conversation 1—* messages), dan index koleksi `conversations`, `messages`.
- `60_API.md` — Kontrak Chat Service (createConversation, sendMessage) & alur realtime.
- `70_Backend.md` — Appwrite Realtime, Storage, validasi backend.
- `80_Frontend.md` — Halaman & komponen chat.
- `90_Events.md` — Event chat & tautan ke modul Offers.
- `100_Testing.md` — Skenario uji conversation, pesan, realtime, offer.
