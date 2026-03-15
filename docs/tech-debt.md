# Teknik borç listesi

Bu dosya MVP sonrası v2, refactor, performans ve eksik özellikleri listeler.

---

## v2'ye kalanlar

- **Engagement / sözleşme akışı:** Talep–teklif sonrası “kabul” ve sözleşme adımı; şu an sadece shortlist/reject var, kazanana atama ve engagement tablosu yok.
- **Bütçe gizliliği tam uygulama:** Sağlayıcıya bütçe aralığı değil sadece “uygun / uygun değil” (veya band) gösterimi; mevcut eşleşmelerde band var, UI tarafında netleştirme.
- **Talep kapatma / iptal:** Buyer’ın talebi kapatması, “filled” veya “cancelled” durumları.
- **Bildirimler:** E-posta veya in-app bildirim (yeni teklif, shortlist, ödeme raporu vb.).
- **Wildcard CORS:** `.env.example`’da netlify için wildcard geçti; express `cors` tam origin bekliyor; v2’de pattern tabanlı origin veya proxy ile çözüm.
- **UUID validasyonu:** Controller + service + middleware üç katmanda tekrarlanan UUID kontrolü; v2’de tek merkezi middleware veya route-level validate.

---

## Refactor gerekenler

- **Şema uyumluluk kodu:** `offers` / `request_matches` için `offer_id` vs `id`, `total_price_try` vs `monthly_offer_try`, `budget_fit_band` vs `budget_band` gibi dallanmalar; migration’lar tam uygulanıp tek şema hedeflenmeli, fallback’ler kaldırılmalı.
- **Hata atma yardımcıları:** `requestService`, `offerService`, `paymentReportService` içinde tekrarlanan `err.code = '...'; throw err` pattern’i; ortak `createError(code, message, statusCode)` veya sınıf ile toplanmalı.
- **Admin controller:** `listRequests`, `listOffers`, `listRiskFlags`, `listPaymentReports` aynı pool/503 ve try-catch yapısını kullanıyor; ortak wrapper veya base helper ile sadeleştirilebilir.
- **Test script’leri:** `test-offer-post.js`, `test-admin-routes.js`, `test-error-format.js`, `test-rate-limit.js`, `test-e2e-smoke.js` içinde ortak `request()`, token/org_id çözme tekrarları; paylaşılan test util (örn. `scripts/test-utils.js`) ile birleştirilebilir.
- **Matching engine:** Publish sırasında sadece “OUT” band eşleşmelerinin yazılması; mantık netleştirilip IN/EDGE’in de yazılması veya ayrı bir matching job’a taşınması.

---

## Performans iyileştirmeleri

- **Rate limit:** Bellek tabanlı Map; çok instance’da paylaşılmaz. v2’de Redis (veya paylaşımlı store) ile merkezi rate limit.
- **Admin listeler:** `LIMIT 100` sabit; sayfalama (cursor veya offset) ve isteğe bağlı filtre (tarih, status, risk_band) eklenmeli.
- **N+1 / büyük listeler:** Buyer offers list, provider offers list için gerekirse sayfalama ve index kontrolü (request_id, provider_org_id, created_at).
- **Pool / connection:** Geliştirme ortamında pool size ve idle timeout ayarları gözden geçirilmeli; yük testi sonrası netleştirilebilir.
- **Log:** Pino sync hedefi; yük altında async destination veya dosyaya yazım düşünülebilir.

---

## Admin review eksikleri

- **Risk flag aksiyonları:** `risk_flags` listeleniyor; “resolve” / “dismiss” gibi admin aksiyonları ve gerekirse not alanı yok.
- **Tekil request/offer/risk detay:** Admin’in bir talebi, teklifi veya risk kaydını tek ekranda (detay API) inceleyebilmesi; şu an sadece listeler var.
- **Kullanıcı / organizasyon bloklama:** Şüpheli provider veya buyer’ı “disabled” veya “under_review” yapma; ilgili rol ve status alanları varsa API bağlanmalı.
- **Admin audit log görüntüleme:** Audit log’lar şu an sadece stdout/logger’a gidiyor; admin panelinde “son aksiyonlar” veya log sorgulama (DB’ye yazılırsa) eksik.
- **Dashboard KPI:** Dokümandaki KPI sorguları (talep sayısı, teklif sayısı, risk dağılımı) henüz endpoint olarak sunulmamış olabilir; `ADMIN-DASHBOARD-KPI-QUERIES.md` ile karşılaştırılıp eksikler kapatılmalı.

---

## Payment review / buyer score eksikleri

- **Ödeme davranışı özeti:** Admin’in bir buyer’a ait tüm payment report’ları toplu görmesi veya “ödeme skoru” (on_time oranı, gecikme sayısı) gösterimi yok.
- **Provider tarafında özet:** Provider’ın kendi girdiği ödeme raporlarının listesi veya “raporladığım alıcılar” özeti eksik olabilir.
- **Buyer score / trust:** Payment report’lardan türetilen bir “buyer score” veya “ödeme güvenilirliği” alanı ve buna göre sağlayıcı eşleşme veya uyarı mantığı yok.
- **Çift taraflı onay:** Ödeme raporu sadece provider’dan; alıcı tarafından “ödemeyi yaptım” onayı veya anlaşmazlık akışı yok.
- **Rapor düzeltme / güncelleme:** Mevcut upsert request bazlı; admin’in raporu düzeltmesi veya “dispute” sonrası güncelleme akışı tanımlı değil.

---

*Son güncelleme: MVP E2E smoke test ve admin payment-reports sonrası.*
