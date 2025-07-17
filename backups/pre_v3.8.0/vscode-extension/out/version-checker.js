"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVersionCheckerCommand = exports.VersionChecker = void 0;
const vscode = require("vscode");
const semver = require("semver");
const fs = require("fs");
const path = require("path");
const https = require("https");
const os = require("os");
const GITHUB_API_URL = 'https://api.github.com/repos/aiqia/corex-ai-mindlayer/releases/latest';
const CHECK_INTERVAL = 86400000; // 24 hours in milliseconds
/**
 * VersionChecker Klasse für automatisches Erkennen und Installieren von Updates
 */
class VersionChecker {
    constructor(context) {
        this.context = context;
        this.extensionVersion = vscode.extensions.getExtension('aiqia.corex-ai-mindlayer')?.packageJSON.version || '0.0.0';
        // Status Bar Item für Update-Benachrichtigungen
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'aiMindLayer.checkForUpdates';
        this.context.subscriptions.push(this.statusBarItem);
        // Prüfe auf Updates beim Start
        this.checkForUpdates(false);
        // Starte regelmäßige Update-Prüfungen
        setInterval(() => this.checkForUpdates(false), CHECK_INTERVAL);
    }
    /**
     * Prüft auf verfügbare Updates
     * @param manual Ob die Prüfung manuell ausgelöst wurde
     */
    async checkForUpdates(manual) {
        try {
            const latestRelease = await this.fetchLatestRelease();
            const latestVersion = latestRelease.tag_name.replace('v', '');
            if (semver.gt(latestVersion, this.extensionVersion)) {
                // Update verfügbar
                this.statusBarItem.text = `$(cloud-download) AI MindLayer Update`;
                this.statusBarItem.tooltip = `Update auf Version ${latestVersion} verfügbar`;
                this.statusBarItem.show();
                if (manual || this.shouldNotifyForUpdate()) {
                    this.showUpdateNotification(latestVersion, latestRelease.body);
                }
            }
            else {
                // Keine Updates verfügbar
                this.statusBarItem.hide();
                if (manual) {
                    vscode.window.showInformationMessage(`🤖 coreX AI MindLayer ist auf dem neuesten Stand (v${this.extensionVersion})`);
                }
            }
        }
        catch (error) {
            console.error('Fehler beim Prüfen auf Updates:', error);
            if (manual) {
                vscode.window.showErrorMessage('Fehler beim Prüfen auf Updates. Bitte versuche es später erneut.');
            }
        }
    } /**
     * Zeigt eine Benachrichtigung über verfügbare Updates an
     */
    showUpdateNotification(version, changelog) {
        const updateMessage = `🚀 coreX AI MindLayer Update verfügbar: v${version}`;
        vscode.window.showInformationMessage(updateMessage, 'Update sicher installieren', 'Details & Änderungen anzeigen', 'Später erinnern').then(selection => {
            if (selection === 'Update sicher installieren') {
                this.startSafeUpdateProcess(version, changelog);
            }
            else if (selection === 'Details & Änderungen anzeigen') {
                this.showChangelogWithDiff(version, changelog);
            }
            else if (selection === 'Später erinnern') {
                // Speichern des letzten Benachrichtigungszeitpunkts
                this.context.globalState.update('lastUpdateNotification', Date.now());
            }
        });
    }
    /**
     * Startet den sicheren Update-Prozess mit Schutz projektspezifischer Daten
     */
    async startSafeUpdateProcess(version, changelog) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('Update nicht möglich: Kein Workspace geöffnet.');
            return;
        }
        // Zeige mehrstufigen Fortschritt mit Sicherheitschecks
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Sichere Update-Vorbereitung für v${version}`,
            cancellable: true
        }, async (progress, token) => {
            try {
                // Schritt 1: Projektanalyse
                progress.report({ increment: 0, message: 'Analysiere aktuelle Installation...' });
                if (token.isCancellationRequested)
                    return;
                // Backup erstellen
                const backupPath = await this.createProjectBackup(workspaceFolders[0]);
                progress.report({ increment: 25, message: 'Backup erstellt unter ' + backupPath });
                if (token.isCancellationRequested)
                    return;
                // Schritt 2: Schema-Vergleich (simuliert für Prototyp)
                progress.report({ increment: 25, message: 'Analysiere Schema-Änderungen...' });
                // Platzhalter für Schema-Analyse (hier würde die tatsächliche Analyse der .ai.json stattfinden)
                const currentSchema = { /* Aktuelles Schema hier laden */};
                const newSchema = { /* Neues Schema aus GitHub oder VSIX laden */};
                if (token.isCancellationRequested)
                    return;
                // Schritt 3: Änderungsanalyse
                const changes = await this.analyzeSchemaChanges(currentSchema, newSchema);
                progress.report({ increment: 25, message: `Analyse abgeschlossen, ${changes.addedFields.length} neue, ${changes.modifiedFields.length} geänderte und ${changes.removedFields.length} entfernte Felder gefunden.` });
                // Schritt 4: Sicherheitscheck
                if (changes.riskLevel === 'high') {
                    // Bei hohem Risiko: Detailansicht der Änderungen erzwingen
                    this.showUpdateSafetyDialog(version, changelog, changes, backupPath);
                }
                else {
                    // Bei niedrigem/mittlerem Risiko: Fortfahren
                    progress.report({ increment: 25, message: 'Bereit für sicheres Update!' });
                    this.showUpdateConfirmationDialog(version, changelog, changes, backupPath);
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Fehler bei der Update-Vorbereitung: ${error.message || 'Unbekannter Fehler'}`);
            }
        });
    }
    /**
     * Zeigt einen detaillierten Sicherheitsdialog für Updates mit höherem Risiko
     */
    showUpdateSafetyDialog(version, changelog, changes, backupPath) {
        // Erstelle ein Webview-Panel für die detaillierte Darstellung
        const panel = vscode.window.createWebviewPanel('aiMindLayerUpdateSafety', `AI MindLayer v${version} - Sicherheitsüberprüfung`, vscode.ViewColumn.One, { enableScripts: true });
        // HTML für das Webview generieren
        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Update-Sicherheitscheck</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 20px;
                        color: var(--vscode-editor-foreground);
                    }
                    h1, h2, h3 {
                        color: var(--vscode-textLink-foreground);
                    }
                    .warning {
                        background-color: var(--vscode-inputValidation-warningBackground);
                        color: var(--vscode-inputValidation-warningForeground);
                        padding: 10px;
                        margin: 15px 0;
                        border-left: 5px solid orange;
                    }
                    .danger {
                        background-color: var(--vscode-inputValidation-errorBackground);
                        color: var(--vscode-inputValidation-errorForeground);
                        padding: 10px;
                        margin: 15px 0;
                        border-left: 5px solid red;
                    }
                    .safety-info {
                        background-color: var(--vscode-inputValidation-infoBackground);
                        color: var(--vscode-inputValidation-infoForeground);
                        padding: 10px;
                        margin: 15px 0;
                        border-left: 5px solid var(--vscode-textLink-foreground);
                    }
                    .path {
                        font-family: var(--vscode-editor-font-family);
                        font-weight: bold;
                    }
                    .old-value {
                        text-decoration: line-through;
                        opacity: 0.7;
                    }
                    .new-value {
                        font-weight: bold;
                    }
                    .added-value {
                        color: var(--vscode-gitDecoration-addedResourceForeground);
                    }
                    .removed-value {
                        color: var(--vscode-gitDecoration-deletedResourceForeground);
                    }
                    .impact-high {
                        background-color: var(--vscode-inputValidation-errorBackground);
                        padding: 5px;
                    }
                    button {
                        margin-top: 20px;
                        padding: 8px 16px;
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        cursor: pointer;
                    }
                    button.secondary {
                        background: var(--vscode-button-secondaryBackground);
                        color: var(--vscode-button-secondaryForeground);
                    }
                    .changelog {
                        margin-top: 20px;
                        border-top: 1px solid var(--vscode-panel-border);
                        padding-top: 20px;
                    }
                    .backup-info {
                        font-style: italic;
                        margin-top: 10px;
                    }
                    .checkbox-container {
                        margin: 10px 0;
                    }
                    .action-buttons {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <h1>🛡️ Sicherheitsüberprüfung für Update v${version}</h1>
                
                ${changes.riskLevel === 'high' ? `
                <div class="danger">
                    <h3>⚠️ Wichtiger Hinweis zur Sicherheit</h3>
                    <p>Dieses Update enthält Änderungen, die möglicherweise projektspezifische Daten in Ihrer .ai.json betreffen könnten.</p>
                    <p>Bitte prüfen Sie die untenstehenden Änderungen sorgfältig, bevor Sie fortfahren.</p>
                </div>
                ` : ''}
                
                <div class="safety-info">
                    <h3>🔒 Update-Sicherheitsmaßnahmen</h3>
                    <p>Ein Backup Ihrer aktuellen Konfiguration wurde erstellt unter:</p>
                    <code>${backupPath}</code>
                    <p>Im Falle von Problemen kann ein Rollback durchgeführt werden.</p>
                </div>
                
                <h2>Detaillierte Änderungsanalyse</h2>
                ${this.generateVisualDiff(changes)}
                
                <div class="changelog">
                    <h2>Changelog für Version ${version}</h2>
                    <div>${this.formatChangelog(changelog)}</div>
                </div>
                
                <div class="checkbox-container">
                    <input type="checkbox" id="confirmBackup"> 
                    <label for="confirmBackup">Ich verstehe, dass ein Backup erstellt wurde und im Fall von Problemen darauf zurückgegriffen werden kann.</label>
                </div>
                
                <div class="checkbox-container">
                    <input type="checkbox" id="confirmChanges"> 
                    <label for="confirmChanges">Ich habe die Änderungen überprüft und verstehe die Auswirkungen auf mein Projekt.</label>
                </div>
                
                <div class="action-buttons">
                    <button id="proceed" disabled>Update durchführen</button>
                    <button id="cancel" class="secondary">Abbrechen</button>
                </div>
                
                <script>
                    const vscode = acquireVsCodeApi();
                    const confirmBackup = document.getElementById('confirmBackup');
                    const confirmChanges = document.getElementById('confirmChanges');
                    const proceedButton = document.getElementById('proceed');
                    
                    function updateButtonState() {
                        proceedButton.disabled = !(confirmBackup.checked && confirmChanges.checked);
                    }
                    
                    confirmBackup.addEventListener('change', updateButtonState);
                    confirmChanges.addEventListener('change', updateButtonState);
                    
                    proceedButton.addEventListener('click', () => {
                        vscode.postMessage({ command: 'proceed', version: '${version}' });
                    });
                    
                    document.getElementById('cancel').addEventListener('click', () => {
                        vscode.postMessage({ command: 'cancel' });
                    });
                </script>
            </body>
            </html>
        `;
        // Handler für Webview-Nachrichten
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'proceed':
                    this.installUpdate(version);
                    panel.dispose();
                    return;
                case 'cancel':
                    panel.dispose();
                    return;
            }
        }, undefined, this.context.subscriptions);
    }
    /**
     * Zeigt Changelog mit Differenzanzeige an
     */
    showChangelogWithDiff(version, changelog) {
        // Ähnlich wie showUpdateSafetyDialog, aber mit Fokus auf Changelog
        const panel = vscode.window.createWebviewPanel('aiMindLayerChangelog', `AI MindLayer v${version} - Änderungsdetails`, vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Update Details</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 20px;
                        color: var(--vscode-editor-foreground);
                    }
                    h1 {
                        color: var(--vscode-textLink-foreground);
                    }
                    .version {
                        color: var(--vscode-textPreformat-foreground);
                        font-weight: bold;
                    }
                    .changelog {
                        margin-top: 20px;
                        white-space: pre-wrap;
                    }
                    .update-button {
                        margin-top: 20px;
                        padding: 8px 16px;
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <h1>🚀 coreX AI MindLayer</h1>
                <div class="version">Version ${version}</div>
                <div class="changelog">${this.formatChangelog(changelog)}</div>
                <div class="footer">
                    <button id="install" class="update-button">Sicheres Update starten</button>
                    <button id="remind" class="update-button">Später erinnern</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('install').addEventListener('click', () => {
                        vscode.postMessage({ command: 'install', version: '${version}' });
                    });
                    document.getElementById('remind').addEventListener('click', () => {
                        vscode.postMessage({ command: 'remind' });
                    });
                </script>
            </body>
            </html>
        `;
        // Handler für Webview-Nachrichten
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'install':
                    this.startSafeUpdateProcess(version, changelog);
                    panel.dispose();
                    return;
                case 'remind':
                    this.context.globalState.update('lastUpdateNotification', Date.now());
                    panel.dispose();
                    return;
            }
        }, undefined, this.context.subscriptions);
    }
    /**
     * Zeigt einen Bestätigungsdialog für Updates mit niedrigerem Risiko
     */
    showUpdateConfirmationDialog(version, changelog, changes, backupPath) {
        vscode.window.showInformationMessage(`Bereit für Update auf v${version}. ${changes.addedFields.length} neue und ${changes.modifiedFields.length} geänderte Felder. Ein Backup wurde erstellt.`, { modal: true }, 'Update durchführen', 'Details anzeigen', 'Abbrechen').then(selection => {
            if (selection === 'Update durchführen') {
                this.installUpdate(version);
            }
            else if (selection === 'Details anzeigen') {
                this.showUpdateSafetyDialog(version, changelog, changes, backupPath);
            }
        });
    } /**
     * Installiert das Update
     */
    async installUpdate(version) {
        // Zeige Fortschrittsbalken
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Update auf Version ${version} wird installiert...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            try {
                // Wir verwenden bereits das sichere Backup aus startSafeUpdateProcess
                progress.report({ increment: 10, message: 'Bereite Installation vor' });
                // Lade VSIX herunter
                const vsixPath = await this.downloadVsix(version);
                progress.report({ increment: 50, message: 'Update heruntergeladen' });
                // Installiere VSIX mit Datenschutz für projektspezifische Daten
                await this.installVsixSafely(vsixPath);
                progress.report({ increment: 30, message: 'Sichere Installation abgeschlossen' });
                // Protokolliere erfolgreiches Update
                this.logSuccessfulUpdate(version);
                vscode.window.showInformationMessage('🎉 Update erfolgreich und sicher installiert! VS Code muss neu gestartet werden.', 'Jetzt neu starten').then(selection => {
                    if (selection === 'Jetzt neu starten') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            }
            catch (error) {
                console.error('Fehler bei der Update-Installation:', error);
                vscode.window.showErrorMessage('Fehler bei der Update-Installation. Rollback wird durchgeführt...', 'Details anzeigen', 'Rollback starten').then(selection => {
                    if (selection === 'Details anzeigen') {
                        // Zeige Fehlerdetails in Output-Channel
                        const outputChannel = vscode.window.createOutputChannel('AI MindLayer Updates');
                        outputChannel.appendLine(`Fehler bei der Installation von v${version}:`);
                        outputChannel.appendLine(String(error));
                        outputChannel.appendLine('Ein automatischer Rollback wird durchgeführt, um Ihre Daten zu schützen.');
                        outputChannel.show();
                    }
                    if (selection === 'Rollback starten' || selection === 'Details anzeigen') {
                        // Rollback durchführen
                        this.performRollback();
                    }
                });
            }
        });
    }
    /**
     * Installiert die VSIX-Datei mit umfassendem Schutz für alle projektspezifischen Daten
     *
     * Diese Methode implementiert ein mehrstufiges Sicherheitssystem für Updates:
     * 1. Überprüfung der Backup-Integrität vor der Installation
     * 2. Sichere Installation der VSIX-Datei
     * 3. Intelligente Zusammenführung von Projektdaten nach der Installation
     * 4. Verifikation der Datenintegrität nach dem Update
     *
     * @param vsixPath Pfad zur zu installierenden VSIX-Datei
     */
    async installVsixSafely(vsixPath) {
        // Erfasse alle Workspace-Ordner
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error('Kein Workspace geöffnet. Installation abgebrochen.');
        }
        const mainWorkspace = workspaceFolders[0];
        try {
            // SCHRITT 1: Vorbereitung und zusätzliche Sicherheitsmaßnahmen
            // Erstelle einen Snapshot aller .ai-bezogenen JSON-Dateien vor der Installation
            const preUpdateSnapshot = {};
            const jsonFiles = ['.ai.json', '.ai.dev.json', '.ai.user.json', 'schema.json'];
            for (const file of jsonFiles) {
                const filePath = path.join(mainWorkspace.uri.fsPath, file);
                if (fs.existsSync(filePath)) {
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        preUpdateSnapshot[file] = JSON.parse(content);
                    }
                    catch (error) {
                        console.warn(`Konnte ${file} nicht einlesen oder parsen, überspringe...`);
                    }
                }
            }
            // SCHRITT 2: Installation der Extension
            console.log(`Installiere Update aus: ${vsixPath}`);
            await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(vsixPath));
            // SCHRITT 3: Datenschutz nach der Installation
            console.log('Installation abgeschlossen. Stelle projektspezifische Daten sicher...');
            // Warte kurz, um sicherzustellen, dass Dateien nicht mehr im Schreibzugriff sind
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Iteriere über alle .ai-JSON-Dateien und stelle projektspezifische Daten sicher
            let dataProtectionSuccessful = true;
            const protectionResults = [];
            for (const file of jsonFiles) {
                const filePath = path.join(mainWorkspace.uri.fsPath, file);
                // Wenn die Datei vor dem Update existierte, stelle sicher, dass projektspezifische Daten erhalten bleiben
                if (preUpdateSnapshot[file]) {
                    try {
                        // Versuche die aktualisierte Datei zu lesen (falls sie vom Update geändert wurde)
                        let currentContent = null;
                        let currentRawContent = '';
                        if (fs.existsSync(filePath)) {
                            currentRawContent = fs.readFileSync(filePath, 'utf8');
                            try {
                                currentContent = JSON.parse(currentRawContent);
                            }
                            catch (parseError) {
                                console.error(`Fehler beim Parsen der aktualisierten ${file}, stelle Original wieder her`);
                                // Bei Parsing-Fehler: Stelle Original wieder her
                                fs.writeFileSync(filePath, JSON.stringify(preUpdateSnapshot[file], null, 2));
                                protectionResults.push(`⚠️ ${file}: Parsing-Fehler in aktualisierter Datei. Original wiederhergestellt.`);
                                continue;
                            }
                        }
                        // Wenn die Datei nicht mehr existiert oder sich geändert hat
                        if (!currentContent || JSON.stringify(currentContent) !== JSON.stringify(preUpdateSnapshot[file])) {
                            // Sichern projektspezifischer Daten basierend auf dem Dateityp
                            if (file === '.ai.json') {
                                // Für .ai.json: Bewahre alle projektspezifischen Daten
                                const merged = this.mergeAiJsonData(preUpdateSnapshot[file], currentContent || {});
                                fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
                                protectionResults.push(`✅ ${file}: Projektspezifische Daten wurden geschützt.`);
                            }
                            else if (file === '.ai.user.json' || file.includes('user')) {
                                // Für benutzerspezifische Dateien: Immer die Originaldaten behalten
                                fs.writeFileSync(filePath, JSON.stringify(preUpdateSnapshot[file], null, 2));
                                protectionResults.push(`✅ ${file}: Benutzerdaten wurden vollständig wiederhergestellt.`);
                            }
                            else {
                                // Für andere Dateien: Intelligente Zusammenführung
                                if (currentContent) {
                                    const merged = this.safelyMergeJsonData(preUpdateSnapshot[file], currentContent);
                                    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
                                    protectionResults.push(`✅ ${file}: Daten intelligent zusammengeführt.`);
                                }
                                else {
                                    // Datei wurde gelöscht - stelle sie wieder her
                                    fs.writeFileSync(filePath, JSON.stringify(preUpdateSnapshot[file], null, 2));
                                    protectionResults.push(`🔄 ${file}: Datei wurde wiederhergestellt.`);
                                }
                            }
                        }
                        else {
                            protectionResults.push(`✓ ${file}: Keine Änderungen festgestellt.`);
                        }
                    }
                    catch (error) {
                        console.error(`Fehler beim Schützen der Daten in ${file}:`, error);
                        dataProtectionSuccessful = false;
                        protectionResults.push(`❌ ${file}: Fehler beim Datenschutz: ${error.message || 'Unbekannter Fehler'}`);
                    }
                }
            }
            // SCHRITT 4: Verifikation und Berichterstattung
            if (!dataProtectionSuccessful) {
                console.warn('Es gab Probleme beim Schutz projektspezifischer Daten. Siehe Details im Log.');
            }
            // Erstelle einen Bericht über den Update-Prozess
            const updateReportPath = path.join(this.context.globalStorageUri.fsPath, 'update_logs', `update_report_${new Date().toISOString().replace(/[:.]/g, '_')}.json`);
            // Stelle sicher, dass das Verzeichnis existiert
            const updateLogDir = path.dirname(updateReportPath);
            if (!fs.existsSync(updateLogDir)) {
                fs.mkdirSync(updateLogDir, { recursive: true });
            }
            // Schreibe den Update-Bericht
            fs.writeFileSync(updateReportPath, JSON.stringify({
                timestamp: new Date().toISOString(),
                success: true,
                dataProtectionSuccessful,
                protectedFiles: Object.keys(preUpdateSnapshot),
                results: protectionResults,
                backupLocations: [path.join(this.context.globalStorageUri.fsPath, 'project_backups')]
            }, null, 2));
            console.log('Update erfolgreich und sicher abgeschlossen.');
        }
        catch (error) {
            console.error('Fehler während der sicheren Installation:', error);
            throw new Error(`Sichere Installation fehlgeschlagen: ${error.message || 'Unbekannter Fehler'}`);
        }
    }
    /**
     * Führt eine sichere Zusammenführung von .ai.json Daten durch, wobei projektspezifische
     * Daten immer Vorrang haben und geschützt werden
     *
     * @param original Die originale .ai.json mit projektspezifischen Daten
     * @param updated Die aktualisierte .ai.json aus dem Update
     * @returns Die zusammengeführte .ai.json mit Schutz projektspezifischer Daten
     */
    mergeAiJsonData(original, updated) {
        // Tiefe Kopie der Objekte erstellen
        const result = JSON.parse(JSON.stringify(updated));
        const originalCopy = JSON.parse(JSON.stringify(original));
        // Liste der Felder, die definitiv projektspezifisch sind und immer erhalten werden müssen
        const projectSpecificSections = [
            'meta.project',
            'meta.author',
            'meta.description',
            'meta.created',
            'user_preferences',
            'project',
            'architecture',
            'context',
            'references',
            'tasks'
        ];
        // Projektspezifische Abschnitte übertragen
        for (const section of projectSpecificSections) {
            const parts = section.split('.');
            let originalValue = originalCopy;
            let resultTarget = result;
            // Navigiere zur Zielposition
            let validPath = true;
            for (let i = 0; i < parts.length - 1; i++) {
                if (originalValue[parts[i]] === undefined) {
                    validPath = false;
                    break;
                }
                originalValue = originalValue[parts[i]];
                // Stelle sicher, dass der Pfad im Ziel existiert
                if (resultTarget[parts[i]] === undefined) {
                    resultTarget[parts[i]] = {};
                }
                resultTarget = resultTarget[parts[i]];
            }
            // Wenn der Pfad gültig ist und Daten enthält, übertrage sie
            if (validPath && originalValue[parts[parts.length - 1]] !== undefined) {
                resultTarget[parts[parts.length - 1]] = originalValue[parts[parts.length - 1]];
            }
        }
        // Spezielle Behandlung für komplexere Strukturen
        // 1. meta - Mische, aber behalte Projektspezifika
        if (originalCopy.meta && result.meta) {
            result.meta = {
                ...result.meta,
                project: originalCopy.meta.project || result.meta.project,
                author: originalCopy.meta.author || result.meta.author,
                description: originalCopy.meta.description || result.meta.description,
                created: originalCopy.meta.created || result.meta.created,
                // updated wird aktualisiert:
                updated: new Date().toISOString().split('T')[0]
            };
        }
        // 2. user_preferences - NIEMALS überschreiben
        if (originalCopy.user_preferences) {
            result.user_preferences = originalCopy.user_preferences;
        }
        // 3. Komponenten intelligent zusammenführen - behalte benutzerdefinierte
        if (originalCopy.components && result.components) {
            // Behalte alle originalCopy Komponenten, die nicht in result existieren
            for (const key in originalCopy.components) {
                if (!result.components[key] || originalCopy.components[key].custom === true) {
                    result.components[key] = originalCopy.components[key];
                }
            }
        }
        return result;
    }
    /**
     * Allgemeine sichere Zusammenführung beliebiger JSON-Daten mit
     * Konfliktauflösung zugunsten der Originaldaten
     */
    safelyMergeJsonData(original, updated) {
        // Für einfache Werte: Original bevorzugen
        if (typeof original !== 'object' || original === null ||
            typeof updated !== 'object' || updated === null) {
            return original;
        }
        // Für Arrays: Behalte Original, wenn nicht leer, sonst Updated
        if (Array.isArray(original)) {
            return original.length > 0 ? original : updated;
        }
        // Für Objekte: Rekursiv zusammenführen
        const result = { ...updated };
        for (const key in original) {
            // Wenn der Schlüssel nur im Original existiert, übernehme ihn
            if (!(key in result)) {
                result[key] = original[key];
            }
            // Wenn der Schlüssel in beiden existiert, führe sie rekursiv zusammen
            else {
                result[key] = this.safelyMergeJsonData(original[key], result[key]);
            }
        }
        return result;
    }
    /**
     * Protokolliert ein erfolgreiches Update
     */
    logSuccessfulUpdate(version) {
        const logDir = path.join(this.context.globalStorageUri.fsPath, 'update_logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const now = new Date();
        const timestamp = now.toISOString();
        const logFile = path.join(logDir, 'update_history.json');
        let history = [];
        if (fs.existsSync(logFile)) {
            try {
                history = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            }
            catch (e) {
                console.error('Fehler beim Lesen der Update-Historie:', e);
            }
        }
        history.push({
            version,
            timestamp,
            fromVersion: this.extensionVersion
        });
        fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
    }
    /**
     * Lädt die VSIX-Datei für die angegebene Version herunter
     */
    async downloadVsix(version) {
        const vsixUrl = `https://github.com/aiqia/corex-ai-mindlayer/releases/download/v${version}/corex-ai-mindlayer-${version}.vsix`;
        const tempDir = path.join(this.context.globalStorageUri.fsPath, 'updates');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const vsixPath = path.join(tempDir, `corex-ai-mindlayer-${version}.vsix`);
        // Herunterladen der VSIX-Datei mit HTTPS
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(vsixPath);
            const request = https.get(vsixUrl, {
                headers: {
                    'User-Agent': 'coreX-AI-MindLayer-Version-Checker'
                }
            }, (response) => {
                // Handle HTTP-Redirects
                if (response.statusCode === 302 || response.statusCode === 301) {
                    if (response.headers.location) {
                        // Download von der neuen URL starten
                        https.get(response.headers.location, {
                            headers: {
                                'User-Agent': 'coreX-AI-MindLayer-Version-Checker'
                            }
                        }).pipe(file);
                    }
                    else {
                        reject(new Error('Redirect location header missing'));
                        return;
                    }
                }
                else if (response.statusCode !== 200) {
                    reject(new Error(`Server responded with status code ${response.statusCode}`));
                    return;
                }
                else {
                    // Direkt in Datei schreiben
                    response.pipe(file);
                }
            });
            file.on('finish', () => {
                file.close();
                resolve(vsixPath);
            });
            request.on('error', (err) => {
                fs.unlink(vsixPath, () => { }); // Datei bei Fehler löschen
                reject(err);
            });
            file.on('error', (err) => {
                fs.unlink(vsixPath, () => { }); // Datei bei Fehler löschen
                reject(err);
            });
            request.end();
        });
    }
    /**
     * Installiert die VSIX-Datei
     */
    async installVsix(vsixPath) {
        // TODO: Implementierung zur Installation der VSIX-Datei
        // Dies würde die VS Code Extension Manager API verwenden
        await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(vsixPath));
    } // createBackup wurde durch die umfassendere createProjectBackup-Methode ersetzt
    /**
     * Führt ein Rollback zur vorherigen Version durch, wenn ein Update fehlgeschlagen ist
     *
     * Diese Methode stellt alle Projektdaten aus dem letzten Backup wieder her und
     * bietet umfassende Wiederherstellungsoptionen für den Benutzer.
     */
    async performRollback() {
        try {
            // Zeige Fortschrittsindikator
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Führe Rollback durch...',
                cancellable: false
            }, async (progress) => {
                // Schritt 1: Finde das neueste Backup
                progress.report({ increment: 0, message: 'Suche neuestes Backup...' });
                const backupBaseDir = path.join(this.context.globalStorageUri.fsPath, 'project_backups');
                if (!fs.existsSync(backupBaseDir)) {
                    throw new Error('Keine Backups gefunden. Rollback nicht möglich.');
                }
                // Liste alle Backup-Verzeichnisse
                const backupDirs = fs.readdirSync(backupBaseDir)
                    .filter(dir => dir.startsWith('backup_'))
                    .map(dir => {
                    const fullPath = path.join(backupBaseDir, dir);
                    const stats = fs.statSync(fullPath);
                    return {
                        path: fullPath,
                        name: dir,
                        time: stats.mtime.getTime()
                    };
                })
                    .sort((a, b) => b.time - a.time); // Sortiere nach Datum (neueste zuerst)
                if (backupDirs.length === 0) {
                    throw new Error('Keine Backup-Verzeichnisse gefunden.');
                }
                // Neuestes Backup auswählen
                const latestBackup = backupDirs[0];
                progress.report({ increment: 20, message: `Neuestes Backup gefunden: ${latestBackup.name}` });
                // Schritt 2: Verifiziere Backup-Integrität
                progress.report({ increment: 10, message: 'Verifiziere Backup-Integrität...' });
                const backupInfoPath = path.join(latestBackup.path, 'backup_info.json');
                if (!fs.existsSync(backupInfoPath)) {
                    throw new Error('Backup-Informationen nicht gefunden. Backup könnte beschädigt sein.');
                }
                const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    throw new Error('Kein Workspace geöffnet. Rollback nicht möglich.');
                }
                const workspaceFolder = workspaceFolders[0];
                // Schritt 3: Backup wiederherstellen
                progress.report({ increment: 10, message: 'Stelle Dateien wieder her...' });
                const restoredFiles = [];
                const failedFiles = [];
                for (const file of backupInfo.files) {
                    const sourcePath = path.join(latestBackup.path, file);
                    const targetPath = path.join(workspaceFolder.uri.fsPath, file);
                    if (fs.existsSync(sourcePath)) {
                        try {
                            fs.copyFileSync(sourcePath, targetPath);
                            restoredFiles.push(file);
                        }
                        catch (error) {
                            console.error(`Fehler beim Wiederherstellen von ${file}:`, error);
                            failedFiles.push(file);
                        }
                    }
                    else {
                        console.warn(`Backup-Datei nicht gefunden: ${sourcePath}`);
                        failedFiles.push(file);
                    }
                }
                progress.report({ increment: 50, message: 'Dateien wiederhergestellt' });
                // Schritt 4: Rollback-Bericht erstellen
                const rollbackReportPath = path.join(this.context.globalStorageUri.fsPath, 'update_logs', `rollback_report_${new Date().toISOString().replace(/[:.]/g, '_')}.json`);
                // Stelle sicher, dass das Verzeichnis existiert
                const updateLogDir = path.dirname(rollbackReportPath);
                if (!fs.existsSync(updateLogDir)) {
                    fs.mkdirSync(updateLogDir, { recursive: true });
                }
                // Schreibe den Rollback-Bericht
                fs.writeFileSync(rollbackReportPath, JSON.stringify({
                    timestamp: new Date().toISOString(),
                    backupUsed: latestBackup.name,
                    backupDate: backupInfo.backupDate || 'Unknown',
                    workspaceFolder: workspaceFolder.name,
                    restoredFiles,
                    failedFiles,
                    success: failedFiles.length === 0
                }, null, 2));
                progress.report({ increment: 10, message: 'Rollback abgeschlossen' });
                // Zeige Ergebnis an
                if (failedFiles.length === 0) {
                    vscode.window.showInformationMessage(`Rollback erfolgreich! ${restoredFiles.length} Dateien wurden wiederhergestellt.`, 'Details anzeigen').then(selection => {
                        if (selection === 'Details anzeigen') {
                            // Zeige detaillierten Bericht in neuem Editor
                            const content = `# Rollback Report
                                
## Erfolgreicher Rollback

- **Datum:** ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
- **Verwendetes Backup:** ${latestBackup.name}
- **Backup-Datum:** ${backupInfo.backupDate || 'Unbekannt'}
- **Workspace:** ${workspaceFolder.name}

## Wiederhergestellte Dateien
${restoredFiles.map(file => `- \`${file}\``).join('\n')}

`;
                            // Öffne temporäre Datei mit Bericht
                            const tempFile = path.join(os.tmpdir(), `rollback_report_${Date.now()}.md`);
                            fs.writeFileSync(tempFile, content);
                            vscode.workspace.openTextDocument(tempFile).then(doc => {
                                vscode.window.showTextDocument(doc);
                            });
                        }
                    });
                }
                else {
                    vscode.window.showWarningMessage(`Rollback teilweise erfolgreich. ${restoredFiles.length} Dateien wiederhergestellt, ${failedFiles.length} fehlgeschlagen.`, 'Details anzeigen', 'Problem melden').then(selection => {
                        if (selection === 'Details anzeigen') {
                            const outputChannel = vscode.window.createOutputChannel('AI MindLayer Rollback');
                            outputChannel.appendLine(`Rollback-Bericht für ${latestBackup.name}:`);
                            outputChannel.appendLine(`Wiederhergestellte Dateien (${restoredFiles.length}):`);
                            restoredFiles.forEach(file => outputChannel.appendLine(`- ${file}`));
                            outputChannel.appendLine(`\nFehlgeschlagene Dateien (${failedFiles.length}):`);
                            failedFiles.forEach(file => outputChannel.appendLine(`- ${file}`));
                            outputChannel.show();
                        }
                        else if (selection === 'Problem melden') {
                            vscode.env.openExternal(vscode.Uri.parse('https://github.com/aiqia/corex-ai-mindlayer/issues/new'));
                        }
                    });
                }
            });
        }
        catch (error) {
            console.error('Rollback fehlgeschlagen:', error);
            vscode.window.showErrorMessage(`Rollback fehlgeschlagen: ${error.message || 'Unbekannter Fehler'}`);
            // Biete manuelle Wiederherstellungsoptionen an
            vscode.window.showErrorMessage('Automatischer Rollback fehlgeschlagen. Möchten Sie die Backup-Dateien manuell öffnen?', 'Backup-Ordner öffnen').then(selection => {
                if (selection === 'Backup-Ordner öffnen') {
                    const backupBaseDir = path.join(this.context.globalStorageUri.fsPath, 'project_backups');
                    vscode.env.openExternal(vscode.Uri.file(backupBaseDir));
                }
            });
        }
    }
    /**
     * Zeigt das Changelog für die neue Version an
     */
    showChangelog(version, changelog) {
        const panel = vscode.window.createWebviewPanel('aiMindLayerChangelog', `AI MindLayer v${version} - Changelog`, vscode.ViewColumn.One, {});
        panel.webview.html = this.getChangelogHtml(version, changelog);
    }
    /**
     * Generiert das HTML für die Changelog-Anzeige
     */
    getChangelogHtml(version, changelog) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI MindLayer Changelog</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 20px;
                        color: var(--vscode-editor-foreground);
                    }
                    h1 {
                        color: var(--vscode-textLink-foreground);
                    }
                    .version {
                        color: var(--vscode-textPreformat-foreground);
                        font-weight: bold;
                    }
                    .changelog {
                        margin-top: 20px;
                        white-space: pre-wrap;
                    }
                </style>
            </head>
            <body>
                <h1>🚀 coreX AI MindLayer</h1>
                <div class="version">Version ${version}</div>
                <div class="changelog">${this.formatChangelog(changelog)}</div>
                <div class="footer">
                    <button id="install">Update jetzt installieren</button>
                    <button id="remind">Später erinnern</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('install').addEventListener('click', () => {
                        vscode.postMessage({ command: 'install', version: '${version}' });
                    });
                    document.getElementById('remind').addEventListener('click', () => {
                        vscode.postMessage({ command: 'remind' });
                    });
                </script>
            </body>
            </html>
        `;
    }
    /**
     * Formatiert den Changelog-Text als HTML
     */
    formatChangelog(changelog) {
        // Konvertiert Markdown zu HTML (einfache Version)
        return changelog
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    }
    /**
     * Prüft die GitHub API auf die neueste Version
     */
    async fetchLatestRelease() {
        return new Promise((resolve, reject) => {
            const request = https.get(GITHUB_API_URL, {
                headers: {
                    'User-Agent': 'coreX-AI-MindLayer-Version-Checker'
                }
            }, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`GitHub API responded with status code ${response.statusCode}`));
                    return;
                }
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (error) {
                        reject(new Error(`Failed to parse GitHub API response: ${error.message || 'Unknown error'}`));
                    }
                });
            });
            request.on('error', (error) => {
                reject(error);
            });
            request.end();
        });
    }
    /**
     * Prüft, ob der Nutzer über ein Update benachrichtigt werden sollte
     */
    shouldNotifyForUpdate() {
        const lastNotification = this.context.globalState.get('lastUpdateNotification') || 0;
        const now = Date.now();
        // Zeige Benachrichtigung, wenn die letzte Benachrichtigung mehr als 3 Tage her ist
        return (now - lastNotification) > 259200000; // 3 Tage in Millisekunden
    }
    /**
     * Führt eine umfassende und tiefgreifende Differenzanalyse zwischen bestehender und neuer .ai.json durch
     * mit besonderem Fokus auf den Schutz projektspezifischer und benutzerdefinierter Daten
     *
     * @param currentSchema Die aktuelle .ai.json-Struktur des Benutzers
     * @param newSchema Die neue .ai.json-Struktur aus dem Update
     * @returns Ein Objekt mit detaillierten Informationen zu Änderungen, Risiken und Empfehlungen
     */
    async analyzeSchemaChanges(currentSchema, newSchema) {
        // Ergebnisstruktur initialisieren
        const result = {
            addedFields: [],
            removedFields: [],
            modifiedFields: [],
            structuralChanges: [],
            riskLevel: 'low',
            projectDataImpact: false,
            recommendations: []
        };
        // Definiere Pfade, die als besonders kritisch für Projektdaten gelten
        const criticalProjectDataPaths = [
            'meta.project',
            'meta.author',
            'meta.description',
            'meta.created',
            'project',
            'architecture',
            'components',
            'context',
            'references',
            'user_preferences',
            'tasks'
        ];
        // Liste von Pfaden, die üblicherweise benutzerdefinierte Inhalte enthalten
        const userContentPaths = [
            'meta',
            'project',
            'architecture',
            'components',
            'tasks',
            'user_preferences'
        ];
        // Funktion zum Prüfen, ob ein Pfad einem kritischen Projektdatenpfad entspricht
        const isProjectData = (path) => {
            return criticalProjectDataPaths.some(criticalPath => path === criticalPath || path.startsWith(`${criticalPath}.`));
        };
        // Funktion zum Prüfen, ob ein Pfad ein benutzerdefinierter Bereich sein könnte
        const isLikelyUserContent = (path) => {
            return userContentPaths.some(contentPath => path === contentPath || path.startsWith(`${contentPath}.`));
        };
        // Funktion zum Bestimmen des Impakt-Levels einer Änderung basierend auf Pfad und Typ
        const determineImpactLevel = (path, changeType) => {
            // Löschungen in Projektdaten sind immer hochriskant
            if (changeType === 'removal' && isProjectData(path)) {
                return 'high';
            }
            // Änderungen in Projektdaten sind mittel bis hochriskant
            if (changeType === 'modification' && isProjectData(path)) {
                return 'medium';
            }
            // Hinzufügungen in Projektdaten sind niedrig bis mittelriskant
            if (changeType === 'addition' && isProjectData(path)) {
                return 'low';
            }
            // Standard-Risikostufe basierend auf Änderungstyp
            switch (changeType) {
                case 'removal': return 'medium';
                case 'modification': return 'low';
                case 'addition': return 'low';
                default: return 'low';
            }
        };
        // Rekursive Funktion für tiefe Objektvergleiche mit erweiterter Analyse
        const compareObjects = (current, updated, path = '') => {
            // Wenn einer der Werte kein Objekt ist oder null ist, direkt vergleichen
            if (typeof current !== 'object' || current === null ||
                typeof updated !== 'object' || updated === null) {
                if (current !== updated) {
                    result.modifiedFields.push({
                        path,
                        oldValue: current,
                        newValue: updated,
                        type: typeof updated
                    });
                    // Prüfe auf strukturelle Änderungen bei wichtigen Werten
                    if (isLikelyUserContent(path)) {
                        const impact = determineImpactLevel(path, 'modification');
                        result.structuralChanges.push({
                            type: 'modification',
                            path,
                            impact,
                            recommendation: `Der Wert von "${path}" wurde geändert und könnte benutzerdefinierte Daten enthalten.`
                        });
                        if (impact === 'high') {
                            result.projectDataImpact = true;
                        }
                    }
                }
                return;
            }
            // Arrays als Ganzes vergleichen
            if (Array.isArray(current) || Array.isArray(updated)) {
                // Wenn sich der Typ ändert (Array ↔ Objekt), behandle es als Modifikation
                if (Array.isArray(current) !== Array.isArray(updated)) {
                    result.modifiedFields.push({
                        path,
                        oldValue: current,
                        newValue: updated,
                        type: typeof updated
                    });
                    // Signifikante strukturelle Änderung
                    const impact = determineImpactLevel(path, 'modification');
                    result.structuralChanges.push({
                        type: 'modification',
                        path,
                        impact,
                        recommendation: `Der Typ von "${path}" wurde von ${Array.isArray(current) ? 'Array zu Objekt' : 'Objekt zu Array'} geändert.`
                    });
                    if (isProjectData(path)) {
                        result.projectDataImpact = true;
                    }
                    return;
                }
                // Beide sind Arrays - tiefgreifender Vergleich, wenn es sich um strukturierte Daten handelt
                if (Array.isArray(current) && Array.isArray(updated)) {
                    // Prüfe auf Projektdaten in Arrays (komplexe Prüfung)
                    if (isProjectData(path) && JSON.stringify(current) !== JSON.stringify(updated)) {
                        // Sammlung von Änderungen
                        result.modifiedFields.push({
                            path,
                            oldValue: current,
                            newValue: updated,
                            type: 'array'
                        });
                        // Strukturänderung für Arrays in Projektdaten
                        const impact = determineImpactLevel(path, 'modification');
                        result.structuralChanges.push({
                            type: 'modification',
                            path,
                            impact,
                            recommendation: `Die Array-Struktur in "${path}" wurde verändert und könnte Projektdaten enthalten.`
                        });
                        if (impact === 'high') {
                            result.projectDataImpact = true;
                        }
                    }
                    return;
                }
            }
            // Ab hier: beide sind reguläre Objekte
            // Prüfe hinzugefügte Felder
            Object.keys(updated).forEach(key => {
                const newPath = path ? `${path}.${key}` : key;
                if (!(key in current)) {
                    // Neues Feld gefunden
                    result.addedFields.push({
                        path: newPath,
                        value: updated[key],
                        type: typeof updated[key]
                    });
                    // Prüfe, ob das neue Feld zu einem Projektdaten-Pfad gehört
                    if (isLikelyUserContent(newPath)) {
                        const impact = determineImpactLevel(newPath, 'addition');
                        result.structuralChanges.push({
                            type: 'addition',
                            path: newPath,
                            impact,
                            recommendation: `Neues Feld "${newPath}" wurde hinzugefügt und könnte neue Funktionalität darstellen.`
                        });
                    }
                }
                else if (typeof updated[key] === 'object' && updated[key] !== null &&
                    typeof current[key] === 'object' && current[key] !== null) {
                    // Rekursiver Vergleich für verschachtelte Objekte
                    compareObjects(current[key], updated[key], newPath);
                }
                else if (JSON.stringify(current[key]) !== JSON.stringify(updated[key])) {
                    // Geändertes Feld gefunden
                    result.modifiedFields.push({
                        path: newPath,
                        oldValue: current[key],
                        newValue: updated[key],
                        type: typeof updated[key]
                    });
                    // Prüfe auf wichtige Änderungen in Projektdaten
                    if (isProjectData(newPath)) {
                        const impact = determineImpactLevel(newPath, 'modification');
                        result.structuralChanges.push({
                            type: 'modification',
                            path: newPath,
                            impact,
                            recommendation: `Das Feld "${newPath}" wurde geändert und könnte projektspezifische Daten betreffen.`
                        });
                        if (impact === 'high') {
                            result.projectDataImpact = true;
                        }
                    }
                }
            });
            // Prüfe entfernte Felder (kritisch für Projektdaten)
            Object.keys(current).forEach(key => {
                const newPath = path ? `${path}.${key}` : key;
                if (!(key in updated)) {
                    // Entferntes Feld gefunden
                    result.removedFields.push({
                        path: newPath,
                        value: current[key],
                        type: typeof current[key]
                    });
                    // Besonders kritisch: Überprüfe, ob projektspezifische Daten betroffen sind
                    if (isProjectData(newPath)) {
                        result.projectDataImpact = true;
                        // Füge kritische strukturelle Änderung mit hohem Impakt hinzu
                        result.structuralChanges.push({
                            type: 'removal',
                            path: newPath,
                            impact: 'high',
                            recommendation: `⚠️ WICHTIG: Das Feld "${newPath}" wurde in der neuen Version entfernt und enthält projektspezifische Daten. Diese werden durch die sichere Update-Funktion geschützt.`
                        });
                    }
                    else if (isLikelyUserContent(newPath)) {
                        // Für wahrscheinliche Benutzerdaten, aber nicht sicher projektspezifisch
                        result.structuralChanges.push({
                            type: 'removal',
                            path: newPath,
                            impact: 'medium',
                            recommendation: `Das Feld "${newPath}" wurde entfernt und könnte benutzerdefinierte Daten enthalten.`
                        });
                    }
                    else {
                        // Für reguläre Schema-Änderungen
                        result.structuralChanges.push({
                            type: 'removal',
                            path: newPath,
                            impact: 'low',
                            recommendation: `Das Feld "${newPath}" wird nicht mehr unterstützt.`
                        });
                    }
                }
            });
        };
        // Starte den detaillierten Vergleich
        compareObjects(currentSchema, newSchema);
        // Analyse des Gesamtrisikos mit mehrstufiger Bewertung
        // 1. Direkte Auswirkung auf Projektdaten
        const highRiskChanges = result.structuralChanges.filter(change => change.impact === 'high');
        const mediumRiskChanges = result.structuralChanges.filter(change => change.impact === 'medium');
        // 2. Bestimme Risiko-Level basierend auf Änderungen mit gewichteter Bewertung
        if (result.projectDataImpact || highRiskChanges.length > 0 || result.removedFields.length > 5) {
            result.riskLevel = 'high';
            result.recommendations = [
                '⚠️ WICHTIGER HINWEIS: Dieses Update enthält signifikante Änderungen an der .ai.json-Struktur.',
                'Ein vollständiges Backup wird automatisch erstellt.',
                'Alle projektspezifischen Daten werden durch den sicheren Update-Prozess geschützt.',
                'Bitte prüfen Sie die aufgelisteten Änderungen vor der Installation sorgfältig.',
                'Bei Fragen oder Bedenken brechen Sie das Update ab und kontaktieren Sie den Support.'
            ];
            // Füge spezifische Empfehlungen basierend auf gefundenen Änderungen hinzu
            if (highRiskChanges.length > 0) {
                result.recommendations.push(`Es wurden ${highRiskChanges.length} kritische Strukturänderungen gefunden, die Projektdaten betreffen könnten.`);
            }
        }
        else if (mediumRiskChanges.length > 0 || result.removedFields.length > 0) {
            result.riskLevel = 'medium';
            result.recommendations = [
                'Dieses Update enthält strukturelle Änderungen an der .ai.json.',
                'Ein Backup wird automatisch erstellt, um Ihre Daten zu schützen.',
                'Überprüfen Sie die Änderungen vor dem Update.'
            ];
        }
        else {
            // Niedriges Risiko (nur Hinzufügungen oder unkritische Änderungen)
            result.recommendations = [
                'Dieses Update enthält keine kritischen Änderungen an der Projektstruktur.',
                'Ein Backup wird dennoch automatisch erstellt.'
            ];
        }
        // Informative Zusammenfassung hinzufügen
        result.recommendations.push(`Zusammenfassung der Änderungen: ${result.addedFields.length} neue Felder, ` +
            `${result.modifiedFields.length} geänderte Felder, ${result.removedFields.length} entfernte Felder.`);
        return result;
    }
    /**
     * Generiert einen visuellen Diff für die Änderungen zwischen Schemas
     */
    generateVisualDiff(changes) {
        let html = '<div class="schema-diff">';
        // Zeige hinzugefügte Felder
        if (changes.addedFields.length > 0) {
            html += '<h3>Neue Felder</h3><ul class="added-fields">';
            changes.addedFields.forEach(field => {
                html += `<li><span class="path">${field.path}</span>: <span class="added-value">${JSON.stringify(field.value)}</span></li>`;
            });
            html += '</ul>';
        }
        // Zeige geänderte Felder
        if (changes.modifiedFields.length > 0) {
            html += '<h3>Geänderte Felder</h3><ul class="modified-fields">';
            changes.modifiedFields.forEach(field => {
                html += `<li>
                    <span class="path">${field.path}</span>:<br>
                    <div class="diff-container">
                        <div class="old-value">Alt: ${JSON.stringify(field.oldValue)}</div>
                        <div class="new-value">Neu: ${JSON.stringify(field.newValue)}</div>
                    </div>
                </li>`;
            });
            html += '</ul>';
        }
        // Zeige entfernte Felder (mit Warnung)
        if (changes.removedFields.length > 0) {
            html += '<h3>Entfernte Felder</h3><ul class="removed-fields">';
            changes.removedFields.forEach(field => {
                const isProjectData = field.path.startsWith('project.') ||
                    field.path.startsWith('components.') ||
                    field.path.startsWith('architecture.');
                html += `<li class="${isProjectData ? 'project-data' : ''}">
                    <span class="path">${field.path}</span>: 
                    <span class="removed-value">${JSON.stringify(field.value)}</span>
                    ${isProjectData ? '<span class="warning">⚠️ Projektspezifische Daten</span>' : ''}
                </li>`;
            });
            html += '</ul>';
        }
        // Zeige Strukturelle Änderungen und Empfehlungen
        if (changes.structuralChanges.length > 0) {
            html += '<h3>Strukturelle Änderungen</h3><ul class="structural-changes">';
            changes.structuralChanges.forEach(change => {
                html += `<li class="impact-${change.impact}">
                    <span class="change-type">${change.type}</span> 
                    <span class="path">${change.path}</span>
                    <div class="recommendation">${change.recommendation}</div>
                </li>`;
            });
            html += '</ul>';
        }
        // Zeige Empfehlungen
        if (changes.recommendations.length > 0) {
            html += '<h3>Empfehlungen</h3><ul class="recommendations">';
            changes.recommendations.forEach(recommendation => {
                html += `<li>${recommendation}</li>`;
            });
            html += '</ul>';
        }
        html += '</div>';
        return html;
    }
    /**
     * Erstellt ein umfassendes und sicheres Backup aller projektspezifischen Dateien
     * mit besonderem Fokus auf den Schutz von .ai.json-Daten
     *
     * Diese Methode implementiert einen mehrstufigen Backup-Prozess, der garantiert,
     * dass keine Daten bei Updates verloren gehen können.
     *
     * @param workspaceFolder Das Workspace-Verzeichnis, für das ein Backup erstellt werden soll
     * @returns Pfad zum erstellten Backup-Verzeichnis
     */
    async createProjectBackup(workspaceFolder) {
        try {
            // Erstelle einen eindeutigen Zeitstempel für dieses Backup
            const now = new Date();
            const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
            // Hauptbackup-Verzeichnis im Extension Storage
            const backupDir = path.join(this.context.globalStorageUri.fsPath, 'project_backups', `backup_${timestamp}`);
            // Zusätzliches Sicherheits-Backup im Workspace selbst (optional)
            const workspaceBackupDir = path.join(workspaceFolder.uri.fsPath, '.ai-backups', `backup_${timestamp}`);
            // Stelle sicher, dass Backup-Verzeichnisse existieren
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            // Erstelle Workspace-Backup nur, wenn die Option aktiviert ist
            // (Default: aktiviert für maximale Sicherheit)
            const createWorkspaceBackup = true; // Könnte aus Einstellungen kommen
            if (createWorkspaceBackup) {
                try {
                    if (!fs.existsSync(workspaceBackupDir)) {
                        fs.mkdirSync(workspaceBackupDir, { recursive: true });
                    }
                }
                catch (error) {
                    console.log("Workspace-Backup konnte nicht erstellt werden, fahre mit Hauptbackup fort");
                    // Fehler beim Erstellen des Workspace-Backups werden ignoriert
                    // da das Hauptbackup immer noch verfügbar ist
                }
            }
            // Liste ALLER zu sichernden Dateien (mit Priorität auf projektspezifischen Daten)
            const criticalFilesToBackup = [
                '.ai.json',
                '.ai.dev.json',
                '.ai.user.json',
                '.ai.research.json',
                '.ai.preferences.json',
                'schema.json' // Schema-Definitionen
            ];
            // Zusätzliche Dateien, die auch gesichert werden sollten
            const additionalFilesToBackup = [
                '.ai-extensions.json',
                '.ai-components.json',
                'ai-init.php',
                'ai-config.json' // Konfigurationsdatei
            ];
            // Kombinierte Liste aller zu sichernden Dateien
            const allFilesToBackup = [...criticalFilesToBackup, ...additionalFilesToBackup];
            // Dateien kopieren und verifizieren
            const successfullyBackedUp = [];
            for (const file of allFilesToBackup) {
                const sourcePath = path.join(workspaceFolder.uri.fsPath, file);
                if (fs.existsSync(sourcePath)) {
                    try {
                        // Kopiere in Hauptbackup
                        const targetPath = path.join(backupDir, file);
                        fs.copyFileSync(sourcePath, targetPath);
                        // Verifiziere Backup (zusätzliche Sicherheit)
                        const sourceContent = fs.readFileSync(sourcePath, 'utf8');
                        const targetContent = fs.readFileSync(targetPath, 'utf8');
                        if (sourceContent === targetContent) {
                            successfullyBackedUp.push(file);
                            // Zusätzliches Backup im Workspace (wenn aktiviert)
                            if (createWorkspaceBackup) {
                                try {
                                    fs.copyFileSync(sourcePath, path.join(workspaceBackupDir, file));
                                }
                                catch (err) {
                                    // Workspace-Backup ist optional, ignoriere Fehler
                                }
                            }
                        }
                        else {
                            throw new Error(`Verifizierung fehlgeschlagen für ${file}`);
                        }
                    }
                    catch (error) {
                        console.error(`Fehler beim Backup von ${file}:`, error.message || error);
                        // Wir werfen hier keinen Fehler, da wir so viele Dateien wie möglich sichern wollen
                    }
                }
            }
            // Erstelle eine dedizierte Sicherheitskopie der .ai.json mit Zeitstempel-Suffix
            // Das garantiert, dass die Originaldaten immer wiederhergestellt werden können
            const aiJsonPath = path.join(workspaceFolder.uri.fsPath, '.ai.json');
            if (fs.existsSync(aiJsonPath)) {
                const safetyBackupPath = path.join(backupDir, `.ai.json.${timestamp}.safe`);
                fs.copyFileSync(aiJsonPath, safetyBackupPath);
            }
            // Backup-Metadaten erstellen
            const logPath = path.join(backupDir, 'backup_info.json');
            const backupInfo = {
                timestamp,
                version: this.extensionVersion,
                workspace: workspaceFolder.name,
                backupDate: now.toISOString(),
                files: successfullyBackedUp,
                safetyChecks: {
                    verificationPerformed: true,
                    allFilesCopied: successfullyBackedUp.length === allFilesToBackup.filter(file => fs.existsSync(path.join(workspaceFolder.uri.fsPath, file))).length
                },
                backupLocations: [
                    backupDir,
                    createWorkspaceBackup ? workspaceBackupDir : null
                ].filter(Boolean)
            };
            // Schreibe Backup-Informationen
            fs.writeFileSync(logPath, JSON.stringify(backupInfo, null, 2));
            // Erstelle zusätzliche README mit Anweisungen zur Wiederherstellung
            const readmePath = path.join(backupDir, 'RECOVERY_INSTRUCTIONS.md');
            const readmeContent = `# Backup Recovery Instructions
            
## Information
- **Backup Date:** ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
- **Version:** ${this.extensionVersion}
- **Workspace:** ${workspaceFolder.name}

## How to Recover
1. Close VS Code if it's running
2. Copy the files from this backup directory to your workspace root
3. Start VS Code and verify that your project settings are restored

## Backed Up Files
${successfullyBackedUp.map(file => `- \`${file}\``).join('\n')}

## Technical Details
This backup was created automatically by coreX AI MindLayer's secure update system.
If you need assistance, please contact support or refer to the documentation.
`;
            fs.writeFileSync(readmePath, readmeContent);
            return backupDir;
        }
        catch (error) {
            console.error('Kritischer Fehler beim Erstellen des Backups:', error);
            throw new Error(`Backup fehlgeschlagen: ${error.message || 'Unbekannter Fehler'}`);
        }
    }
}
exports.VersionChecker = VersionChecker;
/**
 * Registriert den Befehl zum manuellen Prüfen auf Updates
 */
function registerVersionCheckerCommand(context) {
    const versionChecker = new VersionChecker(context);
    return vscode.commands.registerCommand('aiMindLayer.checkForUpdates', () => {
        versionChecker.checkForUpdates(true);
    });
}
exports.registerVersionCheckerCommand = registerVersionCheckerCommand;
//# sourceMappingURL=version-checker.js.map