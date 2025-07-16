# AI MindLayer Ignore System

Das hierarchische Ignore-System ermöglicht eine flexible und dokumentierte Kontrolle darüber, welche Dateien vom AI MindLayer ignoriert werden sollen.

## Struktur

- `.ai.json.ignore` - Projekt-weite Ignore-Regeln
- `.ai.ignore.docs/` - Dokumentation und Begründungen
- `{ordner}/.ai.json.ignore` - Ordner-spezifische Regeln

## Pattern-Typen

- `*.extension` - Alle Dateien mit dieser Erweiterung
- `ordner/*` - Alle Dateien in diesem Ordner
- `!pattern` - Negierung (Datei explizit einschließen)
- `**/*.pattern` - Rekursive Suche

## Kategorien

1. **Persönliche Dateien**

   - `*.private.md`
   - `*.personal.md`
   - Grund: Schutz persönlicher Notizen und Arbeitsweisen

2. **Entwicklungs-Dateien**

   - `*.notes.md`
   - `dev/*.md`
   - Grund: Temporäre Entwicklungsnotizen

3. **System-Dateien**

   - `.DS_Store`
   - `Thumbs.db`
   - Grund: Betriebssystem-spezifische Dateien

4. **IDE-Dateien**
   - `.idea/`
   - `.vscode/`
   - Grund: Editor-spezifische Konfigurationen
