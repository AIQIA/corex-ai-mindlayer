# AI-INTEGRATION.md

## 🧠 Purpose

This file describes how AI assistants can detect and use the `.ai.json` file as a structured context layer within a developer project.

The goal is to provide intelligent tools with clear, machine-readable insight into project architecture, components, errors, and documentation – enabling more precise code suggestions, explanations, and interactions.

---

## 📁 File Location

The `.ai.json` file is located in the **root of the project**.

If present, AI assistants should:

1. Parse the file as JSON
2. Read all top-level fields (`meta`, `architecture`, `errors`, `tasks`, `context`, `references`)
3. Use that data to enrich code completion, explanation, and navigation

---

## 🔍 Detection Mechanism

To support automatic detection, a helper script (optional):

### `ai-init.php`

```php
<?php
// AI INIT MARKER
define("AIQIA_MINDLAYER_ACTIVE", true);
define("AI_JSON_FILE", __DIR__ . "/.ai.json");

// Optional: validation and assistant-specific flags
if (file_exists(AI_JSON_FILE)) {
    header("X-AI-Context: active");
    // You may echo metadata for debug
}
?>
```

---

## 🔌 Integration mit Package Managern

### Composer Integration

Die `.ai.json` Datei kann automatisch aus der `composer.json` erstellt und aktualisiert werden:

```php
// Direkte Ausführung des PHP Scanners
php scripts/ecosystem/php-scanner/PhpProjectScanner.php

// Oder via Composer Plugin (falls Composer installiert ist)
cd scripts/ecosystem/composer-plugin
composer install
cd ../../..
php scripts/ecosystem/composer-plugin/vendor/bin/composer aimindlayer:update
```

### NPM Integration

Für JavaScript/Node.js Projekte:

```bash
node scripts/ecosystem/npm-plugin/index.js
```

---

## 🔄 VS Code Extension

Die coreX AI MindLayer VS Code Extension bietet eine grafische Oberfläche und automatisierte Werkzeuge für die Verwaltung der `.ai.json` und die Integration mit KI-Assistenten.

Features:

- Architecture Preview
- Tree Explorer
- Mind Map Visualizer
- Auto-Sync mit Dokumentation
- Package Manager Integration
- Docker Configuration Scanner

Verfügbar unter: [GitHub Repository](https://github.com/AIQIA/corex-ai-mindlayer)

---

## 👤 Benutzereinstellungen (user_preferences)

Der neue `user_preferences` Abschnitt in der `.ai.json` ermöglicht es, persönliche Kommunikations- und Interaktionspräferenzen für KI-Assistenten zu definieren:

```json
"user_preferences": {
    "language": "deutsch",
    "communication_style": "informell",
    "technical_depth": "mittel",
    "response_format": "mit_codebeispielen",
    "note": "Dieses Projekt wird von einem deutschsprachigen Team entwickelt"
}
```

### Unterstützte Einstellungen:

- **language**: Bevorzugte Sprache (z.B. "deutsch", "english", "français")
- **communication_style**: Kommunikationsstil ("formal", "informell", "technisch", "freundschaftlich", "kompakt")
- **technical_depth**: Gewünschter technischer Detailgrad ("niedrig", "mittel", "hoch")
- **response_format**: Format der Antworten ("kurz", "ausführlich", "mit_codebeispielen", "mit_analogien")
- **note**: Zusätzliche Hinweise zu Benutzerpräferenzen

KI-Assistenten sollten diese Einstellungen berücksichtigen, um eine personalisierte und effektive Kommunikation zu ermöglichen.

---

# AI Integration Guide

## ⚠️ WICHTIG: Dokumentations-Redundanz

ABSOLUTE REDUNDANZ zwischen allen .md Dateien ist PFLICHT! (Ausgenommen sind Dateien in .ai.json.ignore)

- Änderungen in einer .md Datei erfordern identische Updates in allen anderen
- Ausnahmen sind nur durch Eintrag in .ai.json.ignore möglich
- Auto-Tasks überwachen die Dokumentations-Konsistenz
- Pull Requests werden auf Dokumentations-Redundanz geprüft

## Ignore-System

Die `.ai.json.ignore` Datei definiert, welche Dokumentationen von der Redundanz-Anforderung ausgenommen sind:

- Persönliche Notizen (z.B. git-hilfe.sascha.md)
- Private Dokumentationen (\*.private.md)
- Temporäre Notizen (\*.notes.md)

## File Structure

The coreX AI MindLayer uses a modular file structure for better maintainability. Some sections of the `.ai.json` are externalized into separate files:

### External Files

- `.ai.errors.json`: Contains detailed error scenarios and solutions

  - Used for growing error documentation
  - Referenced in `.ai.json` under the `errors` section
  - Should be committed to version control

- `.ai.auto-tasks.json`: Contains automated task definitions
  - Handles pre-commit, post-install, and other automated processes
  - Referenced in `.ai.json` under the `auto_tasks` section
  - Should be committed to version control

### Upcoming in v4.0

- `.aim-context.json`: Will handle persistent AI context (planned for v4.0)
  - Will store chat history and relevant context
  - Will be generated automatically
  - Should be added to `.gitignore`

## Best Practices

1. **Error Management**

   - Add new error scenarios to `.ai.errors.json`
   - Keep error messages consistent and informative
   - Include both causes and solutions

2. **Automated Tasks**
   - Define new automation tasks in `.ai.auto-tasks.json`
   - Each task should have clear triggers and error handling
   - Test automated tasks thoroughly before deployment
