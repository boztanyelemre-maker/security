# Geç ödeme sayısı & ödenmeyen iş sayısı — veri kaynakları ve metrik oluşumu

**Amaç:** “Geç ödeme sayısı” ve “ödeme yapılmayan iş sayısı” metriklerinin **nereden ve nasıl** ortaya çıktığını netleştirmek. Tahmin değil; davranış + tekrar + doğrulama ile oluşur.

**İlgili:** [ALICI-TEMIZLEME-MEKANIZMASI.md](ALICI-TEMIZLEME-MEKANIZMASI.md), [ALICI-ODEME-VADESI-VE-GUCU.md](ALICI-ODEME-VADESI-VE-GUCU.md).

---

## Temel prensip

Platform **banka gibi ödeme takip etmez**; **sözleşme ve davranış sinyallerini** toplar.

- ❌ Alıcının banka hesabı bilinmez  
- ❌ Tahsilat platform tarafından yapılmaz (MVP)  
- ✅ Ödeme **vaadi ↔ gerçekleşme** farkı ölçülür  

---

## 1. Kaynak: Sözleşme & vade beyanı (MVP’de başlar)

Talep oluştururken / sözleşme aşamasında alıcı şunu **beyan eder**:

- **Ödeme vadesi:** 30 / 45 / 60 / 90 gün  

Bu bilgi:
- DB’de saklanır  
- Sağlayıcıya **etiket** olarak gösterilir (sayı yok)  
- Admin tarafından izlenir  

**Not:** Bu aşamada henüz “geç ödeme” yok; sadece **referans vade** vardır.

---

## 2. Kaynak: Sağlayıcı geri bildirimi (MVP’nin kalbi)

Sağlayıcı dashboard’unda, **iş başladıktan sonra** basit bir aksiyon:

**“Ödeme Durumu Bildir”**

Seçenekler:
- 🟢 Zamanında ödendi  
- 🟡 Gecikmeli ödendi  
- 🔴 Ödeme alınmadı  

Bu bir şikayet formu veya dava yeri **değil**; **davranış sinyali**dir.

### Sistem ne yapar?

Aynı alıcı için:
- 1 sağlayıcı bildirimi → 🟡 zayıf sinyal  
- 2–3 farklı sağlayıcı → 🔵 güçlü sinyal  
- Tekrar eden “ödenmedi” → 🔴 kritik sinyal  

**Kural:** Tekil beyan **asla yeterli değildir**. Çoğul ve **tekrar eden** davranış aranır.

---

## 3. Kaynak: Admin doğrulaması (kontrol mekanizması)

Admin panelinde:
- **“Ödeme Davranışı İnceleme”** kuyruğu oluşur  
- Admin görür: alıcının beyan ettiği vade, sağlayıcı geri bildirimleri, tekrarlılık / tutarlılık  

**Admin aksiyonları:**
- Onayla (sinyali geçerli say)  
- Beklemeye al  
- İlgili bildirimi geçersiz say  

Bu adım: Kötü niyetli sağlayıcıyı filtreler; alıcıyı **haksız damgalamayı** engeller.

---

## Metrikler nasıl oluşur?

### Geç ödeme sayısı

**Hesaplama:**
- “Gecikmeli ödendi” bildirimi  
- **+** Admin onayı  
- → **1 geç ödeme**  

**Örnek:** Son 12 ayda 5 iş; 2’sinde “gecikmeli ödendi” admin tarafından onaylandı → **Geç ödeme sayısı: 2**.

### Ödeme yapılmayan iş sayısı

**Şartlar daha ağırdır:**
- Birden fazla sağlayıcı bildirimi  
- “Ödeme alınmadı”  
- Belirli süre geçmiş (örn. 90 gün)  
- **Admin onayı**  
- → **1 ödenmeyen iş**  

Bu sayı **bilinçli olarak** zor artar; tek bildirimle yükselmez.

---

## Özet tablo (tek bakışta)

| Veri | Nereden gelir |
|------|----------------|
| Ödeme vadesi | Alıcı beyanı |
| Geç ödeme sayısı | Sağlayıcı bildirimi (“gecikmeli ödendi”) + admin onayı |
| Ödenmeyen iş sayısı | Çoklu “ödeme alınmadı” bildirimi + süre + admin onayı |
| Etiket (sağlayıcıya) | Sistem üretir (Düzenli / Ortalama Vade / Uzun Vade) |
| Görünüm | Etiket; **sayı kullanıcıya gösterilmez** |

---

## MVP vs v2 farkı

| | MVP | v2–v3 |
|---|-----|--------|
| Vade | Alıcı beyanı | Alıcı beyanı + fiili vade |
| Ödeme durumu | Sağlayıcı bildirimi | Sağlayıcı bildirimi + ödeme entegrasyonu |
| Doğrulama | Admin | Admin + fatura / tahsilat sinyali |
| Sonuç | Davranış etiketi | Davranış etiketi + daha objektif skor (arka planda) |

---

## Hukuki & vizyon güvenliği

**Yapılmayanlar:**
- ❌ “Ödeme yapmıyor” demiyoruz  
- ❌ Tek bir sağlayıcıya göre karar vermiyoruz  
- ❌ Sayısal kredi notu üretmiyoruz  

**Yapılanlar:**
- ✅ Davranış takibi  
- ✅ Tekrar eden örüntü  
- ✅ Admin onayı  

---

## Sonuç

Bu iki metrik **tahminle değil**, **davranış + tekrar + doğrulama** ile oluşur. Sağlayıcı korunur, alıcı haksız damgalanmaz, platform premium ve güvenilir kalır.

---

*UI brief’leri: Sağlayıcı [FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md](FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md); Admin [FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md](FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md).*
