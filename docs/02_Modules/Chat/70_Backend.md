# Chat — Backend

Dokumen ini khusus untuk Appwrite Functions, Realtime, dan aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Realtime

- Subscriber UI mendengarkan channel `conversations.{id}.messages`.
- Saat `messages.create`, event realtime dikirim ke seluruh participant.

## Appwrite Functions

### send-chat-notification

- **Trigger**: `messages.create`.
- **Aksi**: identifikasi penerima dari `conversations.umkm_id`/`creator_id`, buat record `notifications`, lalu kirim push notification via Appwrite Messaging jika user memiliki target push.
- **Catatan**: isi percakapan tetap bersumber dari collection `messages`; Messaging hanya kanal notifikasi.

### upload-chat-attachment

- **Trigger**: dipanggil frontend saat mengirim pesan `image`/`file`.
- **Execute**: authenticated users.
- **Input**: `{ conversationId, kind: "image"|"file", fileName, mimeType, sizeBytes, contentBase64 }`.
- **Aksi**:
  1. Validasi pemanggil adalah participant conversation (`umkm_id`/`creator_id`).
  2. Validasi `kind`, MIME, ekstensi, dan ukuran (image ≤ 5 MB; file ≤ 10 MB).
  3. Upload ke bucket `chat-files` dengan permission read/delete kedua participant.
  4. Kembalikan `{ attachmentUrl, attachmentName, attachmentSize, attachmentMime, fileId }`.
- **Catatan**: TIDAK memakai File Manager modul Users — tanpa `user_files` dan tanpa kuota `user_storage_usage`. Frontend memakai hasilnya untuk `sendMessage()`.

## Storage

- Bucket: `chat-files`.
- Permission: participant read/write.
- Image maksimal `5 MB`; format: `jpg`, `jpeg`, `png`, `webp`.
- File maksimal `10 MB`; format: `pdf`, `doc`, `docx`.
- Dokumen `messages` hanya menyimpan metadata dan `attachmentUrl`.

## Aturan Backend

- Validasi participant: hanya UMKM & creator yang terlibat dapat mengirim/membaca pesan.
- Unique constraint `umkm_id + creator_id` pada conversation.
- Tipe `offer`: validasi bahwa pengirim adalah UMKM dan `offerId` merujuk offer dalam conversation yang sama.
- Tipe `image`/`file`: validasi ukuran, MIME type, ekstensi, dan kepemilikan file di bucket `chat-files`.
- Read receipt, unread counter, typing indicator, multi-file upload, dan voice note dikecualikan dari MVP chat dasar.
