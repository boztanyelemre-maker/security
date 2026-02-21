# Docker Postgres baslat (gus_mvp) - PowerShell
# Kullanim: .\scripts\start-postgres.ps1

$name = "gus-psql"
$existing = docker ps -a -q -f "name=^$name$" 2>$null
if ($existing) {
  Write-Host "Container $name zaten var, baslatiliyor..."
  docker start $name
} else {
  Write-Host "Container $name olusturuluyor..."
  docker run --name $name `
    -e POSTGRES_USER=postgres `
    -e POSTGRES_PASSWORD=postgres `
    -e POSTGRES_DB=gus_mvp `
    -p 5432:5432 `
    -d postgres:16
}
if ($LASTEXITCODE -ne 0) {
  Write-Host "HATA: Docker calismadi. Docker Desktop yuklu ve calisiyor mu?"
  exit 1
}
Write-Host ""
Write-Host "Postgres hazir: localhost:5432, DB=gus_mvp, user=postgres, password=postgres"
