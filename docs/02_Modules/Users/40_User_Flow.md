# Users — User Flow

## Onboarding UMKM

```text
Register → Login
↓
Onboarding Wizard
  ├─ Nama Usaha, Kategori (pre-filled dari register)
  ├─ Deskripsi, Kota, Alamat
  ├─ Social Media MVP (TikTok, opsional)
  └─ Upload Logo (opsional)
↓
isProfileCompleted = true
↓
Dashboard UMKM
```

## Onboarding Creator

```text
Register → Login
↓
Onboarding Wizard
  ├─ Display Name, Bio, Kota
  ├─ Avatar
  ├─ Tambah Akun Sosial TikTok (username, followers)
  └─ Tambah Portfolio (opsional: title, description, thumbnailUrl, portfolioUrl)
↓
isProfileCompleted = true
↓
Dashboard Creator
```

## File Manager

Setiap user (UMKM & Creator) memiliki akses ke File Manager untuk mengelola file yang diupload ke Appwrite Storage.

Logo UMKM dan portfolio Creator yang tidak diisi saat onboarding dapat ditambahkan atau diganti dari halaman profil.

```text
Buka File Manager
↓
Lihat daftar file (nama, ukuran, tujuan, status)
   └─ Indikator kuota: usedBytes / quotaBytes (default 100 MB)
↓
Upload File
  ├─ Pilih file (max 20 MB, total max 100 file)
  ├─ Pilih tujuan: campaign_asset / portfolio / chat_attachment / deliverable
  └─ Upload → sistem cek kuota → simpan ke Storage
↓
Hapus File
  ├─ Pilih file → delete
  └─ File dihapus dari Storage → kuota pulih
```

## Discovery Creator

```text
UMKM buka halaman Browse Creator
↓
Filter: platform MVP (TikTok), kota
↓
Hasil: card Creator (avatar, name, city, rating, followers)
↓
Klik profil → lihat detail + rate card
```
