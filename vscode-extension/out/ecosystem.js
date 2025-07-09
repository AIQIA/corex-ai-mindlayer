"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanDockerConfiguration = exports.updateFromPackageManager = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Package Manager Integration für NPM und Composer
 */
async function updateFromPackageManager() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner geöffnet');
        return;
    }
    // Prüfe welche package manager verfügbar sind
    const hasPackageJson = fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'package.json'));
    const hasComposerJson = fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'composer.json'));
    if (!hasPackageJson && !hasComposerJson) {
        vscode.window.showErrorMessage('Kein package.json oder composer.json gefunden');
        return;
    }
    // Prüfe ob Composer installiert ist, falls composer.json vorhanden
    let composerInstalled = false;
    if (hasComposerJson) {
        try {
            // Prüfen ob Composer im Pfad verfügbar ist
            await execAsync(process.platform === 'win32' ? 'where composer' : 'which composer');
            composerInstalled = true;
        }
        catch (error) {
            // Composer ist nicht installiert
            composerInstalled = false;
        }
    }
    // Frage den Benutzer welchen Manager er verwenden möchte
    let packageManager;
    if (hasPackageJson && hasComposerJson && composerInstalled) {
        packageManager = await vscode.window.showQuickPick(['NPM (package.json)', 'Composer (composer.json)'], { placeHolder: 'Welchen Package Manager möchten Sie verwenden?' });
        if (!packageManager)
            return;
        packageManager = packageManager.startsWith('NPM') ? 'npm' : 'composer';
    }
    else if (hasPackageJson) {
        packageManager = 'npm';
    }
    else if (hasComposerJson && composerInstalled) {
        packageManager = 'composer';
    }
    else if (hasComposerJson && !composerInstalled) {
        // Composer JSON gefunden aber kein Composer installiert - Fallbacks anbieten
        const fallbackOption = await vscode.window.showQuickPick(['Standalone Composer Plugin', 'PHP Scanner', 'Abbrechen'], {
            placeHolder: 'Composer ist nicht installiert. Welche Alternative möchten Sie verwenden?',
            canPickMany: false
        });
        if (fallbackOption === 'Standalone Composer Plugin') {
            // Führe den Standalone Composer Plugin aus
            await runStandaloneComposerPlugin(workspaceFolder);
            return;
        }
        else if (fallbackOption === 'PHP Scanner') {
            // Führe den PHP Scanner aus
            await runStandalonePhpScanner(workspaceFolder);
            return;
        }
        else {
            vscode.window.showInformationMessage('Um Composer zu nutzen, installieren Sie bitte Composer (https://getcomposer.org) und versuchen Sie es erneut.');
            return;
        }
    }
    // Prüfe ob ein Package Manager ausgewählt wurde
    if (!packageManager) {
        vscode.window.showErrorMessage('Kein Package Manager ausgewählt');
        return;
    }
    // Stelle sicher, dass das Plugin-Script existiert
    const scriptsPath = path.join(workspaceFolder.uri.fsPath, 'scripts', 'ecosystem');
    const npmPluginPath = path.join(scriptsPath, 'npm-plugin', 'index.js');
    const composerPluginPath = path.join(scriptsPath, 'composer-plugin', 'src', 'ComposerPlugin.php');
    if ((packageManager === 'npm' && !fs.existsSync(npmPluginPath)) ||
        (packageManager === 'composer' && !fs.existsSync(composerPluginPath))) {
        const copyPlugins = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: `${packageManager.toUpperCase()} Plugin nicht gefunden. Möchten Sie es aus der Extension kopieren?` });
        if (copyPlugins !== 'Ja')
            return;
        // Stelle sicher, dass die Ordner existieren
        if (!fs.existsSync(scriptsPath)) {
            fs.mkdirSync(scriptsPath, { recursive: true });
        }
        if (packageManager === 'npm') {
            const npmPluginDir = path.join(scriptsPath, 'npm-plugin');
            if (!fs.existsSync(npmPluginDir)) {
                fs.mkdirSync(npmPluginDir, { recursive: true });
            }
            // Kopiere die Plugin-Dateien aus der Extension
            const extensionPath = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.extensionPath;
            if (extensionPath) {
                const sourcePath = path.join(extensionPath, 'resources', 'ecosystem', 'npm-plugin');
                if (fs.existsSync(sourcePath)) {
                    copyDirectory(sourcePath, npmPluginDir);
                }
                else {
                    // Erstelle basic Plugin-Files
                    createNpmPluginFiles(npmPluginDir);
                }
            }
            else {
                createNpmPluginFiles(npmPluginDir);
            }
        }
        else {
            const composerPluginDir = path.join(scriptsPath, 'composer-plugin');
            if (!fs.existsSync(composerPluginDir)) {
                fs.mkdirSync(composerPluginDir, { recursive: true });
            }
            const composerSrcDir = path.join(composerPluginDir, 'src');
            if (!fs.existsSync(composerSrcDir)) {
                fs.mkdirSync(composerSrcDir, { recursive: true });
            }
            // Kopiere die Plugin-Dateien aus der Extension
            const extensionPath = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.extensionPath;
            if (extensionPath) {
                const sourcePath = path.join(extensionPath, 'resources', 'ecosystem', 'composer-plugin');
                if (fs.existsSync(sourcePath)) {
                    copyDirectory(sourcePath, composerPluginDir);
                }
                else {
                    // Erstelle basic Plugin-Files
                    createComposerPluginFiles(composerPluginDir);
                }
            }
            else {
                createComposerPluginFiles(composerPluginDir);
            }
        }
    }
    // Führe das Plugin aus
    const terminal = vscode.window.createTerminal(`AI MindLayer - ${packageManager.toUpperCase()} Plugin`);
    terminal.show();
    // Zu Workspace-Ordner navigieren
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    if (packageManager === 'npm') {
        terminal.sendText('node scripts/ecosystem/npm-plugin/index.js');
    }
    else if (packageManager === 'composer') {
        // Noch einmal prüfen, ob Composer wirklich verfügbar ist
        try {
            await execAsync(process.platform === 'win32' ? 'where composer' : 'which composer');
            // Bei Composer benötigen wir composer.json im Plugin-Verzeichnis
            if (!fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'scripts/ecosystem/composer-plugin/composer.json'))) {
                vscode.window.showErrorMessage('composer.json im Plugin-Verzeichnis nicht gefunden');
                return;
            }
            // Installation in einem Try-Block ausführen, um Fehlermeldung zu fangen
            try {
                terminal.sendText('cd scripts/ecosystem/composer-plugin');
                terminal.sendText('composer install');
                terminal.sendText('cd ../../..');
                // Prüfen ob vendor/bin/composer existiert, sonst alternativen Pfad versuchen
                const vendorBinPath = path.join(workspaceFolder.uri.fsPath, 'scripts/ecosystem/composer-plugin/vendor/bin');
                if (fs.existsSync(vendorBinPath)) {
                    terminal.sendText('php scripts/ecosystem/composer-plugin/vendor/bin/composer aimindlayer:update');
                }
                else {
                    // Alternatives Kommando versuchen
                    terminal.sendText('cd scripts/ecosystem/composer-plugin && php -f src/ComposerPlugin.php && cd ../../..');
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Fehler beim Ausführen von Composer: ${error}`);
                // Biete Alternativen an
                const fallbackOption = await vscode.window.showQuickPick(['Standalone Composer Plugin', 'PHP Scanner', 'Abbrechen'], {
                    placeHolder: 'Composer-Plugin konnte nicht ausgeführt werden. Welche Alternative möchten Sie verwenden?',
                    canPickMany: false
                });
                if (fallbackOption === 'Standalone Composer Plugin') {
                    // Führe den Standalone Composer Plugin aus
                    await runStandaloneComposerPlugin(workspaceFolder);
                    return;
                }
                else if (fallbackOption === 'PHP Scanner') {
                    // Führe den PHP Scanner aus
                    await runStandalonePhpScanner(workspaceFolder);
                    return;
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage('Composer ist nicht installiert oder nicht im PATH verfügbar');
            // Biete Alternativen an
            const fallbackOption = await vscode.window.showQuickPick(['Standalone Composer Plugin', 'PHP Scanner', 'Abbrechen'], {
                placeHolder: 'Composer ist nicht verfügbar. Welche Alternative möchten Sie verwenden?',
                canPickMany: false
            });
            if (fallbackOption === 'Standalone Composer Plugin') {
                // Führe den Standalone Composer Plugin aus
                await runStandaloneComposerPlugin(workspaceFolder);
                return;
            }
            else if (fallbackOption === 'PHP Scanner') {
                // Führe den PHP Scanner aus
                await runStandalonePhpScanner(workspaceFolder);
                return;
            }
        }
    }
    vscode.window.showInformationMessage(`🔄 ${packageManager.toUpperCase()} Integration wird ausgeführt...`);
}
exports.updateFromPackageManager = updateFromPackageManager;
/**
 * Docker Integration zur Scan von Docker-Konfigurationen
 */
async function scanDockerConfiguration() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner geöffnet');
        return;
    }
    // Prüfe, ob Docker-Konfigurationen vorhanden sind
    const hasDockerfile = fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'Dockerfile')) ||
        fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'docker', 'Dockerfile')) ||
        fs.existsSync(path.join(workspaceFolder.uri.fsPath, '.docker', 'Dockerfile'));
    const hasDockerCompose = fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'docker-compose.yml')) ||
        fs.existsSync(path.join(workspaceFolder.uri.fsPath, 'docker-compose.yaml'));
    if (!hasDockerfile && !hasDockerCompose) {
        const createDocs = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: 'Keine Docker-Konfiguration gefunden. Möchten Sie trotzdem Docker-Dokumentation erstellen?' });
        if (createDocs !== 'Ja')
            return;
    }
    // Stelle sicher, dass das Docker-Scanner-Script existiert
    const dockerScriptPath = path.join(workspaceFolder.uri.fsPath, 'scripts', 'ecosystem', 'docker-integration', 'docker-scanner.js');
    if (!fs.existsSync(dockerScriptPath)) {
        const createScript = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: 'Docker-Scanner-Script nicht gefunden. Möchten Sie es erstellen?' });
        if (createScript !== 'Ja')
            return;
        // Stelle sicher, dass der Ordner existiert
        const dockerDir = path.dirname(dockerScriptPath);
        if (!fs.existsSync(dockerDir)) {
            fs.mkdirSync(dockerDir, { recursive: true });
        }
        // Kopiere die Script-Dateien aus der Extension oder erstelle neue
        const extensionPath = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.extensionPath;
        if (extensionPath) {
            const sourcePath = path.join(extensionPath, 'resources', 'ecosystem', 'docker-integration');
            if (fs.existsSync(sourcePath)) {
                copyDirectory(sourcePath, dockerDir);
            }
            else {
                // Erstelle basic Docker-Scanner Files
                createDockerScripts(dockerDir);
            }
        }
        else {
            createDockerScripts(dockerDir);
        }
    }
    // Node.js Dependencies für Docker-Scanner installieren
    const terminal = vscode.window.createTerminal('AI MindLayer - Docker Scanner');
    terminal.show();
    // Zu Workspace-Ordner navigieren
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    // js-yaml für YAML-Parsing installieren (wird für docker-compose.yml benötigt)
    terminal.sendText('npm install js-yaml --no-save');
    // Das Docker-Scanner-Script ausführen
    terminal.sendText('node scripts/ecosystem/docker-integration/docker-scanner.js --verbose');
    // Optional: Docker-Dokumentation erstellen
    const createDocs = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: 'Möchten Sie auch Docker-Dokumentation generieren?' });
    if (createDocs === 'Ja') {
        terminal.sendText('node scripts/ecosystem/docker-integration/docker-docs.js');
    }
    vscode.window.showInformationMessage('🐳 Docker-Konfiguration wird gescannt und in .ai.json integriert...');
}
exports.scanDockerConfiguration = scanDockerConfiguration;
/**
 * Hilfsfunktion zum Kopieren eines Verzeichnisses
 */
function copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    const files = fs.readdirSync(source);
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        const stat = fs.statSync(sourcePath);
        if (stat.isDirectory()) {
            copyDirectory(sourcePath, targetPath);
        }
        else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
}
/**
 * Erstellt Basic NPM Plugin Files
 */
function createNpmPluginFiles(dir) {
    // index.js
    const indexJs = `#!/usr/bin/env node

/**
 * coreX AI MindLayer - NPM Plugin
 * 
 * Aktualisiert .ai.json basierend auf package.json
 */

const fs = require('fs');
const path = require('path');

// .ai.json laden
function loadAiJson() {
    const aiJsonPath = '.ai.json';
    try {
        if (fs.existsSync(aiJsonPath)) {
            return JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
        }
    } catch (error) {
        console.error(\`Fehler beim Laden der .ai.json: \${error.message}\`);
    }
    return {};
}

// .ai.json speichern
function saveAiJson(aiJson) {
    const aiJsonPath = '.ai.json';
    try {
        fs.writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(\`Fehler beim Speichern der .ai.json: \${error.message}\`);
        return false;
    }
}

// Haupt-Funktion
function updateFromPackageJson() {
    console.log('🔄 coreX AI MindLayer - NPM Plugin');
    
    // package.json prüfen
    if (!fs.existsSync('package.json')) {
        console.error('❌ package.json nicht gefunden');
        return;
    }
    
    try {
        // Dateien laden
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const aiJson = loadAiJson();
        
        // Sicherstellen, dass die Grundstruktur existiert
        if (!aiJson.project) aiJson.project = {};
        if (!aiJson.architecture) aiJson.architecture = {};
        if (!aiJson.architecture.dependencies) aiJson.architecture.dependencies = [];
        
        // Projektdaten aktualisieren
        if (packageJson.name) aiJson.project.name = packageJson.name;
        if (packageJson.version) aiJson.project.version = packageJson.version;
        if (packageJson.description) aiJson.project.description = packageJson.description;
        
        // Dependencies aktualisieren
        if (packageJson.dependencies) {
            Object.entries(packageJson.dependencies).forEach(([name, version]) => {
                const existing = aiJson.architecture.dependencies.find(d => d.name === name);
                if (existing) {
                    existing.version = version;
                } else {
                    aiJson.architecture.dependencies.push({
                        name, 
                        version,
                        type: 'npm'
                    });
                }
            });
        }
        
        // Speichern
        if (saveAiJson(aiJson)) {
            console.log('✅ .ai.json wurde mit NPM-Informationen aktualisiert');
        }
    } catch (error) {
        console.error(\`❌ Fehler: \${error.message}\`);
    }
}

// Script ausführen
updateFromPackageJson();
`;
    fs.writeFileSync(path.join(dir, 'index.js'), indexJs);
    // package.json
    const packageJson = {
        "name": "corex-ai-mindlayer-npm-plugin",
        "version": "1.0.0",
        "description": "NPM Plugin für coreX AI MindLayer",
        "main": "index.js",
        "scripts": {
            "postinstall": "node scripts/setup.js"
        },
        "author": "AIQIA Team",
        "license": "MIT"
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
    // Scripts-Ordner erstellen
    const scriptsDir = path.join(dir, 'scripts');
    if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir);
    }
    // Setup-Script
    const setupJs = `#!/usr/bin/env node

/**
 * coreX AI MindLayer - NPM Plugin Setup
 */
console.log('🤖 coreX AI MindLayer - NPM Plugin Setup');
console.log('✅ NPM Plugin installiert und bereit zur Verwendung!');
`;
    fs.writeFileSync(path.join(scriptsDir, 'setup.js'), setupJs);
}
/**
 * Erstellt Basic Composer Plugin Files
 */
function createComposerPluginFiles(dir) {
    // composer.json
    const composerJson = {
        "name": "aiqia/corex-ai-mindlayer-plugin",
        "description": "Composer Plugin für coreX AI MindLayer",
        "type": "composer-plugin",
        "license": "MIT",
        "authors": [
            {
                "name": "AIQIA Team",
                "email": "info@aiqia.de"
            }
        ],
        "require": {
            "php": ">=7.2",
            "composer-plugin-api": "^2.0"
        },
        "require-dev": {
            "composer/composer": "^2.0"
        },
        "autoload": {
            "psr-4": {
                "CoreX\\AIMindLayer\\": "src/"
            }
        },
        "extra": {
            "class": "CoreX\\AIMindLayer\\ComposerPlugin"
        }
    };
    fs.writeFileSync(path.join(dir, 'composer.json'), JSON.stringify(composerJson, null, 2));
    // src-Ordner erstellen
    const srcDir = path.join(dir, 'src');
    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir);
    }
    // ComposerPlugin.php
    const pluginPhp = `<?php

namespace CoreX\\AIMindLayer;

use Composer\\Composer;
use Composer\\IO\\IOInterface;
use Composer\\Plugin\\PluginInterface;

/**
 * coreX AI MindLayer Composer Plugin
 */
class ComposerPlugin implements PluginInterface
{
    /**
     * Plugin wird aktiviert
     */
    public function activate(Composer $composer, IOInterface $io)
    {
        $io->write('<info>coreX AI MindLayer Plugin aktiviert</info>');
        
        // .ai.json suchen und aktualisieren
        $aiJsonPath = getcwd() . '/.ai.json';
        if (file_exists($aiJsonPath)) {
            $aiJson = json_decode(file_get_contents($aiJsonPath), true);
        } else {
            $aiJson = [];
        }
        
        // Grundstruktur erstellen
        if (!isset($aiJson['project'])) $aiJson['project'] = [];
        if (!isset($aiJson['architecture'])) $aiJson['architecture'] = [];
        if (!isset($aiJson['architecture']['dependencies'])) $aiJson['architecture']['dependencies'] = [];
        
        // composer.json Infos auslesen
        $composerJsonPath = getcwd() . '/composer.json';
        if (file_exists($composerJsonPath)) {
            $composerJson = json_decode(file_get_contents($composerJsonPath), true);
            
            // Projektdaten aktualisieren
            if (isset($composerJson['name'])) $aiJson['project']['name'] = $composerJson['name'];
            if (isset($composerJson['description'])) $aiJson['project']['description'] = $composerJson['description'];
            if (isset($composerJson['version'])) $aiJson['project']['version'] = $composerJson['version'];
            
            // Dependencies aktualisieren
            if (isset($composerJson['require'])) {
                foreach ($composerJson['require'] as $name => $version) {
                    if ($name === 'php') continue;
                    
                    $found = false;
                    foreach ($aiJson['architecture']['dependencies'] as &$dep) {
                        if ($dep['name'] === $name) {
                            $dep['version'] = $version;
                            $found = true;
                            break;
                        }
                    }
                    
                    if (!$found) {
                        $aiJson['architecture']['dependencies'][] = [
                            'name' => $name,
                            'version' => $version,
                            'type' => 'composer'
                        ];
                    }
                }
            }
            
            // .ai.json speichern
            file_put_contents($aiJsonPath, json_encode($aiJson, JSON_PRETTY_PRINT));
            $io->write('<info>.ai.json wurde aktualisiert</info>');
        } else {
            $io->write('<error>composer.json nicht gefunden</error>');
        }
    }

    /**
     * Plugin wird deaktiviert
     */
    public function deactivate(Composer $composer, IOInterface $io)
    {
        $io->write('<info>coreX AI MindLayer Plugin deaktiviert</info>');
    }

    /**
     * Plugin wird deinstalliert
     */
    public function uninstall(Composer $composer, IOInterface $io)
    {
        $io->write('<info>coreX AI MindLayer Plugin deinstalliert</info>');
    }
}
`;
    fs.writeFileSync(path.join(srcDir, 'ComposerPlugin.php'), pluginPhp);
}
/**
 * Erstellt Docker Script Files
 */
function createDockerScripts(dir) {
    // docker-scanner.js
    const scannerJs = `#!/usr/bin/env node

/**
 * coreX AI MindLayer - Docker Scanner
 * 
 * Scannt Docker-Konfigurationen und aktualisiert .ai.json
 */

const fs = require('fs');
const path = require('path');

// Docker-Konfigurationen suchen
console.log('🐳 coreX AI MindLayer - Docker Scanner');

// Dateipfade definieren
const dockerfilePaths = ['Dockerfile', 'docker/Dockerfile', '.docker/Dockerfile'];
const composeFilePaths = ['docker-compose.yml', 'docker-compose.yaml'];
let dockerfileFound = false;
let composeFileFound = false;

// Docker-Konfigurationen suchen
for (const dPath of dockerfilePaths) {
    if (fs.existsSync(dPath)) {
        console.log(\`✅ \${dPath} gefunden\`);
        dockerfileFound = true;
        break;
    }
}

for (const cPath of composeFilePaths) {
    if (fs.existsSync(cPath)) {
        console.log(\`✅ \${cPath} gefunden\`);
        composeFileFound = true;
        break;
    }
}

if (!dockerfileFound && !composeFileFound) {
    console.log('❌ Keine Docker-Konfiguration gefunden');
    process.exit(1);
}

// .ai.json laden
let aiJson = {};
const aiJsonPath = '.ai.json';

if (fs.existsSync(aiJsonPath)) {
    try {
        aiJson = JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
    } catch (e) {
        console.error(\`❌ Fehler beim Lesen der .ai.json: \${e.message}\`);
    }
}

// Sicherstellen, dass die Grundstruktur existiert
if (!aiJson.architecture) aiJson.architecture = {};
if (!aiJson.architecture.infrastructure) aiJson.architecture.infrastructure = {};

// Docker-Informationen in .ai.json eintragen
aiJson.architecture.infrastructure.docker = {
    dockerfile: dockerfileFound,
    compose: composeFileFound,
    lastScanned: new Date().toISOString()
};

// Docker als Feature hinzufügen
if (!aiJson.features) aiJson.features = [];

if (!aiJson.features.some(f => f.id === 'docker-integration')) {
    aiJson.features.push({
        "id": "docker-integration",
        "name": "Docker Integration",
        "description": "Containerisierung und Docker-Orchestrierung",
        "type": "infrastructure",
        "category": "ecosystem",
        "status": "active"
    });
}

// .ai.json speichern
try {
    fs.writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf8');
    console.log('✅ Docker-Informationen wurden in .ai.json gespeichert');
} catch (e) {
    console.error(\`❌ Fehler beim Speichern der .ai.json: \${e.message}\`);
}

// Erfolg melden
console.log('✅ Docker-Scan abgeschlossen');
`;
    fs.writeFileSync(path.join(dir, 'docker-scanner.js'), scannerJs);
    // docker-docs.js
    const docsJs = `#!/usr/bin/env node

/**
 * coreX AI MindLayer - Docker Dokumentation Generator
 * 
 * Generiert Dokumentation für Docker-Konfigurationen
 */

const fs = require('fs');

console.log('📄 coreX AI MindLayer - Docker Dokumentation Generator');

// .ai.json laden
let aiJson = {};
const aiJsonPath = '.ai.json';

if (fs.existsSync(aiJsonPath)) {
    try {
        aiJson = JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
    } catch (e) {
        console.error(\`❌ Fehler beim Lesen der .ai.json: \${e.message}\`);
        process.exit(1);
    }
} else {
    console.error('❌ .ai.json nicht gefunden');
    process.exit(1);
}

// Prüfen ob Docker-Informationen vorhanden sind
if (!aiJson.architecture || !aiJson.architecture.infrastructure || !aiJson.architektur.infrastructure.docker) {
    console.error('❌ Keine Docker-Informationen in .ai.json gefunden');
    console.log('💡 Führen Sie zuerst den Docker-Scanner aus: node docker-scanner.js');
    process.exit(1);
}

// Dokumentation generieren
const docker = aiJson.architektur.infrastructure.docker;
const projectName = aiJson.project?.name || 'Projekt';

let markdown = \`# 🐳 Docker-Dokumentation: \${projectName}

> Automatisch generierte Dokumentation durch coreX AI MindLayer

## Docker-Konfiguration

\`;

if (docker.dockerfile) {
    markdown += \`- ✅ **Dockerfile** vorhanden\n\`;
}

if (docker.compose) {
    markdown += \`- ✅ **Docker Compose** konfiguriert\n\`;
}

markdown += \`
## 🚀 Nutzung

### Starten der Container

\`\`\`bash
docker-compose up -d
\`\`\`

### Stoppen der Container

\`\`\`bash
docker-compose down
\`\`\`

### Logs anzeigen

\`\`\`bash
docker-compose logs -f
\`\`\`

---

> Diese Dokumentation wurde automatisch durch coreX AI MindLayer erstellt.
\`;

// Dokumentation speichern
try {
    fs.writeFileSync('DOCKER.md', markdown, 'utf8');
    console.log('✅ Docker-Dokumentation wurde in DOCKER.md gespeichert');
} catch (e) {
    console.error(\`❌ Fehler beim Speichern der Dokumentation: \${e.message}\`);
}
`;
    fs.writeFileSync(path.join(dir, 'docker-docs.js'), docsJs);
}
/**
 * Führt den Standalone PHP Scanner aus
 *
 * @param workspaceFolder Workspace-Ordner
 */
async function runStandalonePhpScanner(workspaceFolder) {
    // Prüfe, ob der PHP Scanner existiert
    const phpScannerPath = path.join(workspaceFolder.uri.fsPath, 'scripts', 'ecosystem', 'php-scanner', 'PhpProjectScanner.php');
    if (!fs.existsSync(phpScannerPath)) {
        const createScanner = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: 'PHP Scanner nicht gefunden. Möchten Sie ihn erstellen?' });
        if (createScanner !== 'Ja')
            return;
        // Stelle sicher, dass der Ordner existiert
        const phpScannerDir = path.dirname(phpScannerPath);
        if (!fs.existsSync(phpScannerDir)) {
            fs.mkdirSync(phpScannerDir, { recursive: true });
        }
        // Kopiere die Scanner-Dateien aus der Extension
        const extensionPath = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.extensionPath;
        if (extensionPath) {
            const sourcePath = path.join(extensionPath, 'resources', 'ecosystem', 'php-scanner');
            if (fs.existsSync(sourcePath)) {
                copyDirectory(sourcePath, phpScannerDir);
            }
            else {
                // Erstelle basic PHP-Scanner File
                createPhpScannerFiles(phpScannerDir);
            }
        }
        else {
            createPhpScannerFiles(phpScannerDir);
        }
    }
    // Führe den PHP Scanner aus
    const terminal = vscode.window.createTerminal('AI MindLayer - PHP Scanner');
    terminal.show();
    // Zu Workspace-Ordner navigieren
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    // Check if PHP is installed
    try {
        await execAsync('php -v');
        // PHP is installed, run the scanner
        terminal.sendText('php scripts/ecosystem/php-scanner/PhpProjectScanner.php');
        vscode.window.showInformationMessage('🔄 PHP Scanner wird ausgeführt...');
    }
    catch (error) {
        // PHP is not installed
        vscode.window.showErrorMessage('PHP ist nicht installiert. Bitte installieren Sie PHP, um den Scanner ausführen zu können.');
    }
}
/**
 * Erstellt PHP Scanner Files
 *
 * @param phpScannerDir PHP Scanner Verzeichnis
 */
