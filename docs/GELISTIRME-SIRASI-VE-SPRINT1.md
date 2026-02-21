# Geliştirme Sırası (MVP → Backend → API → Frontend) + Sprint 1

En doğru ve en az riskli yol: önce scope, sonra motor, sonra kontrat, sonra UI.

---

## Doğru sıra

### 1) MVP

- Ne yapıyoruz / ne yapmıyoruz netleşir  
- 15 ekran + kritik iş kuralları + scope kilitlenir  

➡️ *Bunu büyük ölçüde tamamladık.*

### 2) Backend

- İş kuralları, doğrulamalar, matching, risk, ödeme davranışı burada çalışır  
- DB + servis katmanı + RBAC  

➡️ Ürünün **motoru**.

### 3) API

- Backend’in dışarı açılan sözleşmesi: endpoint’ler, request/response, hata kodları  
- Swagger / OpenAPI ile dokümante edilir  

➡️ Frontend ve mobilin **kontratı**.

### 4) Frontend

- Ekranları API’ye bağlar  
- UI/UX iterasyonu burada hızlanır  

➡️ Backend oturunca çok hızlı ilerler.

---

## Önemli nüans

**API, backend’den ayrı bir “adım” değil:** Backend’i yazarken API’yı aynı anda tanımlarsın.  

Disiplin olarak:

1. Önce **iş mantığı + veri** (backend)  
2. Sonra **kontrat** (API dokümantasyonu / OpenAPI)  
3. Sonra **UI** (frontend bağlama)  

Yani: **Backend + API birlikte** ilerler; frontend, API hazır oldukça bağlanır.

---

## Bu projeye özel net öneri

**Şimdi yapılacak iş:**

- **Backend + API birlikte**  
  Auth → Requests → Matching → Offers  
  (Sırayla: Auth/RBAC, Buyer requests + publish + matching, Provider profile + matches + offers, Offer band + risk.)

**Frontend:**

- Önce **Figma** (ekranlar tasarımda netleşir)  
- Sonra API hazır oldukça **bağlama** (ekran bazlı)  

---

## Sprint 1 — 7 günlük net yapılacaklar

**Hedef:** Auth + RBAC çalışsın; 5 ekran (1–5 + 13) backend’e bağlanabilir hale gelsin.

| Gün | Yapılacak | Bitecek endpoint’ler | Çalışacak ekranlar |
|-----|------------|----------------------|---------------------|
| **1** | Proje iskeleti, DB bağlantı, config, health | GET /health | — |
| **2** | JWT + auth middleware, RBAC (BUYER/PROVIDER/ADMIN) | — | — |
| **3** | POST register/buyer, register/provider (DB zinciri) | POST /auth/register/buyer, /auth/register/provider | 3, 4 (kayıt formları) |
| **4** | POST login, GET /auth/me; POST admin/auth/login | POST /auth/login, GET /auth/me, POST /admin/auth/login | 5 (Giriş), 13 (Admin giriş) |
| **5** | Cities/districts (meta); register formlarında şehir dropdown | GET /cities, GET /districts?city_id= | 3, 4 (şehir seçimi) |
| **6** | Validasyon + hata kodları (400, 401, 403, 409); test | Aynı endpoint’ler, doğru HTTP + body | 3, 4, 5 (negatif test) |
| **7** | Dokümantasyon (OpenAPI/Swagger taslağı); smoke test listesi | — | 1, 2, 3, 4, 5, 13 (manuel checklist) |

**Sprint 1 sonunda:**

- Kayıt (alıcı/sağlayıcı) ve giriş (user + admin) çalışır  
- GET /auth/me ile session restore yapılabilir  
- Frontend ekran 1–5 ve 13 bu API’lere bağlanabilir  

**Sprint 2 (sonraki 7 gün) önerisi:** Buyer requests (POST/PUT/GET), POST publish, matching job tetikleme → Ekran 6, 7, 8 (kısmi).

---

*Kodlama sırası: [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md). Backend hazırlık: [BACKEND-HAZIRLIK-DURUMU.md](BACKEND-HAZIRLIK-DURUMU.md). Test: [MVP-TEST-PLANI-15-SAYFA.md](MVP-TEST-PLANI-15-SAYFA.md).*
