# Ekran 8 (Talep Detayı – Alıcı) — Admin otomatik kontrolleri

**Amaç:** Talep detayı ve gelen teklifler ekranında arka planda çalışan otomatik kontroller; alıcıya/sağlayıcıya ne yansır / yansımaz.

**İlgili ekran:** [FIGMA-BRIEF-08-TALEP-DETAYI-ALICI.md](FIGMA-BRIEF-08-TALEP-DETAYI-ALICI.md).

---

## Genel kural

Bu kontroller **arka planda** çalışır. Alıcıya / sağlayıcıya **ham veri** olarak gösterilmez. Admin, tek tek teklif okumak veya “neden yok?” açıklaması yapmak zorunda kalmaz; sistem eler, etiketler, riskleri işaretler.

---

## 1. Yasal uyumluluk (otomatik – zorunlu)

### 5188 sayılı Kanun uyumu

- **Ne yapılır:** Talepte “silahlı güvenlik” işaretliyse, teklif veren sağlayıcının faaliyet izni ve silahlı güvenlik yetkisi kontrol edilir.
- **Sonuç:** Uygun değilse → teklif alıcıya **gösterilmez**. Kısmi uyum → “Kısmen uygun” etiketi. Alıcı “neden yok?” diye sormaz; görmez bile.

### Zorunlu sertifikalar

- **Ne yapılır:** Talepte işaretlenen ÖGG, psikoteknik, silah ruhsatı → sağlayıcı profilindeki beyanlarla eşleştirilir.
- **Sonuç:** Eksik → teklif filtrelenir. Tam → “Uygun” etiketi.

---

## 2. Operasyonel uygunluk

### Personel kapasitesi

- **Örnek:** Talep 25 personel; sağlayıcı beyanı max 15.
- **Sonuç:** Uygun değil → teklif gösterilmez. Kısmen uygun → etiketlenir. Uygun → normal. Bu kontrol manuel admin işini azaltır.

### Lokasyon uygunluğu

- **Örnek:** Talep Ankara – 3 lokasyon; sağlayıcı sadece İstanbul.
- **Sonuç:** Teklif otomatik elenir.

---

## 3. Bütçe uyum kontrolü (en kritik fark)

- Alıcı bütçe girer; sağlayıcı bütçeyi **görmez**. Sağlayıcı teklif fiyatını girer.
- **Sistem:** Teklif < bütçe min → sınırda · Teklif ∈ bütçe → uyumlu · Teklif > bütçe max → bütçe dışı.
- **Gösterim:** **Sayı gösterilmez.** Alıcı sadece etiketi görür (Uyumlu / Sınırda / Dışında). Platformu sahibinden, Armut, ihale sitelerinden net ayırır.

---

## 4. Kalite & risk skorlaması (admin görür)

- **Personel sürekliliği:** Yüksek devir oranı, yedek personel yok → risk puanı.
- **Operasyonel olgunluk:** Denetim sıklığı, süpervizör, dijital raporlama.
- **Kullanıcıya:** Bu skorlar “puan” olarak **gösterilmez**. v2’de “Öne çıkan teklif” etiketi verilebilir.

---

## 5. Referans & güven kontrolleri

- **Sektörel uyum:** Örn. hastane talebi, sağlayıcı referansları AVM/site → “Benzer sektör deneyimi yok” **iç uyarı**; admin dashboard’da görünür.

---

## 6. Alt yüklenici risk kontrolü

- Alt yüklenici oranı %50+ veya SGK taahhüdü işaretli ama yüksek oran → “Operasyonel risk” flag’i; admin isterse manuel incelemeye alır.

---

## 6b. SGK & ücret vergisi uyumu (yasal ödeme şartı)

- Talep tarafında alıcı “SGK ve ücret vergisi düzenli ödeme” şartını zorunlu kabul eder; sağlayıcı teklifte bu beyanı yapar.
- Admin panelinde: Sağlayıcının beyanı; aynı sağlayıcı için personel devri, “ödeme yapılmadı” bildirimleri, SGK/maaş uyumsuzluğu şikayeti.
- **Çakışma varsa:** Yüksek risk flag’i; sağlayıcı yeni taleplerde otomatik eşleşmez, manuel incelemeye düşer. Detay: [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md).

---

## 7. Teklif davranış analizi

### Aşırı düşük teklif

- Piyasa ortalamasının çok altında → “Aşırı düşük teklif” flag’i.
- **Sonuç:** Alıcıya gösterilmez **veya** “Riskli” etiketi ile gösterilir. Kamu ihalesi disiplinini ürüne yedirir.

---

## 8. Admin’e özel görünenler (alıcı görmez)

Admin view’da (Ekran 8’in admin versiyonunda):

- Ham fiyat  
- Bütçe–fiyat farkı (%)  
- Risk puanı  
- Uyum / uyumsuzluk sebepleri  
- Otomatik elenme nedeni  

**Kullanım:** Hukuki itirazlar, kurumsal müşteri talepleri, denetimler.

---

## Özet tablo

| Kontrol alanı | Otomatik mi | Alıcıya gösterilir mi |
|---------------|-------------|------------------------|
| 5188 uyumu | ✅ | ❌ (elenir veya etiket) |
| Sertifika | ✅ | ❌ |
| Kapasite | ✅ | ❌ |
| Lokasyon | ✅ | ❌ |
| Bütçe uyumu | ✅ | 🟡 Etiket (sayı yok) |
| Aşırı düşük teklif | ✅ | 🟡 Etiket / gizleme |
| Risk skoru | ✅ | ❌ (admin görür) |

---

## Vizyon kontrolü

Bu yapı:
- İhale disiplinini **kopyalamaz**
- Ama ihale **aklını** alır
- Platformu **premium B2B** yapar

---

*Backend/eşleştirme: [ESLESTIRME-ALGORITMASI.md](ESLESTIRME-ALGORITMASI.md). Admin panel: [ADMIN-PANEL-WIREFRAME.md](ADMIN-PANEL-WIREFRAME.md).*
