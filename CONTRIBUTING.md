# 🤝 Beitrag leisten – coreX AI MindLayer v3.7.0

## ⚠️ WICHTIG: Dokumentations-Redundanz

ABSOLUTE REDUNDANZ zwischen allen .md Dateien ist PFLICHT! (Ausgenommen sind Dateien in .ai.json.ignore)

- Alle Änderungen MÜSSEN in ALLEN .md Dateien gespiegelt werden
- Ausnahmen sind nur die in .ai.json.ignore gelisteten Dateien
- Bei Änderungen immer ALLE .md Dateien prüfen und aktualisieren
- Unterschiedliche Perspektiven sind erlaubt, aber Fakten müssen identisch sein

Danke, dass du Interesse hast, dieses Projekt zu unterstützen!  
coreX AI MindLayer steht für einen offenen, zukunftsorientierten AI-Standard zur strukturierten Projektverständlichkeit für KI-Systeme.

## 📚 Wichtige Ressourcen

Bevor du anfängst:

- 📖 [README.md](README.md) - Projektübersicht
- 🤖 [INITIALIZE.md](INITIALIZE.md) - KI-Kontext & Grundprinzipien
- 📋 [CHANGELOG.md](CHANGELOG.md) - Aktuelle Änderungen
- 🎯 [TODO.md](TODO.md) - Aktuelle Entwicklungsziele

## 🎯 Aktuelle Schwerpunkte (v3.7.0)

1. **Sicherer Update-Mechanismus**

   - Schema-Vergleichsanalyse
   - Backup-System
   - Datenschutz-Features

2. **ML-Features (in Entwicklung)**

   - Architekturanalyse
   - Code-Qualitäts-Scoring
   - Predictive Maintenance

3. **Skalierbarkeits-Features**
   - JSON Modularisierung
   - Komprimierungsstrategien
   - Alternative Datenhaltung

## 🧱 Mitmachen

**Neu hier?** 📦 Siehe [INSTALL.md](INSTALL.md) für Setup-Anleitung!

Aktuell befindet sich das Projekt in der Aufbauphase.  
Geplante Beteiligungsformen:

- Vorschläge zur Erweiterung der `.ai.json`-Spezifikation
- Diskussion über sinnvolle AI-Tags, Annotationen und Kontextformen
- Verbesserung der Dokumentation und Developer Experience
- Entwicklung von Tools (Parser, Playground, Validatoren)
- Übersetzungen der Inhalte (Deutsch, Englisch, andere)

---

## 📜 Regeln & Hinweise

- Bitte alle Vorschläge klar strukturiert über Issues oder Pull Requests einreichen
- Achte auf konsistenten Stil, klare Sprache und verständliche Beispiele
- Die Datei `.ai.json.example` dient als Ausgangspunkt für eigene Experimente

---

## 📋 Entwicklung & Testing

### 📦 Voraussetzungen

- PHP 7.4 oder höher
- Node.js (für VS Code Extension)
- VS Code (für Extension Development)

### 🧪 Testing

Für Composer Plugin:

```bash
# Wenn Composer installiert ist
cd scripts/ecosystem/composer-plugin
composer install
cd ../../..

# Oder als Standalone (ohne Composer)
php scripts/ecosystem/composer-plugin/src/ComposerPlugin.php

# Alternativ: PHP Scanner
php scripts/ecosystem/php-scanner/PhpProjectScanner.php
```

Für VS Code Extension:

```bash
cd vscode-extension
npm install
npm run compile
npx vsce package
```

---

## Arbeiten mit externen Konfigurationsdateien

### Fehlerszenarien (.ai.errors.json)

- Neue Fehlerszenarien sollten in `.ai.errors.json` hinzugefügt werden
- Jeder Fehler braucht:
  - Eindeutigen Code (z.B. "SCAN_001")
  - Aussagekräftige Beschreibung
  - Liste möglicher Ursachen
  - Konkrete Lösungsvorschläge
  - Severity-Level (low, medium, high, critical)

### Automatisierte Tasks (.ai.auto-tasks.json)

- Neue automatische Tasks in `.ai.auto-tasks.json` definieren
- Erforderliche Felder:
  - Task-Name
  - Trigger (wann wird der Task ausgeführt)
  - Command (was wird ausgeführt)
  - Error Handling (was passiert bei Fehlern)
  - Priority (Ausführungspriorität)

### Best Practices

- Externe Dateien gehören ins Git Repository
- Änderungen müssen mit dem Schema kompatibel sein
- Ausführliche Tests vor Pull Requests durchführen
- Dokumentation bei Änderungen aktualisieren

---

## 🧾 Rechtliches

Durch Beiträge erklärst du dich damit einverstanden, dass deine Änderungen unter der MIT-Lizenz (modifiziert) dieses Projekts veröffentlicht werden.

---

## 💬 Fragen oder Vorschläge?

👉 Erstelle ein GitHub Issue  
📧 Oder schreib an [info@aiqia.de](mailto:info@aiqia.de)
