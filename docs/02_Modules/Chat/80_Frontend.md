# Chat — Frontend

## Halaman

### Chat List

- Daftar percakapan milik user.
- Tampilkan: nama lawan bicara, lastMessage, dan waktu pesan terakhir.
- Urut berdasarkan `lastMessageAt` DESC.

### Chat Room

- Riwayat pesan (infinite scroll / pagination).
- Input pesan teks dengan satu attachment opsional.
- Tombol "Buat Offer" (khusus UMKM).
- Real-time update saat pesan baru masuk.

## Komponen

- `ConversationList` — sidebar daftar chat.
- `MessageBubble` — bubble pesan dengan tipe (text/image/file/offer/system).
- `ChatInput` — input pesan teks + attachment picker terbatas.
- `OfferMessageCard` — kartu offer di dalam chat (tap untuk detail).
