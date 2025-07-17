import * as vscode from 'vscode';
import { JsonOptimizer } from '../core/json-optimizer/JsonOptimizer';

export class OptimizationProvider {
    private optimizer: JsonOptimizer | null = null;

    /**
     * Optimierungssystem initialisieren
     */
    async activate(context: vscode.ExtensionContext): Promise<void> {
        // Registriere Commands
        context.subscriptions.push(
            vscode.commands.registerCommand('aiMindLayer.optimizeJson', this.optimizeJson.bind(this)),
            vscode.commands.registerCommand('aiMindLayer.deoptimizeJson', this.deoptimizeJson.bind(this))
        );
    }

    /**
     * .ai.json optimieren
     */
    private async optimizeJson(): Promise<void> {
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
                this.optimizer = new JsonOptimizer(workspaceFolder.uri.fsPath);
                await this.optimizer.init();

                progress.report({ increment: 30, message: 'Optimiere Dateien...' });

                // Optimiere .ai.json
                const aiJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
                await this.optimizer.optimize(aiJsonPath.fsPath);

                progress.report({ increment: 70, message: 'Finalisiere...' });
            });

            vscode.window.showInformationMessage('Optimierung erfolgreich abgeschlossen.');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Optimierung fehlgeschlagen: ${error.message}`);
        }
    }

    /**
     * Optimierung rückgängig machen
     */
    private async deoptimizeJson(): Promise<void> {
        try {
            if (!this.optimizer) {
                throw new Error('Optimizer nicht initialisiert');
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Stelle original .ai.json wieder her',
                cancellable: false
            }, async () => {
                await this.optimizer.cleanup();
            });

            vscode.window.showInformationMessage('Original .ai.json wiederhergestellt.');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Wiederherstellung fehlgeschlagen: ${error.message}`);
        }
    }

    /**
     * Extension deaktivieren
     */
    async deactivate(): Promise<void> {
        if (this.optimizer) {
            await this.optimizer.cleanup();
        }
    }
}
