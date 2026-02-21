# Kavram ve İş Modeli: Güvenlik Hizmetleri B2B Pazar Yeri

## 1. Problem

- Güvenlik hizmeti **almak isteyen** işletmeler (fabrika, AVM, site, hastane, ofis) doğru ve lisanslı sağlayıcıyı bulmakta zorlanıyor.
- Güvenlik hizmeti **veren** firmalar (özel güvenlik, danışmanlık, sistem entegratörleri) potansiyel müşteriye ulaşmak için pazar yeri eksikliği yaşıyor.

## 2. Çözüm

Tek bir B2B platformunda:

- **Talep tarafı:** İşletmeler ihtiyaçlarını (RFQ / teklif isteği) tanımlar.
- **Arz tarafı:** Güvenlik firmaları profillerini oluşturur, taleplere teklif verir.
- **Platform:** Eşleştirme, doğrulama, değerlendirme ve iletişim altyapısını sağlar.

## 3. Kullanıcı tipleri

| Rol | Açıklama | Örnek |
|-----|----------|--------|
| **Hizmet alıcı** | Güvenlik hizmeti talep eden işletme | Fabrika, AVM, site yönetimi, hastane |
| **Hizmet sağlayıcı** | Güvenlik hizmeti sunan firma | Özel güvenlik şirketi, danışmanlık, entegratör |
| **Platform yöneticisi** | Onay, doğrulama, kurallar | Operasyon / admin |

## 3.1 Kayıt aşamasında neden ikiye ayırdık?

“Kayıt Ol”a basan kullanıcı **ilk ekranda** rol seçer: **Almak istiyorum** (Buyer) veya **Vermek istiyorum** (Provider). Bu seçim zorunlu ve akışı belirler.

**Gerekçe:** Karmaşayı önler, yanlış ekranların açılmasını engeller, yetkilendirmeyi (RBAC) basitleştirir. İleride rol bazlı dashboard, farklı ücretlendirme ve KPI kurmayı kolaylaştırır. En önemlisi: Platformu ihale/fiyat pazarına dönüştürmeden doğru alıcı–sağlayıcı eşleşmesini sağlar. Bu karar vizyonu koruyan bir mimari tercihtir.

### 3.2 Sistem rolü nasıl biliyor?

- Kayıt sırasında seçilen rol (**Almak istiyorum** = BUYER, **Vermek istiyorum** = PROVIDER) veritabanında `companies.role` alanına **kalıcı** yazılır.
- **Giriş sonrası:** `role = BUYER` → alıcı dashboard’una, `role = PROVIDER` → sağlayıcı dashboard’una yönlendirilir. Kullanıcı diğer rolün ekranlarını görmez.
- **Yetki:** API seviyesinde kontrol edilir. Alıcı talep açar, teklif veremez; sağlayıcı teklif verir, talep açamaz. Bu yapı vizyonla uyumludur.

### 3.3 İki ürün kararı (netleştirilecek)

| Soru | Seçenekler | Öneri (MVP) |
|------|------------|-------------|
| **Rol değişikliği olur mu?** | (A) Hayır, sabit. (B) Evet, kullanıcı ayardan değiştirir. (C) Evet, sadece destek ile. | (A) veya (C): Rolün kayıtta net kalması karmaşayı ve istismarı azaltır. Değişim gerekirse yeni hesap veya destek üzerinden. |
| **Aynı firma hem alıcı hem sağlayıcı olabilir mi?** | (A) Hayır, bir firma tek rol. (B) Evet, aynı vergi no ile iki “yüz” (alıcı profili + sağlayıcı profili). | (A) MVP için yeterli; basit ve anlaşılır. (B) ileride düşünülebilir (holding / çok taraflı firmalar için). |

Bu tablo ürün kararı netleşince güncellenir.

## 4. Değer önerisi

- **Alıcılar için:** Tek yerden teklif alma, referans ve sertifika görme, güvenilir sağlayıcı seçimi.
- **Sağlayıcılar için:** Nitelikli talep, görünürlük, RFQ bazlı teklif verme imkânı.
- **Platform için:** Abonelik, komisyon veya listeleme ücreti (iş modeli netleştirilecek).

## 5. Benzer modeller

- **GoodFirms** – B2B hizmet eşleştirme (yazılım/danışmanlık).
- **Xometry** – Üretim hizmeti eşleştirme (parça üretimi).
- **Türkiye B2B / TR2B** – Genel B2B; hizmet kategorisi eklenebilir.

Bu proje, bu modelleri **güvenlik hizmeti** odaklı olarak uyarlar.

## 6. Hukuki / sektörel notlar

- Özel güvenlik hizmeti veren firmaların **5198 sayılı kanun** ve ilgili mevzuata uygun lisanslı olması gerekir.
- Platform, sağlayıcı lisans/sertifika bilgilerini toplayıp (mümkünse) doğrulama süreci tanımlamalıdır.
- Sözleşme ve ödeme akışı için hukuki danışmanlık alınması önerilir.

---

*Bu doküman kavram ve iş modeli özetini içerir; detaylar OZELLIKLER.md ve ileride eklenecek teknik dokümanlarla güncellenecektir.*
