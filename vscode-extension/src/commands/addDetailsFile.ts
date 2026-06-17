import * as vscode from 'vscode';
import * as path from 'path';

export async function addDetailsFile() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const rootUri = workspaceFolders[0].uri;

    const areaName = await vscode.window.showInputBox({
        prompt: 'Enter the name of the feature area (e.g. backend, admin, auth)',
        placeHolder: 'area-name'
    });

    if (!areaName) return;

    const fileName = `.ai.features.${areaName}.details.json`;
    const fileUri = vscode.Uri.joinPath(rootUri, fileName);

    const template = {
        "$schema": "./vscode-extension/src/schemas/ai.features.details.schema.json",
        "_meta": {
            "area": areaName,
            "last_updated": new Date().toISOString().split('T')[0],
            "priority": "medium"
        },
        "sections": {
            "routes": [],
            "files": [],
            "core_logic": [],
            "truths": [],
            "known_issues": []
        }
    };

    await vscode.workspace.fs.writeFile(
        fileUri,
        Buffer.from(JSON.stringify(template, null, 2), 'utf8')
    );

    // Automatisches Öffnen der neuen Datei
    const doc = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(`✅ Feature details file created: ${fileName}`);
}
