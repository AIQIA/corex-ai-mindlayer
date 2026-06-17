"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceValidator = void 0;
const fs = require("fs");
const path = require("path");
class ReferenceValidator {
    /**
     * Prüft, ob referenzierte Dateien in einem Dokument existieren.
     * @param workspaceRoot Root des Workspaces
     * @param references Liste von Pfaden (relativ zum Root)
     */
    async validateReferences(workspaceRoot, references) {
        const deadLinks = [];
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
    extractReferences(content) {
        const refs = [];
        // Root: reference_docs
        if (Array.isArray(content.reference_docs)) {
            refs.push(...content.reference_docs);
        }
        // Feature Index: details Pfade
        if (content.areas) {
            Object.values(content.areas).forEach((area) => {
                if (area.details)
                    refs.push(area.details);
            });
        }
        // Feature Details: sections.files
        if (content.sections && Array.isArray(content.sections.files)) {
            refs.push(...content.sections.files);
        }
        return [...new Set(refs)]; // Eindeutige Werte
    }
}
exports.ReferenceValidator = ReferenceValidator;
//# sourceMappingURL=referenceValidator.js.map