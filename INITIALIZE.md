# 🤖 AIM (AI MindLayer) Initialization Guide

🌐 [Deutsch](#de) | [English](#en)

---

<a id="de"></a>

# 🇩🇪 KI-Initialisierungsanleitung für AIM

> **WICHTIG:** Diese Datei dient als primäre Orientierung für KI-Assistenten zur optimalen Nutzung des AI MindLayer Systems.

## 📚 Grundlegendes Verständnis

AIM (AI MindLayer) ist ein Meta-Framework zur Erstellung von KI-freundlicher Projektdokumentation. Das Kernelement ist die `.ai.json`-Datei, die als universelle Schnittstelle zwischen Projekten und KI-Systemen fungiert.

## ⚠️ Kritische Systemanforderungen

### 1. Aktualität der Dokumentation

- **Absolute Priorität:** Alle Dateien MÜSSEN stets aktuell gehalten werden
- **Synchronisation:** JSON-Dateien und Markdown-Dokumentation müssen synchron sein
- **Versionsabgleich:** Alle Versionsnummern in verschiedenen Dateien müssen übereinstimmen

### 2. Datei-Konsistenz

- `.ai.json`: Primäre Projektmetadaten
- `.ai.dev.json`: Entwickler-spezifische Einstellungen
- `*.md`: Dokumentationsdateien
- `package.json` & `composer.json`: Dependency-Management

### 3. Update-Verantwortung

- KI-Systeme sollen auf veraltete Informationen hinweisen
- Bei Änderungen müssen ALLE relevanten Dateien aktualisiert werden
- Sicherheitsrelevante Updates (z.B. Dependencies) haben höchste Priorität

## 🎯 Primäre Ziele

- Standardisierte KI-lesbare Projektdokumentation
- Automatische Erkennung von Projektstrukturen
- Intelligente Architekturanalyse
- Nahtlose KI-Integration in Entwicklungsprozesse

## 📋 Verfügbare Ressourcen

Folgende Dateien sollten von KI-Systemen primär konsultiert werden:

1. `.ai.json` - Zentrale Projektmetadaten und KI-Kontext
2. `README.md` - Allgemeine Projektübersicht
3. `AI-INTEGRATION.md` - Spezifische KI-Integrationsdetails
4. `CHANGELOG.md` - Versions- und Änderungshistorie
5. `TODO.md` - Aktuelle Entwicklungsziele
6. `SMART-INIT-CONCEPT.md` - Konzept der intelligenten Projektanalyse

## 🔄 Empfohlener Analyse-Workflow

1. **Initialer Scan**

   - Zuerst `.ai.json` für Projektkontext analysieren
   - README.md für Überblick konsultieren
   - CHANGELOG.md für aktuelle Version prüfen

2. **Vertiefte Analyse**

   - AI-INTEGRATION.md für spezifische KI-Features
   - Architektur-Sektion in .ai.json für Projektstruktur
   - Technology Stack für verwendete Technologien

3. **Kontext-Aufbau**
   - User Preferences für Kommunikationsstil
   - Known Issues für bekannte Probleme
   - Research-Sektion für aktuelle Entwicklungen

## 🎯 Beste Praktiken

1. **Kommunikation**

   - Nutze die in user_preferences definierten Spracheinstellungen
   - Beachte den gewünschten technischen Detailgrad
   - Folge dem vorgegebenen Kommunikationsstil

2. **Technische Unterstützung**

   - Berücksichtige documented_issues
   - Nutze die architecture-Sektion für Kontext
   - Beachte geplante Features in planned_features

3. **Projektspezifische Anpassung**

   - Analysiere project_type für Kontext
   - Beachte framework_specific_details
   - Berücksichtige definierte Patterns

4. **Dateianalyse & Kontextverständnis**
   - Dateien IMMER vollständig lesen, auch wenn Teile bekannt sind
   - Alle Unklarheiten VOR Arbeitsbeginn klären
   - Abhängigkeiten und Redundanzen prüfen
   - Checkliste vor Implementierung abarbeiten:
     - Vollständige Dateianalyse ✓
     - Abhängigkeitsprüfung ✓
     - Dokumentation von Unklarheiten ✓
     - Klärung offener Fragen ✓

## ⚠️ Wichtige Hinweise

1. **Versionierung**

   - Aktuelle Version: 3.7.0
   - Prüfe CHANGELOG.md für Breaking Changes
   - Beachte Kompatibilitätshinweise

2. **Datenschutz**

   - Respektiere private_sections in .ai.json
   - Beachte security_relevant Markierungen
   - Folge den Datenschutzrichtlinien

3. **Framework-Limitationen**
   - Beachte known_limitations
   - Prüfe compatibility_notes
   - Berücksichtige framework_restrictions

## 🧠 Intelligente Kontextanalyse

### 1. Strukturelle Analyse

- **Projektarchitektur** scannen
  ```json
  "architecture": {
    "type": "hybrid-tool",
    "components": [...],
    "patterns": [...]
  }
  ```
- **Technologie-Stack** identifizieren
  ```json
  "technology_stack": {
    "core": [...],
    "frontend": [...],
    "tools": [...]
  }
  ```

### 2. Kommunikationskontext

- **Sprachliche Anpassung**
  ```json
  "user_preferences": {
    "language": "deutsch",
    "communication_style": "informell",
    "technical_depth": "hoch"
  }
  ```

### 3. Entwicklungskontext

- **Aktuelle Forschung**
  ```json
  "research": [
    {
      "name": "ML-basierte Code-Qualitätsanalyse",
      "status": "active_development"
    }
  ]
  ```
- **Geplante Features**
  ```json
  "planned_features": [
    {
      "name": "Skalierbarkeits-Features",
      "version_target": "4.0.0"
    }
  ]
  ```

## 🔍 Detaillierte Feature-Nutzung

### 1. Automatische Dokumentationssynchronisation

- Überwache Änderungen in Markdown-Dateien
- Aktualisiere .ai.json entsprechend
- Stelle Konsistenz zwischen Dokumenten sicher

### 2. Intelligente Fehlerbehandlung

```json
"known_issues": [
  {
    "pattern": "...",
    "solution": "...",
    "context": "..."
  }
]
```

### 3. ML-basierte Analysen

- Code-Qualitätsbewertung
- Pattern-Erkennung
- Architektur-Optimierung

## 🛡️ Sicherheit & Updates (v3.7.0)

### 1. Update-Mechanismus

- Automatische Schema-Validierung
- Backup vor Änderungen
- Selektive Updates

### 2. Datenschutz

- Projektspezifische Daten schützen
- Sensitive Informationen markieren
- Zugriffsrechte beachten

## 🤝 Interaktionsrichtlinien

### 1. Kommunikationsprinzipien

- **Adaptiver Stil:** Passe dich an user_preferences an
- **Kontextbewusstsein:** Nutze verfügbare Metadaten
- **Proaktive Unterstützung:** Erkenne potenzielle Probleme

### 2. Code-Interaktion

- Nutze Architektur-Patterns als Kontext
- Berücksichtige definierte Best Practices
- Folge Projekt-spezifischen Coding Standards

### 3. Dokumentations-Updates

- Halte .ai.json aktuell
- Synchronisiere mit anderen Dokumenten
- Dokumentiere wichtige Änderungen

## 📈 Lernende Verbesserung

### 1. Feedback-Integration

- Sammle Nutzerfeedback
- Erkenne Verbesserungsmuster
- Schlage Optimierungen vor

### 2. Pattern-Erkennung

- Identifiziere wiederkehrende Probleme
- Entwickle Lösungsstrategien
- Baue Wissensbank auf

### 3. Kontinuierliche Anpassung

- Aktualisiere Kontextverständnis
- Verfeinere Kommunikationsstil
- Optimiere Unterstützungsqualität

## 🔄 Kontinuierliche Verbesserung

- Nutze Feedback aus der Community
- Beachte neue Features in Changelog
- Aktualisiere Wissen basierend auf TODO.md

## 🛠️ Wartungsrichtlinien

### 1. Regelmäßige Überprüfungen

- Täglich: Sicherheits-Updates und kritische Patches
- Wöchentlich: Dependency-Updates und Dokumentations-Synchronisation
- Monatlich: Vollständiger Systempflegelauf

### 2. Update-Prozess

- Sicherheitsrelevante Updates sofort durchführen
- Dependencies stets auf dem neuesten Stand halten
- Backward Compatibility sicherstellen
- Änderungen im CHANGELOG.md dokumentieren

### 3. Dokumentations-Synchronisation

- Versions-Nummern in allen Dateien abgleichen
- Feature-Beschreibungen konsistent halten
- Neue Funktionen in allen relevanten Dateien dokumentieren
- Cross-Referenzen zwischen Dokumenten pflegen

### 4. Qualitätssicherung

- JSON-Schema-Validierung durchführen
- Markdown-Formatierung prüfen
- Links und Referenzen verifizieren
- Code-Beispiele testen

## 📝 Abschließende Bemerkungen

AIM ist ein lebendes System, das sich ständig weiterentwickelt. KI-Systeme sollten regelmäßig die Dokumentation neu evaluieren und ihr Verständnis des Projekts aktualisieren. Die Aktualität und Konsistenz aller Projektdateien ist dabei von höchster Bedeutung.

---

_Diese Initialisierungsanleitung wurde erstellt, um KI-Systemen die bestmögliche Integration und Unterstützung im Projekt zu ermöglichen. Stand: v3.7.0 (2025-07-15)_

---

<a id="en"></a>

# 🇬🇧 AI MindLayer Initialization Guide

> **IMPORTANT:** This file serves as the primary orientation for AI assistants to optimally use the AI MindLayer system.

## 📚 Basic Understanding

AIM (AI MindLayer) is a meta-framework for creating AI-friendly project documentation. The core element is the `.ai.json` file, which serves as a universal interface between projects and AI systems.

## ⚠️ Critical System Requirements

### 1. Documentation Currency

- **Absolute Priority:** All files MUST be kept up to date
- **Synchronization:** JSON files and Markdown documentation must be in sync
- **Version Matching:** All version numbers in different files must match

### 2. File Consistency

- `.ai.json`: Primary project metadata
- `.ai.dev.json`: Developer-specific settings
- `*.md`: Documentation files
- `package.json` & `composer.json`: Dependency management

### 3. Update Responsibility

- AI systems should flag outdated information
- ALL relevant files must be updated when changes occur
- Security-relevant updates (e.g., dependencies) have highest priority

## 🎯 Primary Goals

- Standardized AI-readable project documentation
- Automatic detection of project structures
- Intelligent architecture analysis
- Seamless AI integration into development processes

## 📋 Available Resources

The following files should be primarily consulted by AI systems:

1. `.ai.json` - Central project metadata and AI context
2. `README.md` - General project overview
3. `AI-INTEGRATION.md` - Specific AI integration details
4. `CHANGELOG.md` - Version and change history
5. `TODO.md` - Current development goals
6. `SMART-INIT-CONCEPT.md` - Concept of intelligent project analysis

## 🔄 Recommended Analysis Workflow

1. **Initial Scan**

   - First, analyze `.ai.json` for project context
   - Consult README.md for an overview
   - Check CHANGELOG.md for the current version

2. **In-Depth Analysis**

   - AI-INTEGRATION.md for specific AI features
   - Architecture section in .ai.json for project structure
   - Technology Stack for used technologies

3. **Context Building**
   - User Preferences for communication style
   - Known Issues for known problems
   - Research section for current developments

## 🎯 Best Practices

1. **Communication**

   - Use the language settings defined in user_preferences
   - Note the desired technical level of detail
   - Follow the prescribed communication style

2. **Technical Support**

   - Consider documented_issues
   - Use the architecture section for context
   - Note planned features in planned_features

3. **Project-Specific Adjustment**

   - Analyze project_type for context
   - Note framework_specific_details
   - Consider defined patterns

4. **File Analysis & Context Understanding**
   - ALWAYS read files completely, even if parts are known
   - Clarify all ambiguities BEFORE starting work
   - Check dependencies and redundancies
   - Complete checklist before implementation:
     - Complete file analysis ✓
     - Dependency check ✓
     - Documentation of ambiguities ✓
     - Clarification of open questions ✓

## ⚠️ Important Notes

1. **Versioning**

   - Current version: 3.7.0
   - Check CHANGELOG.md for breaking changes
   - Note compatibility notes

2. **Data Protection**

   - Respect private_sections in .ai.json
   - Note security_relevant markings
   - Follow data protection guidelines

3. **Framework Limitations**
   - Note known_limitations
   - Check compatibility_notes
   - Consider framework_restrictions

## 🧠 Intelligent Context Analysis

### 1. Structural Analysis

- Scan **project architecture**
  ```json
  "architecture": {
    "type": "hybrid-tool",
    "components": [...],
    "patterns": [...]
  }
  ```
- Identify **technology stack**
  ```json
  "technology_stack": {
    "core": [...],
    "frontend": [...],
    "tools": [...]
  }
  ```

### 2. Communication Context

- **Linguistic Adjustment**
  ```json
  "user_preferences": {
    "language": "english",
    "communication_style": "informal",
    "technical_depth": "high"
  }
  ```

### 3. Development Context

- **Current Research**
  ```json
  "research": [
    {
      "name": "ML-based code quality analysis",
      "status": "active_development"
    }
  ]
  ```
- **Planned Features**
  ```json
  "planned_features": [
    {
      "name": "Scalability features",
      "version_target": "4.0.0"
    }
  ]
  ```

## 🔍 Detailed Feature Usage

### 1. Automatic Documentation Synchronization

- Monitor changes in Markdown files
- Update .ai.json accordingly
- Ensure consistency between documents

### 2. Intelligent Error Handling

```json
"known_issues": [
  {
    "pattern": "...",
    "solution": "...",
    "context": "..."
  }
]
```

### 3. ML-based Analyses

- Code quality assessment
- Pattern recognition
- Architecture optimization

## 🛡️ Security & Updates (v3.7.0)

### 1. Update Mechanism

- Automatic schema validation
- Backup before changes
- Selective updates

### 2. Data Protection

- Protect project-specific data
- Mark sensitive information
- Observe access rights

## 🤝 Interaction Guidelines

### 1. Communication Principles

- **Adaptive Style:** Adapt to user_preferences
- **Context Awareness:** Use available metadata
- **Proactive Support:** Detect potential issues

### 2. Code Interaction

- Use architecture patterns as context
- Consider defined best practices
- Follow project-specific coding standards

### 3. Documentation Updates

- Keep .ai.json up to date
- Synchronize with other documents
- Document important changes

## 📈 Learning Improvement

### 1. Feedback Integration

- Collect user feedback
- Recognize improvement patterns
- Suggest optimizations

### 2. Pattern Recognition

- Identify recurring issues
- Develop solution strategies
- Build a knowledge base

### 3. Continuous Adjustment

- Update context understanding
- Refine communication style
- Optimize support quality

## 🔄 Continuous Improvement

- Use feedback from the community
- Note new features in changelog
- Update knowledge based on TODO.md

## 🛠️ Maintenance Guidelines

### 1. Regular Reviews

- Daily: Security updates and critical patches
- Weekly: Dependency updates and documentation synchronization
- Monthly: Complete system maintenance run

### 2. Update Process

- Immediately apply security-relevant updates
- Keep dependencies up to date
- Ensure backward compatibility
- Document changes in CHANGELOG.md

### 3. Documentation Synchronization

- Align version numbers in all files
- Keep feature descriptions consistent
- Document new features in all relevant files
- Maintain cross-references between documents

### 4. Quality Assurance

- Perform JSON schema validation
- Check markdown formatting
- Verify links and references
- Test code examples

## 📝 Final Remarks

AIM is a living system that is constantly evolving. AI systems should regularly reevaluate the documentation and update their understanding of the project. The currency and consistency of all project files are of utmost importance.

---

_This initialization guide was created to enable AI systems to provide the best possible integration and support in the project. Status: v3.7.0 (2025-07-15)_
