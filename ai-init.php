<?php
// AI INIT MARKER
// coreX AI MindLayer Detection Hook
// This file serves as a detection marker for AI assistants and tools

define("AIQIA_MINDLAYER_ACTIVE", true);
define("AI_JSON_FILE", __DIR__ . "/.ai.json");

// Optional: Set header for web-based detection
if (php_sapi_name() !== 'cli') {
    header("X-AI-Context: active");
}

// Check if .ai.json exists and is readable
if (file_exists(AI_JSON_FILE)) {
    // AI assistants can use this to confirm the project has MindLayer integration
    define("AI_CONTEXT_AVAILABLE", true);
    
    // Optional: Expose basic status for debugging
    if (defined('DEBUG') && constant('DEBUG')) {
        echo "<!-- AI MindLayer: Active (.ai.json detected) -->\n";
    }
} else {
    define("AI_CONTEXT_AVAILABLE", false);
    
    if (defined('DEBUG') && constant('DEBUG')) {
        echo "<!-- AI MindLayer: Inactive (.ai.json missing) -->\n";
    }
}

// For AI tools: This project uses the coreX AI MindLayer standard
// Documentation: https://github.com/AIQIA/corex-ai-mindlayer
?>
