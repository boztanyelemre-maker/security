-- Minimum Seed (MVP) — PostgreSQL
-- Tabloların migration ile oluşturulmuş olduğunu varsayar.
-- Şifre hash'ini uygulama tarafında üretmen önerilir; alan açık bırakıldı.
--
-- Çalıştırma: psql -U postgres -d <veritabani_adi> -f minimum-seed.sql

BEGIN;

-- =========================
-- 1) ROLES (MVP zorunlu)
-- =========================
INSERT INTO roles (code, name)
VALUES
  ('BUYER_USER',    'Buyer User'),
  ('PROVIDER_USER', 'Provider User'),
  ('ADMIN_SUPER',   'Super Admin'),
  ('ADMIN_OPS',     'Operations Admin'),
  ('ADMIN_RISK',    'Risk & Finance Admin'),
  ('ADMIN_SUPPORT', 'Support Admin')
ON CONFLICT (code) DO NOTHING;

-- =========================
-- 2) CITIES (Pilot seed - hızlı)
--    İstersen 81 ili sonra ekleriz.
-- =========================
INSERT INTO cities (id, name) VALUES
  (34, 'İstanbul'),
  (6,  'Ankara'),
  (35, 'İzmir'),
  (16, 'Bursa'),
  (7,  'Antalya'),
  (41, 'Kocaeli'),
  (1,  'Adana'),
  (48, 'Muğla')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- 3) DISTRICTS (Opsiyonel - MVP'de district nullable ise şart değil)
--    Örnek: İstanbul'dan birkaç ilçe.
-- =========================
-- Tabloda UNIQUE(city_id, name) olmalı.
INSERT INTO districts (city_id, name) VALUES
  (34, 'Sarıyer'),
  (34, 'Beşiktaş'),
  (34, 'Şişli'),
  (34, 'Kadıköy'),
  (34, 'Üsküdar')
ON CONFLICT (city_id, name) DO NOTHING;

-- =========================
-- 4) SUPER ADMIN (Opsiyonel ama önerilir)
--    password_hash değerini uygulamadan üretip REPLACE_WITH_BCRYPT_HASH yerine koy.
-- =========================

-- 4.1 Admin user oluştur (email varsa atla)
WITH inserted_user AS (
  INSERT INTO users (id, email, password_hash, full_name, phone, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'admin@platform.com',
    '$2b$12$REPLACE_WITH_BCRYPT_HASH', -- <-- UYGULAMADAN ÜRET
    'Platform Admin',
    NULL,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id
),
resolved_user AS (
  SELECT id FROM inserted_user
  UNION ALL
  SELECT id FROM users WHERE email = 'admin@platform.com' LIMIT 1
),
resolved_role AS (
  SELECT id AS role_id FROM roles WHERE code = 'ADMIN_SUPER' LIMIT 1
)
INSERT INTO user_roles (user_id, role_id, created_at)
SELECT ru.id, rr.role_id, NOW()
FROM resolved_user ru
CROSS JOIN resolved_role rr
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 4.2 Audit log (opsiyonel)
INSERT INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, metadata_json, created_at)
SELECT
  gen_random_uuid(),
  u.id,
  'ADMIN_SUPER',
  'SEED_SUPER_ADMIN_CREATED',
  'USER',
  u.id,
  jsonb_build_object('email', u.email),
  NOW()
FROM users u
WHERE u.email = 'admin@platform.com'
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =============================================================================
-- Hızlı kontrol sorguları (seed sonrası çalıştırılabilir)
-- =============================================================================

-- Roller geldi mi?
-- SELECT code, name FROM roles ORDER BY code;

-- Şehirler geldi mi?
-- SELECT id, name FROM cities ORDER BY id;

-- Admin rolü bağlandı mı?
-- SELECT u.email, r.code
-- FROM users u
-- JOIN user_roles ur ON ur.user_id = u.id
-- JOIN roles r ON r.id = ur.role_id
-- WHERE u.email = 'admin@platform.com';
