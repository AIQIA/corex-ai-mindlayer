"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const schemaValidator_1 = require("./core/schemaValidator");
const referenceValidator_1 = require("./core/referenceValidator");
const secretScanner_1 = require("./core/secretScanner");
const initializeProject_1 = require("./commands/initializeProject");
const validateWorkspace_1 = require("./commands/validateWorkspace");
const copyContext_1 = require("./commands/copyContext");
const installAgentAnchors_1 = require("./commands/installAgentAnchors");
const prepareAiOnboarding_1 = require("./commands/prepareAiOnboarding");
const addDetailsFile_1 = require("./commands/addDetailsFile");
const mindLayerTree_1 = require("./views/mindLayerTree");
/**
 * coreX AI MindLayer (AIM) - Haupt-Einstiegspunkt
 * Revision V4.0.0 (Minimal Core)
 */
function activate(context) {
    console.log('🤖 coreX AI MindLayer (AIM) V4.0.0 is now active!');
    // Core-Services initialisieren
    const schemaValidator = new schemaValidator_1.SchemaValidator();
    const referenceValidator = new referenceValidator_1.ReferenceValidator();
    const secretScanner = new secretScanner_1.SecretScanner();
    // Tree View registrieren
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const treeProvider = new mindLayerTree_1.MindLayerTreeProvider(rootPath);
    vscode.window.registerTreeDataProvider('aiMindLayerExplorer', treeProvider);
    // Commands registrieren
    const commands = [
        vscode.commands.registerCommand('aiMindLayer.initialize', () => (0, initializeProject_1.initializeProject)()),
        vscode.commands.registerCommand('aiMindLayer.validateWorkspace', () => (0, validateWorkspace_1.validateWorkspace)(schemaValidator, referenceValidator, secretScanner)),
        vscode.commands.registerCommand('aiMindLayer.copyContext', () => (0, copyContext_1.copyContext)()),
        vscode.commands.registerCommand('aiMindLayer.installAnchors', () => (0, installAgentAnchors_1.installAgentAnchors)()),
        vscode.commands.registerCommand('aiMindLayer.prepareOnboarding', () => (0, prepareAiOnboarding_1.prepareAiOnboarding)()),
        vscode.commands.registerCommand('aiMindLayer.addDetails', () => (0, addDetailsFile_1.addDetailsFile)()),
        // Fallback/Legacy Mapping (optional zur Erhaltung der Kompatibilität mit alten Menüs)
        vscode.commands.registerCommand('aiMindLayer.validateSchema', () => (0, validateWorkspace_1.validateWorkspace)(schemaValidator, referenceValidator, secretScanner))
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
            (0, validateWorkspace_1.validateWorkspace)(schemaValidator, referenceValidator, secretScanner);
        }
    }));
}
exports.activate = activate;
function deactivate() {
    console.log('🤖 coreX AI MindLayer deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map