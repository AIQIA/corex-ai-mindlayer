<?php
/**
 * coreX AI MindLayer - Initial Setup & .ai.json Generator
 * 
 * Creates a basic .ai.json structure with setup state tracking.
 * The AI assistant will handle the advanced configuration after initial setup.
 * 
 * Usage: php ai-init.php
 * 
 * @author Sascha Buscher - AIQIA
 * @version 3.8.2
 */

class AIMInitializer {
    // Grundlegende Projekt-Konfiguration
    private $projectPath;
    private $projectName;
    private $configFile = '.ai.json.config';
    private $aiJsonFile = '.ai.json';
    
    // Extension-spezifische Konfiguration
    private $extensionConfig = [
        'eventFile' => '.ai.modules/extension.event.json',
        'eventType' => 'ai.mindlayer.event',
        'commands' => [
            'analyze' => 'CoreX: Analyze AI Configuration',
            'openChat' => 'github.copilot.openChatView'
        ],
        'ui' => [
            'buttonLabel' => 'AI Analysis',
            'statusBarId' => 'aiMindlayer.status'
        ]
    ];
    
    // Basis-Module für die .ai.json
    private $baseModules = [
        'meta',
        'architecture',
        'errors',
        'auto_tasks',
        'ml',
        'context'
    ];

    public function __construct($path = '.') {
        $this->projectPath = realpath($path);
        $this->projectName = basename($this->projectPath);
        echo "🚀 coreX AI MindLayer - Initial Setup\n";
        echo "📁 Project: " . $this->projectName . "\n\n";
    }

    /**
     * Main setup flow
     */
    public function setup() {
        // Prüfe Setup-Status
        $setupState = $this->checkSetupState();
        
        if ($setupState['initialized'] && !$this->confirmOverwrite()) {
            echo "❌ Setup abgebrochen. Bestehende Konfiguration wird beibehalten.\n";
            return;
        }

        $this->createDirectories();
        $this->createInitialConfig();
        $this->createBaseModules();
        $this->createInitialAiJson();
        $this->updateSetupState('initialized', true);
        
        // Starte KI-Assistenten Setup
        $this->initiateAIAssistant();
    }

    /**
     * Prüft den aktuellen Setup-Status
     */
    private function checkSetupState() {
        $configPath = $this->projectPath . '/' . $this->configFile;
        if (file_exists($configPath)) {
            return json_decode(file_get_contents($configPath), true) ?: [
                'initialized' => false,
                'aiAssistantSetup' => false,
                'lastUpdate' => null
            ];
        }
        return [
            'initialized' => false,
            'aiAssistantSetup' => false,
            'lastUpdate' => null
        ];
    }

    /**
     * Aktualisiert den Setup-Status
     */
    private function updateSetupState($key, $value) {
        $configPath = $this->projectPath . '/' . $this->configFile;
        $config = $this->checkSetupState();
        $config[$key] = $value;
        $config['lastUpdate'] = date('Y-m-d H:i:s');
        file_put_contents($configPath, json_encode($config, JSON_PRETTY_PRINT));
    }

    /**
     * Fragt den Benutzer nach Bestätigung zum Überschreiben
     */
    private function confirmOverwrite() {
        echo "⚠️ WARNUNG: Eine bestehende AI MindLayer Konfiguration wurde gefunden!\n";
        echo "Möchten Sie die bestehende Konfiguration überschreiben? (j/N): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        return strtolower(trim($line)) === 'j';
    }

