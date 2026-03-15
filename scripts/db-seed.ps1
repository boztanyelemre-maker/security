# db/seed/*.sql dosyalarini sirayla calistirir (Docker)
# Kullanim: npm run db:seed (server icinden) veya .\scripts\db-seed.ps1
# Proje kokunden calistir.

$ErrorActionPreference = "Stop"

$ContainerName = if ($env:CONTAINER_NAME) { $env:CONTAINER_NAME } else { "gus-psql" }
$DbName       = if ($env:PGDATABASE) { $env:PGDATABASE } else { "gus_mvp" }
$DbUser       = if ($env:PGUSER) { $env:PGUSER } else { "postgres" }

$SeedDir = "db\seed"
if (-not (Test-Path $SeedDir)) {
  Write-Host "Klasor yok: $SeedDir"
  exit 0
}

$files = Get-ChildItem -Path $SeedDir -Filter "*.sql" | Sort-Object Name
if ($files.Count -eq 0) {
  Write-Host "Seed dosyasi yok: $SeedDir\*.sql"
  exit 0
}

Write-Host "=== db:seed (Docker: $ContainerName, DB: $DbName) ==="
foreach ($f in $files) {
  $name = $f.Name
  Write-Host "  - $name"
  docker cp "$($f.FullName)" "${ContainerName}:/tmp/$name"
  if ($LASTEXITCODE -ne 0) { exit 1 }
  docker exec -i $ContainerName psql -U $DbUser -d $DbName -f "/tmp/$name" -v ON_ERROR_STOP=1
  if ($LASTEXITCODE -ne 0) { exit 1 }
}
Write-Host "Bitti. Kontrol icin: docker exec -i gus-psql psql -U postgres -d gus_mvp -c 'SELECT * FROM roles;'"
