# MVP — 15 Ekran (Kesin Liste)

Mantıksal akışa göre sıralı. **15 ekran = MVP’nin TAM kapsamı.**

---

## Özet

| Grup | Sayı | Ekranlar |
|------|------|----------|
| Genel / Auth | 5 | 1–5 |
| Alıcı (Buyer) | 3 | 6–8 |
| Sağlayıcı (Provider) | 4 | 9–12 |
| Admin | 3 | 13–15 |
| **Toplam** | **15** | |

---

## Genel / Auth (5)

| # | Ekran | Açıklama |
|---|--------|----------|
| **1** | Ana Sayfa (Landing) | Kayıt Ol / Giriş Yap, ürün değeri, yönlendirme |
| **2** | Rol Seçimi | Alıcıyım / Sağlayıcıyım |
| **3** | Alıcı Kayıt | Firma + yetkili + kullanıcı bilgileri |
| **4** | Sağlayıcı Kayıt | Firma + yetkili + SGK/vergiler beyanı |
| **5** | Giriş Yap (Login) | Buyer / Provider / Admin ayrımı |

---

## Alıcı (Buyer) Akışı (3)

| # | Ekran | Açıklama |
|---|--------|----------|
| **6** | Alıcı Dashboard | Taleplerim, durum özetleri, risk/uyarı badge’leri |
| **7** | Talep Oluşturma (Ürünün Kalbi) | Hizmet kapsamı, personel, süre, yasal şartlar, opsiyonel kalite kriterleri, gizli bütçe |
| **8** | Talep Detayı (Alıcı) | Gelen teklifler (etiketli), fiyat yok / band + kalite sinyali, risk & uygunluk karşılaştırması |

---

## Sağlayıcı (Provider) Akışı (4)

| # | Ekran | Açıklama |
|---|--------|----------|
| **9** | Sağlayıcı Dashboard | Uygun talepler sayısı, tekliflerim, risk durumum (opsiyonel) |
| **10** | Sağlayıcı Profil & Profil Tamamlama | Lisanslar, personel kapasitesi, hizmet verilen şehirler, SGK/ücret beyanı, % tamamlanma |
| **11** | Uygun Talepler Listesi (Sağlayıcı) | Matching sonucu, fit ikonları, bütçe bandı (IN/EDGE) |
| **12** | Talep Detayı (Sağlayıcı) | Maskeli talep bilgisi, teklif verme, SGK/ücret beyan onayı |

---

## Admin Akışı (3)

| # | Ekran | Açıklama |
|---|--------|----------|
| **13** | Admin Login & Yetkilendirme | Admin role bazlı giriş |
| **14** | Admin Dashboard | KPI’lar, risk uyarıları, kuyruklar, son aktiviteler |
| **15** | Admin List & İnceleme | Talepler, Teklifler, Alıcılar, Sağlayıcılar, Ödeme raporları, Risk flag’leri — tab’lı veya ayrı route’lar; UX’te tek “Admin Yönetim” alanı |

---

## Kodlama sprint’leri (öneri)

| Sprint | Gün (tahmini) | Ekranlar çalışır | İçerik |
|--------|----------------|-------------------|--------|
| **Sprint 1** | 1–2 | 1, 2, 3, 4, 5, 13 | Altyapı + Auth: Landing, Rol, Alıcı/Sağlayıcı kayıt, Login, Admin login |
| **Sprint 2** | 3–4 | 6, 7, 8 | Buyer: Dashboard, Talep oluştur, Talep detayı (teklifler etiketli) |
| **Sprint 3** | 5–6 | 9, 10, 11, 12 | Provider: Dashboard, Profil, Uygun talepler listesi, Talep detayı + teklif ver |
| **Sprint 4** | 7–8 | (6–8, 11–12 devam) | Offer & Risk: Bütçe bandı, too-low flag, risk band etiketleri |
| **Sprint 5** | 9–10 | 14, 15 | Admin: Dashboard, List & İnceleme (talepler, teklifler, alıcılar, sağlayıcılar, ödeme, risk) |

---

## Durum

- Tasarım net (Figma brief’ler 01–15)
- DB & backend spec hazır
- Test planı: ilk 5 ekran senaryoları yazıldı ([MVP-TEST-PLANI-15-SAYFA.md](MVP-TEST-PLANI-15-SAYFA.md))

---

## Sonraki adım (opsiyonel)

- **TC-01, TC-02…** ile 15 ekran için tam test planı (test case ID’li)
- Sprint 1 scope’unu task listesi olarak parçalama (backend + frontend adımlar)

---

*Test planı: [MVP-TEST-PLANI-15-SAYFA.md](MVP-TEST-PLANI-15-SAYFA.md). Kodlama sırası: [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md), [KODLAMAYA-GECIS.md](KODLAMAYA-GECIS.md).*
