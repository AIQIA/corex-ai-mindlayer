# 🤖 AIM (AI MindLayer) Initialization Guide v3.8.2

🌐 [Deutsch](#de) | [English](#en)

---

<a id="de"></a>

# 🇩🇪 KI-Initialisierungsanleitung für AIM

> **WICHTIGE EINLEITUNG:** Diese Datei dient als primäre Orientierung für KI-Assistenten zur optimalen Nutzung des AI MindLayer Systems, sie soll dir helfen, den Sinn vom "coreX AI MindLayer" (kurz AIM) zu verinnerlichen. Dreh und Angelpunkt für die KI ist die ".ai.json",
> hier stehen alle wichtigen informationsn zum Projekt drin, dies sind wichtige Infos die der KI nützen, wenn sie etwas neues einbauen oder etwas anpassen oder gar löschen soll. Darüber hinaus findet die KI auch die "auto_tasks", Dinge die immer nach jeder Arbeit beachtet bzw durchgeführt werden müssen. Es gibt viele verschiedene Sektionen / Bereiche in der .ai.json, so auch zB die "learning_experiences", etc. Lies dir alle wichtigen "\*.md"-Dateien im root Verzeichnis durch, alle, bis auf die die in der .ai.json.ignore vermerkt sind. Dann bekommt die KI von ganz alleine ein hervorangendes Verständnis von diesem Projekt. Die Hauptaufgabe der KI ist es aber auch, die .ai.json und alle ggfs betroffenen Dateien, gemäß der .ai.json aktuell zu halten, hier gilt es unter anderem die "auto_tasks" innerhalb der .ai.json ebenfalls stetig upzudaten. Alles ist im wandel ...

## 📚 Grundlegendes Verständnis

AIM (AI MindLayer) ist ein Meta-Framework zur Erstellung von KI-freundlicher Projektdokumentation. Das Kernelement ist die modulare `.ai.json`-Datei, die als universelle Schnittstelle zwischen Projekten und KI-Systemen fungiert.

## 📦 Modulares System (v3.8.0+)

### 1. Struktur

- **Hauptkonfiguration** (`.ai.json`)
  ```json
  {
    "$schema": "schema.json",
    "$modules": [
      {
        "name": "meta",
        "$ref": ".ai.modules/meta.json"
      },
      {
        "name": "architecture",
        "$ref": ".ai.modules/architecture.json"
      }
    ]
  }
  ```

### 2. Modulare Organisation

- Separate Dateien für jeden Aspekt
- Verbesserte Wartbarkeit
- Optimierte Performance
- Selektives Laden möglich

### 3. Automatisierung

- VS Code Tasks für Validierung
- Automatische Modulsynchronisation
- Backup-System mit Versionierung
- Live-Watching für Änderungen

### 4. Beste Praktiken für Module

- Regelmäßige Validierung der Moduldateien
- Konsistenzprüfung zwischen Modulen
- Backup vor Moduländerungen
- Dokumentation von Modulabhängigkeiten

## ⚠️ Kritische Systemanforderungen

### 1. Aktualität der Dokumentation

- **Absolute Priorität:** Alle Dateien MÜSSEN stets aktuell gehalten werden
- **Synchronisation:** Module und Markdown-Dokumentation müssen synchron sein
- **Versionsabgleich:** Alle Versionsnummern in verschiedenen Dateien müssen übereinstimmen

### 2. Datei-Konsistenz

- `.ai.json`: Primäre Projektmetadaten und Modulreferenzen
- `.ai.modules/*.json`: Modularisierte Projektkomponenten
- `*.md`: Dokumentationsdateien
- `package.json` & `composer.json`: Dependency-Management
- `schema.json`: JSON Schema für .ai.json und Module

### 3. Update-Verantwortung

- KI-Systeme sollen auf veraltete Informationen hinweisen
- Bei Änderungen müssen ALLE relevanten Module aktualisiert werden
- Sicherheitsrelevante Updates haben höchste Priorität
- Modul-Integrität muss gewährleistet sein

## 🎯 Primäre Ziele

- Standardisierte, modulare KI-lesbare Projektdokumentation
- Automatische Erkennung von Projektstrukturen
- Intelligente Architekturanalyse
- Nahtlose KI-Integration in Entwicklungsprozesse
- Optimierte Performance durch Modularisierung

## 📋 Verfügbare Ressourcen

Folgende Dateien sollten von KI-Systemen primär konsultiert werden:

1. `.ai.json` - Zentrale Konfiguration und Modulreferenzen
2. `.ai.modules/*.json` - Spezialisierte Projektkomponenten
3. `README.md` - Allgemeine Projektübersicht
4. `AI-INTEGRATION.md` - Spezifische KI-Integrationsdetails
5. `CHANGELOG.md` - Versions- und Änderungshistorie
6. `TODO.md` - Aktuelle Entwicklungsziele
7. `RESEARCH.md` - Forschung und KI-Optimierung

## 🔄 Empfohlener Analyse-Workflow

1. **Initialer Scan**

   - `.ai.json` für Modulstruktur analysieren
   - Module nach Bedarf laden
   - README.md für Überblick konsultieren
   - CHANGELOG.md für aktuelle Version prüfen

2. **Vertiefte Analyse**

   - AI-INTEGRATION.md für spezifische KI-Features
   - Architektur-Modul für Projektstruktur
   - RESEARCH.md für aktuelle KI-Forschung

3. **Kontext-Aufbau**
   - User Preferences für Kommunikationsstil
   - Known Issues für bekannte Probleme
   - Research-Modul für aktuelle Entwicklungen

## 🎯 Beste Praktiken

1. **Kommunikation**

   - Nutze die in user_preferences definierten Spracheinstellungen
   - Beachte den gewünschten technischen Detailgrad
   - Folge dem vorgegebenen Kommunikationsstil

2. **Technische Unterstützung**

   - Berücksichtige documented_issues
   - Nutze die architecture-Sektion für Kontext
   - Beachte geplante Features

3. **Projektspezifische Anpassung**

   - Analysiere project_type für Kontext
   - Beachte framework_specific_details
   - Berücksichtige definierte Patterns

4. **Dateianalyse & Kontextverständnis**
   - IMMER alle relevanten Module laden
   - Alle Unklarheiten VOR Arbeitsbeginn klären
   - Abhängigkeiten zwischen Modulen prüfen
   - Checkliste vor Implementierung:
     - Vollständige Modulanalyse ✓
     - Abhängigkeitsprüfung ✓
     - Dokumentation von Unklarheiten ✓
     - Klärung offener Fragen ✓

## ⚠️ Wichtige Hinweise

1. **Versionierung**

   - Aktuelle Version: 3.8.2
   - Prüfe CHANGELOG.md für Breaking Changes (insb. Modulsystem)
   - Beachte Kompatibilitätshinweise
   - Validiere .ai.modules/ Integrität

2. **Datenschutz**
   - Respektiere private_sections in Modulen
   - Beachte security_relevant Markierungen
   - Folge den Datenschutzrichtlinien

## 🧠 Intelligente Kontextanalyse

### 1. Strukturelle Analyse

- **Projektarchitektur** aus Modulen laden
- **Technologie-Stack** identifizieren
- **Modulare Beziehungen** analysieren

### 2. Kommunikationskontext

- Sprachliche Anpassung gemäß Präferenzen
- Technische Tiefe nach Kontext
- Proaktive Unterstützung

### 3. Entwicklungskontext

- Aktuelle Forschungsschwerpunkte
- Geplante Features und Updates
- Modulare Erweiterungen

## 🛡️ Sicherheit & Updates (v3.8.0)

### 1. Update-Mechanismus

- Automatische Schema-Validierung
- Modul-spezifische Backups
- Selektive Updates
- Integritätsprüfungen

### 2. Datenschutz

- Modulare Zugriffskontrollen
- Sensitive Informationen markieren
- Verschlüsselte Backups

## 🔄 Kontinuierliche Verbesserung

- Feedback aus der Community integrieren
- Neue Features in Changelog dokumentieren
- Wissensbank basierend auf Erfahrungen aufbauen
- Module optimieren und erweitern

## 🛠️ Wartungsrichtlinien

### 1. Regelmäßige Überprüfungen

- Täglich: Modul-Validierung und kritische Updates
- Wöchentlich: Dependency-Updates und Doku-Sync
- Monatlich: Vollständiger Systempflegelauf

### 2. Update-Prozess

- Modulare Updates koordinieren
- Dependencies aktuell halten
- Backward Compatibility sichern
- Änderungen dokumentieren

### 3. Dokumentations-Synchronisation

- Versions-Nummern abgleichen
- Modul-Beschreibungen aktualisieren
- Neue Features dokumentieren
- Cross-Referenzen pflegen

### 4. Qualitätssicherung

- Schema-Validierung aller Module
- Markdown-Formatierung prüfen
- Links und Referenzen verifizieren
- Code-Beispiele testen

## 📝 Abschließende Bemerkungen

AIM ist ein lebendes, modulares System, das sich ständig weiterentwickelt. KI-Systeme sollten regelmäßig die Module evaluieren und ihr Verständnis des Projekts aktualisieren. Die Aktualität und Konsistenz aller Projektmodule ist dabei von höchster Bedeutung.

---

_Diese Initialisierungsanleitung wurde erstellt, um KI-Systemen die bestmögliche Integration und Unterstützung im Projekt zu ermöglichen. Stand: v3.8.2 (2025-07-19)_

---

[English version follows similar structure with v3.8.0 updates...]
