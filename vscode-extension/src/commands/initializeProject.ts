import * as vscode from 'vscode';
import * as path from 'path';

export async function initializeProject() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const rootUri = workspaceFolders[0].uri;
    const aiJsonUri = vscode.Uri.joinPath(rootUri, '.ai.json');

    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        const overwrite = await vscode.window.showWarningMessage(
            '.ai.json already exists. Do you want to overwrite it with a minimal template?',
            'Yes', 'No'
        );
        if (overwrite !== 'Yes') return;
    } catch {
        // File doesn't exist, proceed
    }

    const template = {
        "$schema": "https://raw.githubusercontent.com/AIQIA/corex-ai-mindlayer/main/vscode-extension/src/schemas/ai.schema.json",
        "_meta": {
            "version": "1.0.0",
            "last_updated": new Date().toISOString().split('T')[0]
        },
        "project": {
            "name": path.basename(rootUri.fsPath),
            "description": "Minimal AI MindLayer configuration",
            "version": "1.0.0",
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
        ],
        "user_preferences": {
            "language": "de",
            "communication_style": "technisch",
            "technical_depth": "detailliert"
        }
    };

    await vscode.workspace.fs.writeFile(
        aiJsonUri,
        Buffer.from(JSON.stringify(template, null, 2), 'utf8')
    );

    // Erstelle auch die .ai.json.example Datei im Root des Projekts als Referenz
    const aiJsonExampleUri = vscode.Uri.joinPath(rootUri, '.ai.json.example');
    await vscode.workspace.fs.writeFile(
        aiJsonExampleUri,
        Buffer.from(JSON.stringify(template, null, 2), 'utf8')
    );

    vscode.window.showInformationMessage('✅ AI MindLayer initialized with .ai.json and .ai.json.example');
}
