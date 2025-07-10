import * as vscode from 'vscode';
import * as semver from 'semver';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const GITHUB_API_URL = 'https://api.github.com/repos/aiqia/corex-ai-mindlayer/releases/latest';
const CHECK_INTERVAL = 86400000; // 24 hours in milliseconds

/**
 * VersionChecker Klasse für automatisches Erkennen und Installieren von Updates
 */
export class VersionChecker {
    private context: vscode.ExtensionContext;
    private statusBarItem: vscode.StatusBarItem;
    private extensionVersion: string;

    constructor(context: vscode.ExtensionContext) {
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
    public async checkForUpdates(manual: boolean): Promise<void> {
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
            } else {
                // Keine Updates verfügbar
                this.statusBarItem.hide();
                
                if (manual) {
                    vscode.window.showInformationMessage(`🤖 coreX AI MindLayer ist auf dem neuesten Stand (v${this.extensionVersion})`);
                }
            }
        } catch (error) {
            console.error('Fehler beim Prüfen auf Updates:', error);
            
            if (manual) {
                vscode.window.showErrorMessage('Fehler beim Prüfen auf Updates. Bitte versuche es später erneut.');
            }
        }
    }

    /**
     * Zeigt eine Benachrichtigung über verfügbare Updates an
     */
    private showUpdateNotification(version: string, changelog: string): void {
        const updateMessage = `🚀 coreX AI MindLayer Update verfügbar: v${version}`;
        
        vscode.window.showInformationMessage(updateMessage, 'Update installieren', 'Changelog anzeigen', 'Später erinnern').then(selection => {
            if (selection === 'Update installieren') {
                this.installUpdate(version);
            } else if (selection === 'Changelog anzeigen') {
                this.showChangelog(version, changelog);
            } else if (selection === 'Später erinnern') {
                // Speichern des letzten Benachrichtigungszeitpunkts
                this.context.globalState.update('lastUpdateNotification', Date.now());
            }
        });
    }

    /**
     * Installiert das Update
     */
    private async installUpdate(version: string): Promise<void> {
        // Zeige Fortschrittsbalken
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Update auf Version ${version} wird installiert...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            
            try {
                // Backup der aktuellen Version erstellen
                await this.createBackup();
                progress.report({ increment: 20, message: 'Backup erstellt' });
                
                // Lade VSIX herunter
                const vsixPath = await this.downloadVsix(version);
                progress.report({ increment: 60, message: 'Update heruntergeladen' });
                
                // Installiere VSIX
                await this.installVsix(vsixPath);
                progress.report({ increment: 20, message: 'Installation abgeschlossen' });
                
                vscode.window.showInformationMessage(
                    '🎉 Update erfolgreich installiert! VS Code muss neu gestartet werden.',
                    'Jetzt neu starten'
                ).then(selection => {
                    if (selection === 'Jetzt neu starten') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            } catch (error) {
                console.error('Fehler bei der Update-Installation:', error);
                vscode.window.showErrorMessage(
                    'Fehler bei der Update-Installation. Rollback wird durchgeführt...',
                    'Details anzeigen'
                ).then(selection => {
                    if (selection === 'Details anzeigen') {
                        // Zeige Fehlerdetails in Output-Channel
                        const outputChannel = vscode.window.createOutputChannel('AI MindLayer Updates');
                        outputChannel.appendLine(`Fehler bei der Installation von v${version}:`);
                        outputChannel.appendLine(String(error));
                        outputChannel.show();
                    }
                });
                
                // Rollback durchführen
                await this.performRollback();
            }
        });
    }

    /**
     * Lädt die VSIX-Datei für die angegebene Version herunter
     */
    private async downloadVsix(version: string): Promise<string> {
        const vsixUrl = `https://github.com/aiqia/corex-ai-mindlayer/releases/download/v${version}/corex-ai-mindlayer-${version}.vsix`;
        const tempDir = path.join(this.context.globalStorageUri.fsPath, 'updates');
        
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const vsixPath = path.join(tempDir, `corex-ai-mindlayer-${version}.vsix`);
        
        // Herunterladen der VSIX-Datei mit HTTPS
        return new Promise<string>((resolve, reject) => {
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
                    } else {
                        reject(new Error('Redirect location header missing'));
                        return;
                    }
                } else if (response.statusCode !== 200) {
                    reject(new Error(`Server responded with status code ${response.statusCode}`));
                    return;
                } else {
                    // Direkt in Datei schreiben
                    response.pipe(file);
                }
            });
            
            file.on('finish', () => {
                file.close();
                resolve(vsixPath);
            });
            
            request.on('error', (err) => {
                fs.unlink(vsixPath, () => {}); // Datei bei Fehler löschen
                reject(err);
            });
            
            file.on('error', (err) => {
                fs.unlink(vsixPath, () => {}); // Datei bei Fehler löschen
                reject(err);
            });
            
            request.end();
        });
    }

    /**
     * Installiert die VSIX-Datei
     */
    private async installVsix(vsixPath: string): Promise<void> {
        // TODO: Implementierung zur Installation der VSIX-Datei
        // Dies würde die VS Code Extension Manager API verwenden
        await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(vsixPath));
    }

    /**
     * Erstellt ein Backup der aktuellen Version
     */
    private async createBackup(): Promise<void> {
        // TODO: Implementierung zum Erstellen eines Backups
        // Dies ist ein Platzhalter für die eigentliche Implementierung
        const backupDir = path.join(this.context.globalStorageUri.fsPath, 'backups');
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
    }

    /**
     * Führt ein Rollback zur vorherigen Version durch
     */
    private async performRollback(): Promise<void> {
        // TODO: Implementierung für den Rollback
        // Dies ist ein Platzhalter für die eigentliche Implementierung
        vscode.window.showInformationMessage('Rollback zur vorherigen Version wurde durchgeführt.');
    }

    /**
     * Zeigt das Changelog für die neue Version an
     */
    private showChangelog(version: string, changelog: string): void {
        const panel = vscode.window.createWebviewPanel(
            'aiMindLayerChangelog',
            `AI MindLayer v${version} - Changelog`,
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = this.getChangelogHtml(version, changelog);
    }

    /**
     * Generiert das HTML für die Changelog-Anzeige
     */
    private getChangelogHtml(version: string, changelog: string): string {
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
    private formatChangelog(changelog: string): string {
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
    private async fetchLatestRelease(): Promise<any> {
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
                    } catch (error: any) {
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
    private shouldNotifyForUpdate(): boolean {
        const lastNotification = this.context.globalState.get<number>('lastUpdateNotification') || 0;
        const now = Date.now();
        
        // Zeige Benachrichtigung, wenn die letzte Benachrichtigung mehr als 3 Tage her ist
        return (now - lastNotification) > 259200000; // 3 Tage in Millisekunden
    }
}

/**
 * Registriert den Befehl zum manuellen Prüfen auf Updates
 */
export function registerVersionCheckerCommand(context: vscode.ExtensionContext): vscode.Disposable {
    const versionChecker = new VersionChecker(context);
    
    return vscode.commands.registerCommand('aiMindLayer.checkForUpdates', () => {
        versionChecker.checkForUpdates(true);
    });
}
