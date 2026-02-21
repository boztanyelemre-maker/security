# Veri modeli: Admin, talepler, teklifler, belgeler, notlar, log

Admin panel wireframe’ine göre ihtiyaç duyulan tablolar ve ilişkiler. Mevcut **docs/VERI-MODELI.md** ile birlikte kullanılır.

---

## 1. Mevcut tablolarla ilişki

- **companies** — role: BUYER | PROVIDER | (ADMIN ayrı tablo da olabilir)
- **buyer_profiles**, **provider_profiles** — mevcut

Aşağıdakiler buna eklenir veya detaylandırılır.

---

## 2. Admin kullanıcıları

**Seçenek A:** `companies.role = 'ADMIN'` (firma değil, platform yöneticisi hesabı da companies’te)

**Seçenek B:** Ayrı tablo `admin_users`

| Alan | Açıklama |
|------|----------|
| id | PK |
| email | Unique, giriş için |
| password_hash | |
| role | admin / super_admin (opsiyonel: fiyat/audit sadece super_admin) |
| status | active / locked |
| locked_until | (Opsiyonel) 5 yanlış deneme → 15 dk |
| created_at, updated_at | |

---

## 3. Talepler (requests)

| Alan | Açıklama |
|------|----------|
| id | PK |
| company_id | FK → companies (alıcı) |
| status | draft / published / closed / cancelled |
| service_type | Fiziki, Özel, Mobil, Etkinlik |
| location | İl/İlçe |
| staff_count | Personel sayısı |
| budget_min, budget_max | **Sadece sistem + admin (gizlilik); sağlayıcıya gösterilmez** |
| start_date | Başlangıç tarihi |
| contract_duration | (Opsiyonel) |
| created_at, updated_at | |

**Admin listesi:** Bu tablodan çekilir; filtreler status, location, service_type, tarih, teklif sayısı (offers’tan aggregate).

---

## 4. Teklifler (offers)

| Alan | Açıklama |
|------|----------|
| id | PK |
| request_id | FK → requests |
| company_id | FK → companies (sağlayıcı) |
| status | sent / viewed / shortlisted / awarded / rejected |
| amount | Aylık teklif bedeli (TL) — **vizyon: adminde gösterimi opsiyonel veya sadece super_admin** |
| description | Hizmet açıklaması |
| created_at, updated_at | |

---

## 5. Belgeler (documents) — sağlayıcı

| Alan | Açıklama |
|------|----------|
| id | PK |
| company_id | FK → companies (sağlayıcı) |
| file_name | Yükleme dosya adı |
| file_path | veya storage URL |
| document_type | lisans, sertifika, vb. |
| status | eksik / inceleme / onaylı |
| reviewed_at | Admin inceleme tarihi |
| reviewed_by | FK → admin_users (opsiyonel) |
| created_at | |

**Sağlayıcı “teklif verebilir” kuralı:** Profil tamam + en az bir belge `status = 'onaylı'` (veya “inceleme” kabul ediliyorsa o). Eksik ise teklif verme kilitli.

---

## 6. Admin notları (admin_notes)

| Alan | Açıklama |
|------|----------|
| id | PK |
| company_id | FK → companies (alıcı veya sağlayıcı) |
| author_id | FK → admin_users (veya companies.id admin ise) |
| body | Not metni (admin içi) |
| created_at | |

Alıcı/sağlayıcı detay sayfasında “Notlar” sekmesi buradan doldurulur.

---

## 7. Denetim / aksiyon logu (audit_logs)

| Alan | Açıklama |
|------|----------|
| id | PK |
| entity_type | company / request / offer / document |
| entity_id | İlgili kayıt ID |
| action | status_change / suspended / activated / note_added / document_approved |
| old_value | (Opsiyonel) JSON veya metin |
| new_value | (Opsiyonel) JSON veya metin |
| admin_id | FK → admin_users |
| reason | Örn. pasife alma sebebi (Sahte kayıt, Uygunsuz kullanım, …) |
| created_at | |

Pasife alırken **reason** zorunlu; sebep listesi sabit (Sahte kayıt, Uygunsuz kullanım, Ödeme/uyuşmazlık, Spam, Diğer).

---

## 8. Pasife alma sebepleri (sabit liste)

Kod veya küçük tablo ile yönetilebilir:

- `fake_registration` — Sahte kayıt
- `improper_use` — Uygunsuz kullanım
- `payment_dispute` — Ödeme/uyuşmazlık
- `spam` — Spam
- `other` — Diğer

`audit_logs.reason` veya `company_suspensions.reason` bu değerlerden biri olur.

---

## 9. İnceleme kuyruğu (sorgu)

Ayrı tablo gerekmez; **sorgu** ile üretilir:

- Sağlayıcılar where: belge durumu = “eksik” veya “inceleme” **veya** risk işareti (şikayet sayısı, vb.)
- Liste: firma, eksik belge, risk işareti; aksiyon: incele → onayla / düzeltme iste / pasife al

---

## 10. Özet şema (ER özeti)

```
companies (id, role BUYER|PROVIDER, status, ...)
  ├── buyer_profiles
  ├── provider_profiles
  ├── requests (company_id = alıcı)
  │     └── offers (request_id, company_id = sağlayıcı)
  ├── documents (company_id = sağlayıcı, status)
  ├── admin_notes (company_id)
  └── audit_logs (entity_type, entity_id, action, reason, admin_id)

admin_users (id, email, role admin|super_admin, ...)  [veya companies.role=ADMIN]
```

Bu şema, **ADMIN-PANEL-WIREFRAME.md** içindeki liste kolonları, filtreler, detay sekmeleri ve aksiyonlar için gerekli alanları karşılar. Bütçe/fiyat gizliliği ve “ihale yok” kuralı modele yansıtıldı (bütçe sadece requests’te, adminde kullanım kısıtlı; teklif tutarı opsiyonel/super_admin).
