# Mevcut durum ve veritabanı doğrulama

Bu doküman: **(1)** şu anki sistem durumunu, **(2)** akışta sorun olup olmadığını, **(3)** “veritabanı çalışıyor mu?” sorusunun nasıl yanıtlanacağını ve **(4)** backend eklendiğinde kullanılacak doğrulama paketini netleştirir.

---

## 1. Mevcut durum (net cevap)

| Soru | Cevap |
|------|--------|
| **Akışta sorun var mı?** | **Hayır.** Kayıt → rol seçimi → role göre form → giriş → role göre dashboard ve yetki mantığı B2B standardına uygun. |
| **Veritabanı çalışıyor mu?** | **Hayır.** Şu an sadece **statik front-end** (HTML/CSS/JS) var; **backend ve veritabanı yok**. Kayıt/giriş gerçekte persist edilmiyor, demo için `localStorage` kullanılıyor. |

Yani: **Tasarım ve akış doğru;** “DB çalışıyor” diyebilmek için **gerçek backend + DB** kurulup aşağıdaki testlerle doğrulanmalı.

---

## 2. Akış özeti ve 3 kritik aksiyon

Tasarımda kabul ettiğimiz akış:

1. **Kayıt Ol** → Rol seçimi (Buyer / Provider) → Role göre kayıt formu  
2. **Giriş Yap** → Rol **veritabanından** okunur (UI’da rol seçimi yok)  
3. **Login sonrası** → Role göre dashboard’a yönlendirme (BUYER → alıcı paneli, PROVIDER → sağlayıcı paneli)  
4. **Yetki:** Alıcı talep açar / teklif veremez; sağlayıcı teklif verir / talep açamaz  

Backend/DB eklerken **mutlaka** uygulanması gereken 3 nokta:

| # | Kural | Açıklama |
|---|--------|----------|
| 1 | **Rol DB’den** | Rol bilgisi sadece veritabanından (örn. `companies.role`) okunur; login ekranında veya URL parametresinde rol seçtirilmez. |
| 2 | **Yetki API’da** | Alıcı/sağlayıcı ayrımı sadece ekranda değil **API seviyesinde** zorunlu. Örn. alıcı token ile `POST /offers` çağrılırsa 403. |
| 3 | **Profil tamamlanmadan teklif yok** (öneri) | Sağlayıcı, profil tamamlanmadan “uygun talepler”e teklif veremez. Kalite ve vizyonla uyumlu. |

Bunlar uygulanırsa akış sağlam kabul edilir.

---

## 3. “Veritabanı çalışıyor mu?” nasıl anlaşılır?

Aşağıdakilerin **hepsi** evet ise DB + rol mantığı çalışıyor sayılır:

| Kontrol | Beklenen |
|--------|----------|
| Kayıt olunca DB’de kayıt açılıyor mu? | `companies` (ve gerekirse `buyer_profiles` / `provider_profiles`) tablolarına insert. |
| Girişte sistem kullanıcıyı DB’den buluyor mu? | E-posta + şifre doğrulaması, token/session DB veya cache ile ilişkili. |
| Rol (BUYER/PROVIDER) DB’de saklanıyor mu? | `companies.role` dolu ve login cevabında kullanılıyor. |
| Dashboard yönlendirmesi bu role göre mi? | BUYER → alıcı dashboard, PROVIDER → sağlayıcı dashboard. |
| Admin listeleri DB’den mi? | Alıcı listesi `role=BUYER`, sağlayıcı listesi `role=PROVIDER` ile çekiliyor. |

**Hızlı test senaryosu (2–3 dk):**

1. Yeni kullanıcı ile **alıcı** olarak kayıt ol → DB’de (veya admin panelinde) `role=BUYER` ve firma adı görünmeli.  
2. Çıkış yap → aynı e-posta/şifre ile giriş yap → **Alıcı paneli**ne düşmeli.  
3. Aynı testi **sağlayıcı** ile yap → DB’de `role=PROVIDER` → giriş sonrası **Sağlayıcı paneli**.  

