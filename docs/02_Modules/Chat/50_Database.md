# Chat — Database

Sumber kebenaran skema koleksi milik modul Chat. Satu fakta = satu lokasi.

---

## conversations

Ruang chat antara satu UMKM dan satu creator. Relasi: Conversation (1) → Messages (N).

| Attribute          | Type    | Required | Catatan                              |
| ------------------ | ------- | -------- | ------------------------------------ |
| umkmId             | string  | yes      | FK → users                           |
| creatorId          | string  | yes      | FK → users                           |
| lastMessage        | string  | no       | denormalisasi pesan terakhir         |
| lastMessageAt      | string  | no       | denormalisasi waktu pesan terakhir   |

**Index**: `umkmId`, `creatorId`, `lastMessageAt DESC`.

**Constraint**: kombinasi `umkmId + creatorId` unik (satu percakapan per pasangan — lihat `30_Business_Rules.md`).

**Permission**: Participant only.

---

## messages

Pesan dalam sebuah percakapan. Relasi: Conversation (1) → Messages (N).

| Attribute      | Type   | Required | Catatan                            |
| -------------- | ------ | -------- | ---------------------------------- |
| conversationId | string | yes      | FK → conversations                 |
| senderId       | string | yes      | FK → users                         |
| type           | enum    | yes      | `text\|image\|file\|offer\|system` |
| content        | string  | no       | isi pesan (untuk `text`/`system`)    |
| offerId        | string  | no       | FK → offers untuk tipe `offer`       |
| attachmentUrl  | string  | no       | URL Storage untuk `image`/`file`     |
| attachmentName | string  | no       | nama file asli                       |
| attachmentSize | integer | no       | ukuran file dalam byte               |
| attachmentMime | string  | no       | MIME type file                       |

**Index**: `conversationId`, `createdAt DESC`, `senderId`.

**Permission**: Participant only.

> Attachment disimpan di Storage bucket `chat-attachments` dan dibatasi oleh aturan di `30_Business_Rules.md`. Read receipt dan unread counter dikecualikan dari MVP chat dasar.
