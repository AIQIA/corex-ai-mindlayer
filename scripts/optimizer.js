const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class AiJsonOptimizer {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    async readModules() {
        const aiJson = JSON.parse(fs.readFileSync(path.join(this.rootDir, '.ai.json'), 'utf8'));
        const modules = {};

        for (const module of aiJson.$modules) {
            const modulePath = path.join(this.rootDir, module.$ref);
            const moduleContent = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
            modules[module.name] = moduleContent;
        }

        return modules;
    }

    async compressModules(modules) {
        const compressed = {};
        for (const [name, content] of Object.entries(modules)) {
            const jsonStr = JSON.stringify(content);
            compressed[name] = zlib.gzipSync(jsonStr).toString('base64');
        }
        return compressed;
    }

    async saveCompressed(modules) {
        const outputPath = path.join(this.rootDir, '.ai.modules', 'compressed');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        for (const [name, content] of Object.entries(modules)) {
            fs.writeFileSync(path.join(outputPath, `${name}.gz`), content);
        }
    }

    static async decompress(compressedStr) {
        const buffer = Buffer.from(compressedStr, 'base64');
        return JSON.parse(zlib.gunzipSync(buffer).toString());
    }

    async optimize() {
        console.log('🔍 Reading modules...');
        const modules = await this.readModules();
        
        console.log('🗜️ Compressing modules...');
        const compressed = await this.compressModules(modules);
        
        console.log('💾 Saving compressed modules...');
        await this.saveCompressed(compressed);
        
        console.log('✨ Done! Modules are now compressed.');
    }
}

// If running directly
if (require.main === module) {
    const rootDir = process.cwd();
    const optimizer = new AiJsonOptimizer(rootDir);
    optimizer.optimize().catch(console.error);
}

module.exports = AiJsonOptimizer;
