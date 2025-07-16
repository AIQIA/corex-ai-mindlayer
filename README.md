# coreX AI MindLayer v3.7.0 by Sascha Buscher - aiqia.de

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
| `schema.json`       | JSON Schema für .ai.json              | Entwickler      |
| `CHANGELOG.md`      | Versions- und Änderungshistorie       | Alle            |
| `TODO.md`           | Entwicklungsziele & Roadmap           | Entwickler & KI |
| `INSTALL.md`        | Installationsanleitung                | Entwickler      |

> **🤖 Für KI-Assistenten:** Bitte lesen Sie zuerst `INITIALIZE.md` für ein vollständiges Verständnis des Projekts und seiner Funktionsweise.

## 🧠 Was ist der coreX AI MindLayer?

Der **coreX AI MindLayer** ist eine innovative Metaebene, die statisches Projektwissen in ein strukturiertes, maschinenlesbares Format für KI-Assistenten wie ChatGPT, GitHub Copilot, Cody und andere transformiert.

Das Herzstück ist die `.ai.json`-Datei – eine lebende, strukturierte Abbildung der Projektarchitektur, Logik, Fehlermuster und Arbeitsabläufe. Sie ermöglicht es KI-Tools, Ihr Projekt wirklich zu verstehen.

### 🎯 Kernfunktionen

1. **Universelle KI-Schnittstelle**

   - Standardisiertes Format für Projektmetadaten
   - Automatische Architekturerkennung
   - Intelligente Kontextanalyse

2. **Smarte Integration**

   - VS Code Extension mit 12+ Features
   - Multi-Language Scanner (7 Sprachen)
   - Automatische Updates & Synchronisation

3. **KI-Optimierung**
   - Kontextbewusste Unterstützung
   - Beschleunigte Einarbeitung
   - Verbesserte Fehlerdiagnose

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