function createPhpScannerFiles(phpScannerDir) {
    // Die PhpProjectScanner.php erstellen
    const phpScannerContent = `<?php
/**
 * coreX AI MindLayer - PHP Project Scanner
 * 
 * Standalone-Alternative zum Composer-Plugin für Projekte ohne Composer
 */

/**
 * Scannt ein PHP-Projekt und aktualisiert die .ai.json
 */
class PhpProjectScanner {
    /**
     * Führt den Scan durch
     */
    public function scan() {
        echo "🔍 coreX AI MindLayer - PHP Project Scanner\\n";
        
        // Prüfen, ob eine composer.json existiert
        if (file_exists('composer.json')) {
            echo "✓ composer.json gefunden, verarbeite...\\n";
            $this->scanWithComposer();
        } else {
            echo "ℹ️ Keine composer.json gefunden. Analysiere Projektstruktur...\\n";
            $this->scanWithoutComposer();
        }
    }
    
    /**
     * Scan mit composer.json
     */
    private function scanWithComposer() {
        try {
            $composerContent = file_get_contents('composer.json');
            $composerJson = json_decode($composerContent, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "⚠️ composer.json enthält ungültiges JSON: " . json_last_error_msg() . "\\n";
                return;
            }
            
            // .ai.json laden oder erstellen
            $aiJson = $this->loadOrCreateAiJson();
            
            // Projektinformationen übernehmen
            if (isset($composerJson['name'])) {
                $aiJson['project']['name'] = $composerJson['name'];
            }
            
            if (isset($composerJson['description'])) {
                $aiJson['project']['description'] = $composerJson['description'];
            }
            
            if (isset($composerJson['version'])) {
                $aiJson['project']['version'] = $composerJson['version'];
            }
            
            // Dependencies verarbeiten
            if (isset($composerJson['require'])) {
                if (!isset($aiJson['architecture']['dependencies'])) {
                    $aiJson['architecture']['dependencies'] = [];
                }
                
                foreach ($composerJson['require'] as $name => $version) {
                    if ($name === 'php') continue; // PHP-Requirement überspringen
                    
                    $found = false;
                    foreach ($aiJson['architecture']['dependencies'] as &$dep) {
                        if (isset($dep['name']) && $dep['name'] === $name) {
                            $dep['version'] = $version;
                            $found = true;
                            break;
                        }
                    }
                    
                    if (!$found) {
                        $aiJson['architecture']['dependencies'][] = [
                            'name' => $name,
                            'version' => $version,
                            'type' => 'composer'
                        ];
                    }
                }
            }
            
            // .ai.json speichern
            $this->saveAiJson($aiJson);
            
            echo "✅ .ai.json wurde mit Composer-Informationen aktualisiert!\\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler: " . $e->getMessage() . "\\n";
        }
    }
    
    /**
     * Scan ohne composer.json
     */
    private function scanWithoutComposer() {
        try {
            // .ai.json laden oder erstellen
            $aiJson = $this->loadOrCreateAiJson();
            
            // Projektname aus Verzeichnis
            $projectName = basename(getcwd());
            $aiJson['project']['name'] = $aiJson['project']['name'] ?? $projectName;
            $aiJson['project']['type'] = $aiJson['project']['type'] ?? 'php-application';
            
            // .ai.json speichern
            $this->saveAiJson($aiJson);
            
            echo "✅ .ai.json wurde erstellt/aktualisiert!\\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler: " . $e->getMessage() . "\\n";
        }
    }
    
    /**
     * Lädt die .ai.json oder erstellt eine neue
     */
    private function loadOrCreateAiJson() {
        if (file_exists('.ai.json')) {
            $content = file_get_contents('.ai.json');
            $aiJson = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "⚠️ .ai.json enthält ungültiges JSON. Erstelle neue Datei.\\n";
                return $this->createBaseAiJson();
            }
            
            return $aiJson;
        } else {
            echo "ℹ️ Keine .ai.json gefunden. Erstelle neue Datei.\\n";
            return $this->createBaseAiJson();
        }
    }
    
    /**
     * Erstellt eine Basis-.ai.json
     */
    private function createBaseAiJson() {
        $projectName = basename(getcwd());
        
        return [
            'project' => [
                'name' => $projectName,
                'description' => 'PHP-Projekt',
                'version' => '0.1.0',
                'type' => 'php-application'
            ],
            'ai_context' => [
                'purpose' => 'AI-unterstützte PHP-Anwendung',
                'key_concepts' => []
            ],
            'architecture' => [
                'components' => [],
                'dependencies' => []
            ],
            'features' => []
        ];
    }
    
    /**
     * Speichert die .ai.json
     */
    private function saveAiJson($aiJson) {
        $content = json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents('.ai.json', $content);
    }
}

// Starte den Scanner
$scanner = new PhpProjectScanner();
$scanner->scan();
`;
    fs.writeFileSync(path.join(phpScannerDir, 'PhpProjectScanner.php'), phpScannerContent);
}
/**
 * Führt den Standalone Composer Plugin aus
 *
 * @param workspaceFolder Workspace-Ordner
 */
