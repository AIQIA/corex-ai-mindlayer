import { JsonModularizer } from './JsonModularizer';
import { JsonCompressor } from './JsonCompressor';
import { CacheManager } from './CacheManager';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Hauptklasse für die v3.8.0 Performance-Optimierungen
 */
export class JsonOptimizer {
    private modularizer: JsonModularizer;
    private compressor: JsonCompressor;
    private cacheManager: CacheManager;

    constructor(basePath: string) {
        this.modularizer = new JsonModularizer(basePath);
        this.compressor = new JsonCompressor();
        this.cacheManager = new CacheManager(basePath);
    }

    /**
     * Optimierungen initialisieren
     */
    async init(): Promise<void> {
        await this.cacheManager.init();
    }

    /**
     * .ai.json Datei optimieren
     */
    async optimize(filePath: string): Promise<void> {
        // 1. Modularisiere die Datei
        await this.modularizer.modularize();

        // 2. Komprimiere Module
        const modulesDir = path.join(path.dirname(filePath), '.ai-modules');
        const files = await fs.readdir(modulesDir);

        for (const file of files) {
            const inputPath = path.join(modulesDir, file);
            const outputPath = inputPath + '.bin';
            await this.compressor.compress(inputPath, outputPath);
        }

        // 3. Initialisiere Caching
        await this.cacheManager.loadToCache(filePath);
    }

    /**
     * Ressourcen freigeben
     */
    async cleanup(): Promise<void> {
        await this.cacheManager.cleanup();
    }
}
