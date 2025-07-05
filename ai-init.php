<?php
/**
 * coreX AI MindLayer - Intelligent Project Scanner & .ai.json Generator
 * 
 * This script analyzes your project structure and generates an optimized .ai.json
 * based on detected frameworks, patterns, and architecture.
 * 
 * Usage: php ai-init.php
 * 
 * @author Sascha Buscher - AIQIA
 * @version 2.0.0
 */

class AIProjectScanner {
    
    private $projectPath;
    private $detectedFrameworks = [];
    private $projectStructure = [];
    private $suggestedModules = [];
    
    public function __construct($path = '.') {
        $this->projectPath = realpath($path);
        echo "🔍 coreX AI MindLayer - Intelligent Project Scanner\n";
        echo "📁 Scanning: " . $this->projectPath . "\n\n";
    }
    
    /**
     * Main execution flow
     */
    public function run() {
        $this->scanFrameworks();
        $this->analyzeStructure();
        $this->generateSuggestions();
        $this->interactiveSetup();
        $this->generateAiJson();
    }
    
    /**
     * Detect frameworks and technologies
     */
    private function scanFrameworks() {
        echo "🔍 Detecting frameworks and technologies...\n";
        
        // Check for PHP frameworks
        if (file_exists($this->projectPath . '/composer.json')) {
            $composer = json_decode(file_get_contents($this->projectPath . '/composer.json'), true);
            $this->analyzeComposerDependencies($composer);
        }
        
        // Check for Node.js/JavaScript frameworks
        if (file_exists($this->projectPath . '/package.json')) {
            $package = json_decode(file_get_contents($this->projectPath . '/package.json'), true);
            $this->analyzePackageDependencies($package);
        }
        
        // Check for Python projects
        if (file_exists($this->projectPath . '/requirements.txt') || 
            file_exists($this->projectPath . '/pyproject.toml')) {
            $this->detectedFrameworks[] = 'Python';
            $this->detectPythonFramework();
        }
        
        // Check for specific framework files
        $this->detectByFilePatterns();
        
        $this->displayDetectedFrameworks();
    }
    
    /**
     * Analyze composer.json for PHP frameworks
     */
    private function analyzeComposerDependencies($composer) {
        if (!isset($composer['require'])) return;
        
        $dependencies = array_keys($composer['require']);
        
        foreach ($dependencies as $dep) {
            if (strpos($dep, 'laravel/framework') !== false) {
                $this->detectedFrameworks[] = 'Laravel';
            } elseif (strpos($dep, 'symfony/') !== false) {
                $this->detectedFrameworks[] = 'Symfony';
            } elseif (strpos($dep, 'codeigniter4/') !== false) {
                $this->detectedFrameworks[] = 'CodeIgniter';
            } elseif (strpos($dep, 'cakephp/') !== false) {
                $this->detectedFrameworks[] = 'CakePHP';
            } elseif (strpos($dep, 'slim/slim') !== false) {
                $this->detectedFrameworks[] = 'Slim Framework';
            }
        }
    }
    
    /**
     * Analyze package.json for JavaScript frameworks
     */
    private function analyzePackageDependencies($package) {
        $allDeps = array_merge(
            $package['dependencies'] ?? [],
            $package['devDependencies'] ?? []
        );
        
        $dependencies = array_keys($allDeps);
        
        foreach ($dependencies as $dep) {
            if (in_array($dep, ['vue', '@vue/cli'])) {
                $this->detectedFrameworks[] = 'Vue.js';
            } elseif (in_array($dep, ['react', 'react-dom'])) {
                $this->detectedFrameworks[] = 'React';
            } elseif (in_array($dep, ['@angular/core', '@angular/cli'])) {
                $this->detectedFrameworks[] = 'Angular';
            } elseif ($dep === 'next') {
                $this->detectedFrameworks[] = 'Next.js';
            } elseif ($dep === 'nuxt') {
                $this->detectedFrameworks[] = 'Nuxt.js';
            } elseif ($dep === 'svelte') {
                $this->detectedFrameworks[] = 'Svelte';
            } elseif ($dep === 'express') {
                $this->detectedFrameworks[] = 'Express.js';
            }
        }
    }
    
