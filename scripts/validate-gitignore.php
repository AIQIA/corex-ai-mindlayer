<?php
/**
 * CoreX AI MindLayer - .gitignore Validator
 * 
 * Prüft die .gitignore auf Aktualität und stellt sicher, dass keine unnötigen Dateien auf Git hochgeladen werden.
 */

class GitignoreValidator {
    private $gitignorePath;
    private $requiredRules = [
        '/backups/' => 'Backup-Verzeichnis muss ausgeschlossen sein',
        '*.bak' => 'Backup-Dateien müssen ausgeschlossen sein',
        '*.swp' => 'Temporäre Swap-Dateien müssen ausgeschlossen sein',
        '*.orig' => 'Original-Backup-Dateien müssen ausgeschlossen sein',
        '*~' => 'Temporäre Backup-Dateien müssen ausgeschlossen sein',
        '.backup/' => 'Versteckte Backup-Verzeichnisse müssen ausgeschlossen sein',
        '_backup/' => 'Alternative Backup-Verzeichnisse müssen ausgeschlossen sein'
    ];

    public function __construct($gitignorePath = null) {
        $this->gitignorePath = $gitignorePath ?? dirname(__DIR__) . '/.gitignore';
    }

    public function validate(): bool {
        if (!file_exists($this->gitignorePath)) {
            $this->error("ERROR: .gitignore nicht gefunden in {$this->gitignorePath}");
            return false;
        }

        $content = file_get_contents($this->gitignorePath);
        $lines = array_map('trim', explode("\n", $content));
        $missing = [];

        foreach ($this->requiredRules as $rule => $message) {
            if (!$this->hasRule($lines, $rule)) {
                $missing[] = ["rule" => $rule, "message" => $message];
            }
        }

        if (!empty($missing)) {
            $this->error("\nFEHLENDE REGELN IN .gitignore:");
            foreach ($missing as $item) {
                $this->error("- {$item['rule']}: {$item['message']}");
            }
            return false;
        }

        $this->success("✅ .gitignore ist aktuell und enthält alle notwendigen Regeln.");
        return true;
    }

    private function hasRule(array $lines, string $rule): bool {
        foreach ($lines as $line) {
            if ($line === $rule || $line === "/{$rule}") {
                return true;
            }
        }
        return false;
    }

    private function error(string $message): void {
        fwrite(STDERR, $message . PHP_EOL);
    }

    private function success(string $message): void {
        echo $message . PHP_EOL;
    }
}

// Ausführung
$validator = new GitignoreValidator();
exit($validator->validate() ? 0 : 1);
