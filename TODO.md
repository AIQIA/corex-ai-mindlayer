# ✅ TODO – coreX AI MindLayer

> Aufgaben, Ideen, geplante Features und nächste Schritte  
> Diese Liste wächst dynamisch mit dem Projekt – Einträge dürfen direkt von KI-Systemen gelesen und ergänzt werden.

---

## 🎉 COMPLETE STATUS: v3.7.1 (SECURE UPDATES & DOC SYNC READY!)

- [x] **🔒 v3.7.1 Dokumentations-Synchronisation IMPLEMENTIERT**

  - [x] Auto-Sync zwischen Markdown-Dokumenten
  - [x] Konsistenzprüfung der Dokumentation
  - [x] Redundanz-Validierung
  - [x] Intelligente Aktualisierung von Changelogs
  - [x] Verbessertes Dokumentations-Management

- [x] **🔒 v3.7.0 Sicherer Update-Mechanismus IMPLEMENTIERT**

  - [x] Intelligente Schema-Vergleichsanalyse
  - [x] Mehrstufiges Backup-System
  - [x] Visuelle Differenzdarstellung
  - [x] Projektdaten-Schutz
  - [x] Verbessertes Recovery-System

- [x] **🚀 v3.0.0 Features RESTORED & ACTIVE**

  - [x] Architecture Preview (visuelle Darstellung der Projektstruktur)
  - [x] Tree Explorer (interaktive Navigation)
  - [x] AI IntelliSense (kontextbasierte Code-Vervollständigung)

- [x] **🤖 v3.1.0 Features COMBINED & ACTIVE**

  - [x] Mind Map Visualizer (D3.js-basierte Graph-Visualization)
  - [x] AI Documentation Comments (automatische Doku-Generierung)
  - [x] Diff Analyzer (.ai.json Datei-Vergleiche)

- [x] **🌐 v3.3.0 Ecosystem Integration IMPLEMENTED**

  - [x] Auto-Sync mit Changelogs, READMEs und Tasklisten
  - [x] Composer/NPM Plugin für automatische `.ai.json` Updates
  - [x] Docker Integration für automatische Container-Dokumentation

- [x] **🔧 v3.4.1 Technical Excellence & Bug Fixes**

  - [x] Verbesserte Fehlererkennung für Composer-Integration
  - [x] Standalone-PHP-Scanner als robuste Alternative
  - [x] Intelligenter Fallback-Mechanismus bei fehlender Composer-Installation
  - [x] Bessere Benutzerführung mit konkreten Lösungsvorschlägen

- [x] **🔧 Technical Excellence**
  - [x] Alle 11 Commands fehlerfrei implementiert
  - [x] TypeScript Kompilierung erfolgreich
  - [x] VSIX Package v3.6.0 erstellt und installiert
  - [x] Extension vollständig funktional

---

## ✅ Erledigte Features (Foundation)

- [x] **Intelligente ai-init.php** 🤖 _(Komplett implementiert)_
  - [x] Automatische Framework-Erkennung (Laravel, Vue, React, Django, etc.)
  - [x] Smart-Generierung der `.ai.json` basierend auf Projektstruktur
  - [x] Interaktiver CLI-Setup mit geführten Fragen
  - [x] 100+ unterstützte Technologien und Frameworks
- [x] **JSON Schema Validation** _(schema.json implementiert)_
- [x] **VS Code Extension Foundation** _(Vollständig funktionsfähig)_
  - [x] Commands für Create, Validate, Scanner
  - [x] Snippets für `.ai.json` Strukturen
  - [x] Context-Menu Integration
  - [x] Automatische Schema-Validierung
- [x] **GitHub Actions CI/CD** _(Automatische Validierung)_
- [x] **Dev Container Support** _(Docker-basierte Entwicklungsumgebung)_
- [x] **NPM Package Distribution** _(package.json für Node.js Ecosystem)_

---

## 🧠 AIM v4.0 – Persistenter KI-Kontext & IDE-Synchronisierung (IDE pushed INITIALIZE.md an CoPilot, sofern verfügbar)

### 🔄 Automatische Kontextverwaltung

- [ ] `.aim-context.json` einführen: speichert letzten relevanten Kontext aus Chat / Aktionen
- [ ] Kontext aus `INITIALIZE.md` + `.aim-context.json` kombinieren und an CoPilot pushen
- [ ] Kontextdatei bei jeder relevanten Interaktion aktualisieren (nur bei echten Änderungen)

