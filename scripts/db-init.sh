#!/usr/bin/env bash
# Migration + seed tek seferde (PostgreSQL)
# Kullanım:
#   ./scripts/db-init.sh
#   PGDATABASE=my_db ./scripts/db-init.sh
# Docker container'dan: docker exec -it gus-psql psql -U postgres -d gus_mvp -f - < ...
# Bu script proje kökünden çalıştırılmalı (cd security; ./scripts/db-init.sh)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

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

for f in M00_extensions.sql M01_lookup.sql M02_auth.sql M03_organizations.sql M04_provider_profiles.sql M04b_provider_min_price.sql M05_requests.sql M06_request_matches.sql M07_offers.sql M08_engagements_payment.sql M09_risk_admin_audit.sql; do
  echo "  - $f"
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$MIGRATIONS_DIR/$f" -v ON_ERROR_STOP=1
done

echo "Seed çalıştırılıyor: $SEED_FILE"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$SEED_FILE" -v ON_ERROR_STOP=1

echo "Bitti. Doğrulama:"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
