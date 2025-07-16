const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const ignore = require('ignore');

// Log helper
const log = (msg) => process.stdout.write(msg + '\n');

// Utility: Wendet .ai.json.ignore auf angegebene Array-Felder an
function applyIgnoreFilter(data, arrayKeys, ignoreFile = '.ai.json.ignore') {
    const ignorePath = resolve(__dirname, ignoreFile);

    if (!existsSync(ignorePath)) {
        log(`(No ignore file '${ignoreFile}' found, skipping filtering)`);
        return;
    }

    log(`Applying ignore rules from '${ignoreFile}'...`);

    const ig = ignore();
    const ignoreLines = readFileSync(ignorePath, 'utf8').split(/\r?\n/).filter(Boolean);
    ig.add(ignoreLines);

    arrayKeys.forEach((key) => {
        if (Array.isArray(data[key])) {
            const originalLength = data[key].length;
            data[key] = data[key].filter(item => !ig.ignores(item));
            log(`Filtered '${key}': ${originalLength} → ${data[key].length}`);
        }
    });
}

function run() {
    try {
        log('\n🔍 Starting JSON Schema validation...');

        // Load schema
        const schemaPath = resolve(__dirname, 'schema.json');
        const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
        log('✅ Schema loaded');

        // Set up validator
        const ajv = new Ajv({
            allErrors: true,
            verbose: true,
            strictSchema: false
        });
        
        // Add format validators for uri, email etc.
        addFormats(ajv);
        
        const validate = ajv.compile(schema);
        log('✅ Schema compiled');

        // Load target JSON
        const fileToValidate = process.argv[2] || '.ai.json.example';
        const filePath = resolve(__dirname, fileToValidate);
        log(`📄 Validating file: ${filePath}`);
        const data = JSON.parse(readFileSync(filePath, 'utf8'));
        log('✅ File parsed');

        // Optional: apply .ai.json.ignore filter
        applyIgnoreFilter(data, ['file_contexts', 'scan_targets']);

        // Validate
        const valid = validate(data);

        if (!valid) {
            log('\n❌ Validation failed!\n');
            log(JSON.stringify(validate.errors, null, 2));
            process.exit(1);
        }

        log('\n✅ Validation successful!');
        process.exit(0);
    } catch (err) {
        log('\n❌ Validation error:');
        log(`Type: ${err.name}`);
        log(`Message: ${err.message}`);
        log(`Stack: ${err.stack}`);
        process.exit(1);
    }
}

// Start validation
run();
