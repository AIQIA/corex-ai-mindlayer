<?php
/**
 * coreX AI MindLayer - PHP Project Scanner
 * 
 * Scanner für PHP-basierte Projekte, erkennt gängige PHP-Frameworks.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\php;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class PhpProjectScanner implements ScannerInterface {
    private $frameworks = [];
    private $projectStructure = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf PHP-spezifische Dateien
        return file_exists("$projectPath/composer.json") || 
               count(glob("$projectPath/*.php")) > 0 ||
               count(glob("$projectPath/src/*.php")) > 0 ||
               count(glob("$projectPath/app/*.php")) > 0;
    }
    
    /**
     * Führt den Scan für PHP-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        $this->projectStructure = [];
        
        // Composer-basierte Erkennung
        if (file_exists("$projectPath/composer.json")) {
            $this->scanComposerJson("$projectPath/composer.json");
        }
        
        // Datei- und Verzeichnisbasierte Erkennung
        $this->detectFrameworksByFiles($projectPath);
        
        // Erkennung basierend auf Code-Mustern
        $this->detectByCodePatterns($projectPath);
        
        return $this->frameworks;
    }
    
    /**
     * Gibt den Namen der unterstützten Sprache zurück
     */
    public function getLanguageName(): string {
        return 'PHP';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 80; // Hohe Priorität für PHP-Projekte
    }
    
    /**
     * Analysiert die composer.json Datei für Framework-Erkennung
     */
    private function scanComposerJson(string $composerJsonPath): void {
        $composerData = json_decode(file_get_contents($composerJsonPath), true);
        
        if (!isset($composerData['require'])) {
            return;
        }
        
        $dependencies = array_keys($composerData['require']);
        
        $frameworkMap = [
            'laravel/framework' => 'Laravel',
            'symfony/' => 'Symfony',
            'slim/slim' => 'Slim Framework',
            'yiisoft/yii2' => 'Yii2',
            'cakephp/cakephp' => 'CakePHP',
            'laminas/' => 'Laminas',
            'zendframework/' => 'Zend Framework',
            'codeigniter4/framework' => 'CodeIgniter',
            'phalcon/cphalcon' => 'Phalcon',
            'wordpress/wordpress' => 'WordPress',
            'drupal/drupal' => 'Drupal',
            'magento/' => 'Magento',
            'typo3/' => 'TYPO3',
            'shopware/' => 'Shopware'
        ];
        
        foreach ($dependencies as $dependency) {
            foreach ($frameworkMap as $pattern => $framework) {
                if (strpos($dependency, $pattern) !== false) {
                    $this->frameworks[] = $framework;
                    break;
                }
            }
        }
    }
    
    /**
     * Erkennt Frameworks anhand typischer Datei- und Verzeichnismuster
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $detectionRules = [
            // Laravel
            [
                'check' => ['artisan', 'app/Http/Controllers', 'config/app.php'],
                'framework' => 'Laravel'
            ],
            // Symfony
            [
                'check' => ['bin/console', 'config/services.yaml', 'symfony.lock'],
                'framework' => 'Symfony'
            ],
            // WordPress
            [
                'check' => ['wp-config.php', 'wp-content', 'wp-admin'],
                'framework' => 'WordPress'
            ],
            // Drupal
            [
                'check' => ['core/includes/bootstrap.inc', 'sites/default/settings.php'],
                'framework' => 'Drupal'
            ],
            // CodeIgniter
            [
                'check' => ['app/Config/Routes.php', 'system/CodeIgniter.php'],
                'framework' => 'CodeIgniter'
            ]
        ];
        
        foreach ($detectionRules as $rule) {
            $matches = 0;
            $required = count($rule['check']);
            
            foreach ($rule['check'] as $checkPath) {
                if (file_exists("$projectPath/$checkPath")) {
                    $matches++;
                }
            }
            
            // Wenn mindestens 2 Kriterien erfüllt sind oder alle bei weniger als 2 Kriterien
            if (($required >= 2 && $matches >= 2) || ($required < 2 && $matches == $required)) {
                if (!in_array($rule['framework'], $this->frameworks)) {
                    $this->frameworks[] = $rule['framework'];
                }
            }
        }
    }
    
    /**
     * Erkennt Frameworks durch Analyse von Code-Mustern
     */
    private function detectByCodePatterns(string $projectPath): void {
        // Diese Methode kann in Zukunft erweitert werden, um tiefergehende Code-Analyse durchzuführen
        // z.B. Namespace-Erkennung, typische Klassen-Muster, etc.
        
        // Für jetzt implementieren wir eine einfache Datei-Inhalts-Prüfung
        $sampleFiles = array_merge(
            glob("$projectPath/*.php"),
            glob("$projectPath/src/*.php"),
            glob("$projectPath/app/*.php")
        );
        
        $codePatterns = [
            'Laravel' => [
                'use Illuminate\Foundation',
                'use Illuminate\Support',
                'extends Controller',
                'Artisan::command'
            ],
            'Symfony' => [
                'use Symfony\Component',
                'use Symfony\Bundle',
                'extends AbstractController',
                'Symfony\Component\HttpFoundation\Response'
            ],
            'WordPress' => [
                'add_action(',
                'add_filter(',
                'get_template_part(',
                'wp_enqueue_'
            ]
        ];
        
        $sampleLimit = min(10, count($sampleFiles)); // Max. 10 Dateien prüfen
        $sampledFiles = array_slice($sampleFiles, 0, $sampleLimit);
        
        $patternMatches = [];
        
        foreach ($sampledFiles as $file) {
            $content = file_get_contents($file);
            
            foreach ($codePatterns as $framework => $patterns) {
                if (!isset($patternMatches[$framework])) {
                    $patternMatches[$framework] = 0;
                }
                
                foreach ($patterns as $pattern) {
                    if (strpos($content, $pattern) !== false) {
                        $patternMatches[$framework]++;
                    }
                }
            }
        }
        
        // Frameworks mit signifikanten Treffern hinzufügen
        foreach ($patternMatches as $framework => $matches) {
            if ($matches >= 2 && !in_array($framework, $this->frameworks)) {
                $this->frameworks[] = $framework;
            }
        }
    }
}
