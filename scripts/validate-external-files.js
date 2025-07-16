/**
 * Validates external files referenced in .ai.json
 * Ensures all external references exist and are valid
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

class ExternalFilesValidator {
    constructor(basePath) {
        this.basePath = basePath;
        this.ajv = new Ajv({ allErrors: true });
    }

    async validateAll() {
        const aiJson = this.loadAiJson();
        
        // Validate external error definitions
        if (aiJson.errors?.[0]?.path) {
            await this.validateErrorsFile(aiJson.errors[0].path);
        }
        
        // Validate auto-tasks file
        if (aiJson.auto_tasks?.path) {
            await this.validateAutoTasksFile(aiJson.auto_tasks.path);
        }
        
        // Validate ignore hierarchy
        await this.validateIgnoreHierarchy();
        
        // Validate all referenced files exist
        await this.validateReferences(aiJson.references);
    }
    
    async validateErrorsFile(path) {
        const errorsSchema = require('./schemas/errors.schema.json');
        const content = this.loadJsonFile(path);
        const valid = this.ajv.validate(errorsSchema, content);
        
        if (!valid) {
            throw new Error(`Invalid errors file: ${JSON.stringify(this.ajv.errors)}`);
        }
    }
    
    async validateAutoTasksFile(path) {
        const tasksSchema = require('./schemas/auto-tasks.schema.json');
        const content = this.loadJsonFile(path);
        const valid = this.ajv.validate(tasksSchema, content);
        
        if (!valid) {
            throw new Error(`Invalid auto-tasks file: ${JSON.stringify(this.ajv.errors)}`);
        }
    }
    
    async validateIgnoreHierarchy() {
        const ignoreManager = new AiIgnoreManager(this.basePath);
        const patterns = await ignoreManager.getAllPatterns();
        
        // Validate pattern syntax
        patterns.forEach(pattern => {
            if (!this.isValidIgnorePattern(pattern)) {
                throw new Error(`Invalid ignore pattern: ${pattern}`);
            }
        });
        
        // Check for conflicts
        const conflicts = this.findPatternConflicts(patterns);
        if (conflicts.length > 0) {
            throw new Error(`Found ignore pattern conflicts: ${conflicts.join(', ')}`);
        }
    }
    
    async validateReferences(references) {
        if (!references) return;
        
        for (const ref of references) {
            if (ref.url && !ref.url.startsWith('http')) {
                const fullPath = path.join(this.basePath, ref.url);
                if (!fs.existsSync(fullPath)) {
                    throw new Error(`Referenced file not found: ${ref.url}`);
                }
            }
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
    
    isValidIgnorePattern(pattern) {
        try {
            new RegExp(pattern.replace(/\*/g, '.*'));
            return true;
        } catch {
            return false;
        }
    }
    
    findPatternConflicts(patterns) {
        const conflicts = [];
        for (let i = 0; i < patterns.length; i++) {
            for (let j = i + 1; j < patterns.length; j++) {
                if (this.patternsConflict(patterns[i], patterns[j])) {
                    conflicts.push(`${patterns[i]} conflicts with ${patterns[j]}`);
                }
            }
        }
        return conflicts;
    }
    
    patternsConflict(pattern1, pattern2) {
        // Implement pattern conflict detection logic
        // e.g., "*.md" conflicts with "!important.md"
        return false; // Placeholder implementation
    }
}

module.exports = ExternalFilesValidator;
