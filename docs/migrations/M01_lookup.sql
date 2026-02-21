-- M01 — Lookup / Sözlük (cities, districts)
-- Bağımlılık: M00

BEGIN;

CREATE TABLE IF NOT EXISTS cities (
  id   INT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
  id      BIGSERIAL PRIMARY KEY,
  city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  name    TEXT NOT NULL,
  UNIQUE (city_id, name)
);

CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts(city_id);

COMMIT;
