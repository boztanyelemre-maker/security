# MVP tam kapsamlı çalışma listesi

MVP = ürünün uçtan uca çalışması + ölçülebilir olması + güvenli/sağlam olması için gereken **minimum ama eksiksiz** iş paketi. v2’ye bırakılanlar ayrıca işaretlendi.

---

## 1. Ürün kapsamı ve kurallar

- Rollerin net tanımı: **BUYER** / **PROVIDER** / **ADMIN**
- **Bütçe gizliliği** kuralı (sağlayıcı görmez)
- Sağlayıcı **“profil tamamlamadan teklif veremez”** (kalite)
- Talep alanları: teklif için gerekli minimum veri
- Durum yönetimi: DRAFT / PUBLISHED / CLOSED / SUSPENDED

**Çıktı:** PRD-lite (1–2 sayfa) + karar listesi

---

## 2. UX/UI tasarım paketi (Figma)

- Screen inventory (MVP’de 15 ekran)
- Component set: Button, Input, Card, Table, Badge, Modal
- Form validasyon durumları: hata / başarılı / loading / empty
- Dashboard şablonları: buyer, provider, admin
- Responsive: mobil/desktop minimum

**Çıktı:** Figma dosyası + tıklanabilir prototype

---

## 3. Backend (API) — uçtan uca akış

**Auth**

- POST /auth/register-buyer
- POST /auth/register-provider
- POST /auth/login
- POST /auth/logout (opsiyonel token invalidation)

**Buyer**

- POST /requests (create draft)
- POST /requests/:id/publish
- GET /buyer/requests
- GET /buyer/requests/:id
- GET /buyer/requests/:id/offers

**Provider**

- PUT /provider/profile
- GET /provider/requests (eşleşenler)
- GET /provider/requests/:id
- POST /offers (teklif ver)

**Admin (MVP minimum)**

- GET /admin/buyers
- GET /admin/providers
- POST /admin/companies/:id/status (aktif/pasif)

**Çıktı:** Swagger/OpenAPI + Postman collection

---

## 4. Veritabanı ve yetkilendirme

- **8 tablo:** companies, users, provider_profiles, requests, request_budget_private, offers, admin_notes, audit_logs
- **RBAC:** API seviyesinde role kontrolü
- Unique constraints: email, tax_number
- Indexler: requests (city+status), offers (request_id), users (email)

**Çıktı:** Migration dosyaları + seed data

---

## 5. Eşleştirme mantığı (MVP basit)

MVP’de AI/puanlama şart değil; net filtre şart:

- Şehir uyumu
- Hizmet türü uyumu
- Kapasite yeterliliği
- Profil tamam mı?
- Bütçe: sadece sistem içi “uygun / uygun değil” bayrağı

**Çıktı:** Matching rules dokümanı + 10 test senaryosu

---

## 6. Frontend geliştirme

- **Public:** landing, register (rol seçimi), login
- **Buyer panel:** dashboard, create request, request detail, offers list
- **Provider panel:** dashboard, profile, matched requests, request detail, offer form
- **Admin panel:** login, dashboard, buyers/providers list, status change

**Çıktı:** Prod-ready web app (en az 1 tarayıcıda stabil)

---

## 7. Operasyon ve admin akışları (MVP)

- Admin: alıcı/sağlayıcı listeleri
- Admin: firma pasife alma / aktif etme + sebep kaydı
- Basit audit log (kim ne yaptı)
- İnceleme kuyruğu **v2** (MVP’de zorunlu değil)

**Çıktı:** Admin SOP (mini operasyon rehberi)

---

## 8. Güvenlik ve uyum (MVP minimum)

- Şifre hashleme / token güvenliği
- Rate limit (login)
- Input validation / injection koruması
- Yetki kontrolü (URL ile kaçış yok)
- KVKK: Aydınlatma + Açık rıza metinleri (MVP seviyesinde)

**Çıktı:** Security checklist + KVKK sayfaları (basit)

---

## 9. Test paketi (olması gereken)

**Uçtan uca (E2E) 6 senaryo:**

1. Buyer kayıt → login → talep yayınla
2. Provider kayıt → profil tamamla → uygun talebi gör
3. Provider teklif ver → buyer teklifi gör
4. Buyer bütçe gir → provider bütçeyi göremez
5. Buyer provider sayfasına giremez (403)
6. Admin listelerde firmaları görür + pasife alır

**Çıktı:** Test senaryosu dokümanı + kabul kriterleri

---

## 10. Ölçümleme (MVP’de basit ama gerekli)

- Event log: register_success, request_published, offer_sent
- Funnel: kayıt → talep → teklif → shortlist/award (award v2 olabilir)
- Admin dashboard KPI’ları (basit)

**Çıktı:** 10–15 event listesi + basit ölçüm ekranı

---

## 11. Yayına alma (Deploy)

- Prod ortamı (domain, SSL)
- ENV yönetimi (secret)
- Database backup plan (basit)
- Error monitoring (basit)

**Çıktı:** Go-live checklist

---

## MVP’de mutlaka olması gereken son teslim

- Çalışan ürün (buyer ↔ provider ↔ admin)
- Bütçe gizliliği kanıtlı
- Rol yetkilendirme kanıtlı
- 6 E2E test senaryosu geçmiş
- Admin’de alıcı/sağlayıcı listeleri çalışıyor

---

## v2’ye bırak (MVP’yi şişirmemek için)

- Belgeler / uyumluluk inceleme kuyruğu (tam)
- Puanlama ve yorum
- Chat / mesajlaşma
- Ödeme / komisyon / üyelik
- Gelişmiş eşleştirme puanlaması (AI/score)

---

## MVP Work Breakdown Structure (WBS)

| # | İş paketi | Çıktı | Kabul kriteri |
|---|-----------|--------|----------------|
| 1 | Ürün kapsamı ve kurallar | PRD-lite + karar listesi | Roller, bütçe gizliliği, profil kuralı, durumlar yazılı |
| 2 | UX/UI (Figma) | Figma + clickable prototype | 15 MVP ekran, component set, responsive min |
| 3 | Backend API | OpenAPI + Postman | Auth, buyer, provider, admin endpoint’leri çalışıyor |
| 4 | Veritabanı + RBAC | Migration + seed | 8 tablo, RBAC API’da, indexler tanımlı |
| 5 | Eşleştirme mantığı | Matching rules + test senaryoları | Şehir/tür/kapasite/profil + uygun/uygun değil |
| 6 | Frontend | Web uygulaması | Public + buyer + provider + admin akışları çalışıyor |
| 7 | Admin operasyon | Admin SOP | Listeler + pasife al/aktif et + sebep + audit log |
| 8 | Güvenlik + KVKK | Checklist + KVKK sayfaları | Hash, rate limit, yetki, KVKK metinleri |
| 9 | Test paketi | E2E senaryoları + kabul kriterleri | 6 E2E senaryosu geçiyor, bütçe/403 kanıtlı |
| 10 | Ölçümleme | Event listesi + basit dashboard | Kayıt/talep/teklif event’leri + funnel |
| 11 | Deploy | Go-live checklist | Prod, SSL, ENV, backup, monitoring |

**Sorumlu:** İş paketine göre atanır (tek kişi veya ekip).

---

*Referans: [MVP-TANIM.md](MVP-TANIM.md), [SCREEN-INVENTORY.md](SCREEN-INVENTORY.md), [MVP-VERITABANI-TABLOLARI.md](MVP-VERITABANI-TABLOLARI.md).*
