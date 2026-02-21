# Detaylı Özellik Listesi: Güvenlik Hizmetleri B2B Pazar Yeri

Aşağıdaki özellikler, paylaştığın B2B hizmet eşleştirme modeline göre düzenlenmiştir. MVP (ilk sürüm) ve sonraki sürümler için öncelik notu eklenmiştir.

---

## 1. Hizmet sağlayıcı profilleri

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Firma kaydı | Ünvan, vergi no, iletişim, adres | MVP |
| Hizmet kategorileri | Fiziksel güvenlik, elektronik güvenlik, danışmanlık, eğitim vb. | MVP |
| Kapasite / bölge | Hizmet verilen iller, müşteri sayısı kapasitesi | MVP |
| Sertifikalar ve lisanslar | ÖGG lisansı, ISO, sektör sertifikaları (dosya yükleme) | MVP |
| Referanslar | Tamamlanan projeler, müşteri referansları | MVP |
| Profil onayı | Admin tarafından belge kontrolü ve onay | MVP |

---

## 2. Talep / RFQ (Teklif İsteği) sistemi

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Talep oluşturma | Alıcı firma: hizmet türü, kapsam, lokasyon, tarih aralığı | MVP |
| Talep detayı | Açıklama, bütçe aralığı (opsiyonel), ek dosya | MVP |
| Talebin yayınlanması | Onay sonrası uygun sağlayıcılara açılması | MVP |
| Talep listesi | Alıcının kendi taleplerini görmesi; sağlayıcının açık talepleri filtrelemesi | MVP |
| Talep süresi | Son teklif tarihi, otomatik kapanma | MVP |

---

## 3. Teklif verme modülü

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Teklif gönderme | Sağlayıcının bir RFQ için fiyat ve açıklama girmesi | MVP |
| Teklif detayı | Fiyat, süre, kapsam, ödeme koşulları, ek not | MVP |
| Teklif listesi | Alıcının gelen teklifleri karşılaştırması | MVP |
| Teklif kabul/red | Alıcının bir teklifi kabul etmesi veya reddetmesi | MVP |
| Sadece kabul edilen sağlayıcıya bildirim | E-posta / platform bildirimi | MVP |

---

## 4. Değerlendirme ve referans sistemi

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Proje tamamlandı işareti | Alıcı veya sağlayıcı “iş tamamlandı” diyebilir | MVP |
| Puanlama | 1–5 yıldız veya skor (sağlayıcı / alıcı) | MVP |
| Yorum | Kısa metin değerlendirmesi (isteğe bağlı) | MVP |
| Profilde ortalama puan | Sağlayıcı sayfasında görünen ortalama ve yorum sayısı | MVP |
| İtiraz / moderasyon | Şikayet durumunda inceleme (admin) | Sonraki |

---

## 5. Doğrulama ve güven

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Firma kimlik doğrulama | Vergi levhası, ticaret sicil (dosya) | MVP |
| Lisans doğrulama | ÖGG / sektör lisansı kontrolü (manuel veya belge inceleme) | MVP |
| “Doğrulanmış” rozeti | Onaylanan firmalarda rozet gösterimi | MVP |
| Basit sözleşme şablonu | Platform kullanım şartları, gizlilik | MVP |
| Hukuki metinler | Kullanım koşulları, KVKK, çerez politikası | MVP |

---

## 6. Mesajlaşma ve sözleşme akışı

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Platform içi mesajlaşma | Talep/teklif bağlamında alıcı–sağlayıcı yazışması | MVP |
| Konu bazlı thread | Her RFQ veya teklif için ayrı konu | MVP |
| Bildirimler | E-posta veya uygulama bildirimi (yeni teklif, mesaj, kabul) | MVP |
| Sözleşme öncesi özet | Kabul sonrası iş özeti (taraflar, kapsam, fiyat) – indirilebilir PDF | Sonraki |
| E-imza entegrasyonu | İsteğe bağlı e-imza ile sözleşme | Sonraki |

---

## 7. Arama ve keşif

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Sağlayıcı arama | Kategori, il, anahtar kelime | MVP |
| Filtreler | Hizmet türü, bölge, puan, doğrulanmış | MVP |
| Talep arama (sağlayıcı için) | Açık RFQ’ları kategori ve bölgeye göre listeleme | MVP |

---

## 8. Hesap ve yetkilendirme

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Kayıt / giriş | E-posta + şifre; ileride SMS/OTP | MVP |
| Rol: Alıcı / Sağlayıcı | Kayıtta rol seçimi; bir firma tek rol (başlangıç) | MVP |
| Firma–kullanıcı ilişkisi | Bir firmaya birden fazla kullanıcı (ileride) | Sonraki |
| Admin paneli | Kullanıcı/firma onayı, talepler, şikayetler | MVP (temel) |

---

## 9. Ödeme ve ücretlendirme (platform)

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| İş modeli kararı | Abonelik / listeleme ücreti / işlem komisyonu | Planlama |
| Abonelik paketleri (sağlayıcı) | Örn. aylık/yıllık; teklif hakkı limiti | Sonraki |
| Ödeme altyapısı | Platform ücreti tahsilatı (ödeme kuruluşu entegrasyonu) | Sonraki |

*Not: Alıcı–sağlayıcı arası ödeme (fatura, havale) başlangıçta platform dışında bırakılabilir; sadece eşleştirme odaklı MVP.*

---

## MVP özeti (ilk sürümde olması hedeflenenler)

- Firma kaydı ve sağlayıcı profili (kategori, lisans, referans)
- RFQ oluşturma ve listeleme
- Teklif verme ve teklifleri görüntüleme / kabul–red
- Basit puanlama ve yorum
- Firma ve lisans doğrulama (manuel) + “doğrulanmış” rozeti
- Platform içi mesajlaşma ve temel bildirimler
- Arama ve filtre (sağlayıcı + açık talepler)
- Alıcı / Sağlayıcı rolleri ve temel admin paneli

İstersen bir sonraki adımda **teknik stack** (web/mobil, backend, veritabanı) veya **ekran akışları (wireframe)** için ayrı bir doküman da çıkarabiliriz.
