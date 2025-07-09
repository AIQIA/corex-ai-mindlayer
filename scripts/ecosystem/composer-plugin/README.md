# coreX AI MindLayer Composer Plugin

Dieses Plugin integriert die `.ai.json` Verwaltung in Composer-Workflows.

## 🚀 Installation

```bash
# Im Hauptverzeichnis des Projekts
cd scripts/ecosystem/composer-plugin
composer install
```

## 🧩 Verwendung

### Automatische Integration

Das Plugin wird automatisch nach Composer-Installationen und -Updates ausgeführt.

### Manuelle Ausführung

```bash
# Via Composer Command (wenn im Plugin-Verzeichnis installiert)
php vendor/bin/composer aimindlayer:update

# Oder direkt (ohne vollständige Composer-Installation)
php src/ComposerPlugin.php
```

## 🛠️ Funktionen

- Automatische Erkennung von PHP-Frameworks
- Erfassung aller Composer-Abhängigkeiten
- Intelligente Aktualisierung der `.ai.json`

## 🧪 Fallback-Option

Wenn Composer nicht verfügbar ist, kann auch der Standalone-PHP-Scanner verwendet werden:

```bash
php ../php-scanner/PhpProjectScanner.php
```
