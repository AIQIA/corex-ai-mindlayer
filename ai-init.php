<?php
/**
 * ai-init.php
 * Initialisiert und signalisiert die Anwesenheit einer .ai.json-Datei im Projekt.
 * Dient als Erkennungsmarker für KI-Assistenten wie ChatGPT, CoPilot, Cody etc.
 *
 * @author AIQIA / aiqia.de
 * @since 2025-07-04
 */

define("AIQIA_MINDLAYER_ACTIVE", true);
define("AI_JSON_PATH", __DIR__ . "/ai.json");

$isJson = isset($_GET["json"]) || strpos($_SERVER["HTTP_ACCEPT"] ?? "", "application/json") !== false;

if (file_exists(AI_JSON_PATH)) {
    header("X-AI-Context: active");
    header("X-AI-Version: 1.0");

    if ($isJson) {
        echo json_encode([
            "status" => "MindLayer active",
            "ai_json_found" => true,
            "version" => "1.0.0",
            "project" => "coreX AI MindLayer",
            "powered_by" => "AIQIA / aiqia.de"
        ], JSON_PRETTY_PRINT);
    } else {
        echo "<h2 style='font-family:sans-serif;color:green;'>🧠 coreX AI MindLayer aktiv</h2>";
        echo "<p>Die <code>ai.json</code> wurde erfolgreich erkannt.</p>";
        echo "<p><strong>Projekt:</strong> coreX AI MindLayer</p>";
        echo "<p><strong>Status:</strong> <span style='color:green;'>Aktiv</span></p>";
        echo "<p><strong>Quelle:</strong> <code>ai.json</code></p>";
    }
} else {
    http_response_code(404);
    if ($isJson) {
        echo json_encode([
            "status" => "MindLayer inactive",
            "ai_json_found" => false
        ], JSON_PRETTY_PRINT);
    } else {
        echo "<h2 style='font-family:sans-serif;color:red;'>⚠️ MindLayer nicht aktiv</h2>";
        echo "<p>Keine <code>ai.json</code>-Datei im Projekt gefunden.</p>";
        echo "<p>Status: <span style='color:red;'>Inaktiv</span></p>";
    }
}