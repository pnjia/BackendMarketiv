# AI — Business Rules

## Brief Generator

**Input** (dari UMKM & Sistem):

- `type`: Tipe campaign (`ugc` atau `clipping`)
- `materials`: Daftar atau link aset referensi produk (`campaign_assets`)
- Nama produk
- Deskripsi produk
- Target market
- Goal / tujuan campaign

**Output terstruktur** (disimpan ke `campaign_briefs` di modul Campaigns):

- `objective`: string
- `contentAngle`: string (disesuaikan tipe: *Green Screen/Voiceover/Slideshow* untuk `ugc`, atau *Highlight/Repurposing/Editing* untuk `clipping`)
- `cta`: string
- `briefDetail`: string (arah kreatif, visual, pesan kunci, arahan penggunaan aset produk/link)
- `doAndDont`: { do: string[], dont: string[] }

**Aturan**:

- **Kustomisasi Tipe & Aset Digital**: AI wajib membedakan instruksi berdasarkan tipe campaign dan aset digital yang dilampirkan (tanpa pengiriman sampel produk fisik):
  - Jika `ugc`: arahkan creator untuk membuat video TikTok dari 0 menggunakan aset foto/video produk (mis. efek Green Screen, Voiceover, atau Slideshow Montage).
  - Jika `clipping`: arahkan creator untuk memotong/mengedit ulang video panjang dari link sumber yang dilampirkan dengan *dynamic subtitle* dan *hook*.
- AI hanya menghasilkan *draft* brief. UMKM dapat mengedit sebelum menyimpan.
- Brief disimpan di database Campaigns (`../Campaigns/50_Database.md`).

---

## Fraud Detection

**Validasi yang dijalankan** terhadap submission:

- URL valid (format benar).
- URL tersedia / dapat diakses (tidak 404).
- Tidak private.
- Tidak duplikat.
- Cocok dengan platform yang diklaim.

**Output**: `fraudScore` (0–100) + level risiko.

### Threshold

| Skor   | Risiko | Status     | Aksi          |
| ------ | ------ | ---------- | ------------- |
| 0–30   | Low    | `safe`     | Auto-approve  |
| 31–70  | Medium | `review`   | Manual review |
| 71–100 | High   | `rejected` | Auto-reject   |

> Field hasil fraud (`score`, `result`, `reason`) disimpan di `../Campaigns/50_Database.md` (`fraud_checks`); ringkasan (`fraudScore`, `fraudStatus`) ada di `campaign_submissions`. Modul AI menautkan, tidak mendefinisikan ulang.
