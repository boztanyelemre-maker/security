# Admin Liste Ekranları — UI Spec (Ekran 15A–15D + Ödeme + Risk Flags)

Her liste ekranında: **üst bar (filtreler)**, **sort**, **tablo kolonları**, **satır aksiyonları**, **detay drawer**. Figma çizimini birebir hızlandırır.

**Ortak bileşenler:** Bölüm 7.

---

## 1) Admin Requests List (Ekran 15A)

### Üst bar — Filtreler

| Filtre | Tip | Parametre | Not |
|--------|-----|-----------|-----|
| Arama | text | `q` | “Buyer adı / Request ID” |
| Durum | dropdown | `status` | DRAFT yok; default PUBLISHED / UNDER_REVIEW / CLOSED |
| Şehir | dropdown | `city_id` | |
| Risk | dropdown | `risk` | CRITICAL / HIGH / MEDIUM / LOW |
| Tarih aralığı | from – to | `from`, `to` | |
| | **Reset** / **Apply** | | |

### Sort dropdown

- `created_at` (default desc)
- `offers_count`
- `risk_rank`
- `published_at`
- `buyer`
- `city`

### Tablo kolonları

| Kolon | İçerik |
|-------|--------|
| Risk | Badge — CRITICAL / WATCH / NORMAL (rank’e göre) |
| Request ID | Kısa + kopyala ikon |
| Buyer | Firma adı |
| Şehir | |
| Site type | |
| Personel | |
| Offers count | |
| Status | |
| Created at | |
| Actions | |

### Satır aksiyonları

- **Detay** (drawer/modal) → `/admin/requests/{id}`
- **UNDER_REVIEW yap**
- **Kapat (CLOSED)**
- (ops) **Audit logs**

### Detay Drawer (mini)

- Request özet + bütçe (admin görür)
- Offers mini list (en son 5)
- Açık risk flag’ler
- Not alanı + status değiştir

---

## 2) Admin Offers List (Ekran 15B)

### Filtreler

| Filtre | Tip | Parametre |
|--------|-----|-----------|
| Arama | text | `q` — “Buyer / Provider / offer id / request id” |
| Status | dropdown | SUBMITTED / HIDDEN_BY_ADMIN / REJECTED / ACCEPTED |
| Budget Fit | dropdown | IN / EDGE |
| Risk | dropdown | NORMAL / WATCH / CRITICAL (veya risk_rank) |
| Tarih aralığı | from – to | `from`, `to` |

### Sort

- `created_at` (default)
- `submitted_at`
- `monthly_offer_try`
- `risk_rank`
- `buyer`
- `provider`

### Kolonlar

| Kolon | İçerik |
|-------|--------|
| Risk | Badge WATCH / CRITICAL |
| Offer ID | Kısa |
| Buyer | |
| Provider | |
| Budget fit band | IN / EDGE |
| Offer amount | (admin görür) |
| Status | |
| Submitted at | |
| Actions | |

### Actions

- **Detay** (drawer) → offer + request + provider snapshot
- **Hide** (alıcıdan gizle)
- **Reject**
- (ops) **Flag ekle** (manuel risk flag)

### Detay Drawer

- Teklif kırılımı (MVP: amount + not)
- Compliance göstergeleri (OK / PENDING / FAIL)
- Açık risk flags
- Audit

---

## 3) Admin Buyers List (Ekran 15C)

### Filtreler

| Filtre | Tip | Parametre |
|--------|-----|-----------|
| Arama | text | `q` — legal_name, tax_id |
| Status | dropdown | ACTIVE / REVIEW / SUSPENDED |
| Risk | dropdown | payment_behavior_band — NORMAL / WATCH / CRITICAL |

### Sort

- `payment_band_rank` (desc) — default öneri: kritik üstte
- `legal_name` (asc)
- `unpaid_total` (desc)
- `late_total` (desc)

### Kolonlar

| Kolon | İçerik |
|-------|--------|
| Payment risk badge | CRITICAL / WATCH / NORMAL |
| Buyer name | |
| Tax ID | |
| Status | |
| Late payments (90d) | |
| Unpaid jobs (90d) | |
| Unpaid 90+ (90d) | |
| Open requests | |
| Actions | |

