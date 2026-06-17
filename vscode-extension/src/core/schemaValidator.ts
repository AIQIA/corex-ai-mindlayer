import * as vscode from 'vscode';
import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

export class SchemaValidator {
    private ajv: Ajv;
    private schemas: Map<string, any> = new Map();

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        this.loadSchemas();
    }

    private loadSchemas() {
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

    public validate(fileName: string, content: any): { valid: boolean, errors: any[] } {
        let schemaKey = 'ai.schema.json';
        if (fileName.includes('features.index')) {
            schemaKey = 'ai.features.index.schema.json';
        } else if (fileName.includes('details')) {
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
