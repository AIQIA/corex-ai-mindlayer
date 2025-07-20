"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationProvider = void 0;
const vscode = require("vscode");
const JsonOptimizer_1 = require("./JsonOptimizer");
class OptimizationProvider {
    constructor() {
        this.optimizer = null;
    }
    /**
     * Optimierungssystem initialisieren
     */
    async activate(context) {
        // Registriere Commands
        context.subscriptions.push(vscode.commands.registerCommand('aiMindLayer.optimizeJson', this.optimizeJson.bind(this)), vscode.commands.registerCommand('aiMindLayer.deoptimizeJson', this.deoptimizeJson.bind(this)));
    }
    /**
     * .ai.json optimieren
     */
    async optimizeJson() {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('Kein Workspace geöffnet');
            }
            // Informiere Benutzer
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Optimiere .ai.json',
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: 'Initialisiere Optimierung...' });
                // Erstelle Optimizer
                this.optimizer = new JsonOptimizer_1.JsonOptimizer();
                await this.optimizer.init();
                progress.report({ increment: 30, message: 'Optimiere Dateien...' });
                // Optimiere .ai.json
                const aiJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
                await this.optimizer.optimize(aiJsonPath.fsPath);
                progress.report({ increment: 70, message: 'Finalisiere...' });
            });
            vscode.window.showInformationMessage('Optimierung erfolgreich abgeschlossen.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Optimierung fehlgeschlagen: ${error.message}`);
        }
    }
    /**
     * Optimierung rückgängig machen
     */
    async deoptimizeJson() {
        try {
            if (!this.optimizer) {
                throw new Error('Optimizer nicht initialisiert');
            }
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Stelle original .ai.json wieder her',
                cancellable: false
            }, async () => {
                // Optimizer wurde bereits auf null-Check geprüft
                await this.optimizer.deoptimize();
            });
            vscode.window.showInformationMessage('Original .ai.json wiederhergestellt.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Wiederherstellung fehlgeschlagen: ${error.message}`);
        }
    }
    /**
     * Extension deaktivieren
     */
    async deactivate() {
        if (this.optimizer) {
            await this.optimizer.cleanup();
        }
    }
}
exports.OptimizationProvider = OptimizationProvider;
//# sourceMappingURL=OptimizationProvider.js.map