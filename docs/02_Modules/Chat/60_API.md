# Chat — API

Kontrak Chat Service. Skema di `50_Database.md`; aturan di `30_Business_Rules.md`.

---

## Chat Service

### createConversation()

- **Input**: `{ umkmId, creatorId }`
- **Proses**: cek apakah pasangan sudah punya conversation; jika belum, buat dokumen `conversations` baru. Mengembalikan conversation yang ada/baru.
- **Akses**: Participant (UMKM / Creator).

### sendMessage()

- **Input**: `{ conversationId, type?, content?, offerId?, attachmentUrl?, attachmentName?, attachmentSize?, attachmentMime? }` — `type` default `text`.
- **Proses**: validasi participant, tipe pesan, dan batas attachment; buat dokumen `messages`; update `lastMessage` & `lastMessageAt` pada conversation induk.
- **Akses**: Participant.

---

## Realtime

```text
Message Sent (messages.create)
↓
Realtime Event
↓
Receiver UI Update
```

UI penerima subscribe ke channel dokumen `messages` percakapan terkait; saat ada pesan baru, UI langsung ter-update tanpa polling.

> Pesan bertipe `offer` merujuk custom offer yang dibuat UMKM — lihat `../Offers/`.
> Pesan bertipe `image`/`file` memakai file yang sudah di-upload ke bucket `chat-attachments` dan harus lolos whitelist ukuran/format.
