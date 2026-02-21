# Güvenlik Hizmetleri B2B Pazar Yeri

**Ürün tarafı %100 kilitli.** [docs/URUN-TANIMI-FINAL.md](docs/URUN-TANIMI-FINAL.md) — yeni özellik eklenmez; yeni fikirler v2 backlog’a yazılır.  
**Teknik taraf %100 kilitli.** [docs/TEKNIK-MIMARI-FINAL.md](docs/TEKNIK-MIMARI-FINAL.md) — mimari, API, güvenlik, deploy değişmeyecek.

**Amaç:** Güvenlik hizmeti **almak isteyen** işletmeler ile güvenlik hizmeti **vermek isteyen** firmaları tek bir platformda buluşturmak.

- **Alıcı taraf:** Fabrika, AVM, site, hastane, ofis vb. güvenlik hizmeti talep eden işletmeler  
- **Satıcı taraf:** Özel güvenlik şirketleri, danışmanlık firmaları, elektronik güvenlik sistemleri sağlayıcıları

---

## Platform tipi

| Özellik        | Değer                    |
|----------------|--------------------------|
| Model          | B2B (işletmeden işletmeye) |
| Odak           | Hizmet (güvenlik)        |
| Coğrafya       | Türkiye (başlangıç) → bölgesel genişleme |

---

## Temel özellikler (hedef)

1. **Hizmet sağlayıcı profilleri** – Firma bilgisi, referanslar, sertifikalar, lisanslar  
2. **Talep / RFQ sistemi** – Hizmet talep eden firmaların “teklif isteği” oluşturması  
3. **Teklif verme modülü** – Sağlayıcıların fiyat ve teklif sunması  
4. **Değerlendirme ve referans** – Firma puanlama, müşteri yorumları  
5. **Doğrulama ve güven** – Firma kimlik ve lisans doğrulama süreçleri  
6. **Mesajlaşma ve sözleşme** – Platform içi iletişim ve teklif onay akışı  

---

## Proje özeti / Karar kaydı (buraya kadar ne yaptık)

| Konu | Karar / Durum |
|------|-------------------------------|
| **Temel karar** | B2B platform; **ihale / EKAP / en ucuz fiyat değil** → güvenlik hizmeti alan ↔ veren firmaları **akıllı eşleştirme** ile buluşturuyoruz. |
| **Vizyon** | Bütçe alıcıda, sağlayıcı görmez. Doğru firma, kapasite, lokasyon, hizmet türü; karar destek & eşleştirme; “ihale” değil nitelikli iş eşleşmesi. |
| **Kullanıcı türleri** | (1) **Alıcı:** Talep oluşturur, bütçe girer (gizli), teklifleri değerlendirir. (2) **Sağlayıcı:** Profil oluşturur, kapasite tanımlar, uygun taleplere teklif verir. |
| **Kayıt akışı** | Açılış → Kayıt Ol → “Almak istiyorum” / “Vermek istiyorum” seçimi → ilgili firma kaydı → alıcıda talep, sağlayıcıda profil. |
| **Wireframe** | Alıcı: Firma kaydı + talep (hizmet, lokasyon, personel, süre, **bütçe gizli**). Sağlayıcı: Firma kaydı + profil (şehirler, kapasite, türler, referans) + uygun talepler (**sadece uygun/uygun değil**) + teklif verme. |
| **Kritik kurallar** | Bütçe asla açıklanmaz; sağlayıcı uygunlukla eşleşir; talep ekranı teklif için gerekli minimum veri; platform kalite & uyum odaklı. |
| **Çalışma prensibi** | Vizyon/misyona aykırı talep gelirse **uyarı + alternatif**; sessizce uygulama yok. (Bekçi kuralı: `.cursor/rules/vision-guard.mdc`) |

## Proje yapısı

