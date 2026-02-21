# Docker ile DB ayağa kaldır + migration + seed (PowerShell)
# Kullanım: .\scripts\db-init-docker.ps1
# Proje kökünden çalıştır.

$ErrorActionPreference = "Stop"

$ContainerName = if ($env:CONTAINER_NAME) { $env:CONTAINER_NAME } else { "gus-psql" }
$DbName       = if ($env:PGDATABASE) { $env:PGDATABASE } else { "gus_mvp" }
$DbUser       = if ($env:PGUSER) { $env:PGUSER } else { "postgres" }
$DbPass       = if ($env:PGPASSWORD) { $env:PGPASSWORD } else { "postgres" }

$Migrations = @(
  "M00_extensions", "M01_lookup", "M02_auth", "M03_organizations", "M04_provider_profiles", "M04b_provider_min_price",
  "M05_requests", "M06_request_matches", "M07_offers", "M08_engagements_payment", "M09_risk_admin_audit", "M09a_risk_flags_idempotent"
)

Write-Host "=== 1) PostgreSQL container ==="
$namePattern = '^' + [regex]::Escape($ContainerName) + '$'
$exists = docker ps -a --format "{{.Names}}" | Select-String -Pattern $namePattern -Quiet
if (-not $exists) {
  Write-Host "Container yok, oluşturuluyor: $ContainerName"
  docker run --name $ContainerName `
    -e POSTGRES_USER=$DbUser `
    -e POSTGRES_PASSWORD=$DbPass `
    -e POSTGRES_DB=$DbName `
    -p 5432:5432 `
    -d postgres:16
  Write-Host "DB hazır olana kadar bekleniyor..."
  Start-Sleep -Seconds 8
} else {
  $running = docker ps --format "{{.Names}}" | Select-String -Pattern $namePattern -Quiet
  if (-not $running) {
    Write-Host "Container başlatılıyor: $ContainerName"
    docker start $ContainerName
    Start-Sleep -Seconds 3
  }
}

Write-Host "=== 2) Migration + seed dosyaları container'a kopyalanıyor ==="
docker exec $ContainerName mkdir -p /migrations /seed
foreach ($m in $Migrations) {
  docker cp "docs\migrations\$m.sql" "${ContainerName}:/migrations/$m.sql"
}
docker cp docs\seed\minimum-seed.sql "${ContainerName}:/seed/seed.sql"

Write-Host "=== 3) Migration'lar çalıştırılıyor ==="
foreach ($m in $Migrations) {
  Write-Host "  - $m.sql"
  docker exec -i $ContainerName psql -U $DbUser -d $DbName -f "/migrations/$m.sql" -v ON_ERROR_STOP=1
}

Write-Host "=== 4) Seed çalıştırılıyor ==="
docker exec -i $ContainerName psql -U $DbUser -d $DbName -f /seed/seed.sql -v ON_ERROR_STOP=1

Write-Host "=== 5) Smoke test ==="
docker exec -i $ContainerName psql -U $DbUser -d $DbName -c "SELECT current_database(), current_user, now();"
docker exec -i $ContainerName psql -U $DbUser -d $DbName -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
docker exec -i $ContainerName psql -U $DbUser -d $DbName -c "SELECT code, name FROM roles ORDER BY code;"

Write-Host ""
Write-Host "Bitti. Bağlantı: host=localhost port=5432 db=$DbName user=$DbUser password=$DbPass"
Write-Host "DBeaver/pgAdmin ile bağlanabilirsin."