### Actions

- **Detay**
- **REVIEW’e al**
- **SUSPEND**
- (ops) **Not ekle**

### Detay Drawer

- Son 10 payment report (approved/pending)
- “Approved stats” kartı
- Açık risk flags
- Aktif talepler listesi linki

---

## 4) Admin Providers List (Ekran 15D)

### Filtreler

| Filtre | Tip | Parametre |
|--------|-----|-----------|
| Arama | text | `q` — legal_name, tax_id |
| Status | dropdown | ACTIVE / REVIEW / SUSPENDED |
| Risk | dropdown | provider_risk_band — NORMAL / WATCH / CRITICAL |
| Profile completion | slider veya dropdown | 0–50 / 51–99 / 100 |

### Sort

- `too_low_open_30d` (desc) — default öneri
- `provider_band_rank` (desc)
- `profile_completion_pct` (asc)
- `legal_name` (asc)

### Kolonlar

| Kolon | İçerik |
|-------|--------|
| Risk badge | |
| Provider name | |
| Tax ID | |
| Profile completion % | |
| SGK+tax on time | true/false ikon |
| Too low offers (30d) | |
| Status | |
| Actions | |

### Actions

- **Detay**
- **REVIEW** / **SUSPEND**
- (ops) **Matching’i yeniden çalıştır** — backend tetikler
- (ops) **Manual flag**

### Detay Drawer

- Profil snapshot (lisanslar, 5188, şehirler)
- Son teklifler (10)
- Too-low trend mini (v2 chart)
- Risk flags + admin review geçmişi

---

## 5) Admin Payment Reports Queue (Ödeme Davranışı İnceleme)

### Filtreler

| Filtre | Tip | Parametre |
|--------|-----|-----------|
| State | dropdown | pending / reviewed |
| Reported status | dropdown | PAID_LATE / UNPAID / PAID_ON_TIME |
| Buyer search | text | `buyer_q` |
| Date range | from – to | |

### Sort

- `created_at` (desc) default
- `decided_at` (desc)

### Kolonlar

| Kolon | İçerik |
|-------|--------|
| State badge | PENDING / REVIEWED |
| Buyer | |
| Provider | |
| Reported status | |
| Band | delay_band / unpaid_band |
| Created at | |
| Decision | (reviewed ise) |
| Actions | |

### Actions

- **Detay** + **Approve / Reject / Need more signal**
- **Buyer profile**e git

### Detay Drawer

- Engagement özet
- Provider comment
- Buyer geçmiş sinyali (son 90 gün)
- Karar butonları

---

## 6) Admin Risk Flags List

### Filtreler

| Filtre | Tip | Parametre |
|--------|-----|-----------|
| status | dropdown | OPEN / RESOLVED |
| severity | dropdown | LOW / MEDIUM / HIGH / CRITICAL |
| entity_type | dropdown | OFFER / REQUEST / BUYER / PROVIDER |
| q | text | flag_type veya entity_id |

### Sort

- `created_at` desc (default)
- `severity` desc

### Kolonlar

| Kolon | İçerik |
|-------|--------|
| Severity badge | |
| Flag type | |
| Entity type | |
| Entity id | Kısa |
| Status | |
| Created at | |
| Actions | |

### Actions

- **Resolve**
- **Detaya git** (entity drawer)

---

## 7) UI ortak bileşenler (tüm admin listeleri)

| Bileşen | Spec |
|---------|------|
| **Table** | Sticky header, row hover |
| **Badge** | NORMAL (gri), WATCH (turuncu), CRITICAL (kırmızı) |
| **Drawer** | Sağdan açılan detay paneli |
| **Bulk actions** | (v2) Çoklu seçim |
| **Empty state** | “Filtreleri genişlet” |

---

## Sonraki adım (opsiyonel)

Bu Admin UI spec’ten devam edip **Figma’da 1:1 komponent hiyerarşisi** (Frame → Section → Component → Variant) çıkarılabilir.

---

*Liste query’leri + mock’lar: [ADMIN-LIST-QUERIES.md](ADMIN-LIST-QUERIES.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Figma brief: [FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md](FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md).*
