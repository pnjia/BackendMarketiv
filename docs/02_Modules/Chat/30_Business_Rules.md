# Chat — Business Rules

## Satu Percakapan per Pasangan

- Hanya boleh ada **satu** `conversation` aktif per pasangan `umkmId` + `creatorId`.
- Sebelum membuat percakapan baru, cek apakah pasangan tersebut sudah punya conversation; jika ada, gunakan yang sudah ada.

## Denormalisasi

- `conversations` menyimpan `lastMessage` dan `lastMessageAt` (denormalisasi) agar daftar chat cepat di-query tanpa join ke `messages`.
- Setiap pesan baru memperbarui `lastMessage` & `lastMessageAt` pada conversation induk.
- Read receipt dan unread counter dikecualikan dari MVP chat dasar.

## Tipe Pesan

`text | image | file | offer | system`

- `text` → pesan negosiasi biasa.
- `image` → gambar referensi negosiasi, disimpan di Storage.
- `file` → dokumen referensi negosiasi, disimpan di Storage.
- `offer` → pesan merujuk custom offer yang dibuat UMKM (lihat `../Offers/`).
- `system` → dibuat oleh sistem, bukan user.

## Attachment Terbatas

- Attachment hanya untuk referensi negosiasi offer.
- Satu pesan hanya boleh membawa satu attachment.
- Image maksimal `5 MB`; format: `jpg`, `jpeg`, `png`, `webp`.
- File maksimal `10 MB`; format: `pdf`, `doc`, `docx`.
- File disimpan di Appwrite Storage bucket `chat-files`; dokumen message hanya menyimpan metadata dan `attachmentUrl`.
- Attachment kompleks, multi-file upload, voice note, dan file sharing umum dikecualikan dari MVP.

## Realtime & Akses

- Pengiriman pesan menggunakan Appwrite Realtime sederhana: `messages.create` memicu update UI penerima.
- Hanya **participant** (UMKM & creator pemilik conversation) yang dapat membaca/menulis pesan.
