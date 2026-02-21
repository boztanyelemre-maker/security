# Ürün Tarafı %100 — Final Ürün Tanımı (Scope Freeze)

**Kilit tarih:** Bu doküman ürün kapsamını dondurur. Yeni özellik eklenmeyecek; yeni fikirler "v2 backlog"a yazılacak.

---

## 1. Ürün Tanımı

**B2B Güvenlik Hizmetleri Eşleştirme Platformu**

- **Amaç:** Güvenlik hizmeti almak isteyen firmalar ile, lisanslı ve SGK uyumlu güvenlik şirketlerini, fiyat dışı kalite kriterleri ile, şeffaf ve risk kontrollü şekilde buluşturmak.

---

## 2. Ürün Ne Değildir

- Açık ihale sitesi değil  
- En düşük fiyat kazanır platformu değil  
- Freelancer marketplace değil  
- Personel bulma sitesi değil  
- Güvenlik elemanı bireysel iş arama platformu değil  

---

## 3. Hedef Kitle

| Taraf | Örnekler |
|-------|----------|
| **Alıcı (Buyer)** | AVM, site yönetimi, plaza, fabrika, hastane, lojistik depo, kurumsal şirket |
| **Sağlayıcı (Provider)** | 5188 ruhsatlı özel güvenlik şirketleri, SGK’lı personel çalıştıran firmalar |

---

## 4. MVP Kapsamı (15 Ekran) — KİLİTLİ

| Alan | Ekranlar |
|------|----------|
| **Genel** | Landing, Rol seçimi, Buyer register, Provider register, Login |
| **Buyer** | Dashboard, Talep oluşturma, Talep detayı & teklif değerlendirme |
| **Provider** | Dashboard, Profil tamamlama, Uygun talepler, Talep detayı & teklif verme |
| **Admin** | Admin login, Admin dashboard, Yönetim ekranları (requests/offers/buyers/providers/payments/risk) |

---

## 5. Fark Yaratan 4 Ana Mekanizma

### 5.1 Matching Engine

Talep yayınlanınca değerlendirilen kriterler:

- Şehir uyumu  
- Kapasite uyumu  
- SGK beyanı  
- Lisans  
- Operasyonel yetkinlik  
- Bütçe bandı  

### 5.2 Budget Band Mekanizması

- **Buyer:** Bütçe girer (gizli).  
- **Provider:** IN / EDGE / OUT.  
- **OUT teklif → bloklanır (403).**

### 5.3 Aşırı Düşük Teklif Kontrolü

- Sistem çok düşük teklifleri risk flag’ler.  
- 30 gün içinde 3+ düşük teklif → WATCH.  
- Sürekli tekrar → CRITICAL.

### 5.4 Ödeme Davranışı Sistemi

- Provider iş bitince ödeme durumunu bildirir; Admin onaylar.  
- Buyer için risk band oluşur: **NORMAL**, **WATCH**, **CRITICAL**.  
- Bu sistem ürünün stratejik çekirdeğidir.

---

## 6. Risk Band Standardı (Kilit)

| Taraf | Kural |
|-------|------|
| **Buyer risk** | 0 problem → NORMAL; 1–2 gecikme → WATCH; 90+ gün ödememe → CRITICAL |
| **Provider risk** | Aşırı düşük teklif tekrarları, uyum eksikleri, risk flag yoğunluğu |

---

## 7. Ürün Kuralları (Değişmeyecek)

- OUT teklif sisteme girmez.  
- SGK beyanı olmadan provider teklif veremez.  
- Buyer bütçesi provider’a görünmez.  
- Admin risk override edebilir.  
- Matching publish anında çalışır.  

---

## 8. MVP’de Olmayacaklar (Scope Freeze)

- Otomatik sözleşme  
- Online ödeme  
- Finansal escrow  
- Mobil native app  
- AI teklif optimizasyonu  
- Chat sistemi  

---

## 9. MVP Başarı Kriterleri (KPI)

Aşağıdakiler çalışıyorsa MVP başarılı kabul edilir:

1. 1 talep yayınlandığında match oluşuyor mu?  
2. Provider teklif verebiliyor mu?  
3. OUT teklif bloklanıyor mu?  
4. Risk flag oluşuyor mu?  
5. Admin buyer risk bandını görebiliyor mu?  

---

## 10. Durum Özeti

| Alan | Durum |
|------|--------|
| Ürün tasarımı | Tamam |
| İş kuralları | Tamam |
| Risk sistemi | Tamam |
| Mimari | Tamam |
| **Sonraki adım** | Sadece inşa etme (kodlama) |

---

*Bu doküman ürün tarafını %100 kilitler. Değişiklik yapılmayacak; genişletmeler v2 backlog’a alınacaktır.*
