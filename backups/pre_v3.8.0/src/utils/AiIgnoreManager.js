const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

class AiIgnoreManager {
    constructor(basePath) {
        this.basePath = basePath;
        this.ignoreCache = new Map();
        this.patterns = this.loadPatternsConfig();
    }

    loadPatternsConfig() {
        const patternsPath = path.join(this.basePath, '.ai.ignore.docs', 'patterns.json');
        if (fs.existsSync(patternsPath)) {
            return JSON.parse(fs.readFileSync(patternsPath, 'utf8'));
        }
        return { patterns: {}, globalDefaults: { patterns: [] } };
    }

    getIgnoreForPath(dirPath) {
        if (this.ignoreCache.has(dirPath)) {
            return this.ignoreCache.get(dirPath);
        }

        const ig = ignore();
        
        // Add global defaults
        ig.add(this.patterns.globalDefaults.patterns);

        // Collect all .ai.json.ignore files from root to target directory
        let currentPath = this.basePath;
        const relativePath = path.relative(this.basePath, dirPath);
        const pathParts = relativePath.split(path.sep);

        pathParts.forEach(part => {
            currentPath = path.join(currentPath, part);
            const ignoreFile = path.join(currentPath, '.ai.json.ignore');
            
            if (fs.existsSync(ignoreFile)) {
                const content = fs.readFileSync(ignoreFile, 'utf8')
                    .split('\n')
                    .filter(line => line.trim() && !line.startsWith('#'));
                ig.add(content);
            }
        });

        this.ignoreCache.set(dirPath, ig);
        return ig;
    }

    shouldIgnore(filePath) {
        const dirPath = path.dirname(filePath);
        const ig = this.getIgnoreForPath(dirPath);
        const relativePath = path.relative(this.basePath, filePath);
        return ig.ignores(relativePath);
    }

    getIgnoreReason(filePath) {
        const relativePath = path.relative(this.basePath, filePath);
        
        for (const [category, config] of Object.entries(this.patterns.patterns)) {
            if (config.patterns.some(pattern => 
                ignore().add(pattern).ignores(relativePath)
            )) {
                return {
                    category,
                    reason: config.reason,
                    impact: config.impact,
                    requiresReview: config.reviewRequired
                };
            }
        }
        
        return null;
    }

    validateIgnore(filePath) {
        const reason = this.getIgnoreReason(filePath);
        if (reason && reason.requiresReview) {
            console.warn(`Warning: Ignoring '${filePath}' requires review:`);
            console.warn(`Category: ${reason.category}`);
            console.warn(`Reason: ${reason.reason}`);
            console.warn(`Impact: ${reason.impact}`);
        }
    }
}

module.exports = AiIgnoreManager;
