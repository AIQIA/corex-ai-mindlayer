<?php
/**
 * coreX AI MindLayer - Standalone Composer Plugin
 * 
 * Diese Datei bietet eine Standalone-Alternative zum Composer-Plugin
 * für Projekte, die composer.json haben aber kein Composer selbst
 */

/**
 * Führt die Hauptfunktionen des Composer Plugins aus ohne Abhängigkeit von Composer
 */
class StandaloneComposerPlugin {
    /**
     * Führt den Plugin aus
     */
    public function run(): void {
        echo "🔍 coreX AI MindLayer - Standalone Composer Plugin\n";
        
        // Prüfen, ob eine composer.json existiert
        if (!file_exists('composer.json')) {
            echo "❌ Keine composer.json gefunden. Abbruch.\n";
            return;
        }
        
        $this->updateAiJson();
    }
    
    /**
     * Aktualisiert die .ai.json mit Informationen aus composer.json
     */
    private function updateAiJson(): void {
        // Prüfen ob composer.json existiert
        if (!file_exists('composer.json')) {
            echo "❌ Keine composer.json gefunden. Überspringe...\n";
            return;
        }
        
        // Prüfen ob .ai.json existiert
        if (!file_exists('.ai.json')) {
            echo "ℹ️ Keine .ai.json gefunden. Erstelle neue Datei.\n";
            $this->createAiJson();
            return;
        }
        
        try {
            // composer.json laden und validieren
            $composerContent = file_get_contents('composer.json');
            if ($composerContent === false) {
                throw new RuntimeException('composer.json konnte nicht gelesen werden');
            }
            
            $composerJson = json_decode($composerContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('composer.json enthält ungültiges JSON: ' . json_last_error_msg());
            }
            
            // .ai.json laden und validieren
            $aiContent = file_exists('.ai.json') ? file_get_contents('.ai.json') : '{}';
            if ($aiContent === false) {
                throw new RuntimeException('.ai.json konnte nicht gelesen werden');
            }
            
            $aiJson = json_decode($aiContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('.ai.json enthält ungültiges JSON: ' . json_last_error_msg());
            }
            
            // Sicherstellen, dass die Grundstruktur existiert
            if (!isset($aiJson['project'])) {
                $aiJson['project'] = [];
            }
            
            if (!isset($aiJson['architecture'])) {
                $aiJson['architecture'] = [];
            }
            
            if (!isset($aiJson['architecture']['dependencies'])) {
                $aiJson['architecture']['dependencies'] = [];
            }
            
            // Projektinformationen übernehmen
            if (isset($composerJson['name']) && !isset($aiJson['project']['name'])) {
                $aiJson['project']['name'] = $composerJson['name'];
            }
            
            if (isset($composerJson['description']) && !isset($aiJson['project']['description'])) {
                $aiJson['project']['description'] = $composerJson['description'];
            }
            
            if (isset($composerJson['version'])) {
                $aiJson['project']['version'] = $composerJson['version'];
            }
            
            // Abhängigkeiten aktualisieren
            $dependencies = &$aiJson['architecture']['dependencies'];
            
            // require Dependencies
            if (isset($composerJson['require'])) {
                foreach ($composerJson['require'] as $name => $version) {
                    // Skip php requirement
                    if ($name === 'php') {
                        continue;
                    }
                    
                    $found = false;
                    foreach ($dependencies as &$dep) {
                        if (isset($dep['name']) && $dep['name'] === $name) {
                            $dep['version'] = $version;
                            $found = true;
                            break;
                        }
                    }
                    
                    if (!$found) {
                        $dependencies[] = [
                            'name' => $name,
                            'version' => $version,
                            'type' => 'composer'
                        ];
                    }
                }
            }
            
            // PHP-Frameworks erkennen
            $this->detectPhpFrameworks($aiJson, $composerJson);
            
            // .ai.json speichern
            $result = file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            if ($result === false) {
                throw new RuntimeException('Konnte .ai.json nicht schreiben');
            }
            
            echo "✅ .ai.json wurde aktualisiert!\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler beim Aktualisieren der .ai.json: " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Erstellt eine neue .ai.json-Datei
     */
    private function createAiJson(): void {
        try {
            // composer.json laden und validieren
            $composerContent = file_get_contents('composer.json');
            if ($composerContent === false) {
                throw new RuntimeException('composer.json konnte nicht gelesen werden');
            }
            
            $composerJson = json_decode($composerContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('composer.json enthält ungültiges JSON: ' . json_last_error_msg());
            }
            
            $aiJson = [
                'project' => [
                    'name' => $composerJson['name'] ?? basename(getcwd()),
                    'description' => $composerJson['description'] ?? 'PHP-Projekt mit AI-Integration',
                    'version' => $composerJson['version'] ?? '0.1.0',
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
            
            // PHP-Frameworks erkennen
            $this->detectPhpFrameworks($aiJson, $composerJson);
            
            // .ai.json speichern
            $result = file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            if ($result === false) {
                throw new RuntimeException('Konnte .ai.json nicht schreiben');
            }
            
            echo "✅ Neue .ai.json erstellt!\n";
            
        } catch (Exception $e) {
            echo "❌ Fehler beim Erstellen der .ai.json: " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Erkennt PHP-Frameworks basierend auf Composer-Abhängigkeiten
     * 
     * @param array &$aiJson Die .ai.json Daten
     * @param array $composerJson Die composer.json Daten
     */
    private function detectPhpFrameworks(array &$aiJson, array $composerJson): void {
        if (!isset($aiJson['features'])) {
            $aiJson['features'] = [];
        }
        
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
        
        // Prüfe Frameworks
        $detectedFrameworks = [];
        
        if (isset($composerJson['require'])) {
            foreach ($frameworkDetectors as $id => $detector) {
                foreach ($detector['packages'] as $package) {
                    if (isset($composerJson['require'][$package])) {
                        $detectedFrameworks[$id] = $detector;
                        break;
                    }
                }
            }
        }
        
        // Prüfe auch Dateistrukturen
        foreach ($frameworkDetectors as $id => $detector) {
            if (isset($detectedFrameworks[$id])) {
                continue;
            }
            
            foreach ($detector['files'] as $file) {
                if (file_exists($file)) {
                    $detectedFrameworks[$id] = $detector;
                    break;
                }
            }
        }
        
        // Füge erkannte Frameworks zu Features hinzu
        foreach ($detectedFrameworks as $id => $detector) {
            // Prüfe, ob Framework bereits in Features vorhanden ist
            $exists = false;
            foreach ($aiJson['features'] as $feature) {
                if (isset($feature['id']) && $feature['id'] === "framework-{$id}") {
                    $exists = true;
                    break;
                }
            }
            
            if (!$exists) {
                $aiJson['features'][] = [
                    'id' => "framework-{$id}",
                    'name' => $detector['name'],
                    'type' => 'framework',
                    'category' => 'core',
                    'status' => 'active'
                ];
                
                echo "✓ Framework erkannt: {$detector['name']}\n";
            }
        }
    }
}

// Starte das Plugin
$plugin = new StandaloneComposerPlugin();
$plugin->run();