    /**
     * Erstellt notwendige Verzeichnisse
     */
    private function createDirectories() {
        echo "📂 Erstelle Verzeichnisse...\n";
        
        $dirs = [
            '.ai.modules',
            '.ai.backup',
            '.ai.cache'
        ];
        
        foreach ($dirs as $dir) {
            $path = $this->projectPath . '/' . $dir;
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
                echo "  ✓ Erstellt: $dir\n";
            }
        }
    }

    /**
     * Erstellt initiale Konfigurationsdatei
     */
    private function createInitialConfig() {
        echo "\n⚙️ Erstelle initiale Konfiguration...\n";
        
        $config = [
            'initialized' => false,
            'aiAssistantSetup' => false,
            'lastUpdate' => date('Y-m-d H:i:s'),
            'version' => '3.8.2',
            'projectName' => $this->projectName,
            'setupDate' => date('Y-m-d'),
            'environment' => [
                'php' => PHP_VERSION,
                'os' => PHP_OS,
                'encoding' => mb_internal_encoding()
            ]
        ];

        $configPath = $this->projectPath . '/' . $this->configFile;
        file_put_contents($configPath, json_encode($config, JSON_PRETTY_PRINT));
        echo "  ✓ Konfigurationsdatei erstellt\n";
    }

    /**
     * Erstellt Basis-Module
     */
    private function createBaseModules() {
        echo "\n📄 Erstelle Basis-Module...\n";
        
        foreach ($this->baseModules as $module) {
            $path = $this->projectPath . '/.ai.modules/' . $module . '.json';
            if (!file_exists($path)) {
                $template = $this->getModuleTemplate($module);
                file_put_contents($path, json_encode($template, JSON_PRETTY_PRINT));
                echo "  ✓ Erstellt: $module.json\n";
            }
        }
    }

    /**
     * Liefert Template für Module
     */
    private function getModuleTemplate($module) {
        $templates = [
            'meta' => [
                'project' => $this->projectName,
                'created' => date('Y-m-d'),
                'updated' => date('Y-m-d'),
                'status' => 'initial'
            ],
            'architecture' => [
                'components' => [],
                'dependencies' => [],
                'patterns' => [],
                'status' => 'pending_ai_analysis'
            ],
            'errors' => [
                'patterns' => [],
                'solutions' => [],
                'history' => [],
                'status' => 'collecting'
            ],
            'auto_tasks' => [
                'tasks' => [],
                'workflows' => [],
                'scheduler' => [
                    'enabled' => false,
                    'interval' => '1h'
                ]
            ],
            'ml' => [
                'enabled' => true,
                'features' => [],
                'models' => [],
                'training' => [
                    'autoUpdate' => true,
                    'interval' => '24h'
                ]
            ],
            'context' => [
                'enabled' => true,
                'mode' => 'smart',
                'scope' => 'project',
                'retention' => '30d'
            ]
        ];
        
        return $templates[$module] ?? [];
    }

    /**
     * Erstellt initiale .ai.json
     */
    private function createInitialAiJson() {
        echo "\n🔧 Erstelle .ai.json...\n";
        
        $aiJson = [
            '$schema' => './schema.json',
            '$modules' => array_map(function($module) {
                return [
                    'name' => $module,
                    '$ref' => "./.ai.modules/$module.json",
                    'loadPriority' => $module === 'meta' ? 'high' : 'medium'
                ];
            }, $this->baseModules),
            'performance' => [
                'storage' => [
                    'mode' => 'modular',
                    'compression' => true,
                    'lazyLoading' => true
                ],
                'monitoring' => [
                    'enabled' => true,
                    'metrics' => ['memory', 'loadTime']
                ]
            ],
            'contextManagement' => [
                'enabled' => true,
                'mode' => 'smart',
                'resources' => [
                    'maxMemoryUsage' => '512MB',
                    'cleanupInterval' => '24h'
                ]
            ],
            'aiAssistant' => [
                'enabled' => true,
                'mode' => 'proactive',
                'preferences' => [
                    'language' => 'de',
                    'style' => 'collaborative',
                    'detailLevel' => 'detailed'
                ]
            ]
        ];
        
        // Backup existierende .ai.json falls vorhanden
        if (file_exists($this->projectPath . '/' . $this->aiJsonFile)) {
            $backupPath = $this->projectPath . '/.ai.backup/ai.json.' . date('Y-m-d-His');
            copy($this->projectPath . '/' . $this->aiJsonFile, $backupPath);
            echo "  ✓ Backup erstellt: " . basename($backupPath) . "\n";
        }

        file_put_contents($this->projectPath . '/' . $this->aiJsonFile, json_encode($aiJson, JSON_PRETTY_PRINT));
        echo "  ✓ .ai.json erstellt\n";
    }

    /**
     * Startet das KI-Assistenten Setup
     */
    private function initiateAIAssistant() {
        echo "\n🤖 Starte KI-Assistenten Setup...\n";
        
        // Erstelle Extension Event Datei
        $extensionEvent = [
            'type' => $this->extensionConfig['eventType'],
            'action' => 'initiate_ai_analysis',
            'timestamp' => time(),
            'data' => [
                'projectName' => $this->projectName,
                'projectPath' => $this->projectPath,
                'configFile' => $this->configFile,
                'aiJsonFile' => $this->aiJsonFile,
                'prompt' => "Bitte analysiere und optimiere die .ai.json für das Projekt '" . $this->projectName . "'",
                'modules' => $this->baseModules,
                'version' => '3.8.2'
            ],
            'ui' => $this->extensionConfig['ui']
        ];

        // Speichere Event für die Extension
        file_put_contents(
            $this->projectPath . '/' . $this->extensionConfig['eventFile'],
            json_encode($extensionEvent, JSON_PRETTY_PRINT)
        );
        
        // Markiere den Status als bereit für KI-Setup
        $this->updateSetupState('readyForAI', true);
        $this->updateSetupState('extensionEvent', $extensionEvent);
        
        // Ausgabe für den Benutzer
        echo "\n📋 Nächste Schritte:\n";
        echo "1. Öffnen Sie VS Code in diesem Verzeichnis:\n";
        echo "   code .\n";
        echo "2. Die CoreX AI MindLayer Extension wird automatisch aktiviert\n";
        echo "3. Klicken Sie auf den '{$this->extensionConfig['ui']['buttonLabel']}' Button in der Seitenleiste\n";
        echo "   oder nutzen Sie den Befehl '{$this->extensionConfig['commands']['analyze']}'\n\n";
        echo "✨ Tipp: Die Extension zeigt den Setup-Status in der Statusleiste an!\n";
    }
}