```
security/
├── README.md
├── index.html                # Açılış (Kayıt Ol / Giriş Yap)
├── register.html             # Firma türü seçimi (Alıcı / Sağlayıcı)
├── register-buyer.html       # Alıcı firma kaydı → buyer/request-create.html
├── register-provider.html    # Sağlayıcı firma kaydı → provider/profile.html
├── login.html                # Giriş (e-posta + şifre; rol DB'den, yönlendirme role göre)
├── akış-grafik.html          # Kayıt Ol / Giriş Yap akış grafikleri (tarayıcıda aç)
├── buyer/
│   ├── dashboard.html        # Alıcı paneli (giriş sonrası yönlendirme)
│   └── request-create.html   # Talep oluşturma (bütçe gizli)
├── provider/
│   ├── dashboard.html        # Sağlayıcı paneli (giriş sonrası yönlendirme)
│   ├── profile.html         # Firma profili (teklife açık ol)
│   ├── requests.html        # Uygun talepler (bütçe görünmez)
│   └── offer.html           # Teklif verme
├── admin/
│   ├── login.html           # Admin giriş (e-posta + şifre; role=ADMIN gerekli)
│   ├── index.html           # Admin dashboard (Alıcılar, Sağlayıcılar, Talepler, Teklifler)
│   ├── buyers.html          # Alıcı firmalar listesi
│   └── providers.html       # Sağlayıcı firmalar listesi
├── css/
│   └── style.css
├── .cursor/rules/
│   └── vision-guard.mdc     # Vizyon bekçisi kuralı (aykırı talepte uyar)
├── scripts/
│   ├── db-init-docker.sh    # Docker ile DB + migration + seed (önerilen; psql gerekmez)
│   ├── db-init-docker.ps1   # Aynı — Windows PowerShell
│   ├── db-init.sh           # Yerel psql ile migration + seed
│   ├── db-init.ps1          # Aynı — PowerShell
│   └── db-init.md           # Kullanım
└── docs/
    ├── KAVRAM.md
    ├── OZELLIKLER.md
    ├── WIREFRAME.md
    ├── ESLESTIRME-ALGORITMASI.md
    ├── VERI-MODELI.md
    ├── ADMIN-PANEL-WIREFRAME.md
    ├── GIRIS-AKIS.md        # Login adımları, role göre yönlendirme, yetki
    ├── DURUM-VE-DB-DOGRULAMA.md
    ├── AKIS-GRAFIK.md
    ├── ADMIN-PANEL-WIREFRAME.md   # Admin: sayfalar, kolonlar, filtreler, detay, aksiyonlar, doğrulama
    ├── VERI-MODELI-ADMIN.md
    ├── BUTON-ENVANTERI.md
    ├── FIGMA-HIYERARSI.md
    ├── SCREEN-INVENTORY.md
    ├── MVP-TANIM.md
    ├── MVP-VERITABANI-TABLOLARI.md
    ├── MVP-DB-SCHEMA-FINAL.md            # Final DB şeması (önceki 9 tablo özeti)
    ├── MVP-DB-SCHEMA-FINAL-POSTGRES.md   # Final DB şeması — PostgreSQL (19 tablo, tek referans)
    ├── TABLO-EKRAN-ESLEME-MATRISI.md     # Tablo–ekran matrisi final (READ/WRITE + kritik kurallar + backend işleri)
    ├── MVP-API-SOZLESMESI.md              # API sözleşmesi — Auth + Buyer + Provider + Admin (4 bölüm, tamamlandı)
    ├── KODLAMA-SIRASI-BACKEND.md          # Backend-first MVP geliştirme sırası (13 adım + demo hedefleri)
    ├── KODLAMAYA-GECIS.md                 # Karar: kodlamaya geçiş + gün gün sıra
    ├── GELISTIRME-SIRASI-VE-SPRINT1.md    # MVP→Backend→API→Frontend sırası + 7 günlük Sprint 1 planı
    ├── PLANLAMA-DURUMU-VE-KARARLAR.md     # Planlama: verilen kararlar, kilitlenen default'lar (Node/Express, JWT, OUT=403), sonrası akış
    ├── GUNLUK-PLAN-20-GUN.md
    ├── NETLIFY-FRONTEND-DEPLOY.md         # Frontend deploy Netlify: _redirects, netlify.toml, env, CORS, checklist
    ├── RENDER-BACKEND-DEPLOY.md           # Backend deploy Render: Web Service + Postgres, env, health, checklist (production’a yakın)
    ├── BACKEND-KLASOR-YAPISI.md            # Backend klasör/dosya isimleri (stack-agnostic)
    ├── BACKEND-HAZIRLIK-DURUMU.md          # API backend hazır mı: hazır/hazır değil, checklist, Auth contract (JSON)
    ├── MVP-15-EKRAN-KESIN-LISTE.md        # MVP 15 ekran kesin listesi (1-5 genel, 6-8 alıcı, 9-12 sağlayıcı, 13-15 admin) + sprint önerisi
    ├── MVP-TEST-PLANI-15-SAYFA.md          # 15 sayfa MVP test planı (manuel + backend); ilk 5 sayfa detaylı
    ├── test-checklist-5-sayfa.csv           # İlk 5 sayfa checklist (Excel’de açılabilir)
    ├── MIGRATION-SIRASI-VE-SEED.md        # Migration sıralaması (M00–M09) + minimum seed (roles, cities)
    ├── MATCHING-JOB-KURALLAR.md           # request_matches kuralları (Ekran 11–12)
    ├── MATCHING-JOB-IMPLEMENTATION.md    # Matching job uygulama spec: pseudo, SQL, endpoint bağlantısı
    ├── OFFER-BUDGET-AND-RISK-RULES.md    # Teklif: budget_fit_band (IN/EDGE/OUT, OUT→403) + TOO_LOW_OFFER risk_flags
    ├── RISK-BAND-STANDARD.md             # risk_band tek standardı: Offer / Provider / Buyer (UI tutarlılığı)
    ├── ADMIN-DASHBOARD-KPI-QUERIES.md    # Ekran 14: KPI + kuyruk + risk watchlist + audit, önerilen JSON
    ├── ADMIN-LIST-QUERIES.md             # Admin listeler: filtre + sayfa + sort + mock
    ├── ADMIN-LIST-UI-SPEC.md             # Admin liste ekranları: kolonlar, filtreler, aksiyonlar, drawer (15A-15D)’leri, önerilen JSON
    ├── POSTGRES-KURULUM-VE-CALISTIRMA.md  # PostgreSQL kurulum, araç, migration sırası, doğrulama
    ├── migrations/                        # PostgreSQL DDL — M00 … M09
    │   ├── README.md                      # Çalıştırma sırası + smoke check
    │   └── sqlite/                        # SQLite (DB Browser uyumlu) M00–M09 + README
    ├── MVP-TAM-KAPSAM.md             # MVP tam kapsam: 11 iş paketi, çıktılar, WBS, v2
    ├── MVP-TAM-KAPSAM-KONTROL.md     # MVP tam kapsam doğrulama kontrol listesi (12 başlık)
    ├── TALEP-SEKTOR-KRITERLERI.md     # Talep ekranı sektör kriterleri & değerlendirme ağırlıkları
    ├── ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md # Ekran 8 — admin otomatik kontrolleri (alıcıya ne yansır)
    ├── ALICI-ODEME-VADESI-VE-GUCU.md       # Alıcı ödeme vadesi/davranışı — etiket gösterimi (skor yok)
    ├── ALICI-TEMIZLEME-MEKANIZMASI.md      # Ödeme yapmayan/geç yapan alıcıları temizleme (kademeli, damgasız)
    ├── ODEME-METRIKLERI-KAYNAKLARI.md      # Geç ödeme & ödenmeyen iş metrikleri — veri kaynakları (beyan + bildirim + admin)
    ├── SGK-URET-VERGISI-ZORUNLU-KRITER.md  # SGK + ücret vergisi düzenli ödeme — zorunlu kriter (talep, teklif, puanlama, admin)
    ├── MVP-BLUEPRINT.md               # MVP 12 bölüm — tek sayfa özet (yatırımcı/üst yönetim)
    ├── MVP-SUNUM-YATIRIMCI.md         # MVP sunumu: 14 slayt metni (yatırımcı/yönetici)
    ├── MVP-MOBIL-STRATEJI.md          # Mobil uygulama: evet ama önce PWA, sonra Provider app (React Native/Flutter)
    ├── TASARIM-KODLAMA-SIRASI.md     # Karar: önce tasarım, sonra kodlama
    ├── FIGMA-MVP-SIRASI.md           # 15 MVP ekranı Figma çizim sırası (field-by-field)
    ├── FIGMA-BRIEF-01-LANDING.md     # Landing Page — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-02-ROL-SECIMI.md  # Rol Seçimi — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-03-ALICI-KAYIT.md # Alıcı Kayıt — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-04-SAGLAYICI-KAYIT.md # Sağlayıcı Kayıt — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-05-GIRIS-YAP.md       # Giriş Yap (Login) — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-06-ALICI-DASHBOARD.md  # Alıcı Dashboard — Figma çizim brief’i (MVP)
    ├── FIGMA-BRIEF-07-TALEP-OLUSTURMA.md  # Talep Oluşturma (ürünün kalbi) — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-08-TALEP-DETAYI-ALICI.md # Talep Detayı (Alıcı) — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md # Sağlayıcı Dashboard — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-10-SAGLAYICI-PROFIL.md    # Sağlayıcı Profil & Profil Tamamlama — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-11-UYGUN-TALEPLER-LISTESI.md # Uygun Talepler Listesi (Sağlayıcı) — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-12-TALEP-DETAYI-SAGLAYICI.md  # Talep Detayı (Sağlayıcı) & Teklif Ver — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-13-ADMIN-LOGIN.md             # Admin Login & Yetkilendirme — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-14-ADMIN-DASHBOARD.md         # Admin Dashboard (Kontrol Merkezi) — Figma brief’i (MVP)
    ├── FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md    # Admin Liste & İnceleme (Talep/Teklif/Alıcı/Sağlayıcı) — MVP son ekran
    ├── FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md # Sağlayıcı: Ödeme Durumu Bildir (modül + modal)
    ├── FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md # Admin: Ödeme Davranışı İnceleme ekranı
    ├── API-KONTRAT-SABLONU.md        # Endpoint + request/response + 8 tablo + RBAC
    └── DURUM-OZET.md                 # En son neredeydik / buraya kadar ne yaptık
```

