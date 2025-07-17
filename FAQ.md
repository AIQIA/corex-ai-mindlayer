❓ FAQ – coreX AI MindLayer
🔧 Einrichtung & Nutzung

Was ist der coreX AI MindLayer?
Ein intelligentes Plugin für Entwickler, das KI-gestützt Projektstrukturen erkennt, dokumentiert und visualisiert – basierend auf der .ai.json-Datei.

Wie installiere ich das Plugin?
Einfach die VS Code Extension installieren und ai-init.php ausführen – der Scanner übernimmt den Rest.

Welche Sprachen/Frameworks werden unterstützt?
Über 100 Technologien, darunter Laravel, Vue, React, Django, Node.js, Flask, Rust, Go, uvm.

Wie starte ich den intelligenten Projekt-Scanner?
Per VS Code Command Palette: Run Intelligent Scanner → generiert oder aktualisiert .ai.json.

Was bedeutet die .ai.json?
Sie ist das zentrale KI-Gedächtnis deines Projekts: Architektur, Komponenten, Metadaten und Doku auf einen Blick.

Wie aktiviere ich AI IntelliSense?
Einfach per Command Enable AI IntelliSense – dann bekommst du kontextbasierte Vorschläge in allen Dateien.
⚙️ Erweiterte Funktionen

Kann ich meine Architektur visuell darstellen lassen?
Ja – per Architecture Preview oder Tree Explorer siehst du die gesamte Struktur interaktiv im Editor.

Gibt es eine visuelle Mind Map?
Ja – über den Mind Map Visualizer siehst du Beziehungen und Abhängigkeiten deiner Komponenten.

Was macht der Diff Analyzer?
Er vergleicht .ai.json-Dateien (z. B. vorher/nachher) und zeigt Änderungen farblich markiert an.

Kann ich automatisch Dokumentation generieren?
Ja – mit Generate AI Docs werden Kommentare und Doku-Inhalte automatisch erstellt.
🐞 Fehlermeldungen & Probleme

Fehler: Cannot validate PHP – Was tun?
Das bedeutet, dein php.validate.executablePath ist nicht korrekt gesetzt. In VS Code unter Einstellungen →
Beispiel (Windows):

"php.validate.executablePath": "d:/xampp/php/php.exe"

Was tun, wenn .ai.json Änderungen nicht erkannt werden?
Stelle sicher, dass der File Watcher aktiv ist. Falls nötig, nutze Validate .ai.json manuell.
🔄 DevOps & Automatisierung

Wie kann ich .ai.json automatisch aktuell halten?
Mit den Commands Run Auto-Sync, Update from Package, Scan Docker Configuration oder direkt via GitHub Actions.

Wird Docker unterstützt?
Ja – Dockerfiles und docker-compose.yml werden automatisch erkannt und dokumentiert (DOCKER.md wird generiert).
🧠 KI & Machine Learning

Was macht die KI wirklich?
Sie analysiert dein Projekt, erkennt Muster, schlägt Architektur-Verbesserungen vor und generiert kontextabhängige Inhalte.

Lernt das System mit?
Aktuell: Nein. Die KI arbeitet lokal oder über eine angebundene API. Eine selbstlernende Komponente ist für spätere Releases geplant.
💡 Erweiterbarkeit

Kann ich eigene Features hinzufügen?
Ja – du kannst .ai.json beliebig erweitern. Eigene Commands lassen sich ebenfalls über die Extension API integrieren.

Gibt es eine Integration für mein CMS? (z. B. coreX)
Ja – über das AI::M SiteCreator Modul kannst du neue Seiten KI-gestützt im Admin-Bereich erstellen lassen. (ERST AB v4.x !!)
