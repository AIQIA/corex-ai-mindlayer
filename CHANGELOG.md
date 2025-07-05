# 📦 CHANGELOG – coreX AI MindLayer

> Alle Änderungen, Verbesserungen und Erweiterungen dieses Repos – sauber dokumentiert für Entwickler, Nutzer und KI-Systeme.

---

## [2.0.0] – 2025-07-05

### 🚀 Major Modernization Release

**Core Changes:**

- **Open Source Transformation**: Komplette Umstellung auf MIT-Lizenz und Community-fokussierten Standard
- **Intelligent Project Scanner**: `ai-init.php` erweitert zu intelligentem CLI-Tool mit Framework-Erkennung (Laravel, Vue, React, Django, etc.)
- **JSON Schema Validation**: Vollständiges JSON Schema (`schema.json`) für `.ai.json` mit strenger Validierung
- **VS Code Extension**: Native VS Code Integration mit Snippets, Commands und Scanner-Integration

**New Features:**

- **Framework Detection**: Automatische Erkennung von 15+ Frameworks und Technologien
- **Interactive CLI Setup**: Intelligente Fragen zur Projektstruktur und automatische `.ai.json` Generierung
- **GitHub Actions CI/CD**: Automatische Schema-Validierung in CI/CD Pipeline
- **Dev Container Support**: Vollständige Entwicklungsumgebung mit Docker
- **VS Code Workspace**: Optimierte Einstellungen und Extensions für Entwicklung

**Technical Improvements:**

- **NPM Package Distribution**: `package.json` für Node.js/NPM Ecosystem
- **EditorConfig**: Konsistente Code-Formatierung
- **TypeScript Extension**: Vollständig typisierte VS Code Extension
- **Snippet System**: Intelligente Code-Snippets für `.ai.json` Erstellung

### 🧠 VS Code Extension Features

- **Commands**:
  - `Create .ai.json`: Erstellt neue `.ai.json` Datei mit Template
  - `Validate .ai.json`: Schema-Validierung für bestehende Dateien
  - `Run Intelligent Scanner`: Führt PHP-Scanner aus und generiert `.ai.json`
- **Snippets**: Intelligente Code-Vervollständigung für `.ai.json` Strukturen
- **Context Menus**: Rechtsklick-Integration im Explorer
- **Auto-Validation**: Automatische Schema-Prüfung beim Speichern

### 🔧 Infrastructure

- **GitHub Actions**: Automatische Tests und Schema-Validierung
- **DevContainer**: Vollständige Docker-basierte Entwicklungsumgebung
- **Workspace Settings**: VS Code optimiert für AI-freundliche Entwicklung

---

## [1.0.0] – 2025-07-04

### 🧠 Initial Release

- Erste Veröffentlichung des AI-Standards `.ai.json`
- Einführung der zentralen Komponenten:
  - `.ai.json` (Wissensstruktur)
  - `ai-init.php` (Erkennung)
  - `AI-INTEGRATION.md` (Dokumentation für Assistenten)
- Projektstruktur mit `README.md`, `LICENSE.md`, `.gitignore` und `.ai.json.example`
- Aufbau GitHub-Repo & erste Publikation unter:  
  [https://github.com/AIQIA/corex-ai-mindlayer](https://github.com/AIQIA/corex-ai-mindlayer)

---

## Geplant (voraussichtlich 1.1.0)

- JSON-Validator/Parser zur Prüfung der `.ai.json`
- Interaktive Landingpage für Live-Demo und Einstieg
- Erweiterung der Standardfelder (`modules`, `tags`, `relations`)
- Integration in weitere Tools (z. B. Composer/NPM-Paketstruktur)
