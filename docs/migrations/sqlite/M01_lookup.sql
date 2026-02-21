-- M01 — Lookup / Sözlük (cities, districts) — SQLite
-- Bağımlılık: M00 (no-op)

BEGIN;

CREATE TABLE IF NOT EXISTS cities (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  name    TEXT NOT NULL,
  UNIQUE (city_id, name)
);

CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts(city_id);

COMMIT;
