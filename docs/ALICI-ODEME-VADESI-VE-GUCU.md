# Alıcının ödeme vadesi & ödeme davranışı (gösterim kuralları)

**Kısa cevap:** Evet, alıcının ödeme vadesi ve ödeme davranışı gösterilebilir — **ama nasıl gösterildiği kritik**; yanlış gösterim vizyonu ve hukuki durumu bozar.

**Net karar:** Etiket + açıklama şeklinde gösterilir. Skor / puan / not şeklinde **gösterilmez**.

---

## Neden bu özellik?

- Sağlayıcının “para alabilecek miyim?” kaygısını azaltır  
- Kaliteli sağlayıcıyı platformda tutar  
- Klasik teklif sitelerinden ayırır  

**Yanlış yapılırsa:** Alıcı damgalanır, hukuki risk, “kredi skoru” algısı.

---

## 1. Neyi puanlarız / değerlendiririz?

### A) Ödeme vadesi davranışı

- Ortalama ödeme süresi (gün)  
- Sözleşmede yazan vade vs. fiili ödeme  
- Geç ödeme sıklığı  

### B) Ödeme gücü (dolaylı – platform içi)

- ❌ Ciro, bilanço, banka skoru **yok**  
- ✅ Platform içi sinyaller **var**: açılan talep hacmi, sürekli iptal / ödenmeyen iş, platform geçmişi (v2’de ödeme entegrasyonu ile)  

---

## 2. Puan / bilgi nasıl gösterilir? (kritik)

### ❌ Asla böyle gösterilmez

- “Ödeme Gücü: 72/100”  
- “Riskli alıcı”  
- “Zayıf finansal yapı”  

→ Hukuken riskli; damgalama.

### ✅ Doğru gösterim (vizyon uyumlu) — sağlayıcıya görünen

**Ödeme davranışı etiketi (sayı yok):**

| Etiket | Anlam |
|--------|--------|
| 🟢 Düzenli Ödeme | |
| 🟡 Ortalama Vade | |
| 🔵 Uzun Vade | |

**Alt micro copy:** *Platform içi ödeme davranışına göre.*

- Sayı yok  
- Damgalama yok  
- Karar desteği var  

**Opsiyonel detay (tooltip):** *Bu değerlendirme, alıcının geçmiş ödeme vadesi ve platform içi davranışları dikkate alınarak oluşturulmuştur.*

---

## 3. Admin tarafında ne görünür?

Admin panelinde daha detaylı:

- Ortalama ödeme süresi: X gün  
- Geç ödeme oranı: %X  
- Son 6 ay ödeme trendi  
- Risk flag’leri  

- Admin görür  
- Sağlayıcı görmez (sadece etiket)  
- Alıcı görmez (self-score yok)  

---

## 4. Ne zaman hesaplanır?

| Faz | Yöntem |
|-----|--------|
| **MVP** | Manuel admin girişi veya sadece “vade beyanı” (30 / 45 / 60 / 90 gün) |
| **v2–v3** | Platform içi ödeme verisi, fatura / tahsilat entegrasyonu, gerçek davranışa dayalı değerlendirme |

---

## 5. Hukuki & vizyon güvenlik çizgisi

**Uyulacak kurallar:**

- ✅ Sayısal skor gösterilmez  
- ✅ Finansal güç iddiası yapılmaz  
- ✅ “Beyan + davranış” temelli  
- ✅ Açık damgalama yok  

**Yasak:**

- ❌ Kredi notu benzeri dil  
- ❌ “Riskli müşteri” etiketi  
- ❌ Üçüncü taraf veri iddiası  

---

## 6. Stratejik kazanç

- İyi sağlayıcı platformda kalır  
- Teklif kalitesi yükselir  
- “Her yere teklif atalım” davranışı azalır  
- Platform premium B2B konumuna geçer  

---

## Net karar (özet)

| Soru | Cevap |
|------|--------|
| Alıcı ödeme vadesi / davranışı gösterilebilir mi? | ✔️ Evet |
| Nasıl? | Etiket + kısa açıklama (Düzenli Ödeme / Ortalama Vade / Uzun Vade) |
| Skor / puan / not (72/100 vb.) gösterilir mi? | ❌ Hayır |
| Admin detay görür mü? | ✔️ Evet (süre, oran, trend, flag) |
| Sağlayıcı ne görür? | Sadece etiket + “platform içi davranışa göre” notu |

---

*Kullanım: Sağlayıcı Dashboard (9. ekran), Uygun Talepler listesi, Teklif ekranı — sağlayıcı alıcıyı görürken bu etiket gösterilebilir. [ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md](ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md) ile uyumlu. Kötü davranışı kademeli temizleme: [ALICI-TEMIZLEME-MEKANIZMASI.md](ALICI-TEMIZLEME-MEKANIZMASI.md).*
