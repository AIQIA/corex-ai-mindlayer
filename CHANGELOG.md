# CHANGELOG – coreX AI MindLayer

Alle Änderungen, Verbesserungen und Erweiterungen dieses Repos – dokumentiert für Entwickler, Nutzer und KI-Systeme.

---

## [4.0.0] - 2026-06-17

### "Compass, not Chronicle" - Major Reset & Revision

Dieser Release markiert einen vollständigen technologischen und konzeptionellen Neustart der Extension. Ziel ist maximale Leichtigkeit, radikale Reduktion des AI-Kontexts und proaktive Steuerung von AI-Agenten.

#### 🏗️ Neue Architektur & Modularisierung
- **Tabula Rasa**: Komplette Überarbeitung des Source-Codes. Weg von monolithischen Dateien hin zu testbaren Modulen (`src/core`, `src/commands`, `src/views`).
- **Semantic Project Compass**: Einführung einer semantischen Tree View in der VS Code Activity Bar. Fokus auf Projektidentität, Red Lines, Architektur und Feature-Areas aus dem Index.
- **Moderner Stack**: Optimierte TypeScript-Konfiguration und AJV-basierte Validierung.

#### 🛡️ Validierung & Sicherheit (Phase 2 & 3)
- **Deep Validation**: Automatisches Scanning von AIM-Dateien gegen neue, strikte JSON-Schemas.
- **Reference Check**: Erkennt "Dead References" (verlinkte Dateien, die nicht existieren) sofort.
- **Secret Scanner**: Integrierte Heuristik zur Warnung vor API-Keys oder Passwörtern in Projekt-Gedächtnis-Dateien.
- **Live Diagnostics**: Fehler und Warnungen werden direkt im VS Code Editor markiert.

#### 🤖 AI-Centric Setup (Phase 4 & 5)
- **Multi-Agent Detection**: Intelligente Installation von Anker-Dateien für Claude (`CLAUDE.md`), Copilot, Cursor und allgemeine Agents via QuickPick.
- **Smart Onboarding**: Neuer Befehl `AIM: Prepare AI Onboarding Briefing`. Kopiert eine proaktive "Mission" für KIs, die diese dazu anweist, das Projekt eigenständig zu scannen und den User zu interviewen.
- **Agent Guidance**: Verschärfte Instruktionen in den Anker-Templates zwingen KIs zur proaktiven Pflege des MindLayers.

#### 🧩 Quality of Life
- **Smart Diagnostics**: Verbesserte Fehlerlokalisierung (Range Detection) in AIM-Dateien.
- **Modulare Erweiterung**: Neuer Befehl `AIM: Add Feature Details File` für schnelles Hinzufügen von Wissens-Modulen.
- **Neue Snippets**: `ai-root`, `ai-index` und `ai-details` Templates für das neue, modulare Datenmodell.
- **Reduziertes UI**: Entfernung unbenutzter Webviews und redundanter Commands zur Verbesserung der Performance.
- **Statusbar-Integration**: Schneller Zugriff auf den Validierungs-Status.

---

## [3.8.5] - 2025-07-20

### Verbesserungen

- **Project Visualizer (Beta)**
  - Erste Implementation des neuen Project Visualizers
  - Modernes VS Code-konformes Design
  - Unterstützung für Mind Map und Tree View
  - Responsive Layout mit VS Code Theming
  - Verbesserte Code-Struktur durch CSS-Auslagerung

## [3.9.0] - PLANNED

### Feature-Optimierung & Modularisierung

**Geplante Zusammenlegungen:**

- Mind Map und Tree Explorer werden zu "Project Visualizer"
  - Verbesserte Visualisierungsoptionen
  - Einheitliche Benutzeroberfläche
  - Performance-Optimierung
- Auto-Sync und Package-Update werden zu "Smart Update System"
  - Intelligente Update-Erkennung
  - Automatische Dependency-Analyse
  - Verbessertes Konfliktmanagement

**Geplante Modularisierung:**

- Docker Integration als optionales Add-on
- Research Management als separates Feature-Modul
- Verbesserte Erweiterbarkeit durch Plugin-System

**UI/UX Verbesserungen:**

- Integration der User Preferences in VS Code Settings
- Streamlined Command-Palette
- Verbesserte Dokumentations-Integration

## [3.8.4] - 2025-07-20

### Code-Qualität & Cleanup Features

**Neue Features:**

- Implementierung der Deinstallations-Funktionalität
  - Automatische Bereinigung aller AIM-Dateien bei Extension-Deinstallation
  - Sicheres Entfernen von .ai.json und zugehörigen Ordnern
  - Benutzerfreundliche Bestätigungsmeldungen

