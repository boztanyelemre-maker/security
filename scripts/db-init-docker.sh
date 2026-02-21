#!/usr/bin/env bash
# Docker ile DB ayağa kaldır + migration + seed (psql yoksa bile çalışır)
# Kullanım: ./scripts/db-init-docker.sh
# Proje kökünden çalıştır.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

CONTAINER_NAME="${CONTAINER_NAME:-gus-psql}"
DB_NAME="${PGDATABASE:-gus_mvp}"
DB_USER="${PGUSER:-postgres}"
DB_PASS="${PGPASSWORD:-postgres}"

echo "=== 1) PostgreSQL container ==="
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Container yok, oluşturuluyor: $CONTAINER_NAME"
  docker run --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASS" \
    -e POSTGRES_DB="$DB_NAME" \
    -p 5432:5432 \
    -d postgres:16
  echo "DB hazır olana kadar 5–10 sn bekleniyor..."
  sleep 8
else
  if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container duruyor, başlatılıyor: $CONTAINER_NAME"
    docker start "$CONTAINER_NAME"
    sleep 3
  fi
fi

echo "=== 2) Migration + seed dosyaları container'a kopyalanıyor ==="
docker exec "$CONTAINER_NAME" mkdir -p /migrations /seed
for f in M00_extensions.sql M01_lookup.sql M02_auth.sql M03_organizations.sql M04_provider_profiles.sql M04b_provider_min_price.sql M05_requests.sql M06_request_matches.sql M07_offers.sql M08_engagements_payment.sql M09_risk_admin_audit.sql; do
  docker cp "docs/migrations/$f" "$CONTAINER_NAME:/migrations/$f"
done
docker cp docs/seed/minimum-seed.sql "$CONTAINER_NAME:/seed/seed.sql"

echo "=== 3) Migration'lar çalıştırılıyor ==="
for f in M00_extensions.sql M01_lookup.sql M02_auth.sql M03_organizations.sql M04_provider_profiles.sql M04b_provider_min_price.sql M05_requests.sql M06_request_matches.sql M07_offers.sql M08_engagements_payment.sql M09_risk_admin_audit.sql; do
  echo "  - $f"
  docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f "/migrations/$f" -v ON_ERROR_STOP=1
done

echo "=== 4) Seed çalıştırılıyor ==="
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /seed/seed.sql -v ON_ERROR_STOP=1

echo "=== 5) Smoke test ==="
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT current_database(), current_user, now();"
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT code, name FROM roles ORDER BY code;"

echo ""
echo "Bitti. Bağlantı: host=localhost port=5432 db=$DB_NAME user=$DB_USER password=$DB_PASS"
echo "DBeaver/pgAdmin ile bağlanabilirsin."
