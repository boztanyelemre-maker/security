# MVP Sunumu — Güvenlik Hizmetleri B2B Eşleştirme Platformu

Yatırımcı / yönetici sunumu için slayt metinleri. Her bölüm = 1 slayt; direkt kopyalayıp kullanılabilir.

---

## Slayt 1 — Kapak

**Güvenlik Hizmetleri B2B Eşleştirme Platformu**  
**MVP Sunumu**

---

## Slayt 2 — Problem Tanımı

**Güvenlik hizmeti satın alma süreçleri bugün:**

- Fiyat odaklı ve yüzeysel ilerliyor  
- Kalite kriterleri sistematik ölçülmüyor  
- SGK / ücret vergisi düzeni görünmüyor  
- Ödeme davranışı geçmişi bilinmiyor  
- Şeffaf ve adil karşılaştırma yok  

**Sonuç:** Sürdürülebilir olmayan sözleşmeler, düşük kalite / yüksek personel sirkülasyonu, finansal risk.

---

## Slayt 3 — MVP Vizyonu

**Bu platform:**

- Alıcı ve sağlayıcıyı dijital olarak buluşturur  
- Fiyat dışı kalite kriterlerini sistematikleştirir  
- SGK ve yasal uyumu zorunlu hale getirir  
- Ödeme davranışını ölçer  
- Risk sinyali üretir  
- Şeffaf ama ihaleleşmeyen bir yapı kurar  

---

## Slayt 4 — MVP Kapsamı: 15 Ekran

**Genel (5):** Ana Sayfa, Rol Seçimi, Alıcı Kayıt, Sağlayıcı Kayıt, Giriş  

**Alıcı (3):** Dashboard, Talep Oluşturma (çekirdek ekran), Talep Detayı & Teklif Değerlendirme  

**Sağlayıcı (4):** Dashboard, Profil Tamamlama, Uygun Talepler, Talep Detayı & Teklif Verme  

**Admin (3):** Admin Login, Admin Dashboard, Yönetim Listeleri  

---

## Slayt 5 — Teknik Altyapı (MVP)

**Veritabanı (PostgreSQL)** — Ana tablolar:

- users, organizations (BUYER / PROVIDER), provider_profiles  
- requests, request_matches, offers  
- engagements, payment_reports, risk_flags, admin_reviews, audit_logs  

- UUID bazlı yapı  
- JSONB ile esnek risk metadata  
- Upsert tabanlı eşleşme sistemi  

---

## Slayt 6 — Matching Algoritması (Fark Yaratan Nokta)

**Talep yayınlandığında sistem:**

- Şehir uyumu  
- SGK ve yasal beyan  
- Lisans ve 5188 uyumu  
- Personel kapasitesi  
- Operasyonel yetenekler  
- Bütçe bandı sinyali (IN / EDGE / OUT)  

**Çıktı:** Her sağlayıcı için fit skorları.  

*Klasik teklif sitelerinden farklı.*

---

## Slayt 7 — Teklif Mekanizması

**Teklif verirken:**

- Bütçe aralığı kontrol edilir  
- Aşırı düşük teklif engellenir  
- Dumping davranışı risk flag üretir  
- Risk bandı otomatik hesaplanır  

**İlke:** Fiyat tek başına kazanmaz.

---

## Slayt 8 — Ödeme Davranışı Sistemi (Kritik Yenilik)

**Sağlayıcı:** İş bitince ödeme durumunu bildirir (gecikme bandı / 90+ gün).  

**Admin:** İnceleme yapar; onaylarsa alıcı risk bandı güncellenir.  

**Alıcı Risk Bandı:** NORMAL | WATCH | CRITICAL  

*Piyasada benzeri olmayan bir şeffaflık.*

---

## Slayt 9 — Risk Yönetim Mimarisi

**Risk bandı (3 seviye):** NORMAL | WATCH | CRITICAL  

**Kaynaklar:**

- Aşırı düşük teklifler  
- Tekrarlayan risk davranışı  
- Ödeme gecikmeleri  
- 90+ gün ödememe  

Platform kalitesi bu katmanla korunur.

---

## Slayt 10 — Admin Kontrol Katmanı

**Admin:**

- Risk flag’leri görür  
- Ödeme raporlarını onaylar  
- Şüpheli teklifleri gizleyebilir  
- Kullanıcıyı REVIEW / SUSPEND yapabilir  
- Dashboard üzerinden KPI’ları izler  

---

## Slayt 11 — MVP’de Çözülen Ana Konular

- Dijital eşleştirme  
- Kalite puanlaması  
- Bütçe sinyali (band)  
- SGK/vergisel beyan zorunluluğu  
- Aşırı düşük teklif filtresi  
- Ödeme davranışı takibi  
- Risk band sistemi  
- Admin kontrol paneli  

---

## Slayt 12 — Bilinçli Olarak Yapmadıklarımız (MVP)

- Açık ihale / canlı fiyat rekabeti  
- Açık bütçe paylaşımı  
- Otomatik sözleşme üretimi  
- Finansal ödeme entegrasyonu  

*Bunlar v2/v3 roadmap’te.*

---

## Slayt 13 — MVP Sonucu

**Bu MVP ile:**

- Güvenlik hizmeti satın alma süreci dijitalleşir  
- Kalite ölçülebilir hale gelir  
- Finansal risk azalır  
- Dumping ve kayıt dışılık caydırılır  
- Sürdürülebilir iş modeli oluşur  

---

## Slayt 14 — Kapanış / Soru & Cevap

**MVP Sunumu — Güvenlik Hizmetleri B2B Eşleştirme Platformu**  

Sorular?

---

## Sunum Notları (konuşmacı için)

- **Slayt 2:** “Sektörde fiyat tek kriter; kalite ve ödeme geçmişi görünmüyor.”  
- **Slayt 6:** “Eşleşme sadece şehir değil; SGK, lisans, kapasite ve bütçe bandı birlikte değerlendiriliyor.”  
- **Slayt 8:** “Ödeme davranışı admin onayıyla kayda geçiyor; alıcı risk bandı buna göre güncelleniyor.”  
- **Slayt 12:** “İhale açmak ve bütçeyi ifşa etmek istemiyoruz; gizli bütçe + band sinyali ile ilerliyoruz.”

---

---

## Sonraki adım (opsiyonel)

- **MVP sonrası 6 aylık ürün yol haritası** — v2/v3 özellikleri, öncelik sırası.
- Bu sunumu **PDF/PPT export** için aynı akışla özetleyen tek sayfa özet.

---

*Ekran listesi: [MVP-15-EKRAN-KESIN-LISTE.md](MVP-15-EKRAN-KESIN-LISTE.md). API & DB: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md), [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