---

## Platform kuralları (wireframe)

- **Bütçe gizliliği:** Alıcı bütçeyi girer; sağlayıcı rakamı görmez, sadece “uygundur / uygun değildir” görür.
- **Eşleştirme, ihale değil:** Akıllı eşleştirme mantığı; talep ekranındaki her alan teklif için anlamlı.

Detaylı ekranlar, alanlar ve doğrulama kuralları: **[docs/WIREFRAME.md](docs/WIREFRAME.md)**

---

## Neredeyiz / Sonraki adımlar

**En son aşama:** MVP tam kapsamlı çalışmalar listesi tamamlandı. Tasarım → akış → MVP kapsamı → veritabanı → backend → test → go-live kağıt üzerinde net. **Kodlama veya tasarıma başlamaya hazır noktadayız.**

**Kronolojik özet:** [docs/DURUM-OZET.md](docs/DURUM-OZET.md) — “Buraya kadar ne yaptık?” tek bakışta.

**Bundan sonraki doğal adımlar (sen seç):**  
1) MVP iş paketleri + takvim (2–4–6 hafta) · 2) Backend API’leri sözleşme (contract) · 3) Figma’da MVP ekranları alan bazlı · 4) Teknik stack (backend, frontend, auth, DB)

**Diğer olası adımlar:**

| # | Adım | Açıklama |
|---|------|----------|
| 1 | Ana sayfa sloganı & değer önerisi | Metin ve CTA’lar |
| 2 | Veri modeli (ER / DB) | Entity’ler, ilişkiler, bütçe alanları nasıl saklanır |
| 3 | Figma / UI promptları | Bu wireframe’e göre ekran tasarımı brief’i |
| 4 | Gelir modeli | Komisyon, üyelik, başarı primi (vizyonla uyumlu) |
| 5 | Hukuki gereklilikler | ÖGG lisansı, sözleşme şablonları, KVKK |
| 6 | Teknik stack & backend | API, auth, veritabanı |

---

*Güvenlik hizmeti alan ve veren firmaları buluşturan B2B pazar yeri projesi.*
#   s e c u r i t y  
 #   s e c u r i t y  
 