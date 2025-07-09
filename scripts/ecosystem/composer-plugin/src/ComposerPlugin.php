<?php

namespace CoreX\AIMindLayer;

use Composer\Composer;
use Composer\EventDispatcher\EventSubscriberInterface;
use Composer\IO\IOInterface;
use Composer\Plugin\PluginInterface;
use Composer\Script\Event;
use Composer\Script\ScriptEvents;
use Composer\Plugin\Capable;
use Composer\Plugin\Capability\CommandProvider;

/**
 * coreX AI MindLayer Composer Plugin
 * 
 * Dieses Plugin integriert die .ai.json Verwaltung in Composer-Workflows
 * 
 * VERBESSERUNG v3.4.1: Implementierung eines Fallback-Mechanismus für
 * Umgebungen ohne vollständige Composer-Installation
 */
class ComposerPlugin implements PluginInterface, EventSubscriberInterface, Capable
{
    /**
     * @var Composer $composer
     */
    private $composer;
    
    /**
     * @var IOInterface $io
     */
    private $io;

    /**
     * Plugin wird aktiviert
     * 
     * @param Composer $composer
     * @param IOInterface $io
     * @return void
     */
    public function activate(Composer $composer, IOInterface $io): void
    {
        $this->composer = $composer;
        $this->io = $io;
        
        $io->write('<info>coreX AI MindLayer Plugin aktiviert</info>');
    }

    /**
     * Plugin wird deaktiviert
     * 
     * @param Composer $composer
     * @param IOInterface $io
     * @return void
     */
    public function deactivate(Composer $composer, IOInterface $io): void
    {
        $io->write('<info>coreX AI MindLayer Plugin deaktiviert</info>');
    }

    /**
     * Plugin wird deinstalliert
     * 
     * @param Composer $composer
     * @param IOInterface $io
     * @return void
     */
    public function uninstall(Composer $composer, IOInterface $io): void
    {
        $io->write('<info>coreX AI MindLayer Plugin deinstalliert</info>');
        // Cleanup-Logik hier (falls nötig)
    }
    
    /**
     * Gibt die Fähigkeiten des Plugins zurück
     * 
     * @return array<string, string>
     */
    public function getCapabilities(): array
    {
        return [
            CommandProvider::class => ComposerCommandProvider::class,
        ];
    }
    
    /**
     * Event-Subscriber Konfiguration
     * 
     * @return array<string, string>
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ScriptEvents::POST_INSTALL_CMD => 'onPostInstall',
            ScriptEvents::POST_UPDATE_CMD => 'onPostUpdate',
        ];
    }
    
    /**
     * Nach der Installation ausführen
     * 
     * @param Event $event
     * @return void
     */
    public function onPostInstall(Event $event): void
    {
        $io = $event->getIO();
        $io->write('<info>🤖 coreX AI MindLayer: Aktualisiere .ai.json nach Installation...</info>');
        
        $this->updateAiJson($io);
    }
    
    /**
     * Nach dem Update ausführen
     * 
     * @param Event $event
     * @return void
     */
    public function onPostUpdate(Event $event): void
    {
        $io = $event->getIO();
        $io->write('<info>🤖 coreX AI MindLayer: Aktualisiere .ai.json nach Update...</info>');
        
        $this->updateAiJson($io);
    }
    
