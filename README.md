# coreX AI MindLayer v3.8.3 by Sascha Buscher - aiqia.de

## 🚀 Schnellstart

1. Installieren Sie die **CoreX AI MindLayer Extension** in VS Code
2. Öffnen Sie die Command Palette (Strg+Shift+P)
3. Führen Sie `CoreX: Initialize Project` aus
4. Die Extension führt Sie durch den Setup-Prozess

## ✨ Neue Features in v3.8.3

- 🔄 Vollautomatischer Setup-Prozess
- 🛠️ Nahtlose VS Code Integration
- 🤖 Direkte Copilot-Anbindung
- 📊 Status-Tracking in der IDE
- 🔒 Verbesserte Konfigurationsverwaltung

## ⚠️ WICHTIG: Dokumentations-Redundanz

ABSOLUTE REDUNDANZ zwischen allen .md Dateien ist PFLICHT! (Ausgenommen sind Dateien in .ai.json.ignore)

- Alle Dokumentationsdateien sind redundant gehalten
- Änderungen werden automatisch in allen Dateien gespiegelt
- Ausnahmen sind in .ai.json.ignore definiert
- Konsistenz wird durch auto_tasks überprüft

## 📚 Dokumentation & Ressourcen

| Datei               | Zweck                                 | Für wen?        |
| ------------------- | ------------------------------------- | --------------- |
| `README.md`         | Projektübersicht & Schnellstart       | Entwickler      |
| `.ai.json`          | Strukturierte Projektmetadaten        | KI-Assistenten  |
| `INITIALIZE.md`     | 🤖 **Primärer Einstiegspunkt für KI** | KI-Assistenten  |
| `AI-INTEGRATION.md` | Technische KI-Integration             | Entwickler & KI |
| `RESEARCH.md`       | KI-Forschung & Entwicklung            | Entwickler & KI |
| `schema.json`       | JSON Schema für .ai.json              | Entwickler      |

## 🔄 Neue Features in v3.8.0

### Modulare Struktur

- `.ai.json` verwendet jetzt ein modulares System
- Module werden in `.ai.modules/` gespeichert
- Verbesserte Wartbarkeit und Performance

### Automatisierte Tasks

- Validierung der Konfiguration
- Modul-Synchronisation
- Backup-Management
- Live-Watching

### KI-Optimierungen

- Erweitertes Kontextverständnis
- Verbesserte Code-Analyse
- Intelligente Entwicklungsunterstützung

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/AIQIA/corex-ai-mindlayer.git mein-projekt
cd mein-projekt
npm install
```

### 2. Konfiguration

```bash
cp .ai.json.example .ai.json  # Basis-Template kopieren
```

Passen Sie die `.ai.json` an Ihr Projekt an oder nutzen Sie den automatischen Scanner:

```bash
php ai-init.php --scan  # Automatische Projekterkennung
```

### 3. VS Code Extension

Installieren Sie unsere VS Code Extension für die beste Integration:

- Architecture Preview
- Tree Explorer
- Mind Map Visualizer
- Automatische Updates

📦 [VS Code Marketplace Link]

## 🔄 Aktuelle Version

**Version 3.7.0** (2025-07-15) bringt:

- Sicherer Update-Mechanismus
- Intelligente Schema-Vergleichsanalyse
- Mehrstufiges Backup-System
- Verbesserter Datenschutz

Alle Details im [CHANGELOG.md](CHANGELOG.md)

## 🤝 Community & Support

- **GitHub Issues:** Feature-Requests & Bugmeldungen
- **Discussions:** Fragen & Austausch
- **[Documentation]:** Ausführliche Guides
- **[Discord]:** Live Community Support

## 📝 Lizenz

Lizenziert unter der **MIT-Lizenz** mit Attributierungsanforderung.
Details in der [LICENSE](LICENSE) Datei.

## 📁 Projektstruktur

```
.
├── .ai.json               # Hauptkonfigurationsdatei
├── .ai.errors.json        # Fehlerszenarien und Lösungen
├── .ai.auto-tasks.json    # Automatisierte Aufgaben-Definitionen
├── ai-init.php           # Kern-Initialisierungsskript
├── scripts/              # Kernskripte und -tools
└── vscode-extension/     # VS Code Erweiterungsquelle
```

### Konfigurationsdateien

- `.ai.json`: Die Hauptkonfigurationsdatei, die die AI-ready Struktur Ihres Projekts definiert
- `.ai.errors.json`: Enthält detaillierte Fehlerszenarien, Ursachen und Lösungen
- `.ai.auto-tasks.json`: Definiert automatisierte Aufgaben für verschiedene Trigger (pre-commit, post-install, etc.)

Kommt in v4.0:

- `.aim-context.json`: Wird den persistente AI-Kontext und den Chatverlauf verwalten (zu .gitignore hinzufügen)

---

_"Making every project AI-ready, one .ai.json at a time."_
