# Users — Testing

## Profil

- Profil UMKM terbuat dengan data pre-filled dari register.
- Profil Creator terbuat dengan data pre-filled dari register.
- `isProfileCompleted` berubah menjadi `true` setelah onboarding.

## Update Profil

- Update field profil → tersimpan dengan benar.
- Upload logo/avatar → file tersimpan di Storage.
- Hanya pemilik yang dapat mengedit profilnya.

## Onboarding

- UMKM dapat menyelesaikan onboarding tanpa upload logo.
- Creator dapat menyelesaikan onboarding tanpa menambah portfolio.
- Logo UMKM dan portfolio Creator dapat ditambahkan dari halaman profil setelah onboarding.

## Social Accounts

- Creator menambah akun TikTok → tersimpan.
- Creator menghapus akun TikTok → terhapus.
- Creator tidak dapat menambah platform selain TikTok pada MVP.

## Discovery

- Pencarian Creator berdasarkan platform TikTok → hasil sesuai.
- Pencarian Creator berdasarkan kota → hasil sesuai.
- Creator dengan profil tidak lengkap tidak muncul di discovery (opsional).
- Data denormalisasi (`totalFollowers`, `totalOrders`, `rating`) akurat setelah event.
