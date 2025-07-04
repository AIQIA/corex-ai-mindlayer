# AI-INTEGRATION.md

## 🧠 Purpose

This file describes how AI assistants can detect and use the `.ai.json` file as a structured context layer within a developer project.

The goal is to provide intelligent tools with clear, machine-readable insight into project architecture, components, errors, and documentation – enabling more precise code suggestions, explanations, and interactions.

---

## 📁 File Location

The `.ai.json` file is located in the **root of the project**.

If present, AI assistants should:

1. Parse the file as JSON
2. Read all top-level fields (`meta`, `architecture`, `errors`, `tasks`, `context`, `references`)
3. Use that data to enrich code completion, explanation, and navigation

---

## 🔍 Detection Mechanism

To support automatic detection, a helper script (optional):

### `ai-init.php`

```php
<?php
// AI INIT MARKER
define("AIQIA_MINDLAYER_ACTIVE", true);
define("AI_JSON_FILE", __DIR__ . "/.ai.json");

// Optional: validation and assistant-specific flags
if (file_exists(AI_JSON_FILE)) {
    header("X-AI-Context: active");
    // You may echo metadata for debug
}
?>
