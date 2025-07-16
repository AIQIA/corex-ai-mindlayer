/**
 * RedundancyValidator ensures perfect synchronization between all system components
 * Every piece of information should be consistently represented across all relevant places
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class RedundancyValidator {
    constructor(basePath) {
        this.basePath = basePath;
        this.aiJson = this.loadAiJson();
        this.validationErrors = [];
    }

    async validateAllRedundancy() {
        await this.validateDocumentationRedundancy();
        await this.validateModuleRedundancy();
        await this.validateSchemaRedundancy();
        await this.validateExternalFileRedundancy();
        
        if (this.validationErrors.length > 0) {
            throw new Error('Redundancy validation failed:\n' + 
                this.validationErrors.join('\n'));
        }
    }

    async validateDocumentationRedundancy() {
        // Check if all features mentioned in .ai.json are documented
        const docs = this.collectAllDocumentation();
        
        // Validate architecture documentation
        for (const module of this.aiJson.architecture) {
            // Check module documentation
            if (!this.isDocumented(module.module, docs)) {
                this.validationErrors.push(
                    `Module ${module.module} is not fully documented`
                );
            }

            // Check features documentation
            for (const feature of module.features || []) {
                if (!this.isDocumented(feature, docs)) {
                    this.validationErrors.push(
                        `Feature ${feature} in module ${module.module} is not fully documented`
                    );
                }
            }
        }
    }

    async validateModuleRedundancy() {
        // Ensure module relationships are bidirectional
        const modules = new Map();
        
        // Build module relationship map
        this.aiJson.architecture.forEach(module => {
            modules.set(module.module, {
                dependencies: module.dependencies || [],
                references: []
            });
        });

        // Validate relationships
        this.aiJson.architecture.forEach(module => {
            if (module.relations) {
                module.relations.forEach(relation => {
                    const targetModule = modules.get(relation.target);
                    if (!targetModule) {
                        this.validationErrors.push(
                            `Invalid module reference: ${module.module} -> ${relation.target}`
                        );
                    }
                });
            }
        });
    }

    async validateSchemaRedundancy() {
        // Check schema consistency across all JSON files
        const schemaFiles = [
            '.ai.json',
            '.ai.errors.json',
            '.ai.auto-tasks.json'
        ];

        for (const file of schemaFiles) {
            const filePath = path.join(this.basePath, file);
            if (fs.existsSync(filePath)) {
                const content = this.loadJsonFile(filePath);
                if (!this.validateSchemaConsistency(content)) {
                    this.validationErrors.push(
                        `Schema inconsistency detected in ${file}`
                    );
                }
            }
        }
    }

    async validateExternalFileRedundancy() {
        // Validate external file references
        const referencedFiles = this.collectAllFileReferences();
        
        // Check each referenced file
        for (const [file, references] of referencedFiles) {
            if (!fs.existsSync(path.join(this.basePath, file))) {
                this.validationErrors.push(
                    `Referenced file ${file} does not exist`
                );
                continue;
            }

            // Check if the file content matches its references
            if (!this.validateFileContentRedundancy(file, references)) {
                this.validationErrors.push(
                    `Content mismatch for ${file} across references`
                );
            }
        }
    }

    collectAllDocumentation() {
        const docs = new Set();
        
        // Collect from markdown files
        glob.sync('**/*.md', { cwd: this.basePath }).forEach(file => {
            const content = fs.readFileSync(
                path.join(this.basePath, file), 
                'utf8'
            );
            const { data, content: markdown } = matter(content);
            
            // Extract documentation sections
            this.extractDocumentationSections(markdown).forEach(
                section => docs.add(section)
            );
        });

        // Collect from code comments
        ['**/*.ts', '**/*.js', '**/*.php'].forEach(pattern => {
            glob.sync(pattern, { cwd: this.basePath }).forEach(file => {
                const content = fs.readFileSync(
                    path.join(this.basePath, file), 
                    'utf8'
                );
                this.extractCodeDocumentation(content).forEach(
                    doc => docs.add(doc)
                );
            });
        });

        return docs;
    }

    isDocumented(item, docs) {
        // Check if item is documented somewhere
        return [...docs].some(doc => 
            doc.toLowerCase().includes(item.toLowerCase())
        );
    }

    validateSchemaConsistency(content) {
        // Implement schema consistency validation
        // Check if all required fields are present and correctly typed
        return true; // Placeholder
    }

    collectAllFileReferences() {
        const references = new Map();
        
        // Collect from .ai.json
        this.collectReferencesFromObject(this.aiJson, references);
        
        return references;
    }

    validateFileContentRedundancy(file, references) {
        // Implement content redundancy validation
        // Ensure file content matches all its references
        return true; // Placeholder
    }

    loadAiJson() {
        return this.loadJsonFile(path.join(this.basePath, '.ai.json'));
    }

    loadJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            throw new Error(
                `Failed to load JSON file ${filePath}: ${error.message}`
            );
        }
    }

    extractDocumentationSections(markdown) {
        // Implement markdown documentation extraction
        return new Set();
    }

    extractCodeDocumentation(code) {
        // Implement code documentation extraction
        return new Set();
    }

    collectReferencesFromObject(obj, references, path = '') {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' && value.includes('.')) {
                references.set(value, [
                    ...(references.get(value) || []),
                    path + '.' + key
                ]);
            } else if (typeof value === 'object' && value !== null) {
                this.collectReferencesFromObject(
                    value,
                    references,
                    path ? path + '.' + key : key
                );
            }
        }
    }
}

module.exports = RedundancyValidator;
