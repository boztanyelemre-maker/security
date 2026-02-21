# Eşleştirme Algoritması: Uygunluk ve “Uygundur / Uygun Değildir” Mantığı

Bu doküman, platformun **akıllı eşleştirme** aklını tanımlar. Amaç: **doğru alıcı ↔ doğru sağlayıcı** eşleşmesi; **ihale veya fiyat kırdırma değil**. Bütçe alıcıda kalır, sağlayıcı sadece **uygunluk sonucu** görür.

---

## 1. Temel ilkeler

| İlke | Açıklama |
|------|----------|
| **Bütçe gizli** | Alıcının min–max bütçesi sadece sistem tarafından kullanılır; sağlayıcıya **asla** gösterilmez. |
| **Çıktı sadece uygunluk** | Sağlayıcıya gösterilen: **“Bu talep fiyat politikanıza uygundur”** veya **“uygun değildir”**. Tutar yok. |
| **Operasyonel öncelik** | Önce lokasyon, hizmet türü, kapasite gibi operasyonel kriterler filtrelenir; bütçe uygunluğu son adımda uygulanır. |
| **Sıralama fiyata göre değil** | Talepler sağlayıcıya **en düşük bütçeli** veya **en yüksek bütçeli** diye sıralanmaz. Sıralama operasyonel uygunluk / tarih / öncelik gibi nötr kriterlere göre yapılabilir. |

---

## 2. Girdiler

### 2.1 Talepten (Alıcı)

| Alan | Kullanım |
|------|----------|
| Hizmet türü | Filtre: Sağlayıcının sunduğu türlerle eşleşmeli. |
| Hizmet lokasyonu (İl) | Filtre: Sağlayıcının hizmet verdiği şehirler listesinde olmalı. |
| Personel sayısı | Filtre: Sağlayıcının max personel kapasitesinden büyük olmamalı. |
| Aylık bütçe min (B_min) | Sadece eşleştirme mantığında; sağlayıcıya gösterilmez. |
| Aylık bütçe max (B_max) | Sadece eşleştirme mantığında; sağlayıcıya gösterilmez. |

### 2.2 Sağlayıcı profilden

| Alan | Kullanım |
|------|----------|
| Hizmet verilen şehirler | Filtre: Talep lokasyonu bu listede olmalı. |
| Maks. personel kapasitesi | Filtre: Talep personel sayısı ≤ bu değer. |
| Hizmet türleri | Filtre: Talep hizmet türü bu listede olmalı. |
| Min aylık iş büyüklüğü (P_min) | Bütçe uygunluğu: Alıcı bütçe aralığı bu aralıkla kesişmeli. |
| Max aylık iş büyüklüğü (P_max) | Bütçe uygunluğu: Alıcı bütçe aralığı bu aralıkla kesişmeli. |

---

## 3. Adım adım eşleştirme

### Adım 1: Operasyonel filtreler (zorunlu)

Sağlayıcı aşağıdakilerin **hepsini** sağlamalı; sağlamıyorsa talep listede **gösterilmez** veya “uygun değil” sayılır (tercihe göre):

1. **Lokasyon:** Talebin İl’i, sağlayıcının “hizmet verilen şehirler” listesinde.
2. **Hizmet türü:** Talebin hizmet türü, sağlayıcının “hizmet türleri” listesinde.
3. **Kapasite:** Talep personel sayısı ≤ sağlayıcının “maks. personel kapasitesi”.

Bu üçü sağlanmıyorsa **bütçe hesabına gerek yok**; sonuç: **uygun değildir** (veya talep bu sağlayıcıya hiç düşmez).

### Adım 2: Bütçe uygunluğu (kesişim)

Sadece **Adım 1** geçen sağlayıcılar için:

- Alıcı bütçe aralığı: **[B_min, B_max]**
- Sağlayıcı kabul ettiği iş büyüklüğü aralığı: **[P_min, P_max]**

**Kural:** İki aralık **kesişiyorsa** → **“Bu talep fiyat politikanıza uygundur”**.  
Kesişmiyorsa → **“Bu talep fiyat politikanıza uygun değildir”**.

