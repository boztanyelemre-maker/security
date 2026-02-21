# Figma çizim brief’i — 11. Ekran: Uygun Talepler Listesi (Sağlayıcı) (Provider – Matched Requests)

**Amaç:** Sağlayıcıya **neden bu talepleri gördüğünü** net anlatmak ve yalnızca **gerçekten uygun** olduğu taleplerde aksiyon aldırmak.

- ❌ Açık talep havuzu değil  
- ❌ “Herkes her şeyi görsün” ekranı değil  
- ❌ Fiyat kovalanan yer değil  
- ✅ **Algoritmik eşleşmenin vitrinidir**  

**Prensip:** Algoritma görünür ama manipüle edilemez.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 11 · [ESLESTIRME-ALGORITMASI.md](ESLESTIRME-ALGORITMASI.md).

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Content max width** | 1200 px |
| **Background** | Açık |

---

## Sayfa başlığı & bilgi

- **Başlık (H1):** *Uygun Talepler*
- **Alt açıklama (muted):** *Aşağıdaki talepler, profil bilgileriniz ve uygunluk kriterlerine göre listelenmektedir.*

Algoritmayı görünür kılar; tartışmaya açmaz.

---

## 1. Filtreler (sade & kapalı)

**MVP kuralı:** Filtreler bilgi amaçlı, manipülasyon amaçlı değil.

**Gösterilen (readonly / soft filter):**
- Lokasyon  
- Hizmet türü  
- Personel sayısı aralığı  

**Kapalı (gösterilmez):**
- ❌ Fiyat  
- ❌ Bütçe  
- ❌ Alıcı adı  
- ❌ Ağırlık ayarları  

---

## 2. Talep kartı (algoritma vitrini)

Her talep **kart** olarak listelenir.

### Talep kartı yapısı

| Bölüm | İçerik |
|--------|--------|
| **Üst satır** | Talep ID · Lokasyon · Hizmet türleri (etiket) |
| **Orta – uygunluk haritası** | Lokasyon uyumu 🟢 · Personel kapasitesi 🟢 · Sertifika / yetki 🟡 · SGK & ücret uyumu 🟢 · Operasyonel yeterlilik 🟡. İkon + kısa label; **sayı yok, ağırlık yok**. Tooltip: *Bu kriterler, profil bilgileriniz ile talep gereksinimlerinin eşleşmesine göre belirlenir.* |
| **Alt – finansal sinyal (rakam yok)** | 🟢 Bütçe ile uyumlu / 🟡 Bütçe sınırında / 🔴 Bütçe dışında (🔴 ise kart **varsayılan olarak gösterilmez**). **Bütçe rakamı asla gösterilmez.** |
| **Alt satır – aksiyonlar** | *Talebi İncele* · *Teklif Ver* (profil %100 ve bütçe uyumu 🟢 veya 🟡 ise **aktif**). Aksi halde buton **disabled**; tooltip: *Profil bilgilerinizi tamamlayın.* |

---

## 3. Sıralama (gizli ama adil)

Sağlayıcı sıralamayı **değiştiremez**.

**Varsayılan (arka planda):**
- Uygunluk seviyesi  
- Yasal & SGK uyumu  
- Operasyonel yeterlilik  
- Sistem içi davranış sinyali  

**Yok:** ❌ Fiyat · ❌ “En yeni” · ❌ “En çok bütçe”

---

## 4. Empty state’ler

| Durum | Mesaj | CTA |
|--------|--------|-----|
| **Hiç uygun talep yok** | *Şu an profilinize uygun aktif talep bulunmamaktadır.* | *Profilimi Gözden Geçir* |
| **Profil eksik** | *Uygun talepleri görebilmek için profilinizi tamamlamanız gerekmektedir.* | *Profili Tamamla* |

---

## 5. Uyarı & bilgi modülü (opsiyonel)

Sayfanın altına küçük bilgi kutusu:

*Talepler, platform kalite ve yasal uygunluk kriterlerine göre filtrelenir.*

Şeffaflık sağlar; itiraz kapısını kapatır.

---

## Component listesi

- Request Card  
- Badge / Match · Badge / Compliance · Badge / Budget Fit  
- Tooltip  
- Button / Primary · Disabled  
- Empty State  

---

## Vizyon kırmızı çizgileri

- ❌ “Tüm talepler” · Fiyat bilgisi · Alıcıyı seçme yarışı · Algoritma ayarı  
- ✅ Uygunluk · Kalite · Yasal uyum · Dengeli eşleşme  

---

## Teslim kriterleri (checklist)

- [ ] Sağlayıcı “neden bu talebi görüyorum?”u anlıyor mu?
- [ ] Uygun olmayan talepler gerçekten görünmüyor mu?
- [ ] Fiyat hiçbir yerde sızmıyor mu?
- [ ] Profil tamamlama teşviki net mi?

---

## Sonuç

Bu ekran:
- Algoritmayı **görünür ama tartışılmaz** kılar  
- Sağlayıcıyı doğru işe yönlendirir  
- Spam teklifleri doğal olarak azaltır  

---

## Sonraki adım

**12. ekran – Talep Detayı (Sağlayıcı)** — sağlayıcı talebi nasıl görür, teklifi nasıl verir (ihaleleşmeden).

---

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

---

*Eşleştirme mantığı: [ESLESTIRME-ALGORITMASI.md](ESLESTIRME-ALGORITMASI.md). Profil: [FIGMA-BRIEF-10-SAGLAYICI-PROFIL.md](FIGMA-BRIEF-10-SAGLAYICI-PROFIL.md).*