    /**
     * Aktualisiert die .ai.json mit Informationen aus composer.json
     * 
     * @param IOInterface $io
     * @return void
     */
    public function updateAiJson(IOInterface $io): void
    {
        // Prüfen ob composer.json existiert
        if (!file_exists('composer.json')) {
            $io->write('<error>Keine composer.json gefunden. Überspringe...</error>');
            return;
        }
        
        // Prüfen ob .ai.json existiert
        if (!file_exists('.ai.json')) {
            if ($io->isInteractive() && $io->askConfirmation('Keine .ai.json gefunden. Möchten Sie eine erstellen? (j/n) ', false)) {
                $this->createAiJson($io);
            } else {
                $io->write('<comment>Keine .ai.json gefunden. Überspringe...</comment>');
                return;
            }
        }
        
        try {
            // composer.json laden und validieren
            $composerContent = file_get_contents('composer.json');
            if ($composerContent === false) {
                throw new \RuntimeException('composer.json konnte nicht gelesen werden');
            }
            
            $composerJson = json_decode($composerContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException('composer.json enthält ungültiges JSON: ' . json_last_error_msg());
            }
            
            // .ai.json laden und validieren
            $aiContent = file_exists('.ai.json') ? file_get_contents('.ai.json') : '{}';
            if ($aiContent === false) {
                throw new \RuntimeException('.ai.json konnte nicht gelesen werden');
            }
            
            $aiJson = json_decode($aiContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException('.ai.json enthält ungültiges JSON: ' . json_last_error_msg());
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
            $this->detectPhpFrameworks($aiJson, $composerJson, $io);
            
            // .ai.json speichern
            $result = file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            if ($result === false) {
                throw new \RuntimeException('Konnte .ai.json nicht schreiben');
            }
            
            $io->write('<info>✅ .ai.json wurde aktualisiert!</info>');
            
        } catch (\Exception $e) {
            $io->write('<error>❌ Fehler beim Aktualisieren der .ai.json: ' . $e->getMessage() . '</error>');
        }
    }
    
    /**
     * Erstellt eine neue .ai.json-Datei
     * 
     * @param IOInterface $io
     * @return void
     */
    private function createAiJson(IOInterface $io): void
    {
        try {
            // composer.json laden und validieren
            $composerContent = file_get_contents('composer.json');
            if ($composerContent === false) {
                throw new \RuntimeException('composer.json konnte nicht gelesen werden');
            }
            
            $composerJson = json_decode($composerContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException('composer.json enthält ungültiges JSON: ' . json_last_error_msg());
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
            $this->detectPhpFrameworks($aiJson, $composerJson, $io);
            
            // .ai.json speichern
            $result = file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            if ($result === false) {
                throw new \RuntimeException('Konnte .ai.json nicht schreiben');
            }
            
            $io->write('<info>✅ Neue .ai.json erstellt!</info>');
            
        } catch (\Exception $e) {
            $io->write('<error>❌ Fehler beim Erstellen der .ai.json: ' . $e->getMessage() . '</error>');
        }
    }
    
    /**
     * Erkennt PHP-Frameworks basierend auf Composer-Abhängigkeiten
     * 
     * @param array &$aiJson
     * @param array $composerJson
     * @param IOInterface $io
     * @return void
     */
    private function detectPhpFrameworks(array &$aiJson, array $composerJson, IOInterface $io): void
    {
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
                
                $io->write("<info>✓ Framework erkannt: {$detector['name']}</info>");
            }
        }
    }
}

// Direkter Einstiegspunkt, wenn die Datei direkt ausgeführt wird
// Dies ermöglicht die Verwendung auch ohne Composer-Integration
if (basename($_SERVER['SCRIPT_NAME']) === basename(__FILE__)) {
    echo "🚀 coreX AI MindLayer - Composer Plugin Direct Runner\n";
    echo "Diese Datei wurde direkt aufgerufen, führe Stand-alone Modus aus...\n\n";
    
    try {
        // Erstelle einfaches IO-Interface für CLI
        class SimpleIO {
            public function write($message) {
                echo strip_tags($message) . "\n";
            }
            
            public function isInteractive() {
                return true;
            }
            
            public function askConfirmation($message, $default = true) {
                echo $message;
                $input = trim(fgets(STDIN));
                return strtolower($input) === 'j' || strtolower($input) === 'y';
            }
        }
        
        // Lade PhpProjectScanner als Fallback
        $phpScannerPath = dirname(__DIR__, 3) . '/php-scanner/PhpProjectScanner.php';
        if (file_exists($phpScannerPath)) {
            echo "ℹ️ Verwende PHP Project Scanner als Alternative...\n";
            include_once $phpScannerPath;
            $scanner = new \PhpProjectScanner();
            $scanner->scan();
            exit(0);
        } else {
            // Minimale Fallback-Implementation
            echo "📄 Einfache .ai.json Aktualisierung...\n";
            
            // Composer.json laden
            if (!file_exists('composer.json')) {
                echo "❌ Keine composer.json gefunden!\n";
                exit(1);
            }
            
            $composerContent = file_get_contents('composer.json');
            $composerJson = json_decode($composerContent, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "❌ composer.json enthält ungültiges JSON: " . json_last_error_msg() . "\n";
                exit(1);
            }
            
            // .ai.json laden oder erstellen
            $aiContent = file_exists('.ai.json') ? file_get_contents('.ai.json') : '{}';
            $aiJson = json_decode($aiContent, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "❌ .ai.json enthält ungültiges JSON, erstelle neue Datei.\n";
                $aiJson = [
                    'project' => [],
                    'ai_context' => [],
                    'architecture' => [
                        'components' => [],
                        'dependencies' => []
                    ],
                    'features' => []
                ];
            }
            
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
            
            // .ai.json speichern
            file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            echo "✅ .ai.json erfolgreich aktualisiert!\n";
            exit(0);
        }
    } catch (\Exception $e) {
        echo "❌ Fehler: " . $e->getMessage() . "\n";
        exit(1);
    }
}