async function runStandaloneComposerPlugin(workspaceFolder) {
    // Prüfe, ob der Standalone Composer Plugin existiert
    const standalonePluginPath = path.join(workspaceFolder.uri.fsPath, 'scripts', 'ecosystem', 'php-scanner', 'StandaloneComposerPlugin.php');
    if (!fs.existsSync(standalonePluginPath)) {
        const createPlugin = await vscode.window.showQuickPick(['Ja', 'Nein'], { placeHolder: 'Standalone Composer Plugin nicht gefunden. Möchten Sie ihn erstellen?' });
        if (createPlugin !== 'Ja')
            return;
        // Stelle sicher, dass der Ordner existiert
        const phpScannerDir = path.dirname(standalonePluginPath);
        if (!fs.existsSync(phpScannerDir)) {
            fs.mkdirSync(phpScannerDir, { recursive: true });
        }
        // Kopiere die Plugin-Dateien aus der Extension oder erstelle sie
        const extensionPath = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.extensionPath;
        if (extensionPath) {
            const sourcePath = path.join(extensionPath, 'resources', 'ecosystem', 'php-scanner');
            if (fs.existsSync(path.join(sourcePath, 'StandaloneComposerPlugin.php'))) {
                fs.copyFileSync(path.join(sourcePath, 'StandaloneComposerPlugin.php'), standalonePluginPath);
            }
            else {
                // Erstelle die Plugin-Datei
                createStandaloneComposerPluginFiles(phpScannerDir);
            }
        }
        else {
            // Erstelle die Plugin-Datei
            createStandaloneComposerPluginFiles(phpScannerDir);
        }
    }
    // Führe den Standalone Composer Plugin aus
    const terminal = vscode.window.createTerminal('AI MindLayer - Composer Plugin (Standalone)');
    terminal.show();
    // Zu Workspace-Ordner navigieren
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    // Check if PHP is installed
    try {
        await execAsync('php -v');
        // PHP is installed, run the plugin
        terminal.sendText('php scripts/ecosystem/php-scanner/StandaloneComposerPlugin.php');
        vscode.window.showInformationMessage('🔄 Standalone Composer Plugin wird ausgeführt...');
    }
    catch (error) {
        // PHP is not installed
        vscode.window.showErrorMessage('PHP ist nicht installiert. Bitte installieren Sie PHP, um den Plugin ausführen zu können.');
    }
}
/**
 * Erstellt Standalone Composer Plugin Files
 *
 * @param phpScannerDir PHP Scanner Verzeichnis
 */
