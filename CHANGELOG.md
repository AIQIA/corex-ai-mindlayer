# 📦 CHANGELOG – coreX AI MindLayer

> Alle Änderungen, Verbesserungen und Erweiterungen dieses Repos – sauber dokumentiert für Entwickler, Nutzer und KI-Systeme.

---

## [3.2.0] – 2025-07-05

### 🎯 Complete Feature Integration (v3.0.0 + v3.1.0)

**All Features Combined & Working:**

- **v3.0.0 Features RESTORED**:

  - ✅ **Architecture Preview**: Visuelle Darstellung der Projektstruktur
  - ✅ **Tree Explorer**: Interaktive Navigation durch AI-strukturierte Projekte
  - ✅ **AI IntelliSense**: Kontextbasierte Code-Vervollständigung

- **v3.1.0 Features ACTIVE**:
  - ✅ **Mind Map Visualizer**: Interaktive Graphvisualisierung von .ai.json
  - ✅ **AI Documentation Comments**: Automatische Doku-Kommentare
  - ✅ **Diff Analyzer**: Vergleich von .ai.json Dateien

**Complete Command Set (6 Commands):**

- `🏗️ Architecture Preview`: Zeigt visuelle Projektarchitektur
- `🌳 Open Tree Explorer`: Interaktive Projektnavigation
- `🧠 Enable AI IntelliSense`: Aktiviert AI-basierte Code-Vervollständigung
- `🧠 Show Mind Map`: Mind Map Visualizer für .ai.json
- `🤖 Generate AI Docs`: Automatische AI-Dokumentations-Kommentare
- `📊 Compare Diff`: Diff-Analyzer für .ai.json Vergleiche

**Technical Improvements:**

- Alle Features kompilieren fehlerfrei
- VSIX-Package erfolgreich erstellt und getestet
- Keine temporären Deaktivierungen mehr
- Vollständig funktional v3.2.0 Release

---

## [3.1.0] – 2025-07-05

### 🤖 AI Integration Features

**Advanced AI Integration:**

- **Mind Map Visualizer**: Interaktive Graphvisualisierung der .ai.json Struktur
  - Force-directed Graph Layout für Architecture Components
  - Interactive Node-Navigation mit Zoom/Pan
  - D3.js-basierte Web-Visualization in VS Code Panel
- **AI Documentation Comments**: Automatische Dokumentations-Kommentare
  - AI-generierte Kommentare basierend auf .ai.json Context
  - Smart Code-Analyse für bessere Doku-Qualität
  - Integration in bestehende Code-Files
- **Diff Analyzer**: .ai.json Vergleichstool
  - Side-by-Side Vergleich von .ai.json Dateien
  - Highlighting von Changes in Architecture/Components
  - Import/Export für .ai.json Versioning

**New Commands:**

- `🧠 Show Mind Map`: Mind Map Visualizer für .ai.json
- `🤖 Generate AI Docs`: Automatische AI-Dokumentations-Kommentare
- `📊 Compare Diff`: Diff-Analyzer für .ai.json Vergleiche

---

## [3.0.0] – 2025-07-05

### 🚀 VS Code Extension Advanced Features

**Extended VS Code Integration:**

- **Architecture Preview**: Visuelle Darstellung der Projektstruktur aus `.ai.json`
  - Interactive Component Cards mit Hover-Effekten
  - Architecture Patterns Übersicht
  - Modern VS Code Theme Design
- **Tree Explorer**: Interaktive Navigation durch AI-strukturierte Projekte
  - Klickbare Ordnerstruktur mit Expand/Collapse
  - Direkt-Öffnen von Dateien durch Klick
  - Basiert auf `project.structure` in `.ai.json`
- **AI IntelliSense**: Kontextbasierte Code-Vervollständigung
  - Auto-Completion für Architecture Components
  - Key Concepts als Keyword-Suggestions
  - Funktioniert in allen Dateitypen

**New Commands:**

- `🏗️ Architecture Preview`: Zeigt visuelle Projektarchitektur
- `🌳 Open Tree Explorer`: Interaktive Projektnavigation
- `🧠 Enable AI IntelliSense`: Aktiviert AI-basierte Code-Vervollständigung

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
