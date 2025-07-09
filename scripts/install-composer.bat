@echo off
REM Composer Installer für Windows

echo 🔍 Prüfe ob Composer bereits installiert ist...
where composer >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ Composer ist bereits installiert.
    composer --version
    exit /b 0
)

echo ⬇️ Installiere Composer...

REM Temporäres Verzeichnis erstellen
mkdir temp
cd temp

REM Composer Installer herunterladen
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

REM Installer ausführen
php composer-setup.php

REM Composer in das Projekt verschieben
move composer.phar ..\composer.phar

REM Aufräumen
php -r "unlink('composer-setup.php');"
cd ..
rmdir temp

echo ✅ Composer wurde lokal installiert. Verwende 'php composer.phar' anstelle von 'composer'.
echo ✨ Fertig!