**Technische Verbesserungen:**

- PSR-4 Konformität hergestellt
  - Umbenennung aller Analyzer-Dateien gemäß PSR-4 Standard
  - Korrektur der Namespace-Struktur
- Fehlerbehebung im StreamProcessor
  - Korrekter Typ-Hint für JsonStreamingParser
  - Verbesserte Fehlerbehandlung
- Anpassung der Test-Validierung
  - Syntax-Check statt vollständiger Ausführung
  - Verbesserte CI/CD Integration

**Dokumentation:**

- Aktualisierte Deinstallations-Anleitung
- Verbesserte Code-Dokumentation
- Klare Namespace-Struktur

## [3.8.3] - 2025-07-20

### Installation & Setup Verbesserungen

**Cleanup & Optimierung:**

- Bereinigung temporärer Entwicklungsdateien
  - Entfernt: `.ai.json.example.new`
  - Entfernt: `.ai.json.example.tmp`
  - Entfernt: `INITIALIZE.md.new`
  - Entfernt: `schema.json.new`
- Verbesserte Codestruktur in der Extension

**Neue Features:**

- Vollständig automatisierter Setup-Prozess
- VS Code Extension Integration
  - Direkter Setup über die Extension
  - Automatische Copilot Integration
  - Status-Anzeige in der IDE

**Technische Verbesserungen:**

- Neue `install.ai.json` für Extension-gesteuerte Installation
- Verbessertes Konfigurations-Management
  - Lokale `.ai.json.config` (nicht im Repository)
  - Example-Konfiguration als Referenz
- Sicherer Extension-Token für Setup-Prozess

**Dokumentation:**

- Aktualisierte Installations-Anweisungen
- Neue Entwickler-Dokumentation für Extension-Integration
- Verbesserte Benutzerführung während Setup

## [3.8.2] - 2025-07-20

### Performance & Architektur Update

**Performance-Optimierungen:**

- Neue Performance-first Architektur
  - Modulares Speichersystem mit Lazy Loading
  - Smart Caching-Mechanismen
  - Ressourcen-Monitoring und Limits

**Schema-Erweiterungen:**

- Performance-Metriken integriert
  - Memory Usage Tracking
  - Load Time Monitoring
  - Response Time Analysis
  - Disk Usage Tracking

**Kontext-Management:**

- Optionales Kontext-System eingeführt
  - Smart Mode für automatische Anpassung
  - Resource-Aware Kontext-Handling
  - Initial-Text Alternative implementiert

**Dokumentation:**

- TODO.md restrukturiert für klare Priorisierung
- Neue Performance-Guidelines
- Verbesserte Modul-Dokumentation

## [3.8.2] - 2025-07-19

### Machine Learning Vorbereitung

**Framework für ML-Features:**

- Code-Analyzer

  - Komplexitätsanalyse-Framework
    - Zyklomatische Komplexität
    - Kognitive Komplexität
    - Verschachtelungstiefe
  - Performance-Metriken-System
    - Speicherverbrauch-Analyse
    - Zeitkomplexitäts-Schätzung
    - Optimierungspotential-Erkennung
  - Wartbarkeits-Bewertung
    - Lesbarkeits-Score
    - Dokumentations-Coverage
    - Kopplungs-Analyse

- Kontext-Analyzer

  - Prioritäts-Engine
    - Dringlichkeits-Bewertung
    - Wichtigkeits-Scoring
    - Abhängigkeits-Analyse
    - Ressourcen-Planung
  - Impact-Assessment
    - Änderungs-Scope-Analyse
    - Risiko-Bewertung
    - Nutzen-Analyse
    - Aufwands-Schätzung
  - ML-basierte Empfehlungen
    - Aktions-Vorschläge
    - Timeline-Optimierung
    - Ressourcen-Allokation

- ML-Modul Integration
  - Konfigurierbares Scoring-System
  - Anpassbare Schwellenwerte
  - Trainings-Daten-Management
  - Feedback-Loop-System

## [3.8.1] - 2025-07-19

### Performance-Verbesserungen

**Erweiterte Performance-Optimierung:**

- Stream-Verarbeitung

  - Implementierung eines Stream-Processors für .ai.json
  - Chunk-basierte JSON-Verarbeitung
  - Reduzierter Speicherverbrauch
  - Optimierte Verarbeitung großer Dateien

- Cache-System
  - Einführung eines zentralen Cache-Managers
  - Intelligentes Caching häufig genutzter Daten
  - Konfigurierbarer TTL (Time To Live)
  - Automatische Cache-Invalidierung

**Technische Verbesserungen:**

