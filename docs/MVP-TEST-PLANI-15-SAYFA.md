# MVP Test Planı — 15 Sayfa (manuel + temel backend)

**Şablon:** Her sayfa için Amaç, UI kontrolleri, Validasyon, Negatif/Güvenlik, Backend kontrolleri. Kalan 10 sayfa aynı şablonla eklenir.

**Çıktı formatı:** Her senaryo için Passed/Failed, hata mesajı, (ops) screenshot, (ops) request id.

---

## Ortak test ön koşulları

- **DB** çalışıyor (PostgreSQL)
- **Seed:** roles + en az 1 şehir + (ops) admin
- **Endpoint’ler hazır:**
  - POST /auth/register/buyer
  - POST /auth/register/provider
  - POST /auth/login
  - GET /auth/me

---

## 1) Ana Sayfa (Landing) — Ekran 1

**Amaç:** Kullanıcıyı doğru akışlara yönlendirmek.

### UI kontrolleri

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 1.1 | "Kayıt Ol" butonu | Rol seçimi sayfasına gider | ☐ |
| 1.2 | "Giriş Yap" butonu | Login sayfasına gider | ☐ |
| 1.3 | Footer linkler (KVKK / İletişim) (varsa) | Çalışır | ☐ |

### Negatif

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 1.4 | Çift tıklamada iki kez yönlenme olmaz | Debounce / tek yönlenme | ☐ |

### Backend

- Bu sayfada backend çağrısı yok.

---

## 2) Rol Seçimi Sayfası — Ekran 2

**Amaç:** Kayıt akışını Alıcı / Sağlayıcı olarak ayırmak.

### UI kontrolleri

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 2.1 | "Alıcıyım" seç → Devam | Alıcı kayıt sayfasına gider | ☐ |
| 2.2 | "Sağlayıcıyım" seç → Devam | Sağlayıcı kayıt sayfasına gider | ☐ |
| 2.3 | Geri butonu | Landing’e döner | ☐ |

### Validasyon

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 2.4 | Seçim yapmadan "Devam" (varsa) | Disabled veya hata | ☐ |

### Backend

- Bu sayfada backend çağrısı yok.

---

## 3) Alıcı Kayıt Sayfası — Ekran 3

**Zorunlu alanlar (MVP):** Firma ünvanı (legal_name), Vergi no (tax_id), Şehir (hq_city_id), Yetkili ad-soyad (full_name), E-posta (email), Şifre (password).

### Test senaryoları — Başarılı

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 3.1 | Formu doğru doldur → Gönder | 201 + token (veya login’e yönlendirme) | ☐ |
| 3.2 | organizations | org_type=BUYER kaydı oluştu | ☐ |
| 3.3 | users | Yeni user oluştu | ☐ |
| 3.4 | organization_users | Bağlantı oluştu | ☐ |
| 3.5 | user_roles | BUYER_USER atandı | ☐ |
| 3.6 | GET /auth/me (token ile) | buyer role + org döner | ☐ |

### Negatif / validasyon

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 3.7 | E-posta format hatalı | UI hata + API 400 | ☐ |
| 3.8 | Aynı email ile tekrar kayıt | 409 | ☐ |
| 3.9 | Aynı tax_id ile farklı firma kaydı | 409 | ☐ |
| 3.10 | Şifre çok kısa | 400 | ☐ |
| 3.11 | Zorunlu alan boş | 400 | ☐ |

### Güvenlik

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 3.12 | Şifre asla response’da dönmez | Response’da password yok | ☐ |
| 3.13 | (ops) Rate limit | v1’de olmasa da not | ☐ |

---

## 4) Sağlayıcı Kayıt Sayfası — Ekran 4

**Zorunlu alanlar (MVP):** Firma ünvanı, Vergi no, Şehir, Yetkili ad-soyad, E-posta, Şifre.  
**Kritik beyan:** "SGK + ücret vergisini düzenli öderim" checkbox. (ops) "5188 uyumluyum" checkbox.

