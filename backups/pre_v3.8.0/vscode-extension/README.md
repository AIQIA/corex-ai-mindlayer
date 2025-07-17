# VS Code Extension für coreX AI MindLayer

## 🚀 Features

- **Intelligent .ai.json Editor** mit Auto-Complete und Validierung
- **Live Architecture Preview** - Visualisierung der Projektstruktur
- **Schema Validation** - Echtzeit-Validierung gegen JSON Schema
- **Quick Actions** - Schnelles Hinzufügen von Modulen, Fehlern, Tasks
- **Smart Snippets** - Vorgefertigte Templates für alle Bereiche
- **Integration mit AI Scanner** - Direkter Aufruf von ai-init.php

## 📦 Installation

### Aus Source kompilieren:

```bash
cd vscode-extension
npm install
npm run compile
npm run package
```

### Installation der .vsix Datei:

```bash
code --install-extension corex-ai-mindlayer-3.4.1.vsix
```

## 🎯 Verwendung

1. **Öffne ein Projekt** mit .ai.json Datei
2. **Sidebar** zeigt automatisch AI MindLayer Explorer
3. **Command Palette** (Ctrl+Shift+P) → "AI MindLayer"
4. **Rechtsklick** in .ai.json → Context-Menü mit AI-Aktionen

### Befehle:

- `AI MindLayer: Create .ai.json` - Neue .ai.json erstellen
- `AI MindLayer: Add Module` - Architektur-Modul hinzufügen
- `AI MindLayer: Add Error` - Fehler-Pattern hinzufügen
- `AI MindLayer: Add Task` - Task hinzufügen
- `AI MindLayer: Preview Architecture` - Architektur-Übersicht öffnen
- `AI MindLayer: Run Scanner` - Intelligenten Scanner ausführen
- `AI MindLayer: Validate Schema` - JSON Schema validieren

### Snippets:

- `ai-json` - Komplette .ai.json Template
- `ai-module` - Architektur-Modul
- `ai-error` - Fehler-Pattern
- `ai-task` - Task-Item
- `ai-context` - Kontext-Eintrag
- `ai-reference` - Referenz

## ⚙️ Konfiguration

```json
{
  "aiMindLayer.autoValidate": true,
  "aiMindLayer.showArchitecturePreview": true,
  "aiMindLayer.enableIntelliSense": true,
  "aiMindLayer.scannerAutoRun": false
}
```

## 🔗 Integration

Die Extension integriert sich nahtlos mit:

- **GitHub Copilot** - Besserer Kontext durch .ai.json
- **ChatGPT** - Projektverständnis durch strukturierte Daten
- **Other AI Tools** - Standard-konforme JSON-Struktur

## 📈 Development

```bash
# Development Mode
npm run watch

# Testing
npm run test

# Packaging
npm run package

# Publishing
npm run publish
```

---

**🤖 Part of the coreX AI MindLayer ecosystem**  
https://github.com/AIQIA/corex-ai-mindlayer
