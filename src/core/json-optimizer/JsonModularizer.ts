import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * JsonModularizer - Klasse für die Modularisierung von .ai.json Dateien
 * Implementiert das neue Referenzsystem und Splitting in Module
 */
export class JsonModularizer {
    private basePath: string;
    private mainFile: string;

    constructor(basePath: string) {
        this.basePath = basePath;
        this.mainFile = path.join(basePath, '.ai.json');
    }

    /**
     * Hauptdatei in Module aufteilen
     */
    async modularize(): Promise<void> {
        const content = await fs.readFile(this.mainFile, 'utf8');
        const json = JSON.parse(content);

        // Erstelle Modulverzeichnis
        const modulesDir = path.join(this.basePath, '.ai-modules');
        await fs.mkdir(modulesDir, { recursive: true });

        // Extrahiere und speichere Module
        const modules = this.extractModules(json);
        for (const [name, data] of Object.entries(modules)) {
            const modulePath = path.join(modulesDir, `${name}.json`);
            await fs.writeFile(modulePath, JSON.stringify(data, null, 2));
        }

        // Aktualisiere Hauptdatei mit Referenzen
        const mainContent = this.createMainFileWithRefs(json, modules);
        await fs.writeFile(this.mainFile, JSON.stringify(mainContent, null, 2));
    }

    /**
     * Module aus der JSON-Struktur extrahieren
     */
    private extractModules(json: any): Record<string, any> {
        const modules: Record<string, any> = {};

        // Extrahiere logische Einheiten in separate Module
        if (json.components) {
            modules['components'] = { components: json.components };
            delete json.components;
        }

        if (json.architecture) {
            modules['architecture'] = { architecture: json.architecture };
            delete json.architecture;
        }

        if (json.features) {
            modules['features'] = { features: json.features };
            delete json.features;
        }

        return modules;
    }

    /**
     * Hauptdatei mit Referenzen erstellen
     */
    private createMainFileWithRefs(json: any, modules: Record<string, any>): any {
        const main = { ...json };

        // Füge Referenzen ein
        for (const [name] of Object.entries(modules)) {
            main[name] = { $ref: `./.ai-modules/${name}.json#/${name}` };
        }

        return main;
    }

    /**
     * Module wieder zusammenführen
     */
    async demodularize(): Promise<void> {
        const modulesDir = path.join(this.basePath, '.ai-modules');
        const mainContent = JSON.parse(await fs.readFile(this.mainFile, 'utf8'));

        // Sammle alle Module
        for (const key of Object.keys(mainContent)) {
            const ref = mainContent[key]?.$ref;
            if (ref) {
                const modulePath = path.join(this.basePath, ref.split('#')[0]);
                const moduleContent = JSON.parse(await fs.readFile(modulePath, 'utf8'));
                mainContent[key] = moduleContent[key];
            }
        }

        // Speichere zusammengeführte Datei
        await fs.writeFile(this.mainFile, JSON.stringify(mainContent, null, 2));
    }
}