Hepsi geçiyorsa DB + rol mantığı çalışıyor kabul edilir.

---

## 4. DB doğrulama paketi (backend için hedef)

Backend’i hangi teknolojiyle (Node, Python, .NET, Firebase, Supabase, vb.) kurarsan kur, aşağıdaki **tablolar** ve **5 endpoint** hedef alınabilir. Teknolojiye göre SQL veya ORM ile uyarlanır.

### 4.1 Örnek tablolar (özet)

Mevcut **docs/VERI-MODELI.md** ile uyumlu; sadece login/rol doğrulaması için kritik alanlar:

**companies**

| Alan | Tip | Not |
|------|-----|-----|
| id | PK | uuid veya bigint |
| company_name | string | |
| tax_number | string(10) | |
| **role** | enum(‘BUYER’,‘PROVIDER’) | **Kritik** |
| contact_name | string | |
| email | string | unique, giriş için |
| phone | string | |
| password_hash | string | şifre asla düz saklanmaz |
| status | enum(‘active’,‘pending’,‘suspended’) | |
| created_at | timestamp | |

**buyer_profiles** (company_id FK, company.role=BUYER olanlar)  
**provider_profiles** (company_id FK, company.role=PROVIDER olanlar)  
*(Detay için VERI-MODELI.md)*

### 4.2 Doğrulama için 5 endpoint

| # | Metot | Yol | Amaç | Rol / not |
|---|--------|-----|------|-----------|
| 1 | POST | `/api/auth/register` | Kayıt (body’de role: BUYER veya PROVIDER) | Kayıtta role kaydedilir; şifre hash’lenir. |
| 2 | POST | `/api/auth/login` | Giriş (email + password) | Cevapta token + **role** dönmeli; yönlendirme buna göre. |
| 3 | GET | `/api/me` veya `/api/auth/me` | Giriş yapmış kullanıcı bilgisi | Token’dan company + **role**; yetki kontrolü için. |
| 4 | GET | `/api/admin/buyers` | Alıcı listesi | Sadece admin; DB’den `role=BUYER` filtresi. |
| 5 | GET | `/api/admin/providers` | Sağlayıcı listesi | Sadece admin; DB’den `role=PROVIDER` filtresi. |

- **Login cevabında mutlaka `role` olmalı;** front-end buna göre dashboard’a yönlendirir.  
- **Admin endpoint’leri** gerçekten DB’den çekmeli; şu anki statik listeler yerine bu API’ler kullanılacak.

### 4.3 Yetki kuralları (API’da zorunlu)

- `POST /api/requests` (talep oluşturma) → Sadece **role=BUYER**.  
- `POST /api/offers` (teklif verme) → Sadece **role=PROVIDER** (ve isteğe bağlı: profil tamamlanmış mı).  
- Alıcı token ile teklif endpoint’ini çağırırsa **403 Forbidden**.

---

## 5. Kısa sonuç

- **Akış:** Tasarımda sorun yok; B2B standart akış ve vizyonla uyumlu.  
- **Veritabanı:** Şu an **çalışmıyor** (backend/DB yok); sadece front-end ve demo davranışı var.  
- **“DB çalışıyor” diyebilmek için:** Yukarıdaki test senaryosu ve 5 endpoint’in gerçek backend + DB ile sağlanması gerekir.  
- **Teknoloji seçince:** Bu dokümandaki tablolar + 5 endpoint, “DB doğrulama paketi” olarak kullanılabilir; teknolojiye göre (Postgres, MySQL, Firebase, Supabase, vb.) uyarlanır.

İleride kullandığın teknolojiyi söylersen (örn. Node+Postgres, Supabase, Firebase), aynı mantığa göre o stack’e özel örnek kod veya script de çıkarılabilir.
