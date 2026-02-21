# Migration + seed tek seferde (PostgreSQL) — Windows PowerShell
# Kullanım: .\scripts\db-init.ps1
# Ortam: $env:PGDATABASE = "gus_mvp"; $env:PGPASSWORD = "postgres"
# Proje kökünden çalıştır: cd security; .\scripts\db-init.ps1

$ErrorActionPreference = "Stop"

$HostName = if ($env:PGHOST) { $env:PGHOST } else { "localhost" }
$Port     = if ($env:PGPORT) { $env:PGPORT } else { "5432" }
$User     = if ($env:PGUSER) { $env:PGUSER } else { "postgres" }
$Database = if ($env:PGDATABASE) { $env:PGDATABASE } else { "gus_mvp" }
$Password = if ($env:PGPASSWORD) { $env:PGPASSWORD } else { "postgres" }

$env:PGPASSWORD = $Password

$Migrations = @(
  "M00_extensions", "M01_lookup", "M02_auth", "M03_organizations", "M04_provider_profiles", "M04b_provider_min_price",
  "M05_requests", "M06_request_matches", "M07_offers", "M08_engagements_payment", "M09_risk_admin_audit", "M09a_risk_flags_idempotent"
)
$MigrationsDir = "docs\migrations"
$SeedFile      = "docs\seed\minimum-seed.sql"

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  Write-Host "psql bulunamadı. PostgreSQL client kurun veya Docker kullanın."
  exit 1
}

Write-Host "DB: $Database @ ${HostName}:$Port (user: $User)"
Write-Host "Migration'lar çalıştırılıyor..."

foreach ($m in $Migrations) {
  $path = Join-Path $MigrationsDir "$m.sql"
  Write-Host "  - $m.sql"
  & psql -h $HostName -p $Port -U $User -d $Database -f $path -v ON_ERROR_STOP=1
}

Write-Host "Seed çalıştırılıyor: $SeedFile"
& psql -h $HostName -p $Port -U $User -d $Database -f $SeedFile -v ON_ERROR_STOP=1

Write-Host "Bitti. Tablolar:"
& psql -h $HostName -p $Port -U $User -d $Database -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
