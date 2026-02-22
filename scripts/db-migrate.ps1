# db/migrations/*.sql dosyalarini sirayla calistirir (Docker)
# Kullanim: .\scripts\db-migrate.ps1  veya  npm run db:migrate (server icinden)
# Proje kokunden calistir.

$ErrorActionPreference = "Stop"

$ContainerName = if ($env:CONTAINER_NAME) { $env:CONTAINER_NAME } else { "gus-psql" }
$DbName       = if ($env:PGDATABASE) { $env:PGDATABASE } else { "gus_mvp" }
$DbUser       = if ($env:PGUSER) { $env:PGUSER } else { "postgres" }

$MigrationsDir = "db\migrations"
if (-not (Test-Path $MigrationsDir)) {
  Write-Host "Klasor yok: $MigrationsDir"
  exit 0
}

$files = Get-ChildItem -Path $MigrationsDir -Filter "*.sql" | Sort-Object Name
if ($files.Count -eq 0) {
  Write-Host "Migration dosyasi yok: $MigrationsDir\*.sql"
  exit 0
}

Write-Host "=== db:migrate (Docker: $ContainerName, DB: $DbName) ==="
foreach ($f in $files) {
  $name = $f.Name
  Write-Host "  - $name"
  docker cp "$($f.FullName)" "${ContainerName}:/tmp/$name"
  if ($LASTEXITCODE -ne 0) { exit 1 }
  docker exec -i $ContainerName psql -U $DbUser -d $DbName -f "/tmp/$name" -v ON_ERROR_STOP=1
  if ($LASTEXITCODE -ne 0) { exit 1 }
}
Write-Host "Bitti. ($($files.Count)) migration calistirildi."
