"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProject = void 0;
const vscode = require("vscode");
async function initializeProject() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    const rootUri = workspaceFolders[0].uri;
    const aiJsonUri = vscode.Uri.joinPath(rootUri, '.ai.json');
    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        const overwrite = await vscode.window.showWarningMessage('.ai.json already exists. Do you want to overwrite it with a minimal template?', 'Yes', 'No');
        if (overwrite !== 'Yes')
            return;
    }
    catch {
        // File doesn't exist, proceed
    }
    const template = {
        "$schema": "./vscode-extension/src/schemas/ai.schema.json",
        "_meta": {
            "version": "1.0.0",
            "last_updated": new Date().toISOString().split('T')[0]
        },
        "project": {
            "name": path.basename(rootUri.fsPath),
            "description": "Minimal AI MindLayer configuration",
            "tech_stack": []
        },
        "red_lines": [
            "Never delete files without confirmation",
            "Always follow the project's existing coding style"
        ],
        "workflow": {},
        "architecture": {},
        "reference_docs": [
            "README.md"
        ]
    };
    await vscode.workspace.fs.writeFile(aiJsonUri, Buffer.from(JSON.stringify(template, null, 2), 'utf8'));
    vscode.window.showInformationMessage('✅ AI MindLayer initialized with .ai.json');
}
exports.initializeProject = initializeProject;
const path = require("path");
//# sourceMappingURL=initializeProject.js.map