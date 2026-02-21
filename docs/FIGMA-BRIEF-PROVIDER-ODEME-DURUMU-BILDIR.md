# Figma brief — Sağlayıcı Dashboard: “Ödeme Durumu Bildir” UI (MVP)

**Amaç:** Sağlayıcının, çalıştığı alıcı için ödeme davranışını **damgalamadan, kanıt üretmeden**, davranış sinyali olarak bildirmesi.

**Yer:** Ekran 9 (Sağlayıcı Dashboard) içinde **modül** + **modal**. Sadece AWARDED/aktif iş varsa modül görünür; yoksa gizlenir (dashboard şişmez).

**Referans:** [ODEME-METRIKLERI-KAYNAKLARI.md](ODEME-METRIKLERI-KAYNAKLARI.md), [FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md](FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md).

---

## Vizyon & güvenlik kuralları

- ❌ “Bu alıcı ödeme yapmıyor” gibi sert dil yok  
- ✅ “Ödeme durumu bildirimi” / “tahsilat durumu” dili  
- ✅ Tekil bildirim otomatik cezaya dönüşmez (arka planda “inceleme”ye gider)  

---

## Yerleşim (Ekran 9 içinde modül)

### Modül başlığı

- **Başlık:** *Ödeme Durumu Bildirimleri*
- **Alt metin:** *Bu bildirimler platform içi güven ve kalite değerlendirmesi için kullanılır.*

### Tab / filter (mini)

- **Aktif İşlerim** (default)
- **Geçmiş İşlerim**

Her satırda bir “iş / sözleşme / talep” (AWARDED veya aktif çalışma statüsünde kayıt; v2’de sözleşme tablosu gelir).

---

## Liste satırı (job/engagement row)

| Kolon | İçerik |
|--------|--------|
| Alıcı Firma | |
| İş / Talep ID | |
| Başlangıç tarihi | |
| Vade (beyan) | Badge: 30 / 45 / 60 / 90 gün |
| Son bildirim durumu | Var / yok |
| **Aksiyon** | **Ödeme Durumu Bildir** (buton) |

---

## Buton aksiyonu → Modal: “Ödeme Durumu Bildir”

### Modal başlığı

- *Ödeme Durumu Bildir*
- **Context header:** Alıcı Firma Adı + Talep ID

### A) Durum seçimi (zorunlu)

**Radio:**

- 🟢 Zamanında ödendi  
- 🟡 Gecikmeli ödendi  
- 🔴 Ödeme alınmadı  

### B) Gecikme bilgisi (koşullu)

**Durum = “Gecikmeli ödendi” ise:**

- Gecikme süresi (dropdown): 1–7 gün, 8–30, 31–60, 60+  
- (Opsiyonel) Açıklama (textarea, max 280 karakter)  

**Durum = “Ödeme alınmadı” ise:**

- Ne kadar süredir? (dropdown): 0–30, 31–60, 61–90, 90+  
- (Opsiyonel) Açıklama (max 280)  

**Onay kutusu (zorunlu):**  
☑️ *Bu bildirim, kendi tecrübeme dayanır ve doğru olduğunu beyan ederim.*

### C) Kanıt yükleme

- ❌ MVP’de **yok** (v2’de eklenebilir)

### D) CTA’lar

- **Primary:** *Bildirimi Gönder*  
- **Secondary:** *Vazgeç*  

### E) Submit sonrası

- **Toast:** *Bildirim alındı. İncelemeye alınacaktır.*  
- Satırda “Bildirim var” badge’i güncellenir.  

---

## Validasyon kuralları

- Durum seçimi zorunlu  
- “Gecikmeli” / “Ödenmedi” durumlarında **süre** zorunlu  
- “Ödeme alınmadı” durumunda **beyan checkbox** zorunlu  
- **Spam önlemi (backend):** Aynı iş için 24 saatte 1 bildirim  

---

## Component listesi

- Card / Module (liste + başlık)  
- Table row / Job  
- Badge (vade, bildirim var/yok)  
- Button / Primary · Secondary  
- Modal  
- Radio group  
- Dropdown  
- Textarea  
- Checkbox  
- Toast  

---

*Admin inceleme ekranı: [FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md](FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md).*
