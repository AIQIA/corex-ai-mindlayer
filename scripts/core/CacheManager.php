<?php

namespace CoreX\AI\MindLayer\Core;

class CacheManager {
    private static $instance = null;
    private $cacheDir;
    private $defaultTtl = 300; // 5 minutes

    private function __construct() {
        $this->cacheDir = dirname(__DIR__, 2) . '/.cache';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0777, true);
        }
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $key) {
        $filename = $this->getCacheFile($key);
        if (!file_exists($filename)) {
            return null;
        }

        $data = json_decode(file_get_contents($filename), true);
        if ($data === null || time() > $data['expiry']) {
            unlink($filename);
            return null;
        }

        return $data['value'];
    }

    public function set(string $key, $value, int $ttl = null): bool {
        $filename = $this->getCacheFile($key);
        $data = [
            'value' => $value,
            'expiry' => time() + ($ttl ?? $this->defaultTtl)
        ];

        return file_put_contents($filename, json_encode($data)) !== false;
    }

    public function delete(string $key): bool {
        $filename = $this->getCacheFile($key);
        if (file_exists($filename)) {
            return unlink($filename);
        }
        return true;
    }

    public function clear(): bool {
        $files = glob($this->cacheDir . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        return true;
    }

    private function getCacheFile(string $key): string {
        return $this->cacheDir . '/' . md5($key) . '.cache';
    }
}
