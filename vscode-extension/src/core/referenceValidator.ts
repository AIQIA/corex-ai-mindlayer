import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ReferenceValidator {
    /**
     * Prüft, ob referenzierte Dateien in einem Dokument existieren.
     * @param workspaceRoot Root des Workspaces
     * @param references Liste von Pfaden (relativ zum Root)
     */
    public async validateReferences(workspaceRoot: string, references: string[]): Promise<string[]> {
        const deadLinks: string[] = [];

        for (const ref of references) {
            const fullPath = path.join(workspaceRoot, ref);
            if (!fs.existsSync(fullPath)) {
                deadLinks.push(ref);
            }
        }

        return deadLinks;
    }

    /**
     * Extrahiert alle potenziellen Dateireferenzen aus einem AIM JSON.
     */
    public extractReferences(content: any): string[] {
        const refs: string[] = [];
        
        // Root: reference_docs
        if (Array.isArray(content.reference_docs)) {
            refs.push(...content.reference_docs);
        }

        // Feature Index: details Pfade
        if (content.areas) {
            Object.values(content.areas).forEach((area: any) => {
                if (area.details) refs.push(area.details);
            });
        }

        // Feature Details: sections.files
        if (content.sections && Array.isArray(content.sections.files)) {
            refs.push(...content.sections.files);
        }

        return [...new Set(refs)]; // Eindeutige Werte
    }
}
