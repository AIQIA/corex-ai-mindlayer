<?php
/**
 * coreX AI MindLayer - Python Project Scanner
 * 
 * Scanner für Python-basierte Projekte, erkennt gängige Python-Frameworks.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\python;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class PythonProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf Python-spezifische Dateien
        return file_exists("$projectPath/requirements.txt") || 
               file_exists("$projectPath/setup.py") ||
               file_exists("$projectPath/pyproject.toml") ||
               file_exists("$projectPath/Pipfile") ||
               file_exists("$projectPath/environment.yml") ||
               count(glob("$projectPath/*.py")) > 0;
    }
    
    /**
     * Führt den Scan für Python-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // Requirements-basierte Erkennung
        if (file_exists("$projectPath/requirements.txt")) {
            $this->scanRequirementsFile("$projectPath/requirements.txt");
        }
        
        // Pipfile-basierte Erkennung
        if (file_exists("$projectPath/Pipfile")) {
            $this->scanPipfile("$projectPath/Pipfile");
        }
        
        // Setup.py-basierte Erkennung
        if (file_exists("$projectPath/setup.py")) {
            $this->scanSetupPy("$projectPath/setup.py");
        }
        
        // Pyproject.toml-basierte Erkennung
        if (file_exists("$projectPath/pyproject.toml")) {
            $this->scanPyprojectToml("$projectPath/pyproject.toml");
        }
        
        // Datei- und Verzeichnisbasierte Erkennung
        $this->detectFrameworksByFiles($projectPath);
        
        // Code-Pattern Erkennung
        $this->detectByCodePatterns($projectPath);
        
        return $this->frameworks;
    }
    
    /**
     * Gibt den Namen der unterstützten Sprache zurück
     */
    public function getLanguageName(): string {
        return 'Python';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 70;
    }
    
    /**
     * Analysiert die requirements.txt Datei für Framework-Erkennung
     */
    private function scanRequirementsFile(string $requirementsPath): void {
        $content = file_get_contents($requirementsPath);
        $lines = explode("\n", $content);
        
        $frameworkMap = [
            'django' => 'Django',
            'flask' => 'Flask',
            'fastapi' => 'FastAPI',
            'pyramid' => 'Pyramid',
            'tornado' => 'Tornado',
            'bottle' => 'Bottle',
            'cherrypy' => 'CherryPy',
            'dash' => 'Dash',
            'streamlit' => 'Streamlit',
            'scikit-learn' => 'scikit-learn',
            'sklearn' => 'scikit-learn',
            'tensorflow' => 'TensorFlow',
            'keras' => 'Keras',
            'pytorch' => 'PyTorch',
            'torch' => 'PyTorch',
            'pandas' => 'Pandas',
            'numpy' => 'NumPy',
            'matplotlib' => 'Matplotlib',
            'seaborn' => 'Seaborn',
            'jupyter' => 'Jupyter',
            'scrapy' => 'Scrapy',
            'beautifulsoup' => 'BeautifulSoup',
            'celery' => 'Celery',
            'pytest' => 'pytest',
            'sqlalchemy' => 'SQLAlchemy'
        ];
        
        foreach ($lines as $line) {
            $line = trim(strtolower($line));
            if (empty($line) || $line[0] == '#') {
                continue; // Kommentare oder leere Zeilen überspringen
            }
            
            // Versionspezifikationen entfernen
            $line = preg_replace('/[>=<~!].*$/', '', $line);
            $line = trim($line);
            
            foreach ($frameworkMap as $pattern => $framework) {
                if (strpos($line, $pattern) === 0) {
                    if (!in_array($framework, $this->frameworks)) {
                        $this->frameworks[] = $framework;
                    }
                }
            }
        }
    }
    
    /**
     * Analysiert die Pipfile für Framework-Erkennung
     */
    private function scanPipfile(string $pipfilePath): void {
        $content = file_get_contents($pipfilePath);
        
        $frameworkMap = [
            'django' => 'Django',
            'flask' => 'Flask',
            'fastapi' => 'FastAPI',
            'pyramid' => 'Pyramid',
            'tornado' => 'Tornado',
            'scikit-learn' => 'scikit-learn',
            'sklearn' => 'scikit-learn',
            'tensorflow' => 'TensorFlow',
            'keras' => 'Keras',
            'pytorch' => 'PyTorch',
            'torch' => 'PyTorch'
        ];
        
        foreach ($frameworkMap as $pattern => $framework) {
            if (preg_match('/["\']' . preg_quote($pattern) . '["\']/', $content)) {
                if (!in_array($framework, $this->frameworks)) {
                    $this->frameworks[] = $framework;
                }
            }
        }
    }
    
    /**
     * Analysiert die setup.py Datei für Framework-Erkennung
     */
    private function scanSetupPy(string $setupPyPath): void {
        $content = file_get_contents($setupPyPath);
        
        // Suche nach install_requires oder requirements
        if (preg_match('/install_requires\s*=\s*\[(.*?)\]/s', $content, $matches) ||
            preg_match('/requirements\s*=\s*\[(.*?)\]/s', $content, $matches)) {
            
            $requirements = $matches[1];
            
            $frameworkMap = [
                'django' => 'Django',
                'flask' => 'Flask',
                'fastapi' => 'FastAPI',
                'pyramid' => 'Pyramid',
                'tornado' => 'Tornado'
            ];
            
            foreach ($frameworkMap as $pattern => $framework) {
                if (preg_match('/[\'"]' . preg_quote($pattern) . '[\'"]/', $requirements)) {
                    if (!in_array($framework, $this->frameworks)) {
                        $this->frameworks[] = $framework;
                    }
                }
            }
        }
    }
    
    /**
     * Analysiert die pyproject.toml Datei für Framework-Erkennung
     */
    private function scanPyprojectToml(string $pyprojectPath): void {
        $content = file_get_contents($pyprojectPath);
        
        $frameworkMap = [
            'django' => 'Django',
            'flask' => 'Flask',
            'fastapi' => 'FastAPI',
            'pyramid' => 'Pyramid',
            'tornado' => 'Tornado',
            'scikit-learn' => 'scikit-learn',
            'tensorflow' => 'TensorFlow',
            'keras' => 'Keras',
            'pytorch' => 'PyTorch'
        ];
        
        foreach ($frameworkMap as $pattern => $framework) {
            if (preg_match('/"' . preg_quote($pattern) . '"/', $content) || 
                preg_match("/'". preg_quote($pattern) . "'/", $content)) {
                if (!in_array($framework, $this->frameworks)) {
                    $this->frameworks[] = $framework;
                }
            }
        }
    }
    
    /**
     * Erkennt Frameworks anhand typischer Datei- und Verzeichnismuster
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $detectionRules = [
            // Django
            [
                'check' => ['manage.py', 'settings.py', 'urls.py', 'wsgi.py'],
                'framework' => 'Django'
            ],
            // Flask
            [
                'check' => ['app.py', 'wsgi.py', 'templates', 'static'],
                'framework' => 'Flask'
            ],
            // FastAPI
            [
                'check' => ['main.py', 'app/routers', 'app/api'],
                'framework' => 'FastAPI'
            ],
            // Jupyter
            [
                'check' => ['.ipynb_checkpoints', '*.ipynb'],
                'framework' => 'Jupyter'
            ],
            // Data Science
            [
                'check' => ['notebooks', 'data', 'models'],
                'framework' => 'Data Science'
            ]
        ];
        
        foreach ($detectionRules as $rule) {
            $matches = 0;
            $required = count($rule['check']);
            
            foreach ($rule['check'] as $checkPath) {
                if (strpos($checkPath, '*') !== false) {
                    // Glob-Muster
                    $globPath = "$projectPath/" . $checkPath;
                    if (count(glob($globPath)) > 0) {
                        $matches++;
                    }
                } else if (file_exists("$projectPath/$checkPath") || is_dir("$projectPath/$checkPath")) {
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
        $sampleFiles = array_merge(
            glob("$projectPath/*.py"),
            glob("$projectPath/src/*.py"),
            glob("$projectPath/app/*.py")
        );
        
        $codePatterns = [
            'Django' => [
                'from django',
                'django.contrib',
                'django.db.models',
                'django.urls',
                'django.http'
            ],
            'Flask' => [
                'from flask import',
                'app = Flask',
                '@app.route',
                'render_template'
            ],
            'FastAPI' => [
                'from fastapi import',
                'app = FastAPI',
                '@app.get',
                '@app.post'
            ],
            'SQLAlchemy' => [
                'from sqlalchemy',
                'Base = declarative_base',
                'Column(',
                'create_engine'
            ],
            'Pandas' => [
                'import pandas',
                'pd.DataFrame',
                'pd.read_csv',
                'pd.concat'
            ],
            'NumPy' => [
                'import numpy',
                'np.array',
                'np.zeros',
                'np.random'
            ],
            'TensorFlow' => [
                'import tensorflow',
                'tf.keras',
                'tf.data',
                'tf.Variable'
            ],
            'PyTorch' => [
                'import torch',
                'torch.nn',
                'torch.optim',
                'torch.utils.data'
            ]
        ];
        
        $sampleLimit = min(10, count($sampleFiles)); // Max. 10 Dateien prüfen
        $sampledFiles = array_slice($sampleFiles, 0, $sampleLimit);
        
        $patternMatches = [];
        
        foreach ($sampledFiles as $file) {
            if (!is_file($file)) continue;
            
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
