# MVP Blueprint — Tek Sayfa Özet

**Güvenlik Hizmetleri B2B Pazar Yeri** · MVP = 12 bölümlük planlama çerçevesi (ekran/özellik sayısı değil).

---

| # | Bölüm | Kısa tanım | Çıktı / Durum |
|---|--------|------------|----------------|
| 1 | **Ürün & Vizyon** | B2B, alıcı/sağlayıcı, ihale değil eşleştirme, bütçe gizli, kalite önceliği | Kurallar net, vizyon korunuyor |
| 2 | **Kullanıcı Rolleri & Yetkiler** | Buyer / Provider / Admin; kayıtta rol, girişte DB’den; yetkisiz erişim yok | Rol modeli tanımlı |
| 3 | **Akış & Buton Analizi** | Kayıt–giriş akışı, 25 buton tek aksiyon, vizyona aykırı buton yok | Buton envanteri tamam |
| 4 | **Screen Inventory** | 23 ekran; kim görür, ne işe yarar; rol bazlı | Ekran haritası tamam |
| 5 | **MVP – v2 Kapsam Ayrımı** | 15 ekran MVP, 8 ekran v2; MVP şişirilmedi | Sınır net |
| 6 | **Veri Tabanı Tasarımı** | 8 tablo; bütçe ayrı tablo, rol/admin, audit & notlar | Tablo listesi kesin |
| 7 | **Backend / API Kapsamı** | Auth, buyer, provider, admin endpoint’leri; minimum set tanımlı | API kapsamı yazılı |
| 8 | **Eşleştirme Mantığı** | Şehir/hizmet/kapasite, profil tamam kuralı, uygun/uygun değil bayrağı | Kurallar dokümante |
| 9 | **Admin & Operasyon** | Alıcı/sağlayıcı listeleri, pasife al/aktif et + sebep, not & audit log | Akışlar tanımlı |
| 10 | **Güvenlik & Uyum** | Rol bazlı erişim, şifre/auth, KVKK minimum metinler | MVP seviyesi belli |
| 11 | **Test & Kabul Senaryoları** | 6 E2E senaryo, kabul kriterleri | Senaryolar yazılı |
| 12 | **Go-Live / Yayın Hazırlığı** | Prod, SSL, ENV, backup, monitoring başlıkları | Checklist tanımlı |

---

**Önemli ayrım:** MVP ≠ 12 ekran, MVP ≠ 12 özellik. MVP = bu 12 başlık altında **uçtan uca planlanmış ürün**; yatırımcıya anlatılabilir, ekip büyüdüğünde dağılmaz.

**Vizyon koruması:** İhale değil, bütçe sağlayıcıya açılmaz, kalite & uygunluk odağı bozulmaz.

*Detay: [MVP-TAM-KAPSAM.md](MVP-TAM-KAPSAM.md) · Doğrulama: [MVP-TAM-KAPSAM-KONTROL.md](MVP-TAM-KAPSAM-KONTROL.md)*