function createStandaloneComposerPluginFiles(phpScannerDir) {
    // Die StandaloneComposerPlugin.php erstellen - leerer Stub, der später gefüllt wird
    const standaloneComposerPluginContent = `<?php
/**
 * coreX AI MindLayer - Standalone Composer Plugin
 * 
 * Diese Datei bietet eine Standalone-Alternative zum Composer-Plugin
 * für Projekte, die composer.json haben aber kein Composer selbst
 */

echo "🔍 coreX AI MindLayer - Standalone Composer Plugin\\n";
echo "ℹ️ Scanne composer.json und aktualisiere .ai.json...\\n";

// Prüfen, ob eine composer.json existiert
if (!file_exists('composer.json')) {
    echo "❌ Keine composer.json gefunden. Abbruch.\\n";
    exit(1);
}

// Aktualisiere oder erstelle .ai.json
try {
    // composer.json laden
    $composerJson = json_decode(file_get_contents('composer.json'), true);
    
    // .ai.json laden oder neu erstellen
    $aiJson = file_exists('.ai.json') 
        ? json_decode(file_get_contents('.ai.json'), true) 
        : [
            'project' => [
                'name' => $composerJson['name'] ?? basename(getcwd()),
                'description' => $composerJson['description'] ?? 'PHP-Projekt',
                'version' => $composerJson['version'] ?? '0.1.0'
            ],
            'architecture' => [
                'dependencies' => []
            ]
        ];
    
    // Dependencies hinzufügen
    if (isset($composerJson['require'])) {
        foreach ($composerJson['require'] as $name => $version) {
            if ($name !== 'php') {
                $aiJson['architecture']['dependencies'][] = [
                    'name' => $name,
                    'version' => $version,
                    'type' => 'composer'
                ];
            }
        }
    }
    
    // .ai.json speichern
    file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT));
    
    echo "✅ .ai.json wurde aktualisiert!\\n";
} catch (Exception $e) {
    echo "❌ Fehler: " . $e->getMessage() . "\\n";
}
`;
    fs.writeFileSync(path.join(phpScannerDir, 'StandaloneComposerPlugin.php'), standaloneComposerPluginContent);
}
//# sourceMappingURL=ecosystem.js.map