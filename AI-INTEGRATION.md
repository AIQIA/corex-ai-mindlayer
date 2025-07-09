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
