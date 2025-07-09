# CHANGELOG – coreX AI MindLayer

Alle Änderungen, Verbesserungen und Erweiterungen dieses Repos – dokumentiert für Entwickler, Nutzer und KI-Systeme.

---

## [3.4.1] – 2025-07-09

### Verbesserte Composer-Integration

**Robuste Composer-Plugin-Architektur:**

- Fix: Fehlererkennung bei nicht installiertem Composer verbessert
- Mehrschichtiges Fallback-System bei Composer-Problemen
- PhpProjectScanner als zuverlässige Alternative implementiert
- Automatische Migration zur geeignetsten Lösung

#### Technische Verbesserungen

- Verbesserte Fehlererkennung in VS Code Extension
- Detaillierte Benutzerführung mit konkreten Lösungsvorschlägen
- Erweiterte Prüfungen für Composer-Verfügbarkeit
- Optimierte Standalone-PHP-Scanner-Implementation

---

## [3.4.0] – 2025-07-09

### Ecosystem Integration Verbesserungen

**Composer Plugin Verbesserungen:**

- Standalone Composer Plugin für Projekte ohne Composer-Installation
- Verbesserte Erkennung fehlender Composer-Abhängigkeiten
- Intelligente Fallback-Mechanismen bei fehlendem Composer

#### Technische Verbesserungen

- VS Code Extension prüft jetzt auf tatsächliche Verfügbarkeit von Composer
- Automatischer Fallback zum Standalone-Plugin oder PHP-Scanner
- Bessere Benutzerführung bei fehlender Composer-Installation
- Detaillierte Fehlermeldungen mit Installationshinweisen

---

## [3.3.0] – 2025-07-09

### Ecosystem Integration

**Neue Ecosystem Features:**

- Auto-Sync Tool – Synchronisierung von `.ai.json` mit Projekt-Dokumentation
- Package Manager Plugins – NPM und Composer Integration
- Docker Integration – Container-Konfiguration und Dokumentation

#### Neue Befehle (3)

- `Run Auto-Sync` – Dokumentation automatisch synchronisieren
- `Update from Package Manager` – `.ai.json` aus package.json/composer.json aktualisieren
- `Scan Docker Configuration` – Docker-Konfiguration analysieren und dokumentieren

#### Technische Verbesserungen

- Optimierte VSIX-Paketgröße mit .vscodeignore
- Vollständige TypeScript-Kompilierung aller neuen Features
- Erweiterte Dokumentation in STATUS.md

---

## [3.2.0] – 2025-07-05

### Feature Integration (v3.0.0 + v3.1.0)

**Alle Funktionen kombiniert & aktiv:**

#### Reaktivierte Funktionen aus v3.0.0

- Architecture Preview – Visualisierung der Projektstruktur
- Tree Explorer – Navigierbare AI-basierte Projektstruktur
- AI IntelliSense – Kontextbasierte Codevervollständigung

#### Erweiterungen aus v3.1.0

- Mind Map Visualizer – Graphvisualisierung der `.ai.json`
- AI Documentation Comments – Automatische Doku-Kommentare
- Diff Analyzer – Strukturvergleich für `.ai.json`

#### Befehlsübersicht (6)

- `Architecture Preview` – Projektarchitektur anzeigen
- `Open Tree Explorer` – Interaktive Projektstruktur
- `Enable AI IntelliSense` – Smarte Vervollständigung
- `Show Mind Map` – Mind Map für `.ai.json`
- `Generate AI Docs` – Kommentierung durch AI
- `Compare Diff` – `.ai.json` Versionen vergleichen

**Technisch:**

- Alle Features kompilieren fehlerfrei
- VSIX vollständig & getestet
- Kein Feature deaktiviert

---

## [3.1.0] – 2025-07-05

### AI-Integration

- Mind Map Visualizer (D3.js)
- AI-generierte Dokumentationskommentare
- `.ai.json` Diff Viewer mit Highlight-Funktion

**Befehle:**

- `Show Mind Map`
- `Generate AI Docs`
- `Compare Diff`

---

## [3.0.0] – 2025-07-05

### VS Code Erweiterungen

- Architektur-Vorschau aus `.ai.json`
- Interaktiver Tree Explorer
- Kontextbasierte IntelliSense-Vervollständigung

**Befehle:**

- `Architecture Preview`
- `Open Tree Explorer`
- `Enable AI IntelliSense`

---

## [2.0.0] – 2025-07-05

### Major Release: Struktur & Validierung

- MIT-Lizenz, Open Source
- Framework-Erkennung im Scanner (Laravel, Vue, React …)
- Vollständiges JSON-Schema für `.ai.json`
- GitHub Actions: Auto-Validierung
- Dev Container + Docker-Support
- VS Code Workspace mit TypeScript & Snippets

**Neue Features:**

- `Create .ai.json`
- `Validate .ai.json`
- `Run Intelligent Scanner`

---

## [1.0.0] – 2025-07-04

### Initial Release

- `.ai.json` als zentrales Wissenssystem
- Einführung: `ai-init.php`, `AI-INTEGRATION.md`, `.ai.json.example`
- Projektstruktur & Start bei:
  https://github.com/AIQIA/corex-ai-mindlayer

---

## In Planung (v1.1.0)

- Validator & Parser für `.ai.json`
- Interaktive Demo auf Landingpage
- Standarderweiterung (`modules`, `tags`, `relations`)
- Integration in Composer/NPM-Pakete