    /**
     * Detect Python frameworks
     */
    private function detectPythonFramework() {
        // Check requirements.txt
        if (file_exists($this->projectPath . '/requirements.txt')) {
            $requirements = file_get_contents($this->projectPath . '/requirements.txt');
            if (strpos($requirements, 'Django') !== false) {
                $this->detectedFrameworks[] = 'Django';
            } elseif (strpos($requirements, 'Flask') !== false) {
                $this->detectedFrameworks[] = 'Flask';
            } elseif (strpos($requirements, 'FastAPI') !== false) {
                $this->detectedFrameworks[] = 'FastAPI';
            }
        }
        
        // Check for Django-specific files
        if (file_exists($this->projectPath . '/manage.py')) {
            $this->detectedFrameworks[] = 'Django';
        }
    }
    
    /**
     * Detect frameworks by file patterns
     */
    private function detectByFilePatterns() {
        // Laravel specific
        if (file_exists($this->projectPath . '/artisan')) {
            $this->detectedFrameworks[] = 'Laravel';
        }
        
        // WordPress
        if (file_exists($this->projectPath . '/wp-config.php') || 
            file_exists($this->projectPath . '/wp-content/')) {
            $this->detectedFrameworks[] = 'WordPress';
        }
        
        // Drupal
        if (file_exists($this->projectPath . '/core/') && 
            file_exists($this->projectPath . '/sites/')) {
            $this->detectedFrameworks[] = 'Drupal';
        }
        
        // .NET
        if (file_exists($this->projectPath . '/Program.cs') || 
            file_exists($this->projectPath . '/Startup.cs')) {
            $this->detectedFrameworks[] = '.NET Core';
        }
    }
    
    /**
     * Display detected frameworks
     */
    private function displayDetectedFrameworks() {
        if (empty($this->detectedFrameworks)) {
            echo "⚠️  No specific frameworks detected - will generate generic structure\n\n";
            return;
        }
        
        echo "✅ Detected frameworks:\n";
        foreach (array_unique($this->detectedFrameworks) as $framework) {
            echo "   • $framework\n";
        }
        echo "\n";
    }
    
    /**
     * Analyze project structure
     */
    private function analyzeStructure() {
        echo "🏗️  Analyzing project structure...\n";
        
        $this->projectStructure = $this->scanDirectory($this->projectPath, 2); // 2 levels deep
        
        echo "✅ Structure analyzed\n\n";
    }
    
    /**
     * Recursively scan directory structure
     */
    private function scanDirectory($path, $maxDepth, $currentDepth = 0) {
        if ($currentDepth >= $maxDepth) return [];
        
        $structure = [];
        $items = glob($path . '/*');
        
        foreach ($items as $item) {
            $basename = basename($item);
            
            // Skip hidden files and common ignore patterns
            if ($basename[0] === '.' || 
                in_array($basename, ['node_modules', 'vendor', '.git', 'storage', 'cache'])) {
                continue;
            }
            
            if (is_dir($item)) {
                $structure['directories'][] = $basename;
                if ($currentDepth < $maxDepth - 1) {
                    $structure['subdirs'][$basename] = $this->scanDirectory($item, $maxDepth, $currentDepth + 1);
                }
            } else {
                $structure['files'][] = $basename;
            }
        }
        
        return $structure;
    }
    
    /**
     * Generate smart suggestions based on detected frameworks
     */
    private function generateSuggestions() {
        echo "💡 Generating intelligent suggestions...\n";
        
        foreach ($this->detectedFrameworks as $framework) {
            switch ($framework) {
                case 'Laravel':
                    $this->suggestLaravelModules();
                    break;
                case 'Vue.js':
                    $this->suggestVueModules();
                    break;
                case 'React':
                    $this->suggestReactModules();
                    break;
                case 'WordPress':
                    $this->suggestWordPressModules();
                    break;
                case 'Django':
                    $this->suggestDjangoModules();
                    break;
                default:
                    $this->suggestGenericModules();
            }
        }
        
        if (empty($this->detectedFrameworks)) {
            $this->suggestGenericModules();
        }
        
        echo "✅ Suggestions generated\n\n";
    }
    
