import * as vscode from 'vscode';

export class SecretScanner {
    /**
     * Scannt den Inhalt nach potenziellen Secrets (API-Keys, Passwörter).
     * Nutzt einfache Heuristiken für den MVP.
     */
    public findPotentialSecrets(content: string): string[] {
        const findings: string[] = [];
        
        // Liste von Mustern für typische API-Keys / Secrets
        const patterns = [
            { name: 'API Key', regex: /(?:key|api|token|secret|auth|password|pwd)["']\s*[:=]\s*["'](?![^"']*[\s])([a-zA-Z0-9\-_]{16,})["']/gi },
            { name: 'Generic Secret', regex: /["'](sk-[a-zA-Z0-9]{20,})["']/g }, // OpenAI etc.
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
