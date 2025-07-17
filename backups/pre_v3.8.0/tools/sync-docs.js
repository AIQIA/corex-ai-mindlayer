const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { red, green, blue } = require('colorette');

// Dokumentations-Synchronisation
function syncDocs() {
    console.log(blue('🔄 Starte Dokumentations-Synchronisation...'));

    try {
        // Liste der zu synchronisierenden Dateien
        const docFiles = [
            'README.md',
            'CHANGELOG.md',
            'TODO.md',
            'AI-INTEGRATION.md'
        ];

        // Versionsinformationen aus package.json lesen
        const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')));
        const version = packageJson.version;

        // Durchlaufe alle Dokumentationsdateien
        docFiles.forEach(file => {
            const filePath = resolve(__dirname, '..', file);
            let content = readFileSync(filePath, 'utf8');

            // Aktualisiere Versionsreferenzen
            content = content.replace(
                /Version: \d+\.\d+\.\d+/g,
                `Version: ${version}`
            );

            // Speichere aktualisierte Datei
            writeFileSync(filePath, content);
            console.log(green(`✅ ${file} synchronisiert`));
        });

        console.log(green('\n✨ Dokumentations-Synchronisation abgeschlossen!'));
    } catch (err) {
        console.error(red('❌ Fehler bei der Dokumentations-Synchronisation:'));
        console.error(red(err.message));
        process.exit(1);
    }
}

// Starte Synchronisation
syncDocs();
