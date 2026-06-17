import * as vscode from 'vscode';

export async function copyContext() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const rootUri = workspaceFolders[0].uri;
    const aiJsonUri = vscode.Uri.joinPath(rootUri, '.ai.json');

    try {
        const content = await vscode.workspace.fs.readFile(aiJsonUri);
        const aiJson = JSON.parse(content.toString());

        // Erstelle einen kompakten Markdown-Kontext
        let context = `## AI Project Context (via coreX AIM)\n\n`;
        context += `**Project:** ${aiJson.project?.name}\n`;
        context += `**Description:** ${aiJson.project?.description}\n\n`;

        if (aiJson.red_lines && aiJson.red_lines.length > 0) {
            context += `### 🟥 Red Lines (Crucial Rules)\n`;
            aiJson.red_lines.forEach((line: string) => context += `- ${line}\n`);
            context += `\n`;
        }

        if (aiJson.architecture) {
            context += `### 🏗️ Architecture\n`;
            context += JSON.stringify(aiJson.architecture, null, 2) + `\n\n`;
        }

        // Kopiere in die Zwischenablage
        await vscode.env.clipboard.writeText(context);
        vscode.window.showInformationMessage('📋 AI Context copied to clipboard!');

    } catch (error) {
        vscode.window.showErrorMessage('Could not find or parse .ai.json for context export.');
    }
}
