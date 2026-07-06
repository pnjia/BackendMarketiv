# Chat — Backend

Dokumen ini khusus untuk Appwrite Functions, Realtime, dan aturan backend. Kontrak pemanggilan dari frontend dibahas di [60_API.md](60_API.md).

## Appwrite Realtime

- Subscriber UI mendengarkan channel `conversations.{id}.messages`.
- Saat `messages.create`, event realtime dikirim ke seluruh participant.

## Appwrite Functions

### update-conversation-on-message

- **Trigger**: `messages.create`.
- **Aksi**: update `lastMessage` dan `lastMessageAt` pada conversation induk.

## Storage

- Bucket: `chat-attachments`.
- Permission: participant read/write.
- Image maksimal `5 MB`; format: `jpg`, `jpeg`, `png`, `webp`.
- File maksimal `10 MB`; format: `pdf`, `doc`, `docx`.
- Dokumen `messages` hanya menyimpan metadata dan `attachmentUrl`.

## Aturan Backend

- Validasi participant: hanya UMKM & creator yang terlibat dapat mengirim/membaca pesan.
- Unique constraint `umkmId + creatorId` pada conversation.
- Tipe `offer`: validasi bahwa pengirim adalah UMKM dan `offerId` merujuk offer dalam conversation yang sama.
- Tipe `image`/`file`: validasi ukuran, MIME type, ekstensi, dan kepemilikan file di bucket `chat-attachments`.
- Read receipt, unread counter, typing indicator, multi-file upload, dan voice note dikecualikan dari MVP chat dasar.
