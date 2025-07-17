const { readFileSync } = require('fs');
const { resolve } = require('path');
const { red, green, yellow, blue } = require('colorette');

// Dokumentations-Validierung
async function validateDocs() {
    console.log(blue('🔍 Starte Dokumentations-Validierung...'));

    try {
        // Lese .ai.json.example für Referenzstruktur
        const aiJsonExample = JSON.parse(readFileSync(resolve(__dirname, '../.ai.json.example')));
        
        // Validiere README.md
        const readme = readFileSync(resolve(__dirname, '../README.md'), 'utf8');
        validateReadme(readme, aiJsonExample);

        // Validiere INITIALIZE.md
        const initialize = readFileSync(resolve(__dirname, '../INITIALIZE.md'), 'utf8');
        validateInitialize(initialize);

        // Validiere CHANGELOG.md
        const changelog = readFileSync(resolve(__dirname, '../CHANGELOG.md'), 'utf8');
        validateChangelog(changelog);

        // Validiere Versionskonsistenz
        await validateVersions();

        console.log(green('\n✅ Dokumentations-Validierung erfolgreich!'));
    } catch (err) {
        console.error(red('\n❌ Dokumentations-Validierung fehlgeschlagen:'));
        console.error(red(err.message));
        process.exit(1);
    }
}

// Validiere README.md
function validateReadme(content, aiJson) {
    console.log(blue('\n📝 Prüfe README.md...'));
    
    // Prüfe ob alle wichtigen Sektionen vorhanden sind
    const requiredSections = [
        '# coreX AI MindLayer',
        '## ⚠️ WICHTIG: Dokumentations-Redundanz',
        '## 📚 Dokumentation & Ressourcen'
    ];

    requiredSections.forEach(section => {
        if (!content.includes(section)) {
            throw new Error(`Fehlende Sektion in README.md: ${section}`);
        }
    });

    // Prüfe ob alle Features aus .ai.json.example dokumentiert sind
    if (aiJson.features) {
        aiJson.features.forEach(feature => {
            if (!content.includes(feature.name)) {
                console.warn(yellow(`⚠️ Feature nicht in README.md dokumentiert: ${feature.name}`));
            }
        });
    }

    console.log(green('✅ README.md validiert'));
}

// Validiere INITIALIZE.md
function validateInitialize(content) {
    console.log(blue('\n📝 Prüfe INITIALIZE.md auf Zweisprachigkeit...'));
    
    // Prüfe ob beide Sprachversionen vorhanden sind
    const requiredSections = [
        '🇩🇪 KI-Initialisierungsanleitung für AIM',
        '🇬🇧 AI MindLayer Initialization Guide',
        '[Deutsch](#de)',
        '[English](#en)',
        '<a id="de">',
        '<a id="en">'
    ];

    requiredSections.forEach(section => {
        if (!content.includes(section)) {
            throw new Error(`Fehlende Sektion in INITIALIZE.md: ${section}`);
        }
    });

    // Prüfe Version in beiden Sprachversionen
    const deVersion = content.match(/Stand: v([\d.]+)/);
    const enVersion = content.match(/Status: v([\d.]+)/);

    if (!deVersion || !enVersion) {
        throw new Error('Versionsnummer fehlt in einer oder beiden Sprachversionen');
    }

    if (deVersion[1] !== enVersion[1]) {
        throw new Error(`Versionsnummern stimmen nicht überein: DE=${deVersion[1]}, EN=${enVersion[1]}`);
    }

    console.log(green('✅ INITIALIZE.md Zweisprachigkeit validiert'));
}

// Validiere CHANGELOG.md
function validateChangelog(content) {
    console.log(blue('\n📋 Prüfe CHANGELOG.md...'));

    // Prüfe Changelog-Format
    if (!content.includes('# CHANGELOG')) {
        throw new Error('CHANGELOG.md: Fehlender Haupttitel');
    }

    // Prüfe Version Headers
    const versionPattern = /## \[\d+\.\d+\.\d+\]/;
    if (!versionPattern.test(content)) {
        throw new Error('CHANGELOG.md: Keine gültige Versionsformatierung gefunden');
    }

    console.log(green('✅ CHANGELOG.md validiert'));
}

// Validiere Versionskonsistenz
async function validateVersions() {
    console.log(blue('\n🔍 Prüfe Versionskonsistenz...'));

    // Lese Versionen aus verschiedenen Quellen
    const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')));
    const changelog = readFileSync(resolve(__dirname, '../CHANGELOG.md'), 'utf8');

    // Extrahiere aktuelle Version aus CHANGELOG.md
    const changelogVersion = changelog.match(/## \[(\d+\.\d+\.\d+)\]/)?.[1];

    // Vergleiche Versionen
    if (packageJson.version !== changelogVersion) {
        throw new Error(`Versionskonflikt: package.json (${packageJson.version}) != CHANGELOG.md (${changelogVersion})`);
    }

    console.log(green('✅ Versionskonsistenz validiert'));
}

// Starte Validierung
validateDocs();
