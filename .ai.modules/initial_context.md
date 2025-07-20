# AIM Initial Context

## Projekt-Übersicht

coreX AI MindLayer (AIM) ist ein zweistufiges System zur AI-freundlichen Projektdokumentation:

1. **Setup-Phase:** Initial-Setup durch ai-init.php, die eine grundlegende .ai.json basierend auf Projekt-Analyse erstellt.

2. **Enhancement-Phase:** Kontinuierliche Verfeinerung durch KI-Assistenten, die das Projekt-Verständnis vertiefen und die .ai.json intelligent erweitern.

Als Meta-Tool ermöglicht AIM nicht nur die initiale Erstellung, sondern vor allem die intelligente Weiterentwicklung der .ai.json durch KI-Assistenten, die das Projekt-Wissen stetig verfeinern und aktualisieren.

## Kernfunktionen

- Framework-Erkennung und Analyse
- Intelligente Metadaten-Generierung
- Performance-optimierte Datenhaltung
- ML-basierte Code-Analyse
- Multi-IDE Support

## Architektur

- Modulares System mit .ai.json als Kern
- Performance-First Design
- Erweiterbare Plugin-Struktur
- Smart Caching und Lazy Loading

## Installation & Arbeitsweise

### 1. Initiales Setup (einmalig)

- Installation von AIM ins Projekt
- Ausführung der ai-init.php
- Basis-Projekterkennung & Framework-Identifikation
- Grundlegende .ai.json Erstellung

### 2. KI-Assistant Enhancement

- Intelligente Verfeinerung der .ai.json durch den AI-Assistant, indem er das Projekt selbsständig analysiert (zB Routing, Templateengine, DB, Rechtesystem, etc etc pp)!
- Detaillierte System-Dokumentation, README.md; TODO.md; STATUS.md (falls vorhanden muss Anwender gefragt werden ob überschrieben werden darf!)
- Integration von Best Practices (ggfs. sogar auch Dateivorlagen, zB für das erstellen von neuen Unterseiten, incl Class und view Dateien, falls gegeben, welche dann - im Sinne der Aktualität - natürlich auch unter regelmäßger Prüfung stehen muss bzgl. updates)
- Tiefgehendes Projekt-Verständnis
- speicherung von Fehlerbehebungen (nach dem Motto: Nicht den selben Fehler 2 mal machen! Fehler incl Lösung speichern)

### 3. IDE-Integration (falls IDE genutzt wird)

- Automatische Kontext-Wiederherstellung
- Intelligentes Session-Management
- Performance-optimiertes Caching
- Automatische Initialisierung bei IDE-Start

### 4. Kontinuierliche Evolution

- Dynamische .ai.json Anpassung durch KI
- Erkennung & Integration neuer Komponenten
- Intelligente Dokumentations-Updates
- Proaktive System-Verbesserungen

## Performance-Guidelines

- Priorisiere Ressourcen-Effizienz
- Nutze Smart Caching wo möglich
- Implementiere Lazy Loading für große Datensätze
- Beachte Memory-Limits und Cleanup

## Kernprinzipien

- Fokus auf Performance und Skalierbarkeit
- Klare, modulare Struktur
- Entwicklerfreundlichkeit
- Kontinuierliche Selbstoptimierung

## Arbeiten mit AIM (coreX AI MindLayer)

- Wünscht der Anwender Änderungen an seinem Projekt, also an bestehenden Dateien oder den Aufbau neuer Dateien/Sektionen, **müssen die betroffenen Dateien vollständig gelesen werden**, um den Kontext und die Zusammenhänge zu verstehen. Nur so kann sichergestellt werden, dass erforderliche Anpassungen auch in angrenzenden oder verbundenen Dateien/Sektionen korrekt übernommen und durchgeführt werden.

- **Nach Abschluss jeder Arbeit ist zu prüfen, ob es definierte `auto_tasks` gibt** – z. B. das Aktualisieren von `CHANGELOG.md`, `TODO.md`, `README.md`, `STATUS.md` etc. Auch hier gilt: **Immer zuerst die gesamte Datei lesen**, um Inkonsistenzen zu vermeiden.

- **Prinzipiell gilt: Redundanz ist ausdrücklich erwünscht.**
