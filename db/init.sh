#!/usr/bin/env bash
# Migration + seed tek seferde (PostgreSQL)
# Kullanım: proje kökünden değil, backend'den: npm run db:init
#   veya proje kökünden: bash db/init.sh
# Postgres önce ayağa kalkmış olmalı (Docker veya yerel).

set -e

# db/init.sh'in bulunduğu dizinin bir üstü = proje kökü
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# Varsayılan: localhost gus_mvp. Override: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-gus_mvp}"
export PGPASSWORD="${PGPASSWORD:-postgres}"

MIGRATIONS_DIR="docs/migrations"
SEED_FILE="docs/seed/minimum-seed.sql"

if ! command -v psql &> /dev/null; then
  echo "psql bulunamadı. PostgreSQL client kurun veya Docker ile: docker exec -it gus-psql psql ..."
  exit 1
fi

echo "DB: $PGDATABASE @ $PGHOST:$PGPORT (user: $PGUSER)"
echo "Migration'lar çalıştırılıyor..."

for f in M00_extensions.sql M01_lookup.sql M02_auth.sql M03_organizations.sql M04_provider_profiles.sql M04b_provider_min_price.sql M05_requests.sql M06_request_matches.sql M07_offers.sql M08_engagements_payment.sql M09_risk_admin_audit.sql M09a_risk_flags_idempotent.sql; do
  if [ -f "$MIGRATIONS_DIR/$f" ]; then
    echo "  - $f"
    psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$MIGRATIONS_DIR/$f" -v ON_ERROR_STOP=1
  fi
done

echo "Seed çalıştırılıyor: $SEED_FILE"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$SEED_FILE" -v ON_ERROR_STOP=1

echo "Bitti. Tablolar:"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
