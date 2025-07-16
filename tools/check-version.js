const https = require('https');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { red, green, yellow, blue } = require('colorette');

// Versionsprüfung
async function checkVersion() {
    console.log(blue('🔍 Prüfe auf neue Versionen...'));

    try {
        // Lese lokale Version
        const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')));
        const localVersion = packageJson.version;
        
        console.log(blue(`📦 Lokale Version: ${localVersion}`));

        // Prüfe npm Registry
        const latestVersion = await getLatestVersion(packageJson.name);
        console.log(blue(`🌐 Aktuelle Version: ${latestVersion}`));

        // Vergleiche Versionen
        if (localVersion !== latestVersion) {
            console.warn(yellow(`\n⚠️ Neue Version verfügbar: ${latestVersion}`));
            console.log(yellow('Führe npm update aus, um auf die neueste Version zu aktualisieren.'));
            process.exit(1);
        }

        console.log(green('\n✅ Du verwendest die aktuelle Version!'));
        process.exit(0);
    } catch (err) {
        console.error(red('\n❌ Fehler bei der Versionsprüfung:'));
        console.error(red(err.message));
        process.exit(1);
    }
}

// Hole neueste Version von npm
function getLatestVersion(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://registry.npmjs.org/${packageName}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => data += chunk);
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json['dist-tags'].latest);
                } catch (err) {
                    reject(new Error('Fehler beim Abrufen der aktuellen Version'));
                }
            });
        }).on('error', () => {
            reject(new Error('Netzwerkfehler beim Versions-Check'));
        });
    });
}

// Starte Versionsprüfung
checkVersion();
