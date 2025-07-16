/**
 * Validates the actual project structure against .ai.json declarations
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ProjectStructureValidator {
    constructor(basePath) {
        this.basePath = basePath;
        this.aiJson = this.loadAiJson();
    }

    async validateAll() {
        await this.validateArchitecture();
        await this.validateDependencies();
        await this.validateEntryPoints();
        await this.validateEcosystem();
    }
    
    async validateArchitecture() {
        for (const module of this.aiJson.architecture) {
            // Validate module entry points exist
            for (const entrypoint of module.entrypoints) {
                const fullPath = path.join(this.basePath, entrypoint);
                if (!fs.existsSync(fullPath)) {
                    throw new Error(`Module ${module.module} entrypoint not found: ${entrypoint}`);
                }
            }
            
            // Validate module dependencies are installed
            if (module.dependencies) {
                await this.validateModuleDependencies(module);
            }
        }
    }
    
    async validateDependencies() {
        // Check package.json dependencies
        const packageJson = this.loadJsonFile('package.json');
        const outdated = await this.checkOutdatedDependencies(packageJson.dependencies);
        if (outdated.length > 0) {
            throw new Error(`Outdated dependencies found: ${outdated.join(', ')}`);
        }
        
        // Check composer.json dependencies
        if (fs.existsSync('composer.json')) {
            const composerJson = this.loadJsonFile('composer.json');
            const outdatedComposer = await this.checkOutdatedComposerDependencies(composerJson.require);
            if (outdatedComposer.length > 0) {
                throw new Error(`Outdated Composer dependencies found: ${outdatedComposer.join(', ')}`);
            }
        }
    }
    
    async validateEntryPoints() {
        // Validate each entrypoint in the architecture
        for (const module of this.aiJson.architecture) {
            for (const entrypoint of module.entrypoints) {
                const fullPath = path.join(this.basePath, entrypoint);
                if (!fs.existsSync(fullPath)) {
                    throw new Error(`Entrypoint not found: ${entrypoint}`);
                }
                
                // Check file permissions
                const stats = fs.statSync(fullPath);
                if (entrypoint.endsWith('.php') && !stats.mode.toString(8).endsWith('755')) {
                    throw new Error(`PHP entrypoint ${entrypoint} should have 755 permissions`);
                }
            }
        }
    }
    
    async validateEcosystem() {
        const ecosystem = this.aiJson.meta.ecosystem;
        for (const [key, value] of Object.entries(ecosystem)) {
            const fullPath = path.join(this.basePath, value);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Ecosystem path not found: ${key} -> ${value}`);
            }
        }
    }
    
    async validateModuleDependencies(module) {
        for (const dep of module.dependencies) {
            if (dep.startsWith('PHP >= ')) {
                const version = dep.replace('PHP >= ', '');
                if (!this.checkPhpVersion(version)) {
                    throw new Error(`PHP version requirement not met: ${dep}`);
                }
            } else if (dep === 'Node.js') {
                if (!this.checkNodeVersion()) {
                    throw new Error('Node.js requirement not met');
                }
            }
            // Add more dependency checks as needed
        }
    }
    
    loadAiJson() {
        return this.loadJsonFile(path.join(this.basePath, '.ai.json'));
    }
    
    loadJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            throw new Error(`Failed to load JSON file ${filePath}: ${error.message}`);
        }
    }
    
    async checkOutdatedDependencies(dependencies) {
        // Implement npm outdated check
        return [];
    }
    
    async checkOutdatedComposerDependencies(dependencies) {
        // Implement composer outdated check
        return [];
    }
    
    checkPhpVersion(requiredVersion) {
        // Implement PHP version check
        return true;
    }
    
    checkNodeVersion() {
        // Implement Node.js version check
        return true;
    }
}

module.exports = ProjectStructureValidator;
