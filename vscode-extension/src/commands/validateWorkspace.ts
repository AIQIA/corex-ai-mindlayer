import * as vscode from 'vscode';
import { SchemaValidator } from '../core/schemaValidator';
import { ReferenceValidator } from '../core/referenceValidator';
import { SecretScanner } from '../core/secretScanner';

export async function validateWorkspace(schemaValidator: SchemaValidator, referenceValidator: ReferenceValidator, secretScanner: SecretScanner) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const rootPath = workspaceFolders[0].uri.fsPath;
    
    // DiagnosticCollection sollte persistent über die Extension-Lebensdauer sein, 
    // aber für den Command-Aufruf leeren wir sie neu oder nutzen eine globale.
    // Hier nutzen wir eine für diesen Lauf.
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('aim');
    diagnosticCollection.clear();

    const files = await vscode.workspace.findFiles('**/.ai*.json', '**/node_modules/**');

    for (const file of files) {
        try {
            const document = await vscode.workspace.openTextDocument(file);
            const contentStr = document.getText();
            let content: any;

            try {
                content = JSON.parse(contentStr);
            } catch (e) {
                const range = new vscode.Range(0, 0, 0, 10);
                diagnosticCollection.set(file, [new vscode.Diagnostic(range, 'Invalid JSON format', vscode.DiagnosticSeverity.Error)]);
                continue;
            }

            const diagnostics: vscode.Diagnostic[] = [];

            // 1. Schema Validierung
            const schemaResult = schemaValidator.validate(path.basename(file.fsPath), content);
            if (!schemaResult.valid) {
                schemaResult.errors.forEach(err => {
                    // Versuche die Zeile zu finden (einfache Suche für MVP)
                    const range = findRangeForKey(document, err.instancePath || '');
                    diagnostics.push(new vscode.Diagnostic(range, `Schema: ${err.message}`, vscode.DiagnosticSeverity.Error));
                });
            }

            // 2. Referenz Validierung
            const refs = referenceValidator.extractReferences(content);
            const deadLinks = await referenceValidator.validateReferences(rootPath, refs);
            deadLinks.forEach(link => {
                const range = findRangeForKey(document, link);
                diagnostics.push(new vscode.Diagnostic(range, `Dead Reference: "${link}" not found`, vscode.DiagnosticSeverity.Warning));
            });

            // 3. Secret Scanning
            const secrets = secretScanner.findPotentialSecrets(contentStr);
            secrets.forEach(sec => {
                const range = new vscode.Range(0, 0, 0, 0);
                diagnostics.push(new vscode.Diagnostic(range, `Security: ${sec}`, vscode.DiagnosticSeverity.Warning));
            });

            diagnosticCollection.set(file, diagnostics);
        } catch (err) {
            console.error(`Could not validate ${file.fsPath}: ${err}`);
        }
    }

    if (files.length === 0) {
        vscode.window.showInformationMessage('No AIM files found to validate.');
    } else {
        vscode.window.showInformationMessage(`✅ AIM Validation: Checked ${files.length} files.`);
    }
}

/**
 * Hilfsfunktion um eine Range für einen Key/Pfad im Dokument zu finden.
 * Sehr simpel gehalten für MVP.
 */
function findRangeForKey(doc: vscode.TextDocument, key: string): vscode.Range {
    if (!key || key === '') return new vscode.Range(0, 0, 0, 0);
    
    // Extrahiere den reinen Key-Namen falls es ein Pfad ist (/project/name -> name)
    const cleanKey = key.split('/').pop() || key;
    const text = doc.getText();
    const index = text.indexOf(cleanKey);
    
    if (index === -1) return new vscode.Range(0, 0, 0, 0);
    
    const startPos = doc.positionAt(index);
    const endPos = doc.positionAt(index + cleanKey.length);
    return new vscode.Range(startPos, endPos);
}

import * as path from 'path';
