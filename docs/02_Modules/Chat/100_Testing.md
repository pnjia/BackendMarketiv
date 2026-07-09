# Chat — Testing

## Service Layer (`chat.service.ts`)

### Conversation (`createConversation`)

- Membuat conversation baru untuk pasangan unik → dokumen `conversations` terbuat.
- Membuat conversation untuk pasangan yang sudah ada → mengembalikan conversation existing (tanpa buat baru).
- `umkmId` / `creatorId` kosong → throw `ChatServiceError('validation', ...)`.
- User bukan `umkmId` atau `creatorId` → throw `ChatServiceError('forbidden', 'Kamu tidak dapat membuat percakapan untuk user lain.')`.

### Pesan (`sendMessage`)

- Kirim pesan text → dokumen `messages` tersimpan + `conversations.last_message`/`last_message_at` di-update.
- Type default `text` jika tidak diberi.
- Pesan `text` tanpa `content` → throw `ChatServiceError('validation', 'Pesan tidak boleh kosong.')`.
- Kirim pesan image valid → message tersimpan dengan `attachmentUrl` (upload dilakukan lewat function `upload-chat-attachment` SEBELUM `sendMessage` dipanggil).
- Kirim pesan file valid → message tersimpan dengan `attachmentUrl`.
- Kirim pesan sebagai non-participant → throw `ChatServiceError('forbidden', 'Kamu bukan participant percakapan ini.')`.
- `conversationId` kosong → throw `ChatServiceError('validation', 'Conversation ID wajib diisi.')`.

Catatan: Validasi format/size attachment (image ≤5MB, file ≤10MB) dilakukan di Appwrite Function `upload-chat-attachment`, bukan di `chat.service.ts`.

## Offer dari Chat

- UMKM membuat offer (via `offer.service.ts` `createOffer`) → pesan tipe `offer` terkirim + dokumen `offers` terbuat.
- Creator tidak bisa membuat offer (tombol tidak tampil / `createOffer` hanya izinkan `conversation.umkm_id`).

## Realtime

- UI penerima update dalam 1 detik setelah pesan dikirim (channel `conversations.{id}.messages`).

## Notifikasi

- Pesan baru memicu Appwrite Function `send-chat-notification` → buat record `notifications` untuk participant penerima.
- Push notification Appwrite Messaging terkirim jika user penerima memiliki target push yang valid.
- Kegagalan push tidak membatalkan penyimpanan pesan atau pembuatan notifikasi in-app.

## Di Luar MVP

- Multi-file upload tidak tersedia.
- Read receipt, unread counter, dan typing indicator tidak tersedia.