- PHP-Abhängigkeiten
  - Update auf PHP 8.2
  - Integration des JSON-Streaming-Parsers
  - Optimierte Autoloader-Konfiguration

## [3.8.0] - 2025-07-17

### Performance-Optimierungen

**Umfassende Performance-Verbesserungen durch Modularisierung:**

- .ai.json Modularisierung

  - Einführung des `$modules` Systems für referenzierte Teil-Dateien
  - Automatische Modul-Erkennung und -Verarbeitung
  - Verbesserte Wartbarkeit durch logische Trennung
  - Unterstützung für selektives Laden von Modulen
  - Schema-Updates für modulare Struktur

**Automatisierte Build- und Wartungsprozesse:**

- Implementierung von VS Code Tasks
  - Automatische Validierung der AI-Konfiguration
  - Modul-Updates bei Änderungen
  - Backup-System mit lokalem und globalem Storage
  - Live-Watching für Konfigurations-Änderungen

**Verbesserte Datensicherheit:**

- Erweitertes Backup-System

  - Konfigurierbare Backup-Speicherorte
  - Automatische Aufbewahrungszeit-Verwaltung
  - Gesicherte Versionierung aller Module

- Datei-Komprimierung

  - Neue Komprimierungsfunktion für große .ai.json Dateien
  - GZIP-basierte Kompression der Module
  - Base64-Kodierung für verbesserte Kompatibilität
  - Automatische Dekomprimierung bei Bedarf
  - Effiziente Speichernutzung

- Technische Verbesserungen
  - Neues Optimizer-Tool für automatische Modularisierung
  - Aktualisiertes JSON Schema für Modul-Support
  - Verbesserte Fehlerbehandlung
  - Neue NPM-Skripte für Optimierung
  - Rückwärtskompatibilität mit alten Versionen

---

## [3.7.1] - 2025-07-16

### Verbesserte KI-Integration und Redundanz

**Umfassende Verbesserungen der KI-Interaktion und Dokumentations-Synchronisation:**

- Erweiterte KI-Konfiguration

  - Neue user_preferences für strikte Datei-Lese-Anforderungen
  - Implementierung von code_quality_requirements
  - Detaillierte redundancy-Spezifikationen
  - Erweiterte Dokumentations-Synchronisationsregeln
  - ⚠️ Automatische Versionsprüfung bei jedem Start

- Automatisierte Dokumentations-Updates

  - Implementierung der documentation_sync in auto_tasks
  - Automatische CHANGELOG-Aktualisierung
  - Intelligente TODO-Empfehlungen
  - Cross-Referenz-Validierung
  - Versionskontrolle und Update-Benachrichtigungen

- Qualitätsverbesserungen

  - Strikte Dependency-Aktualisierungen
  - Modernisierung der Node.js Dependencies:
    - Entfernung veralteter Pakete (chalk, has-color, strip-ansi, JSV)
    - Einführung von colorette für moderne Terminalausgaben
    - Optimierung der Paketstruktur
  - Erweiterte Redundanzprüfungen
  - Verbesserte Validierungsmechanismen
  - Automatische Konsistenzprüfungen

- KI-Lernprozess & Selbstoptimierung

  - ✨ Implementierung von learning_experiences in .ai.json
  - 📚 Dokumentation von KI-Lernerfolgen als Systemverbesserung
  - 🔄 Optimierung des Dokumentations-Analyse-Workflows
  - 🎯 Verbessertes Verständnis der .ai.json als zentraler Einstiegspunkt
  - 💡 Integration von Praxisbeispielen für besseres KI-Lernen

### Technische Verbesserungen

- Implementierung des RedundancyValidator
- Erweiterung der GitHub Actions für zusätzliche Validierungen
- Verbesserte Fehlerbehandlung und -dokumentation
- Optimierte Dependency-Management-Strategien

---

## [3.7.0] – 2025-07-15

### Hochsicherer Update-Mechanismus

**100% sichere Updates mit umfassendem Datenschutz:**

- Vollständig implementierter sicherer Update-Mechanismus
  - Intelligente Schema-Vergleichsanalyse zur Identifikation kritischer Änderungen
  - Mehrstufiges Backup-System (lokales und globales Extension-Storage)
  - Visuelle Differenzdarstellung mit Hervorhebung kritischer Änderungen
  - Explizite Benutzerbestätigung für alle strukturellen Änderungen
  - Präziser Schutz projektspezifischer Daten in .ai.json
- Erweiterte Sicherheitsfeatures
  - Vorbeugender Datenschutz mit intelligenter Zusammenführung
  - Automatische Erkennung von Projektdaten und Konflikten
  - Verbessertes Recovery-System mit Rollback-Unterstützung
  - Detaillierte Update-Protokollierung und Transparenz
