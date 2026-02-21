# Zorunlu kriter: SGK ve ücret vergisi düzenli ödeme (sağlayıcı)

**Amaç:** “Sağlayıcı, personel maaşlarını SGK ve ücret vergileriyle birlikte, yasal süresinde ve düzenli ödemelidir” kuralını ürüne entegre etmek — talep, teklif, puanlama, admin ve temizleme mekanizmasında kullanım.

**Net karar:** Bu bilgi **zorunlu**; puanlama aşamasında **aktif** kullanılır. Gösterim **etiket & sinyal**; belge / rakam / ifşa **değil**.

---

## 1. Talep oluşturma (7. ekran) — zorunlu alan

**Yer:** D) Yasal & Operasyonel Şartlar bölümüne **ek** alan.

**Alan (zorunlu):**
- **Başlık:** *Ücret & Yasal Ödeme Şartı*
- **UI:** Checkbox (zorunlu, tek seçenek)
- **Metin:** *Sağlayıcı firma, personel maaşlarını SGK ve ücret vergileriyle birlikte, yasal süresinde ve düzenli olarak ödemelidir.*

**Kural:** Alan işaretlenmeden talep **yayınlanamaz**. Tercih değil, **zorunlu kabul şartı**.

**Micro-copy (checkbox altı):** *Bu şart, personel sürekliliği ve hizmet kalitesi için gereklidir.*

**Dil:** Hukuki, tarafsız, damgalayıcı değil. ❌ “Vergi kaçırmıyor” / “SGK’sız işçi” yok. ✅ “Yasal süresinde ve düzenli ödeme beyanı” / “Hizmet kalitesi ve personel sürekliliği için”.

---

## 2. Sağlayıcı tarafı — teklif verirken

**Teklif formunda zorunlu beyan (checkbox):**
- *Personel maaşları, SGK primleri ve ücret vergileri yasal süresinde ve birlikte ödenmektedir.*

**MVP’de yok:** Bordro yükleme, SGK dökümü, belge kanıtlama.

**Var:** Beyan **audit_log**’a yazılır; yalan beyan ileride yüksek risk flag’i.

---

## 3. Puanlama / değerlendirme (sistem içi)

**Kriter:** “Yasal & ücret uyumu (SGK + vergi)” — arka plan puanlamasında kullanılır.

**Önerilen ağırlık (kullanıcıya gösterilmez):**

| Kriter | Ağırlık |
|--------|---------|
| Fiyat / bütçe uyumu | %40 |
| Personel kalitesi | %20 |
| Operasyonel güç | %15 |
| **Yasal & ücret uyumu (SGK + vergi)** | **%15** |
| Raporlama & denetim | %10 |

Alıcı ve sağlayıcı bu yüzdeleri görmez; “uygun / kısmen / riskli” etiketine etki eder.

---

## 4. Ekran 8 (Alıcı — Talep detayı) — görünüm

Teklif kartında **etiket** (sayı yok):

| Etiket | Anlam |
|--------|--------|
| 🟢 Yasal ücret & SGK uyumu beyan edildi | |
| 🟡 Beyan var, doğrulama bekleniyor | |
| 🔴 Bu şart sağlanmıyor | → Teklif gösterilmez |

Alıcı maaş bordrosu veya vergi rakamı **görmez**; sadece kalite sinyali alır.

---

## 5. Admin otomatik kontrolleri

Admin panelinde görünenler:
- Sağlayıcının beyanı
- Aynı sağlayıcı için: personel devri yüksek mi? “Ödeme yapılmadı” bildirimleri var mı? SGK/maaş uyumsuzluğu şikayeti var mı?

**Çakışma varsa:** Yüksek risk flag’i. İlgili sağlayıcı yeni taleplerde otomatik eşleşmez; manuel incelemeye düşer.

---

## 6. Platform temizleme etkisi

| | Kötü sağlayıcı | İyi sağlayıcı |
|---|----------------|----------------|
| **Ne olur** | Beyan etmekten çekinir; eşleşmelerde geriye düşer; kaliteli alıcılara görünmez; kendiliğinden uzaklaşır | Öne çıkar; daha az rekabet; uzun vadeli işler |
| **Yasak** | Kimse yasaklanmaz | — |
| **Sonuç** | Kötü pratik barınamaz | Premium konum güçlenir |

---

## Hukuki & vizyon güvenlik çizgisi

**Kullanılmaz:** “Vergi kaçırmıyor”, “SGK’sız işçi çalıştırmıyor”.

**Kullanılır:** “Yasal süresinde ve düzenli ödeme beyanı”, “Hizmet kalitesi ve personel sürekliliği için”.

Bu dil KVKK uyumlu, iftira riskini azaltır, kurumsal müşteriyle uyumludur.

---

*Talep formu: [FIGMA-BRIEF-07-TALEP-OLUSTURMA.md](FIGMA-BRIEF-07-TALEP-OLUSTURMA.md). Puanlama: [TALEP-SEKTOR-KRITERLERI.md](TALEP-SEKTOR-KRITERLERI.md). Admin: [ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md](ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md).*
