"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareAiOnboarding = void 0;
const vscode = require("vscode");
const path = require("path");
async function prepareAiOnboarding() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders)
        return;
    const rootUri = workspaceFolders[0].uri;
    const projectName = path.basename(rootUri.fsPath);
    const briefing = `
# 🤖 MISSION: AI Project Onboarding Briefing

Du bist als AI-Agent beauftragt, das Projekt-Gedächtnis (AIM) für "${projectName}" einzurichten.

## Deine Aufgaben:
1. **Projekt-Scan**: Analysiere den Tech-Stack, die Ordnerstruktur und vorhandene READMEs.
2. **Setup .ai.json**: Falls nicht vorhanden, erstelle eine \`.ai.json\`. Definiere Namen, Beschreibung und erste "Red Lines".
3. **Interview**: Frage den User nach kritischen Projektwahrheiten:
   - "In welcher Phase befindet sich das Projekt (MVP, Beta, Production)?"
   - "Gibt es spezifische Deployment-Ziele oder Umgebungen?"
   - "Welche technologischen Entscheidungen sind 'in Stein gemeißelt'?"
4. **User Preferences**: Falls \`.ai.user-preferences.md\` fehlt, frage:
   - "Wie detailliert sollen meine Erklärungen sein?"
   - "Gibt es einen bevorzugten Coding-Stil (z.B. funktional vs. OOP)?"

## Ziel:
Am Ende dieser Session soll ein stabiler MindLayer existieren, der mir (und anderen Agenten) hilft, präzise und fehlerfrei an diesem Projekt zu arbeiten.

---
*Antworte mit: 'Ich habe das Onboarding-Briefing verstanden und beginne jetzt mit dem Scan.'*
`;
    await vscode.env.clipboard.writeText(briefing);
    vscode.window.showInformationMessage('🎯 Onboarding Briefing copied to clipboard! Paste it into the AI chat to start the process.');
}
exports.prepareAiOnboarding = prepareAiOnboarding;
//# sourceMappingURL=prepareAiOnboarding.js.map