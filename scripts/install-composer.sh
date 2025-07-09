#!/bin/bash
# Composer Installer für lokales Testing

echo "🔍 Prüfe ob Composer bereits installiert ist..."
if command -v composer &> /dev/null; then
    echo "✅ Composer ist bereits installiert."
    composer --version
    exit 0
fi

echo "⬇️ Installiere Composer..."

# Temporäres Verzeichnis erstellen
mkdir -p temp
cd temp

# Composer Installer herunterladen
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

# Installer ausführen
php composer-setup.php

# Composer nach /usr/local/bin verschieben (erfordert sudo)
if [ -w /usr/local/bin ]; then
    echo "🔧 Installiere Composer global..."
    mv composer.phar /usr/local/bin/composer
    echo "✅ Composer wurde global installiert."
else
    echo "🔧 Installiere Composer lokal..."
    mv composer.phar ../composer.phar
    echo "✅ Composer wurde lokal installiert. Verwende 'php composer.phar' anstelle von 'composer'."
fi

# Aufräumen
php -r "unlink('composer-setup.php');"
cd ..
rmdir temp

echo "✨ Fertig! Teste Composer mit: composer --version"
