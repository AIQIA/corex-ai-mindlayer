const Ajv = require('ajv');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// Direct process output
const log = (msg) => {
    process.stdout.write(msg + '\n');
};

function run() {
    try {
        log('\nStarting JSON Schema validation...');
        
        // Load schema
        log('Loading schema...');
        const schemaPath = resolve(__dirname, 'schema.json');
        const schemaContent = readFileSync(schemaPath, 'utf8');
        const schema = JSON.parse(schemaContent);
        log('Schema loaded successfully');

        // Set up validator
        const ajv = new Ajv({
            allErrors: true,
            verbose: true,
            strictSchema: false
        });
        
        const validate = ajv.compile(schema);
        log('Schema compiled successfully');

        // Load target file
        const fileToValidate = process.argv[2] || '.ai.json.example';
        const filePath = resolve(__dirname, fileToValidate);
        log(`Validating file: ${filePath}`);
        
        const fileContent = readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        log('File loaded successfully');

        // Validate
        const valid = validate(data);

        if (!valid) {
            log('\n❌ Validation failed!');
            log('\nErrors found:');
            log(JSON.stringify(validate.errors, null, 2));
            process.exit(1);
        }

        log('\n✅ Validation successful!');
        process.exit(0);

    } catch (error) {
        log('\n❌ Validation error:');
        log(`Type: ${error.name}`);
        log(`Message: ${error.message}`);
        log(`Stack: ${error.stack}`);
        process.exit(1);
    }
}

// Start validation
run();
