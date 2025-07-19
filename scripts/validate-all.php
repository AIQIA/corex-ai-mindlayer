<?php

namespace CoreX\AI\MindLayer\Validation;

class ValidationRunner {
    private $errors = [];
    private $warnings = [];
    private $logFile = 'logs/validation-errors.log';

    public function __construct() {
        if (!is_dir('logs')) {
            mkdir('logs', 0777, true);
        }
    }

    public function validateAll(): bool {
        $this->log("Starting comprehensive validation...");
        
        // Schema validation
        if (!$this->validateSchema()) {
            $this->error("Schema validation failed");
            return false;
        }

        // PHP Linting
        if (!$this->lintPhpFiles()) {
            $this->error("PHP linting failed");
            return false;
        }

        // Documentation consistency
        if (!$this->validateDocumentation()) {
            $this->error("Documentation validation failed");
            return false;
        }

        if (count($this->errors) > 0) {
            $this->generateReport();
            return false;
        }

        $this->log("All validations passed successfully!");
        return true;
    }

    private function validateSchema(): bool {
        $this->log("Validating schema...");
        
        // Validate main .ai.json
        if (!$this->validateJsonFile('.ai.json', 'schema.json')) {
            return false;
        }

        // Validate all modules
        $moduleDir = '.ai.modules/';
        if (is_dir($moduleDir)) {
            foreach (glob($moduleDir . '*.json') as $moduleFile) {
                if (!$this->validateJsonFile($moduleFile, 'schema.json')) {
                    return false;
                }
            }
        }

        return true;
    }

    private function lintPhpFiles(): bool {
        $this->log("Linting PHP files...");
        
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator('scripts'));
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                exec('php -l ' . escapeshellarg($file->getPathname()), $output, $return);
                if ($return !== 0) {
                    $this->error("PHP lint error in {$file->getPathname()}: " . implode("\n", $output));
                    return false;
                }
            }
        }
        
        return true;
    }

    private function runUnitTests(): bool {
        $this->log("Running unit tests...");
        exec('vendor/bin/phpunit tests/unit', $output, $return);
        if ($return !== 0) {
            $this->error("Unit tests failed: " . implode("\n", $output));
            return false;
        }
        return true;
    }

    private function runIntegrationTests(): bool {
        $this->log("Running integration tests...");
        exec('vendor/bin/phpunit tests/integration', $output, $return);
        if ($return !== 0) {
            $this->error("Integration tests failed: " . implode("\n", $output));
            return false;
        }
        return true;
    }

    private function validateDocumentation(): bool {
        $this->log("Validating documentation consistency...");
        
        // Check version numbers
        $version = $this->getVersionFromFile('.ai.modules/meta.json');
        $files = ['INITIALIZE.md', 'STATUS.md', 'schema.json'];
        
        foreach ($files as $file) {
            if (!$this->checkVersionInFile($file, $version)) {
                return false;
            }
        }

        return true;
    }

    private function validateJsonFile(string $file, string $schema): bool {
        // TODO: Implement JSON Schema validation
        return true;
    }

    private function getVersionFromFile(string $file): string {
        $content = file_get_contents($file);
        $json = json_decode($content, true);
        return $json['meta']['version'] ?? '';
    }

    private function checkVersionInFile(string $file, string $version): bool {
        $content = file_get_contents($file);
        if (strpos($content, $version) === false) {
            $this->error("Version mismatch in {$file}. Expected version {$version} not found.");
            return false;
        }
        return true;
    }

    private function generateReport(): void {
        $report = [
            'timestamp' => date('Y-m-d H:i:s'),
            'errors' => $this->errors,
            'warnings' => $this->warnings
        ];
        
        file_put_contents('logs/validation-report.json', json_encode($report, JSON_PRETTY_PRINT));
    }

    private function error(string $message): void {
        $this->errors[] = $message;
        $this->log("[ERROR] " . $message);
    }

    private function warning(string $message): void {
        $this->warnings[] = $message;
        $this->log("[WARNING] " . $message);
    }

    private function log(string $message): void {
        $logMessage = date('Y-m-d H:i:s') . " - " . $message . PHP_EOL;
        file_put_contents($this->logFile, $logMessage, FILE_APPEND);
    }
}

// Run validation if script is executed directly
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['PHP_SELF'])) {
    $validator = new ValidationRunner();
    $success = $validator->validateAll();
    exit($success ? 0 : 1);
}
