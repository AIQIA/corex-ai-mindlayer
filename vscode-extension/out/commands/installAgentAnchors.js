"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAgentAnchors = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
async function installAgentAnchors() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders)
        return;
    const rootUri = workspaceFolders[0].uri;
    const rootPath = rootUri.fsPath;
    // Definiere mögliche Agent-Anker Ziele
    const potentialTargets = [
        { name: 'AGENTS.md', path: 'AGENTS.md', priority: 1 },
        { name: 'CLAUDE.md', path: 'CLAUDE.md', priority: 2 },
        { name: 'Copilot Instructions', path: '.github/copilot-instructions.md', priority: 3 },
        { name: 'Cursor Rules', path: '.cursorrules', priority: 4 }
    ];
    // Lade das AI-zentrische Template
    let snippet = '';
    const templatePath = path.join(__dirname, '..', 'templates', 'agent-anchor.md');
    if (fs.existsSync(templatePath)) {
        snippet = fs.readFileSync(templatePath, 'utf8');
    }
    else {
        snippet = `\n<!-- AI-MINDLAYER:START -->\n## AI MindLayer (AIM)\nMandatory: Use .ai.json for project rules and context.\n<!-- AI-MINDLAYER:END -->\n`;
    }
    // Identifiziere bereits vorhandene Dateien
    const existingTargets = potentialTargets.filter(t => fs.existsSync(path.join(rootPath, t.path)));
    let targetsToInstall = [];
    if (existingTargets.length > 0) {
        // Falls Dateien existieren, schlage vor, diese zu patchen
        const selected = await vscode.window.showQuickPick(existingTargets.map(t => ({ label: t.name, description: t.path, target: t })), { canPickMany: true, title: 'Select Agent Anchors to update/install' });
        if (selected)
            targetsToInstall = selected.map(s => s.target);
    }
    else {
        // Falls keine existiert, frage welche erstellt werden sollen
        const selected = await vscode.window.showQuickPick(potentialTargets.map(t => ({ label: t.name, description: `Create ${t.path}`, target: t })), { canPickMany: true, title: 'No Agent Anchors found. Which one should be created?' });
        if (selected)
            targetsToInstall = selected.map(s => s.target);
    }
    for (const target of targetsToInstall) {
        const fileUri = vscode.Uri.joinPath(rootUri, target.path);
        const fullPath = path.join(rootPath, target.path);
        let content = '';
        try {
            if (fs.existsSync(fullPath)) {
                content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('AI-MINDLAYER:START')) {
                    const regex = /<!-- AI-MINDLAYER:START -->[\s\S]*<!-- AI-MINDLAYER:END -->/g;
                    content = content.replace(regex, snippet.trim());
                    vscode.window.showInformationMessage(`🔄 Updated AIM anchor in ${target.name}`);
                }
                else {
                    content += '\n' + snippet;
                    vscode.window.showInformationMessage(`✅ Appended AIM anchor to ${target.name}`);
                }
            }
            else {
                // Erstelle Verzeichnis falls nötig (z.B. für .github/)
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir))
                    fs.mkdirSync(dir, { recursive: true });
                content = snippet;
                vscode.window.showInformationMessage(`✅ Created ${target.name} with AIM anchor`);
            }
            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to install anchor in ${target.name}: ${error}`);
        }
    }
}
exports.installAgentAnchors = installAgentAnchors;
//# sourceMappingURL=installAgentAnchors.js.map