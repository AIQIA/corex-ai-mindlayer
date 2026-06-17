"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretScanner = void 0;
class SecretScanner {
    /**
     * Scannt den Inhalt nach potenziellen Secrets (API-Keys, Passwörter).
     * Nutzt einfache Heuristiken für den MVP.
     */
    findPotentialSecrets(content) {
        const findings = [];
        // Liste von Mustern für typische API-Keys / Secrets
        const patterns = [
            { name: 'API Key', regex: /(?:key|api|token|secret|auth|password|pwd)["']\s*[:=]\s*["'](?![^"']*[\s])([a-zA-Z0-9\-_]{16,})["']/gi },
            { name: 'Generic Secret', regex: /["'](sk-[a-zA-Z0-9]{20,})["']/g },
            { name: 'Bearer Token', regex: /bearer\s+[a-zA-Z0-9\-\._~+/]+=*/gi }
        ];
        patterns.forEach(p => {
            let match;
            while ((match = p.regex.exec(content)) !== null) {
                // Wir fügen nur den Namen des Treffers hinzu, nicht das Secret selbst
                findings.push(`${p.name} detected (Length: ${match[1]?.length || match[0].length})`);
            }
        });
        return findings;
    }
}
exports.SecretScanner = SecretScanner;
//# sourceMappingURL=secretScanner.js.map