    /**
     * Laravel-specific module suggestions
     */
    private function suggestLaravelModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Authentication',
                'description' => 'User authentication and authorization system',
                'entrypoints' => ['app/Http/Controllers/Auth/', 'routes/auth.php'],
                'routes' => ['/login', '/register', '/logout', '/password/reset'],
                'dependencies' => ['Middleware', 'User Model']
            ],
            [
                'module' => 'API',
                'description' => 'RESTful API endpoints and resources',
                'entrypoints' => ['app/Http/Controllers/Api/', 'routes/api.php'],
                'routes' => ['/api/v1/*'],
                'dependencies' => ['Authentication', 'Models']
            ],
            [
                'module' => 'Database',
                'description' => 'Database models, migrations and relationships',
                'entrypoints' => ['app/Models/', 'database/migrations/'],
                'routes' => [],
                'dependencies' => ['Eloquent ORM']
            ]
        ]);
    }
    
    /**
     * Vue.js-specific module suggestions
     */
    private function suggestVueModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Components',
                'description' => 'Vue.js components and composables',
                'entrypoints' => ['src/components/', 'src/composables/'],
                'routes' => [],
                'dependencies' => ['Vue Router', 'Pinia/Vuex']
            ],
            [
                'module' => 'Router',
                'description' => 'Vue Router configuration and guards',
                'entrypoints' => ['src/router/'],
                'routes' => ['/*'],
                'dependencies' => ['Components']
            ]
        ]);
    }
    
    /**
     * React-specific module suggestions
     */
    private function suggestReactModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Components',
                'description' => 'React components and hooks',
                'entrypoints' => ['src/components/', 'src/hooks/'],
                'routes' => [],
                'dependencies' => ['React Router']
            ],
            [
                'module' => 'State Management',
                'description' => 'Redux/Context state management',
                'entrypoints' => ['src/store/', 'src/context/'],
                'routes' => [],
                'dependencies' => ['Components']
            ]
        ]);
    }
    
    /**
     * WordPress-specific module suggestions
     */
    private function suggestWordPressModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Theme',
                'description' => 'WordPress theme files and templates',
                'entrypoints' => ['wp-content/themes/active-theme/'],
                'routes' => [],
                'dependencies' => ['WordPress Core']
            ],
            [
                'module' => 'Plugins',
                'description' => 'Custom WordPress plugins',
                'entrypoints' => ['wp-content/plugins/'],
                'routes' => [],
                'dependencies' => ['WordPress Core']
            ]
        ]);
    }
    
    /**
     * Django-specific module suggestions
     */
    private function suggestDjangoModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Views',
                'description' => 'Django views and URL patterns',
                'entrypoints' => ['views.py', 'urls.py'],
                'routes' => ['/*'],
                'dependencies' => ['Models', 'Templates']
            ],
            [
                'module' => 'Models',
                'description' => 'Django models and database schema',
                'entrypoints' => ['models.py', 'migrations/'],
                'routes' => [],
                'dependencies' => ['Django ORM']
            ]
        ]);
    }
    
    /**
     * Generic module suggestions for unknown frameworks
     */
    private function suggestGenericModules() {
        $this->suggestedModules = array_merge($this->suggestedModules, [
            [
                'module' => 'Core',
                'description' => 'Main application logic and entry points',
                'entrypoints' => ['index.php', 'main.py', 'app.js', 'src/'],
                'routes' => ['/'],
                'dependencies' => []
            ],
            [
                'module' => 'Configuration',
                'description' => 'Application configuration and settings',
                'entrypoints' => ['config/', 'settings.py', '.env'],
                'routes' => [],
                'dependencies' => ['Core']
            ]
        ]);
    }
    
    /**
     * Interactive setup with user input
     */
    private function interactiveSetup() {
        echo "🤖 Interactive Setup\n";
        echo "==================\n\n";
        
        if (!empty($this->detectedFrameworks)) {
            echo "I detected: " . implode(', ', array_unique($this->detectedFrameworks)) . "\n";
            echo "Should I generate framework-specific modules? (y/n): ";
            $useFrameworkModules = trim(fgets(STDIN));
            
            if (strtolower($useFrameworkModules) !== 'y') {
                $this->suggestedModules = [];
                $this->suggestGenericModules();
            }
        }
        
        echo "\n";
    }
    
    /**
     * Generate the final .ai.json file
     */
    private function generateAiJson() {
        echo "🎉 Generating optimized .ai.json...\n";
        
        $projectName = basename($this->projectPath);
        $timestamp = date('Y-m-d');
        
        $aiJson = [
            '$schema' => './schema.json',
            'meta' => [
                'project' => $projectName,
                'version' => '1.0.0',
                'author' => 'Generated by AI MindLayer',
                'description' => 'AI-generated project structure based on detected frameworks: ' . 
                               implode(', ', array_unique($this->detectedFrameworks)),
                'created' => $timestamp,
                'updated' => $timestamp,
                'frameworks' => array_unique($this->detectedFrameworks)
            ],
            'architecture' => $this->suggestedModules,
            'errors' => $this->generateCommonErrors(),
            'tasks' => $this->generateInitialTasks(),
            'context' => $this->generateProjectContext(),
            'references' => [
                [
                    'type' => 'doc',
                    'label' => 'AI Integration Guide',
                    'url' => './AI-INTEGRATION.md',
                    'description' => 'How to integrate AI assistants with this project'
                ]
            ]
        ];
        
        $jsonContent = json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        if (file_put_contents($this->projectPath . '/.ai.json', $jsonContent)) {
            echo "✅ Successfully generated .ai.json!\n";
            echo "📁 Location: " . $this->projectPath . "/.ai.json\n\n";
            
            echo "🔍 Summary:\n";
            echo "   • Detected frameworks: " . implode(', ', array_unique($this->detectedFrameworks)) . "\n";
            echo "   • Generated modules: " . count($this->suggestedModules) . "\n";
            echo "   • Common errors: " . count($this->generateCommonErrors()) . "\n";
            echo "\n💡 Your project is now AI-ready! Try asking ChatGPT or Copilot about your architecture.\n";
        } else {
            echo "❌ Failed to write .ai.json file\n";
        }
    }
    
    /**
     * Generate common errors based on detected frameworks
     */
    private function generateCommonErrors() {
        $errors = [];
        
        foreach ($this->detectedFrameworks as $framework) {
            switch ($framework) {
                case 'Laravel':
                    $errors[] = [
                        'code' => 'ROUTE_NOT_FOUND',
                        'message' => 'Route not found or not properly defined',
                        'causes' => ['Route not registered in routes/web.php or routes/api.php', 'Route cache needs clearing'],
                        'solutions' => ['Check route definitions', 'Run php artisan route:clear'],
                        'severity' => 'medium'
                    ];
                    break;
                case 'Vue.js':
                    $errors[] = [
                        'code' => 'COMPONENT_NOT_FOUND',
                        'message' => 'Vue component not found or not properly imported',
                        'causes' => ['Component not registered', 'Import path incorrect'],
                        'solutions' => ['Check component registration', 'Verify import paths'],
                        'severity' => 'medium'
                    ];
                    break;
            }
        }
        
        // Generic errors
        $errors[] = [
            'code' => 'DEPENDENCY_ERROR',
            'message' => 'Missing or incompatible dependencies',
            'causes' => ['Package not installed', 'Version conflicts'],
            'solutions' => ['Run package manager install', 'Check dependency versions'],
            'severity' => 'high'
        ];
        
        return $errors;
    }
    
    /**
     * Generate initial tasks based on project type
     */
    private function generateInitialTasks() {
        return [
            [
                'task' => 'Review and customize generated .ai.json structure',
                'priority' => 'high',
                'status' => 'open',
                'relatedModules' => ['All'],
                'due' => date('Y-m-d', strtotime('+7 days')),
                'tags' => ['setup', 'documentation']
            ],
            [
                'task' => 'Add project-specific error patterns and solutions',
                'priority' => 'medium',
                'status' => 'open',
                'relatedModules' => ['All'],
                'due' => date('Y-m-d', strtotime('+14 days')),
                'tags' => ['documentation', 'debugging']
            ]
        ];
    }
    
    /**
     * Generate project context information
     */
    private function generateProjectContext() {
        $context = [
            [
                'key' => 'Generated',
                'value' => 'This .ai.json was automatically generated by coreX AI MindLayer',
                'category' => 'meta'
            ]
        ];
        
        if (!empty($this->detectedFrameworks)) {
            $context[] = [
                'key' => 'Tech Stack',
                'value' => 'Primary frameworks: ' . implode(', ', array_unique($this->detectedFrameworks)),
                'category' => 'technology'
            ];
        }
        
        return $context;
    }
}

// Main execution
if (php_sapi_name() === 'cli') {
    $scanner = new AIProjectScanner();
    $scanner->run();
} else {
    // Web interface fallback
    echo "<!DOCTYPE html><html><head><title>AI MindLayer Scanner</title></head><body>";
    echo "<h1>🤖 coreX AI MindLayer</h1>";
    echo "<p>This scanner should be run from command line:</p>";
    echo "<code>php ai-init.php</code>";
    echo "<p>For web usage, please use the CLI version for security reasons.</p>";
    echo "</body></html>";
}

?>
