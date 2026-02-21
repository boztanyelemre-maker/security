-- Minimum Seed (MVP) — SQLite
-- Tabloların migration ile oluşturulmuş olduğunu varsayar (sqlite klasöründeki M00–M09).
-- DB Browser for SQLite veya: sqlite3 <db.db> < minimum-seed-sqlite.sql
-- Şifre hash'ini uygulama tarafında üretmen önerilir.

BEGIN;

-- =========================
-- 1) ROLES (MVP zorunlu)
-- =========================
INSERT OR IGNORE INTO roles (code, name) VALUES
  ('BUYER_USER',    'Buyer User'),
  ('PROVIDER_USER', 'Provider User'),
  ('ADMIN_SUPER',   'Super Admin'),
  ('ADMIN_OPS',     'Operations Admin'),
  ('ADMIN_RISK',    'Risk & Finance Admin'),
  ('ADMIN_SUPPORT', 'Support Admin');

-- =========================
-- 2) CITIES (Pilot seed)
-- =========================
INSERT OR IGNORE INTO cities (id, name) VALUES
  (34, 'İstanbul'),
  (6,  'Ankara'),
  (35, 'İzmir'),
  (16, 'Bursa'),
  (7,  'Antalya'),
  (41, 'Kocaeli'),
  (1,  'Adana'),
  (48, 'Muğla');

-- =========================
-- 3) DISTRICTS (Opsiyonel)
-- =========================
INSERT OR IGNORE INTO districts (city_id, name) VALUES
  (34, 'Sarıyer'),
  (34, 'Beşiktaş'),
  (34, 'Şişli'),
  (34, 'Kadıköy'),
  (34, 'Üsküdar');

-- =========================
-- 4) SUPER ADMIN (Opsiyonel)
--    Sabit id: uygulama UUID üretmediği için seed'de literal kullanıldı.
--    password_hash: uygulamadan bcrypt ile üretip değiştir.
-- =========================
INSERT OR IGNORE INTO users (id, email, password_hash, full_name, phone, is_active, created_at, updated_at)
VALUES (
  'seed-admin-user-id',
  'admin@platform.com',
  '$2b$12$REPLACE_WITH_BCRYPT_HASH',
  'Platform Admin',
  NULL,
  1,
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO user_roles (user_id, role_id, created_at)
SELECT 'seed-admin-user-id', id, datetime('now')
FROM roles WHERE code = 'ADMIN_SUPER' LIMIT 1;

INSERT OR IGNORE INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, metadata_json, created_at)
VALUES (
  'seed-audit-admin-1',
  'seed-admin-user-id',
  'ADMIN_SUPER',
  'SEED_SUPER_ADMIN_CREATED',
  'USER',
  'seed-admin-user-id',
  '{"email":"admin@platform.com"}',
  datetime('now')
);

COMMIT;

-- Kontrol (isteğe bağlı):
-- SELECT code, name FROM roles ORDER BY code;
-- SELECT id, name FROM cities ORDER BY id;
-- SELECT u.email, r.code FROM users u JOIN user_roles ur ON ur.user_id = u.id JOIN roles r ON r.id = ur.role_id WHERE u.email = 'admin@platform.com';
