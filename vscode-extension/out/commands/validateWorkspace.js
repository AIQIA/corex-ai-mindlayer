"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWorkspace = void 0;
const vscode = require("vscode");
async function validateWorkspace(schemaValidator, referenceValidator, secretScanner) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders)
        return;
    const rootPath = workspaceFolders[0].uri.fsPath;
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('aim');
    diagnosticCollection.clear();
    // Suche nach allen relevanten .ai Dateien
    const files = await vscode.workspace.findFiles('**/.ai*.json');
    for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const contentStr = document.getText();
        let content;
        try {
            content = JSON.parse(contentStr);
        }
        catch (e) {
            // TODO: Markiere Datei als kaputtes JSON
            continue;
        }
        const diagnostics = [];
        // 1. Schema Validierung
        const schemaResult = schemaValidator.validate(path.basename(file.fsPath), content);
        if (!schemaResult.valid) {
            schemaResult.errors.forEach(err => {
                const range = new vscode.Range(0, 0, 0, 0); // Einfachheitshalber Start der Datei
                diagnostics.push(new vscode.Diagnostic(range, `Schema Error: ${err.message}`, vscode.DiagnosticSeverity.Error));
            });
        }
        // 2. Referenz Validierung
        const refs = referenceValidator.extractReferences(content);
        const deadLinks = await referenceValidator.validateReferences(rootPath, refs);
        deadLinks.forEach(link => {
            const range = new vscode.Range(0, 0, 0, 0);
            diagnostics.push(new vscode.Diagnostic(range, `Dead Reference: File "${link}" not found`, vscode.DiagnosticSeverity.Warning));
        });
        // 3. Secret Scanning
        const secrets = secretScanner.findPotentialSecrets(contentStr);
        secrets.forEach(sec => {
            const range = new vscode.Range(0, 0, 0, 0);
            diagnostics.push(new vscode.Diagnostic(range, `Security Warning: ${sec}`, vscode.DiagnosticSeverity.Warning));
        });
        diagnosticCollection.set(file, diagnostics);
    }
    vscode.window.showInformationMessage(`✅ Workspace validation complete. Found ${files.length} AIM files.`);
}
exports.validateWorkspace = validateWorkspace;
const path = require("path");
//# sourceMappingURL=validateWorkspace.js.map