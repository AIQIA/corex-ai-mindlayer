<?php
/**
 * coreX AI MindLayer - Scanner Manager
 * 
 * Zentrale Verwaltungsklasse, die alle verfügbaren Sprachspezifischen Scanner koordiniert.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners;

class ScannerManager {
    private $scanners = [];
    private $results = [];
    private $projectPath;
    
    /**
     * Konstruktor, der verfügbare Scanner lädt
     * 
     * @param string $projectPath Pfad zum zu scannenden Projekt
     */
    public function __construct(string $projectPath) {
        $this->projectPath = realpath($projectPath);
        $this->loadScanners();
    }
    
    /**
     * Lädt alle verfügbaren Scanner aus den Unterverzeichnissen
     */
    private function loadScanners() {
        $scannerDirs = [
            __DIR__ . '/php',
            __DIR__ . '/js',
            __DIR__ . '/python',
            __DIR__ . '/java',
            __DIR__ . '/csharp',
            __DIR__ . '/go',
            __DIR__ . '/rust'
        ];
        
        foreach ($scannerDirs as $dir) {
            if (!is_dir($dir)) continue;
            
            foreach (glob("$dir/*Scanner.php") as $scannerFile) {
                require_once $scannerFile;
                
                $className = basename($scannerFile, '.php');
                $fullyQualifiedName = "CoreX\\AIMindLayer\\Scanners\\" . basename(dirname($scannerFile)) . "\\$className";
                
                if (class_exists($fullyQualifiedName)) {
                    try {
                        $scanner = new $fullyQualifiedName();
                        if ($scanner instanceof ScannerInterface) {
                            $this->scanners[] = $scanner;
                        }
                    } catch (\Exception $e) {
                        // Fehler beim Laden des Scanners - überspringen
                    }
                }
            }
        }
        
        // Nach Priorität sortieren (höhere Priorität zuerst)
        usort($this->scanners, function($a, $b) {
            return $b->getPriority() - $a->getPriority();
        });
    }
    
    /**
     * Führt alle anwendbaren Scanner aus
     * 
     * @return array Ergebnisse aller Scanner
     */
    public function runScanners() {
        echo "🌐 Multi-Language Scanner: Analyzing project structure...\n";
        
        $detectedLanguages = [];
        $frameworksByLanguage = [];
        
        foreach ($this->scanners as $scanner) {
            if ($scanner->canHandle($this->projectPath)) {
                $languageName = $scanner->getLanguageName();
                echo "  🔍 Running {$languageName} scanner...\n";
                
                $results = $scanner->scan($this->projectPath);
                if (!empty($results)) {
                    $detectedLanguages[] = $languageName;
                    $frameworksByLanguage[$languageName] = $results;
                    $this->results = array_merge($this->results, $results);
                }
            }
        }
        
        if (empty($detectedLanguages)) {
            echo "  ⚠️ No recognized programming languages detected.\n";
        } else {
            echo "  ✅ Detected languages: " . implode(', ', $detectedLanguages) . "\n";
            
            foreach ($frameworksByLanguage as $language => $frameworks) {
                if (!empty($frameworks)) {
                    echo "    📦 {$language} frameworks: " . implode(', ', $frameworks) . "\n";
                }
            }
        }
        
        return [
            'languages' => $detectedLanguages,
            'frameworks' => $this->results,
            'details' => $frameworksByLanguage
        ];
    }
    
    /**
     * Gibt die Anzahl der geladenen Scanner zurück
     * 
     * @return int Anzahl der Scanner
     */
    public function getScannerCount() {
        return count($this->scanners);
    }
    
    /**
     * Gibt eine Liste der geladenen Scanner zurück
     * 
     * @return array Liste der Scanner-Namen
     */
    public function getLoadedScanners() {
        return array_map(function($scanner) {
            return $scanner->getLanguageName();
        }, $this->scanners);
    }
}
