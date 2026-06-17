import * as vscode from 'vscode';
import { SchemaValidator } from './core/schemaValidator';
import { ReferenceValidator } from './core/referenceValidator';
import { SecretScanner } from './core/secretScanner';
import { initializeProject } from './commands/initializeProject';
import { validateWorkspace } from './commands/validateWorkspace';
import { copyContext } from './commands/copyContext';
import { installAgentAnchors } from './commands/installAgentAnchors';
import { prepareAiOnboarding } from './commands/prepareAiOnboarding';
import { addDetailsFile } from './commands/addDetailsFile';
import { MindLayerTreeProvider } from './views/mindLayerTree';

/**
 * coreX AI MindLayer (AIM) - Haupt-Einstiegspunkt
 * Revision V4.0.0 (Minimal Core)
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('🤖 coreX AI MindLayer (AIM) V4.0.0 is now active!');

    // Core-Services initialisieren
    const schemaValidator = new SchemaValidator();
    const referenceValidator = new ReferenceValidator();
    const secretScanner = new SecretScanner();

    // Tree View registrieren
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const treeProvider = new MindLayerTreeProvider(rootPath);
    vscode.window.registerTreeDataProvider('aiMindLayerExplorer', treeProvider);

    // Commands registrieren
    const commands = [
        vscode.commands.registerCommand('aiMindLayer.initialize', () => initializeProject()),
        vscode.commands.registerCommand('aiMindLayer.validateWorkspace', () => validateWorkspace(schemaValidator, referenceValidator, secretScanner)),
        vscode.commands.registerCommand('aiMindLayer.copyContext', () => copyContext()),
        vscode.commands.registerCommand('aiMindLayer.installAnchors', () => installAgentAnchors()),
        vscode.commands.registerCommand('aiMindLayer.prepareOnboarding', () => prepareAiOnboarding()),
        vscode.commands.registerCommand('aiMindLayer.addDetails', () => addDetailsFile()),
        // Fallback/Legacy Mapping (optional zur Erhaltung der Kompatibilität mit alten Menüs)
        vscode.commands.registerCommand('aiMindLayer.validateSchema', () => validateWorkspace(schemaValidator, referenceValidator, secretScanner))
    ];

    context.subscriptions.push(...commands);

    // Refresh Tree on Save
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.fileName.endsWith('.ai.json')) {
            treeProvider.refresh();
        }
    }));
    
    // Statusbar Item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(hubot) AIM: Active";
    statusBarItem.tooltip = "AI MindLayer is monitoring your project context";
    statusBarItem.command = 'aiMindLayer.validateWorkspace';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Auto-Validierung bei Speichern (Optional via Settings)
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.fileName.includes('.ai') && doc.fileName.endsWith('.json')) {
            validateWorkspace(schemaValidator, referenceValidator, secretScanner);
        }
    }));
}

export function deactivate() {
    console.log('🤖 coreX AI MindLayer deactivated');
}
