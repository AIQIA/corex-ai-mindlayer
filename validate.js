const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { blue, red, green, yellow, bold } = require("colorette");

/**
 * coreX AI MindLayer - CLI Validator V4.0.0
 * Validates AIM JSON files against schemas.
 */

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load Schemas
const schemas = {
  "ai.schema.json": JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "vscode-extension/src/schemas/ai.schema.json"),
      "utf8",
    ),
  ),
  "ai.features.index.schema.json": JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "vscode-extension/src/schemas/ai.features.index.schema.json",
      ),
      "utf8",
    ),
  ),
  "ai.features.details.schema.json": JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "vscode-extension/src/schemas/ai.features.details.schema.json",
      ),
      "utf8",
    ),
  ),
};

// Register schemas
Object.values(schemas).forEach((schema) => {
  if (!ajv.getSchema(schema.$id || schema.title)) {
    ajv.addSchema(schema);
  }
});

function validateFile(filePath) {
  console.log(blue(`\n🔍 Validating ${bold(filePath)}...`));

  if (!fs.existsSync(filePath)) {
    console.error(red(`❌ File not found: ${filePath}`));
    return false;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const fileName = path.basename(filePath);

    let schemaKey = "ai.schema.json";
    if (fileName.includes("features.index")) {
      schemaKey = "ai.features.index.schema.json";
    } else if (fileName.includes("details")) {
      schemaKey = "ai.features.details.schema.json";
    }

    const validate = ajv.compile(schemas[schemaKey]);
    const valid = validate(content);

    if (valid) {
      console.log(green(`✅ ${fileName} is valid according to schema.`));
      return true;
    } else {
      console.error(red(`❌ Validation failed for ${fileName}:`));
      validate.errors.forEach((err) => {
        console.error(
          yellow(`  - ${err.instancePath || "root"} ${err.message}`),
        );
      });
      return false;
    }
  } catch (e) {
    console.error(red(`❌ Error parsing JSON in ${filePath}: ${e.message}`));
    return false;
  }
}

// CLI Entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(yellow("Usage: node validate.js <file1> <file2> ..."));
  process.exit(0);
}

let overallSuccess = true;
args.forEach((file) => {
  if (!validateFile(file)) {
    overallSuccess = false;
  }
});

process.exit(overallSuccess ? 0 : 1);
