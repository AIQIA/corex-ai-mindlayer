# AI-INTEGRATION.md

## 🧠 Purpose

This file describes how AI assistants can detect and use the `.ai.json` file as a structured context layer within a developer project.

The goal is to provide intelligent tools with clear, machine-readable insight into project architecture, components, errors, and documentation – enabling more precise code suggestions, explanations, and interactions.

---

## 📁 File Structure

The `.ai.json` file is located in the **root of the project** and uses a modular structure:

1. Main Configuration (`.ai.json`)

   - Contains `$schema` reference
   - Lists all modules in `$modules` array
   - Each module has a `name` and `$ref` to its file

2. Module Files (`.ai.modules/*.json`)
   - Separate JSON files for each component
   - Referenced via `$ref` in main config
   - Organized by functionality

Example structure:

```json
{
  "$schema": "schema.json",
  "$modules": [
    {
      "name": "meta",
      "$ref": ".ai.modules/meta.json"
    },
    {
      "name": "architecture",
      "$ref": ".ai.modules/architecture.json"
    }
  ]
}
```

## 🔄 Processing Instructions

AI assistants should:

1. Parse the main `.ai.json` file
2. Load and validate schema
3. Process each module reference
4. Combine module data into complete context
5. Use the enriched context for:
   - Code completion
   - Architecture understanding
   - Error handling
   - Task awareness
   - Documentation access

## 🛠 Automation Support

The project includes VS Code tasks for:

1. **Validation**

   - Automatic schema validation
   - Module structure verification

2. **Updates**

   - Module file synchronization
   - Real-time change detection

3. **Backups**
   - Automatic backup creation
   - Version retention management
   - Local and global storage
