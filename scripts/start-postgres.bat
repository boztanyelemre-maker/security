@echo off
REM Docker Postgres baslat (gus_mvp) - Windows CMD
REM Kullanim: scripts\start-postgres.bat  veya cift tikla

docker ps -a -q -f name=^gus-psql$ >nul 2>&1
if %errorlevel% equ 0 (
  echo Container gus-psql zaten var, baslatiliyor...
  docker start gus-psql
) else (
  echo Container gus-psql olusturuluyor...
  docker run --name gus-psql -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gus_mvp -p 5432:5432 -d postgres:16
)
if %errorlevel% neq 0 (
  echo HATA: Docker calismadi. Docker Desktop yuklu ve calisiyor mu?
  pause
  exit /b 1
)
echo.
echo Postgres hazir: localhost:5432, DB=gus_mvp, user=postgres, password=postgres
pause
