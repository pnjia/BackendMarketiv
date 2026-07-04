# 03_Workflows — Index

Folder ini mendokumentasikan **kolaborasi lintas-modul** (end-to-end). Aturan internal satu modul tetap dimiliki dokumen modulnya — di sini hanya alur, urutan, event, data model terlibat, state transitions, validasi tiap langkah, dan titik serah-terima antar modul. Lihat modul terkait di [`../02_Modules/`](../02_Modules/).

## Prinsip Penulisan

- Setiap workflow mencakup: Purpose, Modules Involved, Data Model, Step-by-step Flow, State Transitions, Events/Functions, Validation Rules per Langkah, Notifikasi, Edge Cases.
- Gunakan dokumen ini sebagai panduan implementasi: tiap langkah di step-by-step bisa langsung dipetakan ke kode.

## Daftar Workflow

| # | Dokumen | Deskripsi | Modul Terlibat |
|---|---|---|---|
| 10 | [Registration](10_Registration.md) | Onboarding akun baru dari form registrasi sampai akun siap pakai (profil + wallet + storage + notifikasi). | Authentication, Users, Payments, Notifications |
| 20 | [Campaign PPV](20_Campaign_PPV.md) | Siklus campaign Pay-Per-View dari pembuatan, publish, claim, submission, fraud check, hingga reward. | Campaigns, AI, Users, Payments, Notifications |
| 30 | [RateCard Order](30_RateCard_Order.md) | Pesanan rate card dengan escrow: Direct Order (paket) dan Custom Offer (negosiasi) dari discovery sampai release escrow. | RateCards, Chat, Offers, Orders, Users, Payments, Notifications |
| 40 | [Submission Fraud](40_Submission_Fraud.md) | Pemeriksaan fraud submission campaign via AI & routing berdasarkan risk score: auto-approve, manual review admin, auto-reject. | Campaigns, AI, Notifications, Admin |
| 50 | [Withdrawal](50_Withdrawal.md) | Penarikan saldo creator dari wallet ke bank/e-wallet dengan validasi saldo, review admin, dan transfer manual. | Payments, Notifications, Admin |
| 60 | [Dispute](60_Dispute.md) | Sengketa order rate card & resolusi admin: creator win (release escrow), umkm win (refund), partial refund. | Orders, Payments, Chat, Users, Notifications, Admin |

## Relasi Antar Workflow

```text
10_Registration ──→ user punya wallet & profil
      │
      ├──→ 20_Campaign_PPV ──→ 40_Submission_Fraud (fraud check)
      │                              │
      │                              └──→ reward → Payments (wallet)
      │
      └──→ 30_RateCard_Order ──→ 60_Dispute (sengketa)
                 │                      │
                 └──→ escrow → Payments (wallet)
                                        │
                                        └──→ 50_Withdrawal (tarik saldo)
```

## Lihat Juga

- [Modul Index](../02_Modules/00_Index.md) — daftar lengkap modul.
- [Domain Model](../02_Modules/10_Domain_Model.md) — ERD lintas modul.
- [Global Glossary](../01_Global/10_Glossary.md) — istilah umum.
