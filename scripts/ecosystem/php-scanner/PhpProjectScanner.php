<?php
/**
 * coreX AI MindLayer - PHP Project Scanner
 * 
 * Standalone-Alternative zum Composer-Plugin für Projekte ohne Composer
 */

/**
 * Scannt ein PHP-Projekt und aktualisiert die .ai.json
 */
class PhpProjectScanner {
    /**
     * Führt den Scan durch
     */
    public function scan() {
        echo "🔍 coreX AI MindLayer - PHP Project Scanner\n";
        
        // Prüfen, ob eine composer.json existiert
        if (file_exists('composer.json')) {
            echo "✓ composer.json gefunden, verarbeite...\n";
            $this->scanWithComposer();
        } else {
            echo "ℹ️ Keine composer.json gefunden. Analysiere Projektstruktur...\n";
            $this->scanWithoutComposer();
        }
    }
    
    /**
     * Scan mit composer.json
     */
    private function scanWithComposer() {
        try {
            $composerContent = file_get_contents('composer.json');
            $composerJson = json_decode($composerContent, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "⚠️ composer.json enthält ungültiges JSON: " . json_last_error_msg() . "\n";
                return;
            }
            
            // .ai.json laden oder erstellen
            $aiJson = $this->loadOrCreateAiJson();
            
            // Projektinformationen übernehmen
            if (isset($composerJson['name'])) {
                $aiJson['project']['name'] = $composerJson['name'];
            }
            
            if (isset($composerJson['description'])) {
                $aiJson['project']['description'] = $composerJson['description'];
            }
            
            if (isset($composerJson['version'])) {
                $aiJson['project']['version'] = $composerJson['version'];
            }
            
            // Dependencies verarbeiten
            if (isset($composerJson['require'])) {
                foreach ($composerJson['require'] as $name => $version) {
                    if ($name === 'php') continue; // PHP-Requirement überspringen
                    
                    $this->addDependency($aiJson, $name, $version, 'composer');
                }
            }
            
            // PHP-Frameworks erkennen
            $this->detectPhpFrameworks($aiJson, $composerJson);
            
            // .ai.json speichern
            $this->saveAiJson($aiJson);
            
            echo "✅ .ai.json wurde mit Composer-Informationen aktualisiert!\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler: " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Scan ohne composer.json
     */
    private function scanWithoutComposer() {
        try {
            // .ai.json laden oder erstellen
            $aiJson = $this->loadOrCreateAiJson();
            
            // Projektname aus Verzeichnis
            $projectName = basename(getcwd());
            $aiJson['project']['name'] = $aiJson['project']['name'] ?? $projectName;
            
            // PHP-Dateien finden
            echo "🔍 Analysiere PHP-Dateien...\n";
            $phpFiles = $this->findPhpFiles('.');
            echo "✓ " . count($phpFiles) . " PHP-Dateien gefunden.\n";
            
            // Framework erkennen
            $this->detectFrameworksFromFiles($aiJson, $phpFiles);
            
            // Namespaces und Klassen analysieren
            $this->analyzePhpStructure($aiJson, $phpFiles);
            
            // .ai.json speichern
            $this->saveAiJson($aiJson);
            
            echo "✅ .ai.json wurde mit Projektinformationen aktualisiert!\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler: " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Lädt die .ai.json oder erstellt eine neue
     */
    private function loadOrCreateAiJson() {
        if (file_exists('.ai.json')) {
            $content = file_get_contents('.ai.json');
            $aiJson = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "⚠️ .ai.json enthält ungültiges JSON. Erstelle neue Datei.\n";
                return $this->createBaseAiJson();
            }
            
            return $aiJson;
        } else {
            echo "ℹ️ Keine .ai.json gefunden. Erstelle neue Datei.\n";
            return $this->createBaseAiJson();
        }
    }
    
    /**
     * Erstellt eine Basis-.ai.json
     */
    private function createBaseAiJson() {
        $projectName = basename(getcwd());
        
        return [
            'project' => [
                'name' => $projectName,
                'description' => 'PHP-Projekt',
                'version' => '0.1.0',
                'type' => 'php-application'
            ],
            'ai_context' => [
                'purpose' => 'AI-unterstützte PHP-Anwendung',
                'key_concepts' => []
            ],
            'architecture' => [
                'components' => [],
                'dependencies' => []
            ],
            'features' => []
        ];
    }
    
    /**
     * Speichert die .ai.json
     */
    private function saveAiJson($aiJson) {
        $content = json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents('.ai.json', $content);
    }
    
    /**
     * Fügt eine Abhängigkeit hinzu
     */
    private function addDependency(&$aiJson, $name, $version, $type) {
        if (!isset($aiJson['architecture']['dependencies'])) {
            $aiJson['architecture']['dependencies'] = [];
        }
        
        // Prüfen, ob Abhängigkeit bereits existiert
        foreach ($aiJson['architecture']['dependencies'] as &$dep) {
            if (isset($dep['name']) && $dep['name'] === $name) {
                $dep['version'] = $version;
                return;
            }
        }
        
        // Neue Abhängigkeit hinzufügen
        $aiJson['architecture']['dependencies'][] = [
            'name' => $name,
            'version' => $version,
            'type' => $type
        ];
    }
    
    /**
     * Erkennt PHP-Frameworks aus composer.json
     */
    private function detectPhpFrameworks(&$aiJson, $composerJson) {
        // Framework-Erkennungs-Logik
        $frameworkDetectors = [
            'laravel' => [
                'packages' => ['laravel/framework', 'laravel/laravel'],
                'name' => 'Laravel',
                'files' => ['artisan', 'bootstrap/app.php']
            ],
            'symfony' => [
                'packages' => ['symfony/symfony', 'symfony/framework-bundle'],
                'name' => 'Symfony',
                'files' => ['bin/console', 'config/bundles.php']
            ],
            'codeigniter' => [
                'packages' => ['codeigniter/framework', 'codeigniter4/framework'],
                'name' => 'CodeIgniter',
                'files' => ['application/config/config.php', 'app/Config/App.php']
            ],
            'wordpress' => [
                'packages' => ['wordpress', 'johnpbloch/wordpress'],
                'name' => 'WordPress',
                'files' => ['wp-config.php', 'wp-content']
            ],
            'drupal' => [
                'packages' => ['drupal/core', 'drupal/drupal'],
                'name' => 'Drupal',
                'files' => ['core/lib/Drupal.php']
            ],
            'corex' => [
                'packages' => ['aiqia/corex', 'aiqia/corex-cms'],
                'name' => 'coreX CMS',
                'files' => ['src/CoreX.php']
            ]
        ];
        
        // Prüfe Frameworks aus Packages
        if (isset($composerJson['require'])) {
            foreach ($frameworkDetectors as $id => $detector) {
                foreach ($detector['packages'] as $package) {
                    if (isset($composerJson['require'][$package])) {
                        $this->addFrameworkFeature($aiJson, $id, $detector['name']);
                        break;
                    }
                }
            }
        }
        
        // Prüfe auch Dateistrukturen
        foreach ($frameworkDetectors as $id => $detector) {
            foreach ($detector['files'] as $file) {
                if (file_exists($file)) {
                    $this->addFrameworkFeature($aiJson, $id, $detector['name']);
                    break;
                }
            }
        }
    }
    
    /**
     * Fügt ein Framework als Feature hinzu
     */
    private function addFrameworkFeature(&$aiJson, $id, $name) {
        if (!isset($aiJson['features'])) {
            $aiJson['features'] = [];
        }
        
        // Prüfen, ob Framework bereits hinzugefügt wurde
        foreach ($aiJson['features'] as $feature) {
            if (isset($feature['id']) && $feature['id'] === "framework-{$id}") {
                return; // Feature existiert bereits
            }
        }
        
        // Feature hinzufügen
        $aiJson['features'][] = [
            'id' => "framework-{$id}",
            'name' => $name,
            'type' => 'framework',
            'category' => 'core',
            'status' => 'active'
        ];
        
        echo "✓ Framework erkannt: {$name}\n";
    }
    
    /**
     * Findet alle PHP-Dateien im Projekt
     */
    private function findPhpFiles($dir) {
        $result = [];
        
        if (!is_dir($dir)) {
            return $result;
        }
        
        $files = scandir($dir);
        
        foreach ($files as $file) {
            if ($file === '.' || $file === '..' || $file === 'vendor' || $file === 'node_modules') {
                continue;
            }
            
            $path = $dir . '/' . $file;
            
            if (is_dir($path)) {
                $result = array_merge($result, $this->findPhpFiles($path));
            } else if (pathinfo($path, PATHINFO_EXTENSION) === 'php') {
                $result[] = $path;
            }
        }
        
        return $result;
    }
    
    /**
     * Erkennt Frameworks aus Dateien
     */
    private function detectFrameworksFromFiles(&$aiJson, $phpFiles) {
        // Einfache Framework-Erkennungs-Heuristik
        $frameworkPatterns = [
            'laravel' => [
                'name' => 'Laravel',
                'patterns' => [
                    'Illuminate\\',
                    'extends Controller',
                    'artisan'
                ]
            ],
            'symfony' => [
                'name' => 'Symfony',
                'patterns' => [
                    'Symfony\\',
                    'extends AbstractController',
                    'kernel.event_subscriber'
                ]
            ],
            'wordpress' => [
                'name' => 'WordPress',
                'patterns' => [
                    'add_action',
                    'add_filter',
                    'wp_enqueue_script'
                ]
            ],
            'corex' => [
                'name' => 'coreX CMS',
                'patterns' => [
                    'CoreX\\',
                    'extends PageClass',
                    'extends CoreXModule'
                ]
            ]
        ];
        
        foreach ($phpFiles as $file) {
            $content = file_get_contents($file);
            
            foreach ($frameworkPatterns as $id => $framework) {
                foreach ($framework['patterns'] as $pattern) {
                    if (strpos($content, $pattern) !== false) {
                        $this->addFrameworkFeature($aiJson, $id, $framework['name']);
                        break 2; // Zu nächstem Framework
                    }
                }
            }
        }
    }
    
    /**
     * Analysiert PHP-Dateien auf Namespaces und Klassen
     */
    private function analyzePhpStructure(&$aiJson, $phpFiles) {
        $components = [];
        $namespaces = [];
        
        foreach ($phpFiles as $file) {
            $content = file_get_contents($file);
            
            // Namespace erkennen
            if (preg_match('/namespace\s+([^;]+);/i', $content, $matches)) {
                $namespace = trim($matches[1]);
                $namespaces[$namespace] = true;
            }
            
            // Klassen erkennen
            if (preg_match('/class\s+(\w+)/i', $content, $matches)) {
                $className = trim($matches[1]);
                
                $component = [
                    'name' => $className,
                    'type' => 'class',
                    'file' => $this->getRelativePath($file)
                ];
                
                if (isset($namespace)) {
                    $component['namespace'] = $namespace;
                }
                
                $components[] = $component;
            }
        }
        
        // Komponenten zur .ai.json hinzufügen
        if (!empty($components) && !isset($aiJson['architecture']['components'])) {
            $aiJson['architecture']['components'] = [];
        }
        
        foreach ($components as $component) {
            $aiJson['architecture']['components'][] = $component;
        }
        
        // Namespaces als Struktur hinzufügen
        if (!empty($namespaces) && !isset($aiJson['architecture']['structure'])) {
            $aiJson['architecture']['structure'] = [
                'namespaces' => array_keys($namespaces)
            ];
        }
    }
    
    /**
     * Gibt den relativen Pfad zurück
     */
    private function getRelativePath($path) {
        return str_replace('\\', '/', str_replace(getcwd() . '/', '', $path));
    }
}

// Script-Ausführung, wenn direkt aufgerufen
if (basename($_SERVER['SCRIPT_FILENAME']) == basename(__FILE__)) {
    $scanner = new PhpProjectScanner();
    $scanner->scan();
}
