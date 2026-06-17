<?php
/**
 * coreX AI MindLayer - Initial Setup & .ai.json Generator
 * 
 * Creates a basic .ai.json structure following the "Compass, not Chronicle" principle.
 * Version 4.0.0 (Modular & Lightweight)
 * 
 * Usage: php ai-init.php
 * 
 * @author Sascha Buscher - AIQIA
 * @version 4.0.0
 */

class AIMInitializer {
    private $projectPath;
    private $projectName;
    private $aiJsonFile = '.ai.json';
    private $exampleFile = '.ai.json.example';
    private $schemaUrl = 'https://raw.githubusercontent.com/AIQIA/corex-ai-mindlayer/main/vscode-extension/src/schemas/ai.schema.json';

    public function __construct($path = '.') {
        $this->projectPath = realpath($path);
        $this->projectName = basename($this->projectPath);
        echo "🚀 coreX AI MindLayer - V4.0.0 Setup\n";
        echo "📁 Project: " . $this->projectName . "\n\n";
    }

    public function setup() {
        if ($this->checkExists()) {
            if (!$this->confirmOverwrite()) {
                echo "❌ Setup abgebrochen.\n";
                return;
            }
        }

        $this->createInitialAiJson();
        $this->createExample();
        
        echo "\n✨ AIM V4.0.0 wurde erfolgreich initialisiert!\n";
        echo "👉 Nächster Schritt: Öffnen Sie das Projekt in VS Code und nutzen Sie 'AIM: Prepare AI Onboarding Briefing'\n";
    }

    private function checkExists() {
        return file_exists($this->projectPath . DIRECTORY_SEPARATOR . $this->aiJsonFile);
    }

    private function confirmOverwrite() {
        echo "⚠️ WARNUNG: .ai.json existiert bereits!\n";
        echo "Überschreiben? (j/N): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        return strtolower(trim($line)) === 'j';
    }

    private function createInitialAiJson() {
        $template = [
            '$schema' => $this->schemaUrl,
            '_meta' => [
                'version' => '1.0.0',
                'last_updated' => date('Y-m-d')
            ],
            'project' => [
                'name' => $this->projectName,
                'description' => 'Initialisiert via ai-init.php',
                'version' => '1.0.0',
                'tech_stack' => []
            ],
            'red_lines' => [
                'Keep the project memory clean and modular',
                'Follow existing architecture patterns'
            ],
            'workflow' => new stdClass(),
            'architecture' => new stdClass(),
            'reference_docs' => ['README.md'],
            'user_preferences' => [
                'language' => 'de',
                'communication_style' => 'technisch',
                'technical_depth' => 'detailliert'
            ]
        ];

        file_put_contents(
            $this->projectPath . DIRECTORY_SEPARATOR . $this->aiJsonFile, 
            json_encode($template, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
        echo "  ✓ .ai.json erstellt\n";
    }

    private function createExample() {
        if (!file_exists($this->projectPath . DIRECTORY_SEPARATOR . $this->exampleFile)) {
            copy(
                $this->projectPath . DIRECTORY_SEPARATOR . $this->aiJsonFile,
                $this->projectPath . DIRECTORY_SEPARATOR . $this->exampleFile
            );
            echo "  ✓ .ai.json.example erstellt\n";
        }
    }
}

// CLI Execution
if (php_sapi_name() === 'cli') {
    $initializer = new AIMInitializer();
    $initializer->setup();
} else {
    echo "<h1>🤖 coreX AI MindLayer V4.0.0</h1>";
    echo "<p>Bitte führen Sie dieses Skript über die Kommandozeile aus: <code>php ai-init.php</code></p>";
}
