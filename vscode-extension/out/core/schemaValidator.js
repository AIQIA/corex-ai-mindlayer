"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const ajv_1 = require("ajv");
const fs = require("fs");
const path = require("path");
class SchemaValidator {
    constructor() {
        this.schemas = new Map();
        this.ajv = new ajv_1.default({ allErrors: true });
        this.loadSchemas();
    }
    loadSchemas() {
        const schemaDir = path.join(__dirname, '..', 'schemas');
        const schemaFiles = [
            'ai.schema.json',
            'ai.features.index.schema.json',
            'ai.features.details.schema.json'
        ];
        schemaFiles.forEach(file => {
            const filePath = path.join(schemaDir, file);
            if (fs.existsSync(filePath)) {
                const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                this.schemas.set(file, schema);
            }
        });
    }
    validate(fileName, content) {
        let schemaKey = 'ai.schema.json';
        if (fileName.includes('features.index')) {
            schemaKey = 'ai.features.index.schema.json';
        }
        else if (fileName.includes('details')) {
            schemaKey = 'ai.features.details.schema.json';
        }
        const schema = this.schemas.get(schemaKey);
        if (!schema) {
            return { valid: false, errors: [{ message: `Schema ${schemaKey} not found` }] };
        }
        const validate = this.ajv.compile(schema);
        const valid = validate(content);
        return {
            valid: !!valid,
            errors: validate.errors || []
        };
    }
}
exports.SchemaValidator = SchemaValidator;
//# sourceMappingURL=schemaValidator.js.map