Kesişim koşulu (matematiksel):

```
uygundur = (B_min <= P_max) ve (B_max >= P_min)
```

Örnekler:

- Bütçe 50.000 – 80.000 TL, Sağlayıcı 60.000 – 100.000 TL → kesişim var (60k–80k) → **uygundur**.
- Bütçe 50.000 – 80.000 TL, Sağlayıcı 90.000 – 120.000 TL → kesişim yok → **uygun değildir**.
- Bütçe 70.000 – 70.000 TL (tek değer), Sağlayıcı 50.000 – 80.000 TL → 70.000 aralıkta → **uygundur**.

### Adım 3: Sağlayıcıya gösterilecek bilgi

Sağlayıcıya **asla** gösterilmez: B_min, B_max, diğer sağlayıcıların teklifleri, “en düşük bütçeli talep” vb.

Sağlayıcıya gösterilir:

- Talep özeti: lokasyon, hizmet türü, personel sayısı, süre vb. (wireframe’deki gibi).
- **Sadece bir etiket:**  
  - “Bu talep fiyat politikanıza **uygundur**”  
  - veya “Bu talep fiyat politikanıza **uygun değildir**”

İsteğe bağlı (vizyonu bozmadan): “Önerilen teklif aralığı: X – Y TL” gibi bir ipucu **sadece** “uygundur” denilen talepler için ve sistemin P_min–P_max ile hesapladığı kesişim aralığından türetilebilir; bu ayrı ürün kararıdır.

---

## 4. Sıralama (liste nasıl sıralanır?)

Vizyon: **Fiyata göre sıralama yok.** “En ucuz talep” veya “En yüksek bütçeli talep” gibi sıralamalar **kullanılmaz**.

Önerilen nötr sıralama seçenekleri (tek veya birleşik):

- **Yayın tarihi:** En yeni talep önce (veya önce eski).
- **Operasyonel uyum skoru:** Örn. aynı il + aynı hizmet türü + kapasite tam uyum → daha üstte (fiyat yine dahil değil).
- **Sabit sıra:** Rastgele veya ID; hiçbir ticari bilgiye dayanmasın.

**Yapılmayacak:** Bütçe veya teklif tutarına göre sıralama (açık veya gizli “en iyi fiyat” mantığı).

---

## 5. Özet akış (sağlayıcı tarafında “uygun talepler” listesi)

```
Her talep için, sağlayıcı P için:

1. Lokasyon uyumu? (Talep il ∈ P’nin şehirleri) → Hayır ise: listeleme / “uygun değil”.
2. Hizmet türü uyumu? (Talep tür ∈ P’nin türleri) → Hayır ise: listeleme / “uygun değil”.
3. Kapasite uyumu? (Talep personel ≤ P’nin max kapasitesi) → Hayır ise: listeleme / “uygun değil”.
4. Bütçe kesişimi? [B_min, B_max] ∩ [P_min, P_max] ≠ ∅ → Evet: “uygundur”, Hayır: “uygun değildir”.

Listeyi oluştur: Sadece 1–3 geçen talepler (istersen 4’ü de geçenleri ayrı filtreyle “sadece uygun” diye gösterebilirsin).
Her talebin yanında sadece “uygundur” veya “uygun değildir” etiketi; tutar yok.
```

---

## 6. İleride genişletmeler (vizyonu koruyarak)

- **Öncelik / puanlama:** Operasyonel uyum puanı (lokasyon + tür + kapasite eşleşmesi) ile liste sıralanabilir; **fiyat puanı eklenmez**.
- **Bildirim tercihi:** Sağlayıcı “sadece bütçeme uygun taleplerden bildirim al” diyebilir; yine tutar gösterilmez.
- **Raporlama:** Platform yöneticisi istatistikte ortalama bütçe aralığı görebilir; **tek tek alıcı–sağlayıcı eşleşmesinde bütçe açıklanmaz**.

Bu doküman, projenin **eşleştirme aklı** için referans olsun; geliştirme ve test sırasında bu kurallara uyulur.
