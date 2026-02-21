# Veri modeli (özet)

Kayıt olan her firma **veritabanında kalıcı** tutulur ve **role göre ayrıştırılır**. Bu hem teknik zorunluluk hem de vizyonla uyumlu mimari karardır.

---

## 1. Ana tablo: firmalar

| Alan | Açıklama |
|------|----------|
| `id` | Firma ID (PK) |
| `company_name` | Firma ünvanı |
| `tax_number` | Vergi no (VKN), 10 hane |
| `role` | **BUYER** veya **PROVIDER** — kritik ayrım |
| `contact_name` | Yetkili ad soyad |
| `email` | E-posta (giriş için) |
| `phone` | Telefon |
| `status` | active / pending / suspended |
| `created_at` | Kayıt tarihi |

**Not:** Şifre ayrı güvenli tabloda veya hash’lenmiş saklanır; bu özette detay yok.

---

## 2. Role göre detay tabloları

### 2.1 Alıcı (Buyer)

**buyer_profiles** (company_id = BUYER olan firmalar için)

| Alan | Açıklama |
|------|----------|
| `company_id` | FK → companies.id |
| `city` / `district` | İl, İlçe (lokasyon) |
| `sector` | (Opsiyonel) Sektör |
| `typical_service_type` | (Opsiyonel) Sık talep ettiği hizmet türü |

Alıcıya ait **talepler** ayrı tabloda: `requests` (request_id, company_id [buyer], bütçe min/max, hizmet türü, lokasyon, personel sayısı, vb.).

### 2.2 Sağlayıcı (Provider)

**provider_profiles** (company_id = PROVIDER olan firmalar için)

| Alan | Açıklama |
|------|----------|
| `company_id` | FK → companies.id |
| `service_cities` | Hizmet verilen şehirler (array veya ilişkili tablo) |
| `max_capacity` | Maks. personel kapasitesi |
| `service_types` | Fiziki, Özel, Mobil, Etkinlik vb. |
| `min_job_size` | Min aylık iş büyüklüğü (TL) — eşleştirme |
| `max_job_size` | Max aylık iş büyüklüğü (TL) — eşleştirme |
| `license_status` | Yetki belgesi var mı (evet/hayır) |
| `documents_uploaded` | Belgeler yüklendi mi |
| `rating` / `review_count` | (İleride) Puan ve yorum sayısı |

Sağlayıcıya ait **teklifler** ayrı tabloda: `offers` (offer_id, request_id, company_id [provider], amount, açıklama, vb.).

---

## 3. Admin tarafında ayrım

- **Alıcılar** → Sadece `role = BUYER` olan firmalar + buyer_profiles (ve isteğe bağlı talep sayıları).
- **Sağlayıcılar** → Sadece `role = PROVIDER` olan firmalar + provider_profiles (kapasite, şehirler, teklif/iş sayıları).

İki liste **ayrı sayfalarda** sunulur; tek “firma listesi” ile rolü karıştırmamak vizyonla uyumludur.

Detaylı admin ekranları: **docs/ADMIN-PANEL-WIREFRAME.md**.