- Technische Verbesserungen
  - Umstellung auf native HTTPS-Anfragen (Entfernung der Axios-Abhängigkeit)
  - Performanceoptimierungen bei der Schema-Analyse
  - Verbesserte Fehlerbehandlung und Benutzerfeedback
  - Umfassende Integration in die bestehende VS Code-Extension

## [3.6.1] – 2025-07-10

### Erweiterte Roadmap und Optimierungen

**Umfassende Planungen für Skalierbarkeit und KI-Features:**

- Detaillierte Lösungsansätze für große .ai.json-Dateien
  - Modularisierung mit Referenzsystem
  - Komprimierungsstrategien für bessere Performance
  - Filter-System für selektive Generierung
  - Alternative Datenhaltungskonzepte für Enterprise-Einsatz
- Ausführlicher Machine Learning Roadmap
  - Intelligente Architekturanalyse und Pattern-Erkennung
  - KI-gestützte Metadaten-Generierung mit NLP
  - Code-Qualitäts-Scoring und Anti-Pattern-Erkennung
  - Predictive Maintenance für Codebasis
- Hochsicherer Versionschecker mit datenerhaltenden Updates
  - Update-Erkennung mit nativer GitHub API-Integration (ohne externe Abhängigkeiten)
  - Benutzerfreundliches Benachrichtigungssystem mit Details-Vorschau
  - Mehrstufiger sicherer Update-Mechanismus mit 100% Datenschutz
  - Detaillierte Schema-Differenzanalyse mit visueller Darstellung
  - Intelligentes Backup-System mit mehrfacher Absicherung
  - Automatischer Rollback-Mechanismus bei Update-Problemen
  - Vollständiger Schutz projektspezifischer Daten in .ai.json-Dateien
- Erweiterte Ecosystem-Integrationspläne
  - Web-Interface und API-Konzept
  - CI/CD-Pipeline Integrationspläne
  - IDE-Integrationen für JetBrains, Eclipse etc.
  - Fortgeschrittene KI-Integration (OpenAI, Hugging Face)

#### Bugfixes und Optimierungen

- Korrektur von Formatierungsproblemen in TODO.md
- Aktualisierung von Versionsnummern in allen relevanten Dateien
- Verbesserung der Dokumentation mit detaillierten Planungsschritten
- Optimierung der Scan-Performance für große Projekte

---

## [3.6.0] – 2025-07-09

### Multi-Language Scanner Integration

**Umfassende Projekterkennung für mehrere Sprachen:**

- Erweiterte Scanner-Infrastruktur mit standardisiertem Interface
- Integration in ai-init.php und VS Code Extension
- Scanner für PHP, JavaScript, Python, Java, C#, Go und Rust
- Automatische Erkennung von über 100 Frameworks und Technologien
- Priorisierte Ausführung für optimale Ergebnisse

#### Technische Features

- ScannerInterface und ScannerManager als zentrale Koordinatoren
- Sprachspezifische Scanner mit einheitlicher API
- Automatische Framework-Erkennung durch Datei- und Code-Analyse
- Intelligenter Fallback auf eingebaute Scanner
- Prioritätsbasierte Scanner-Ausführung

---

## [3.5.0] – 2025-07-09

### Forschung & Prototypen Integration

**Strukturierte Forschungserfassung:**

- Neuer `research` Abschnitt in `.ai.json`-Struktur
- JSON Schema Erweiterung für Forschungsprojekte
- VS Code WebView zur interaktiven Verwaltung
- Fortschrittsverfolgung mit visuellen Indikatoren

#### Technische Features

- Interaktives UI für Forschungsprojekte
- Statusverwaltung (concept, early_prototype, active_development, testing, evaluation)
- Ressourcenverknüpfung (Papers, Repositories, Blogs, Videos, Notebooks)
- Technologie-Tracking und Impact-Bewertung

---

## [3.4.2] – 2025-07-09

### Neue Benutzereinstellungen (user_preferences)

**Personalisierte KI-Kommunikation:**

- Neuer `user_preferences` Abschnitt in `.ai.json`
- Sprachauswahl für KI-Kommunikation (deutsch, english, etc.)
- Anpassbarer Kommunikationsstil (formal, informell, technisch)
- Konfigurierbarer technischer Detailgrad
- Einstellbares Antwortformat

#### Technische Erweiterungen

- JSON Schema um user_preferences erweitert
- Neuer VS Code Command "Edit User Preferences"
- Interaktive Einstellungsdialoge
- Vollständige Dokumentation in AI-INTEGRATION.md

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