### Test senaryoları — Başarılı

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 4.1 | Formu doldur (SGK/vergi işaretli) → Gönder | 201 + token (veya yönlendirme) | ☐ |
| 4.2 | organizations | org_type=PROVIDER oluştu | ☐ |
| 4.3 | provider_profiles | Satır oluşturuldu (completion % 0–20) | ☐ |
| 4.4 | pays_salary_sgk_tax_on_time | Checkbox true ise profile’a yazıldı | ☐ |
| 4.5 | user_roles | PROVIDER_USER atandı | ☐ |
| 4.6 | GET /auth/me | provider role + org döner | ☐ |

### Negatif

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 4.7 | SGK/vergi işaretlenmeden kayıt | Tercih: 400 (zorunlu) veya kayıt olur ama completion düşük / teklif veremez | ☐ |
| 4.8 | tax_id duplicate | 409 | ☐ |

---

## 5) Giriş Sayfası (Login) — Ekran 5

**Amaç:** Doğru kullanıcıyı doğru role göre sisteme almak.

### Test senaryoları — Başarılı

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 5.1 | Buyer email + şifre → Giriş | Token alır → Buyer dashboard’a gider | ☐ |
| 5.2 | Provider email + şifre → Giriş | Token alır → Provider dashboard’a gider | ☐ |
| 5.3 | GET /auth/me | Doğru org_type ve role döner | ☐ |

### Negatif

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 5.4 | Yanlış şifre | 401 | ☐ |
| 5.5 | Email (kayıtsız) | 401 | ☐ |
| 5.6 | Kullanıcı inactive | 403 | ☐ |

### Oturum

| # | Kontrol | Beklenen | Sonuç |
|---|---------|----------|--------|
| 5.7 | Token | localStorage veya cookie’ye yazılır | ☐ |
| 5.8 | Logout (varsa) | Token silinir | ☐ |

---

## Çıktı: Test raporu formatı (pratik)

Her senaryo için:

| Alan | Açıklama |
|------|----------|
| **Sayfa** | 1–15 (veya isim) |
| **Senaryo no** | Örn. 3.8 |
| **Sonuç** | Passed / Failed |
| **Hata mesajı** | Failed ise (API veya UI) |
| **Screenshot** | (ops) |
| **Request ID / log** | (ops) Backend log referansı |

**Özet:** Sayfa bazında Passed / Total; genel Passed / Total.

---

## Kalan 10 sayfa (şablon)

Aynı şablonla eklenecek. **Kesin liste:** [MVP-15-EKRAN-KESIN-LISTE.md](MVP-15-EKRAN-KESIN-LISTE.md).

- **6** — Alıcı Dashboard  
- **7** — Talep Oluşturma  
- **8** — Talep Detayı (Alıcı)  
- **9** — Sağlayıcı Dashboard  
- **10** — Sağlayıcı Profil  
- **11** — Uygun Talepler Listesi  
- **12** — Talep Detayı (Sağlayıcı) & Teklif Ver  
- **13** — Admin Login  
- **14** — Admin Dashboard  
- **15** — Admin Liste & İnceleme  

Her biri için: Amaç, UI kontrolleri, Validasyon/Negatif, Backend kontrolleri, rapor sütunları.

---

## Checklist (Excel’de açılabilir)

**5 sayfa:** [test-checklist-5-sayfa.csv](test-checklist-5-sayfa.csv) — sütunlar: Sayfa, SenaryoNo, Kontrol, Beklenen, Passed, Not. Noktalı virgül ayraçlı; Excel’de “Veri → Metinden” ile açılabilir.

## Sonraki adım (opsiyonel)

- **Kalan 10 sayfa** için aynı şablonla senaryoların bu dokümana eklenmesi + (ops) kalan sayfalar için CSV checklist

---

*API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Ekran brief’leri: FIGMA-BRIEF-01 … FIGMA-BRIEF-15.*