### 🧩 Plugin-Integration (coreX AI MindLayer Extension)

- [ ] Trigger: Nach jedem Copilot-Chat → Analyse von Eingabe & Antwort (Eingaben ausführlich speichern, Antworten auf's wichtigste zusammengefasst)
- [ ] Kontextauszug automatisiert in `.aim-context.json` speichern
- [ ] Projektstart (also bei Start der IDE): `INITIALIZE.md` + `.aim-context.json` zusammenfassen (ungekürzt!) → Push an CoPilot
- [ ] Bei `create.aiJson` (Generierung der .ai.json) `.aim-context.json` mitliefern, entsprechend müssen alle AI MindLayer-Files in .gitignore eingetragen sein!

### 🧪 Intelligente Kontextanalyse

- [ ] **Kontext-Validierung & Qualitätssicherung**

  ```json
  "context_management": {
      "validation": {
          "language_consistency": true,
          "topic_coherence": true,
          "context_continuity": true
      },
      "scoring": {
          "relevance_threshold": 0.7,
          "content_value": "high",
          "context_retention": "smart"
      }
  }
  ```

- [ ] **Real-World Beispiel (tatsächliches Ereignis am: 2025-07-16)**

  - 🔍 Problem: Temporärer KI-Kontextverlust
    - Plötzlicher Sprachwechsel (DE → EN)
    - Verlust des Gesprächskontexts
    - Neustart der Konversation
  - ✨ Lösung: Intelligente Kontextwiederherstellung
    - Erkennung von Kontext-Anomalien
    - Sprachkonsistenz-Prüfung
    - Thematische Kohärenz-Validierung
  - 🎯 Implementierungsziele:
    - Automatische Erkennung von Kontextbrüchen
    - Sofortige Kontext-Wiederherstellung
    - Prävention von Informationsverlust

- [ ] Nur relevante Blöcke speichern (z. B. projektbezogene Fragen, Entscheidungen, Befehle)
- [ ] Kontext-Scoring für Priorisierung implementieren
- [ ] Optional: Zeitliche Relevanz einbauen (z. B. „zuletzt verwendet vor x Minuten")

### 📁 Kontextdateien

- [ ] `.aim-context.json` (auto-managed, persistenter Kontext)
- [ ] `contextTemplate.json` (statisch zur Initialbefüllung)
- [ ] Integration in `INITIALIZE.md` dokumentieren

### 🧪 Test & Validierung

- [ ] Test-Cases für Kontext-Merging & -Erkennung definieren
- [ ] Workflows erweitern: `.aim-context.json` bei PRs validieren (optional)
- [ ] Dokumentation: INITIALIZE.md Abschnitt „Kontextverwaltung“ erweitern

### 📈 KI-Lernprozess & Optimierung

- [x] **Erfolgreiche Selbstoptimierung implementiert**

  - [x] Erkennung von Workflow-Abweichungen
  - [x] Automatische Korrektur des Analyse-Prozesses
  - [x] Dokumentation von Lernerfolgen
  - [x] Integration in .ai.json als Referenz

- [ ] **Weitere Optimierungsziele**
  - [ ] Automatische Erkennung von Workflow-Abweichungen
  - [ ] Proaktive Vorschläge zur Prozessverbesserung
  - [ ] Metriken für erfolgreiche Lernprozesse
  - [ ] KI-Feedback-Schleife für kontinuierliche Verbesserung

---

## 📌 Future Features (v4.0.0+)

- [x] **Multi-Language Scanner Support**
  - [x] Python Project Scanner (Django, Flask, FastAPI)
  - [x] JavaScript/Node.js Scanner (Express, Nest.js)
  - [x] Java Project Scanner (Spring, Android)
  - [x] C# Project Scanner (.NET, ASP.NET Core)
  - [x] Go Project Scanner
  - [x] Rust Project Scanner
- [ ] **Web Interface**
  - [ ] Browser-basierte UI für `.ai.json` Management
  - [ ] Live-Demo Landingpage
  - [ ] Online Schema Validator
- [ ] **Advanced AI Integration**
  - [ ] GPT Integration für automatische .ai.json Optimierung
  - [ ] AI-basierte Code-Analysis und Suggestions
  - [ ] Smart Refactoring basierend auf .ai.json Patterns

---

## 🧩 Integration in bestehende Systeme

> _(Neu hinzugefügt: Idee vom 2025-07-08)_  
> ✨ Diese Sektion behandelt geplante Anbindungen an bestehende CMS- oder Backend-Systeme wie coreX.

- [ ] **AI::M SiteCreator Integration für coreX CMS**  
       _(📌 Geplant für v4.x oder separates Plugin-Modul)_
  - [ ] Integration des AI MindLayer als Admin-Tool im coreX CMS
  - [ ] Admin kann per UI-Eingabe (Prompt) neue Seiten generieren lassen
  - [ ] Automatisierte Erstellung:
    - [ ] HTML-Inhalt für neue interne Seiten
    - [ ] Generierung passender `PageClass` inkl. Autorouting
    - [ ] Automatisches Hinzufügen zur Sitemap und Navigation
  - [ ] Nutzung der bestehenden Fallback-Logik von coreX (DB → Datei → Ordner)
  - [ ] Validierung gegen `.ai.json`-Strukturen (optional)
  - [ ] Seiten können nachträglich per Editor weiterbearbeitet werden
  - [ ] Ziel: Barrierefreie, valide und strukturierte Inhalte durch KI-Unterstützung

> 💬 _Hinweis: Dieses Feature ist als erweiterbares Modul geplant und könnte einen essenziellen Mehrwert für CMS-Admins bieten. Die eigentliche KI-Logik soll lokal oder via API eingebunden werden – optional und datenschutzkonform. Hierzu wird allerdings erst im "AIQIA coreX CMS" die Grundlage geschaffen, "Module/Plugins" müssen installierbar sein, dann muss aus dem AI::M->AdminTool ein installierbares Plugin für den Adminbereich gebaut werden (oder ggf über das eigentliche Plugin automatisch erkennen und integrieren lassen - hierzu wird noch gebrainstormed!)._

---

## 🏆 Project Status: PRODUCTION READY

**✅ ALLE CORE-FEATURES IMPLEMENTIERT UND GETESTET**

- VS Code Extension v3.6.0 vollständig funktional
- 13 Commands, alle Features von v3.0.0 bis v3.6.0 kombiniert
- Keine temporären Deaktivierungen oder Bugs
- Ready for Community Release!
- [x] **Ecosystem Integration**
  - [x] Auto-Sync mit Changelogs, READMEs und Tasklisten
  - [x] Composer/NPM Plugin für automatische `.ai.json` Updates
  - [x] Docker Integration für automatische Container-Dokumentation

---

## 🧪 Forschung & Prototypen

- [x] **Research Tracking & Management**

  - [x] Strukturierte Erfassung von Forschungsprojekten in `.ai.json`
  - [x] Status- und Fortschrittsverfolgung
  - [x] Ressourcenmanagement und Technologie-Tracking
  - [x] VS Code Integration mit interaktiver Verwaltung

- [ ] **Machine Learning Features**

  - [ ] **Intelligente Architekturanalyse**

    - [ ] Automatische Architektur-Erkennung und Visualisierung
    - [ ] Pattern-Erkennung (MVC, MVVM, Microservices, etc.)
    - [ ] Empfehlungen für Architektur-Optimierungen
    - [ ] Vorhersage potentieller Architektur-Probleme (Technical Debt)

  - [ ] **KI-gestützte Metadaten-Generierung**

    - [ ] Intelligente Tag-Vorschläge durch NLP
    - [ ] Automatische Kategorisierung von Komponenten
    - [ ] Semantische Beziehungsanalyse zwischen Modulen
    - [ ] Kontextbasierte Dokumentationsvorschläge

  - [ ] **Code-Qualität und Metriken**

    - [ ] ML-basiertes Code-Qualität-Scoring
    - [ ] Komplexitätsanalyse mit Verbesserungsvorschlägen
    - [ ] Erkennung von Anti-Patterns und Code-Smells
    - [ ] Refactoring-Empfehlungen basierend auf Projektkontext

  - [ ] **Predictive Maintenance**
    - [ ] Vorhersage von Wartungsbedarf in Code-Bereichen
    - [ ] Identifikation von "Hot Spots" (häufig geänderte Bereiche)
    - [ ] Impact-Analyse für Änderungen (was muss angepasst werden?)
    - [ ] Intelligente Ressourcenzuweisung für Entwicklungsteams

### 🗣️ Mensch-KI-Kommunikationsoptimierung

- [ ] **Sprachverständnis & Kommunikationsbarrieren**

  - [ ] Analyse von Missverständnismustern
    - Fokus auf falsche Details
    - Überinterpretation von Aussagen
    - Kontextuelle Missverständnisse
  - [ ] Dokumentation erfolgreicher Kommunikationsmuster
    - Effektive Formulierungen
    - Hilfreiche Kontextangaben
    - Klare Anweisungsstrukturen

- [ ] **Lernende Verbesserung der Kommunikation**

  - [ ] Beispiel vom 2025-07-17:
    ```json
    {
      "situation": "Textänderung missinterpretiert",
      "user_input": "kleine Anpassung: 'tatsächliches Ereignis am:'",
      "ai_response": "Fokus auf falschen Kontext statt auf die eigentliche Änderung",
      "learning": "Präzisere Wahrnehmung kleiner Textänderungen notwendig"
    }
    ```
  - [ ] Entwicklung von Kommunikationsrichtlinien
    - Für KI: Bessere Erkennung von Nuancen
    - Für Menschen: Effektivere Formulierungen
    - Für System: Dokumentation der Lernerfahrungen

- [ ] **Systemverbesserungen**

  - [ ] KI-seitig
    - Verbessertes Pattern-Matching für Kommunikationsabsichten
    - Kontextbewusstere Interpretation
    - Lernende Anpassung an Kommunikationsstile
  - [ ] Mensch-seitig
    - Hilfestellung bei Formulierungen
    - Feedback zu erfolgreichen Kommunikationsmustern
    - Vorschläge für klarere Anweisungen
  - [ ] Dokumentation
    - Automatische Erfassung erfolgreicher Kommunikationsmuster
    - Aufbau einer "Best Practices"-Bibliothek
    - Kontinuierliche Verfeinerung der Interaktionsmodelle

- [ ] **Verarbeitung komplexer Anweisungen**
  - [ ] Qualitätssicherung bei Multi-Task-Anfragen
    - Mehrfaches Lesen zur Erfassung aller Details
    - Strukturierte Aufgabenliste vor Bearbeitung erstellen
    - Rückfragen bei Unklarheiten
  - [ ] Beispiel-Pattern:
    ```json
    {
      "input_type": "complex_multi_task",
      "quality_checks": [
        "double_read_confirmation",
        "task_list_creation",
        "clarity_verification"
      ],
      "verification_steps": [
        "Wurden alle Teilaufgaben erfasst?",
        "Gibt es Abhängigkeiten zwischen den Aufgaben?",
        "Sind Prioritäten erkennbar?",
        "Bestehen Unklarheiten, die geklärt werden müssen?"
      ]
    }
    ```
  - [ ] Implementierung von Sicherheitsmechanismen
    - Automatische Aufgabenextraktion aus langen Texten
    - Bestätigung der erfassten Aufgaben
    - Fortschrittsverfolgung während der Bearbeitung

## 🧩 Compatibility & Usage

- [x] **Sicherer Versionschecker mit datenerhaltenden Updates**

  - [x] Prüfung auf neue Versionen beim Start
  - [x] Benachrichtigung über verfügbare Updates mit Versionsnummer und Änderungsübersicht
  - [x] **Sicherheits-orientierter Update-Prozess:**
    - [x] Automatisches Backup der aktuellen .ai.json und Konfigurationen vor jedem Update
    - [x] Detaillierte Differenzanalyse mit visueller Darstellung aller Änderungen
    - [x] Explizite Bestätigung jeder strukturellen Änderung durch den Nutzer
    - [x] Schutz projektspezifischer Daten und benutzerdefinierter Einträge
    - [x] Option zum selektiven Update (nur Core-Funktionen oder auch Schema-Änderungen)
  - [x] **Transparente Update-Planung:**
    - [x] Mehrstufige Vorschau der Änderungen mit farblicher Markierung
    - [x] Warnungen bei potentiell problematischen Änderungen (z.B. entfernte Felder)
    - [x] Erklärung der Auswirkungen jeder Änderung
    - [x] Schritt-für-Schritt geführter Update-Prozess
  - [x] **Robuste Sicherheitsmaßnahmen:**
    - [x] Mehrfache Backup-Strategie (lokal und im Extension-Verzeichnis)
    - [x] Automatischer Rollback bei Problemen
    - [x] Protokollierung aller Update-Aktionen
    - [x] Recovery-Tool zur Wiederherstellung bei Fehlern
  - [x] Separate Updates für Core und Extension

- [ ] **Erweiterte Ecosystem-Integrationen**

  - [ ] **Web-Interface und API**

    - [ ] RESTful API für externe Zugriffe auf .ai.json-Daten
    - [ ] Web-Dashboard für Projektvisualisierung ohne IDE
    - [ ] Team-Kollaborationsfunktionen für gemeinsame Dokumentation
    - [ ] Echtzeit-Updates und Benachrichtigungen

  - [ ] **CI/CD-Pipeline Integration**

    - [ ] GitHub Actions-Workflow für automatisierte Validierung
    - [ ] Jenkins-Plugin für Integration in CI/CD-Pipelines
    - [ ] GitLab CI/CD-Integration mit Reporting
    - [ ] Azure DevOps-Integration für Enterprise-Umgebungen

  - [ ] **IDE-Integrationen**

    - [ ] JetBrains-Plugin (IntelliJ, PHPStorm, PyCharm, WebStorm)
    - [ ] Eclipse-Plugin für Java-Entwicklung
    - [ ] Atom-Package für einfachere Projekte
    - [ ] Sublime Text und Notepad++ Unterstützung

  - [ ] **Erweiterte KI-Integration**
    - [ ] OpenAI API-Integration für GPT-4 basierte Projektanalyse
    - [ ] Hugging Face-Integration für spezialisierte NLP-Tasks
    - [ ] GitHub Copilot-Erweiterung für AI-MindLayer Kontext
    - [ ] Eigene Fine-Tuned Models für Projekt-spezifische Analysen

- [ ] **Pluginerweiterungen**
  - [ ] Extension für PHP Storm und andere IDEs
- [ ] **Benutzerfreundlichkeit prüfen und verbessern (einsteigerfreundlich)**
  - [ ] Installationsmenu ausreichend erklärt? (bei prompts)

---

> ⚙️ _Folgende Features wurden als Vorschläge ergänzt auf Basis aktueller Trends in DevTooling, KI-Assistenz und Architekturvisualisierung._

## 🚀 Neue geplante Erweiterungen (ergänzt am 2025-07-09)

- [ ] **AI::M Assistant Mode (Experimental)**

  - [ ] Lokale, interaktive KI-Konsole für Entwickler direkt in VS Code
  - [ ] Unterstützt Rückfragen zum Projektkontext (.ai.json als Gedächtnis)
  - [ ] Vorschläge zu Architekturentscheidungen, Refactoring, Naming
  - [ ] Ziel: wie ein "local dev Co-Pilot", aber offline und projektspezifisch

- [ ] **Project Metrics Dashboard**

  - [ ] Übersicht zu Struktur-Komplexität, Anzahl Komponenten, Tiefe
  - [ ] Visualisierung historischer Änderungen aus `.ai.json` (z. B. MindMap-Diff)
  - [ ] Exportierbare Reports (JSON/Markdown)

- [ ] **Preset-Generatoren für `.ai.json`**

  - [ ] Templates für typische Projektarten (z. B. Laravel CMS, REST API, SPA)
  - [ ] Reduziert Einstiegszeit und verbessert Standardisierung
  - [ ] In Extension oder über CLI auswählbar

- [ ] **Doku-Sync mit GitHub Wiki / Docs**

  - [ ] Automatisierte Spiegelung bestimmter `.ai.json` Einträge in Markdown-Dokumente
  - [ ] Unterstützt Dokumentation im GitHub Wiki oder eigenen `/docs`-Ordner
  - [ ] Ziel: lebendige Architektur-Dokumentation direkt aus dem Projekt

- [ ] **CI-Kommandos für `.ai.json` Pflege**

  - [ ] z. B. `validate-consistency`, `remove-unused`, `ai-doc-refresh`
  - [ ] Nutzt bestehende Strukturen, um "verwaiste" Einträge zu erkennen
  - [ ] Ideal für große Teams oder Agenturen

- [ ] **AI::M Learning Logs (experimentell)**

  - [ ] Lokale Lernfunktion: Welche Fragen werden gestellt, welche Architekturen entstehen?
  - [ ] Ziel: adaptive Verbesserung der Vorschläge basierend auf Projekt-Typ und Nutzerverhalten
  - [ ] Optional, vollständig lokal und transparent

- [ ] **Plugin für IntelliJ/PHPStorm (Integration)**

  - [ ] Umsetzung der VS Code Funktionen in weiteren IDEs
  - [ ] Einheitliche KI-Erweiterung für alle Entwickler im Team

- [ ] **Offline Docs Server (Local DevDoc AI)**
  - [ ] Lokaler Server, der `.ai.json`-Daten in browsbare Doku-Seite rendert
  - [ ] Integriert AI-Hints, Architektur, und Verlinkungen
  - [ ] Optional mit KI-Chat (lokal oder über API) für kontextbezogene Hilfe

---

> ⚙️ _Diese Features wurden als Vorschläge ergänzt auf Basis aktueller Trends in DevTooling, KI-Assistenz und Architekturvisualisierung._

## 🚀 UND GAAAAANZ WICHTIG(!!!), .ai.json Komprimierung (oder ggfs. anderes Format!)

> ⚙️ _PROBLEM: Die .ai.json kann in größeren Projekten sehr schnell sehr groß werden, was mir Sorgen bereitet, hier muss frühzeitig eine Lösung her!_

### 💡 Lösungsansätze für große .ai.json Dateien

- [ ] **Modularisierung der .ai.json**

  - [ ] Split in mehrere Teil-Dateien (z.B. pro Modul/Komponente)
  - [ ] Referenzsystem mit `$ref`-Verweisen nach JSON Schema Standard
  - [ ] Hauptdatei enthält nur Metadaten und Verweise
  - [ ] VS Code Extension unterstützt nahtloses Zusammenführen beim Lesen

- [ ] **Komprimierungsstrategien**

  - [ ] Optionales Binärformat für große Projekte (.ai.bin)
  - [ ] Intelligente Deduplizierung wiederholter Strukturen
  - [ ] Lazy-Loading-Mechanismus in Extension und Scannern
  - [ ] Komprimierungsalgorithmus speziell für strukturierte Projektdaten

- [ ] **Selektive Generierung und Filterung**

  - [ ] CLI-Optionen für partielle Scanning/Generierung
  - [ ] Filter-System für Import/Export bestimmter Bereiche
  - [ ] Verschiedene Detail-Level (z. B. "core", "extended", "full")
  - [ ] Temporäres Auslagern selten genutzter Metadaten

- [ ] **Alternative Datenhaltung für Enterprise-Projekte**

  - [ ] SQLite-Datenbank als Alternative (.ai.sqlite)
  - [ ] GraphQL-Schnittstelle für effiziente Teilabfragen
  - [ ] Verteiltes Speichersystem für Microservice-Architekturen
  - [ ] Inkrementelles Update-System statt vollständiger Neugenerierung

- [ ] **Performance-Optimierungen**
  - [ ] Worker-Threads für parallele Verarbeitung
  - [ ] Cache-Mechanismen für schnelleren Zugriff
  - [ ] Stream-basierte Verarbeitung statt komplettes Laden
  - [ ] Diff-basiertes Update-System (nur Änderungen speichern)

### Lösungsansätze zur Optimierung großer .ai.json-Dateien:

- [ ] **Modulare Struktur mit Referenzen**

  - [ ] Hauptdatei mit Referenzen auf Teildateien (`$ref`-Syntax)
  - [ ] Komponenten in separaten Dateien (ai-components.json)
  - [ ] Architektur in eigener Datei (ai-architecture.json)
  - [ ] Vorteile: Bessere Organisation, weniger Git-Konflikte, einfachere Teamarbeit

- [ ] **Selektive Datenaufnahme**

  - [ ] Implementierung eines "Wichtigkeits-Filters"
  - [ ] Nur relevante Informationen in der .ai.json speichern
  - [ ] Automatische Priorisierung nach Nutzungshäufigkeit

- [ ] **Komprimierungsstrategien**

  - [ ] BSON-Format (binäre JSON-Darstellung)
  - [ ] MessagePack für kompaktere Speicherung
  - [ ] Eigenes Komprimierungsschema mit Token für wiederholte Strings
  - [ ] Standard-Eigenschaften weglassen und beim Laden ergänzen

- [ ] **Inkrementelle Updates**

  - [ ] Nur geänderte Teile der .ai.json aktualisieren
  - [ ] Diff-basierte Änderungsverfolgung

- [ ] **Feature-basierte Aufteilung**

  - [ ] Separate Dateien nach Funktionalität (.ai.architecture.json, .ai.components.json)
  - [ ] Einfache Navigation über zentralen Index

- [ ] **Lazy-Loading in der VS Code Extension**

  - [ ] Nur benötigte Teile laden
  - [ ] Virtuelle Dateisystem-Integration für transparenten Zugriff

- [ ] **Priorisierte Speicherung**
  - [ ] High-Level-Informationen in der Hauptdatei
  - [ ] Details in separaten, bei Bedarf ladbaren Dateien
