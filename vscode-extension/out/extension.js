"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('🤖 coreX AI MindLayer extension is now active!');
    // Register commands
    const createAiJsonCommand = vscode.commands.registerCommand('aiMindLayer.createAiJson', createAiJson);
    const validateSchemaCommand = vscode.commands.registerCommand('aiMindLayer.validateSchema', validateSchema);
    const runScannerCommand = vscode.commands.registerCommand('aiMindLayer.runScanner', runScanner);
    // Register file system watcher for .ai.json files
    const aiJsonWatcher = vscode.workspace.createFileSystemWatcher('**/.ai.json');
    aiJsonWatcher.onDidChange(() => {
        vscode.window.showInformationMessage('🤖 .ai.json file updated!');
    });
    // Auto-validate on save
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.fileName.endsWith('.ai.json')) {
            validateAiJsonDocument(document);
        }
    });
    // Show welcome message if .ai.json doesn't exist
    checkForAiJson();
    // Add all disposables to context
    context.subscriptions.push(createAiJsonCommand, validateSchemaCommand, runScannerCommand, aiJsonWatcher);
}
exports.activate = activate;
async function createAiJson() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    // Check if .ai.json already exists
    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        const overwrite = await vscode.window.showWarningMessage('.ai.json already exists. Overwrite?', 'Yes', 'No');
        if (overwrite !== 'Yes')
            return;
    }
    catch {
        // File doesn't exist, continue
    }
    // Create basic .ai.json template
    const template = {
        "meta": {
            "project": workspaceFolder.name,
            "version": "1.0.0",
            "author": "Your Name",
            "description": "Project description",
            "created": new Date().toISOString().split('T')[0],
            "updated": new Date().toISOString().split('T')[0]
        },
        "architecture": [
            {
                "module": "Core",
                "description": "Main application logic",
                "entrypoints": ["index.js", "main.py", "app.php"],
                "routes": ["/"],
                "dependencies": []
            }
        ],
        "errors": [
            {
                "code": "EXAMPLE_ERROR",
                "message": "Example error description",
                "causes": ["Possible cause 1", "Possible cause 2"],
                "solutions": ["Solution 1", "Solution 2"],
                "severity": "medium"
            }
        ],
        "tasks": [
            {
                "task": "Customize this .ai.json file",
                "priority": "high",
                "status": "open",
                "relatedModules": ["Core"],
                "due": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "tags": ["setup"]
            }
        ],
        "context": [
            {
                "key": "Framework",
                "value": "Add your main framework here",
                "category": "technology"
            }
        ],
        "references": [
            {
                "type": "doc",
                "label": "AI Integration Guide",
                "url": "./AI-INTEGRATION.md",
                "description": "How to integrate AI tools with this project"
            }
        ]
    };
    try {
        const content = JSON.stringify(template, null, 2);
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(aiJsonUri, encoder.encode(content));
        vscode.window.showInformationMessage('✅ .ai.json created successfully!');
        // Open the file for editing
        const document = await vscode.workspace.openTextDocument(aiJsonUri);
        await vscode.window.showTextDocument(document);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to create .ai.json: ${error}`);
    }
}
async function validateSchema() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    try {
        const document = await vscode.workspace.openTextDocument(aiJsonUri);
        await validateAiJsonDocument(document);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to validate .ai.json: ${error}`);
    }
}
async function validateAiJsonDocument(document) {
    try {
        const content = document.getText();
        JSON.parse(content); // Basic JSON validation
        vscode.window.showInformationMessage('✅ .ai.json is valid JSON!');
        return true;
    }
    catch (error) {
        vscode.window.showErrorMessage(`❌ Invalid JSON in .ai.json: ${error}`);
        return false;
    }
}
async function runScanner() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    // Check if ai-init.php exists
    const scannerUri = vscode.Uri.joinPath(workspaceFolder.uri, 'ai-init.php');
    try {
        await vscode.workspace.fs.stat(scannerUri);
    }
    catch {
        const download = await vscode.window.showInformationMessage('ai-init.php not found in this workspace. Would you like to copy it from the AI MindLayer project?', 'Copy Scanner', 'Cancel');
        if (download === 'Copy Scanner') {
            vscode.window.showInformationMessage('Please copy ai-init.php from the coreX AI MindLayer repository to your project root.');
        }
        return;
    }
    // Run the scanner in terminal
    const terminal = vscode.window.createTerminal('AI MindLayer Scanner');
    terminal.show();
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    terminal.sendText('php ai-init.php');
    vscode.window.showInformationMessage('🤖 Running AI MindLayer scanner...');
}
async function checkForAiJson() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder)
        return;
    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        // .ai.json exists
        vscode.window.showInformationMessage('🤖 AI MindLayer detected! Your project is AI-ready.');
    }
    catch {
        // .ai.json doesn't exist, show welcome message
        const action = await vscode.window.showInformationMessage('🤖 Welcome to AI MindLayer! Would you like to make this project AI-ready?', 'Create .ai.json', 'Run Scanner', 'Later');
        if (action === 'Create .ai.json') {
            createAiJson();
        }
        else if (action === 'Run Scanner') {
            runScanner();
        }
    }
}
function deactivate() {
    console.log('🤖 AI MindLayer extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map