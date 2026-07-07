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

## Storage

- Bucket: `chat-attachments`.
- Permission: participant read/write.
- Image maksimal `5 MB`; format: `jpg`, `jpeg`, `png`, `webp`.
- File maksimal `10 MB`; format: `pdf`, `doc`, `docx`.
- Dokumen `messages` hanya menyimpan metadata dan `attachmentUrl`.

## Aturan Backend

- Validasi participant: hanya UMKM & creator yang terlibat dapat mengirim/membaca pesan.
- Unique constraint `umkm_id + creator_id` pada conversation.
- Tipe `offer`: validasi bahwa pengirim adalah UMKM dan `offerId` merujuk offer dalam conversation yang sama.
- Tipe `image`/`file`: validasi ukuran, MIME type, ekstensi, dan kepemilikan file di bucket `chat-attachments`.
- Read receipt, unread counter, typing indicator, multi-file upload, dan voice note dikecualikan dari MVP chat dasar.