// Prüfe ob der Aufruf von der Extension kommt
if (php_sapi_name() === 'cli' && isset($_SERVER['COREX_EXTENSION_TOKEN'])) {
    // Validiere Extension Token
    $validToken = $_SERVER['COREX_EXTENSION_TOKEN'] === 'your-secure-token';
    
    if ($validToken) {
        $initializer = new AIMInitializer();
        $initializer->setup();
    } else {
        echo "❌ Ungültiger Extension Token. Setup muss über die CoreX AI MindLayer Extension gestartet werden.\n";
        exit(1);
    }
} else {
    // Fallback mit Installationshinweis
    if (php_sapi_name() === 'cli') {
        echo "\n❌ Setup kann nur über die CoreX AI MindLayer Extension ausgeführt werden!\n\n";
        echo "🔧 Installation:\n";
        echo "1. Öffnen Sie VS Code\n";
        echo "2. Installieren Sie die 'CoreX AI MindLayer' Extension\n";
        echo "3. Öffnen Sie die Command Palette (Strg+Shift+P)\n";
        echo "4. Führen Sie 'CoreX: Initialize Project' aus\n\n";
        exit(1);
    } else {
        echo "<!DOCTYPE html><html><head><title>AI MindLayer Setup</title></head><body>";
        echo "<h1>🤖 coreX AI MindLayer</h1>";
        echo "<p>Dieses Setup muss über die VS Code Extension durchgeführt werden:</p>";
        echo "<ol>";
        echo "<li>Installieren Sie die 'CoreX AI MindLayer' Extension in VS Code</li>";
        echo "<li>Öffnen Sie die Command Palette (Strg+Shift+P)</li>";
        echo "<li>Führen Sie 'CoreX: Initialize Project' aus</li>";
        echo "</ol>";
        echo "</body></html>";
    }
}