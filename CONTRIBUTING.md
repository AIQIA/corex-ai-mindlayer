# 🤝 Beitrag leisten – coreX AI MindLayer v3.7.0

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

## 🧾 Rechtliches

Durch Beiträge erklärst du dich damit einverstanden, dass deine Änderungen unter der MIT-Lizenz (modifiziert) dieses Projekts veröffentlicht werden.

---

## 💬 Fragen oder Vorschläge?

👉 Erstelle ein GitHub Issue  
📧 Oder schreib an [info@aiqia.de](mailto:info@aiqia.de)
