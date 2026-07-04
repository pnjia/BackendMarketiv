# Workflow: Rate Card Order (Escrow)

## Purpose

Alur pesanan rate card dengan escrow: UMKM menemukan creator, lalu memesan langsung (Direct Order) atau bernegosiasi via chat (Custom Offer) → order → payment → escrow hold → deliverable → approve → release escrow ke wallet creator.

## Modules Involved

- [RateCards](../02_Modules/RateCards/00_Index.md) — discovery creator & rate card.
- [Chat](../02_Modules/Chat/00_Index.md) — percakapan UMKM ↔ creator (untuk jalur Custom Offer).
- [Offers](../02_Modules/Offers/00_Index.md) — custom offer & accept/reject (untuk jalur Custom Offer).
- [Orders](../02_Modules/Orders/00_Index.md) — aggregate order, deliverable, revisi.
- [Users](../02_Modules/Users/00_Index.md) — file manager & storage kuota (upload deliverable).
- [Payments](../02_Modules/Payments/00_Index.md) — payment, escrow, wallet.

## Trigger

UMKM `Creator Discovery` → buka profil → lihat rate card → pilih jalur pemesanan.

## Step-by-step Flow

### Jalur A: Direct Order (Tanpa Negosiasi)

1. **RateCards** — UMKM browse/search/filter creator, buka profil, lihat rate card aktif.
2. **RateCards** — UMKM pilih paket → klik "Pesan".
3. **Orders** — Buat `orders` status `pending_payment` dari paket rate card; **Notifications** notify UMKM.
4. **Payments** — UMKM bayar via gateway → `payments.status pending → paid`.
5. **Event `payments.status (pending→paid)`** memicu `create-escrow`: buat `escrows` (`status: locked`), `wallets.escrowBalance += amount`, order → `in_progress`.
6. **Orders** — Creator `uploadDeliverable()` via File Manager (`purpose = deliverable`) atau external URL. Event `deliverables.create` → `notify-client-review` → notify UMKM.
7. **Orders** — UMKM review: `approveDeliverable()` atau `requestRevision()` (creator reupload → review lagi).
8. **Event `deliverables.status (revision_requested→approved)`** memicu `release-escrow`.
9. **Payments** — Release escrow: `escrowBalance → 0`, saldo masuk `available` creator, buat transaction history, order → `completed`.

### Jalur B: Custom Offer (Dengan Negosiasi)

1. **RateCards** — UMKM browse/search/filter creator, buka profil, lihat rate card aktif.
2. **Chat** — UMKM `createConversation()` & `sendMessage()` (realtime) untuk negosiasi.
3. **Offers** — UMKM `createOffer()` (judul campaign, brief, deadline, rate card, harga, catatan). Status `pending`.
4. **Offers** — Creator review → `acceptOffer()` atau `rejectOffer()`.
5. **Event `offers.status (pending→accepted)`** memicu `create-order`.
6. **Orders** — Buat `orders` status `pending_payment`; **Notifications** notify UMKM.
7. **Payments** — UMKM bayar via gateway → `payments.status pending → paid`.
8. **Event `payments.status (pending→paid)`** memicu `create-escrow`: buat `escrows` (`status: locked`), `wallets.escrowBalance += amount`, order → `in_progress`.
9. **Orders** — Creator `uploadDeliverable()` via File Manager (`purpose = deliverable`) atau external URL. Event `deliverables.create` → `notify-client-review` → notify UMKM.
10. **Orders** — UMKM review: `approveDeliverable()` atau `requestRevision()` (creator reupload → review lagi).
11. **Event `deliverables.status (revision_requested→approved)`** memicu `release-escrow`.
12. **Payments** — Release escrow: `escrowBalance → 0`, saldo masuk `available` creator, buat transaction history, order → `completed`.

## Events / Functions

- `offers.status (pending→accepted)` → `create-order` (Jalur B)
- `payments.status (pending→paid)` → `create-escrow`
- `deliverables.create` → `notify-client-review`
- `deliverables.status (revision_requested→approved)` → `release-escrow`
- Lihat: [`../02_Modules/Orders/90_Events.md`](../02_Modules/Orders/00_Index.md), [`../02_Modules/Payments/90_Events.md`](../02_Modules/Payments/00_Index.md).

## Edge Cases

- Cancel sebelum bayar → order closed langsung.
- Request cancellation setelah bayar → admin review → refund/reject.
- Revisi berulang (lihat aturan limit di [Orders](../02_Modules/Orders/00_Index.md)).
- Sengketa order → lihat [60_Dispute.md](60_Dispute.md).
- **Upload deliverable via File Manager ditolak** jika kuota creator penuh. Creator harus menghapus file lama atau beralih ke external URL.

## Links

- [RateCards](../02_Modules/RateCards/00_Index.md)
- [Chat](../02_Modules/Chat/00_Index.md)
- [Offers](../02_Modules/Offers/00_Index.md)
- [Orders](../02_Modules/Orders/00_Index.md)
- [Users](../02_Modules/Users/00_Index.md)
- [Payments](../02_Modules/Payments/00_Index.md)
- [Dispute workflow](60_Dispute.md)
