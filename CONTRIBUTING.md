# 🤝 Beitrag leisten – coreX AI MindLayer

Danke, dass du Interesse hast, dieses Projekt zu unterstützen!  
coreX AI MindLayer steht für einen offenen, zukunftsorientierten AI-Standard zur strukturierten Projektverständlichkeit für KI-Systeme.

---

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
