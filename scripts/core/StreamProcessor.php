<?php

namespace CoreX\AI\MindLayer\Core;

use JsonStreamingParser\Listener\ListenerInterface;
use JsonStreamingParser\Parser;

class StreamProcessor {
    private $chunkSize = 8192; // 8KB chunks
    private $cache = [];
    private $cacheExpiry = 300; // 5 minutes

    public function processJsonStream(string $filePath, \JsonStreamingParser\Listener\ListenerInterface $listener) {
        $handle = fopen($filePath, 'r');
        $parser = new Parser($handle, $listener);
        $parser->parse();
        fclose($handle);
    }

    public function getCached(string $key) {
        if (isset($this->cache[$key]) && time() < $this->cache[$key]['expiry']) {
            return $this->cache[$key]['data'];
        }
        return null;
    }

    public function cache(string $key, $data) {
        $this->cache[$key] = [
            'data' => $data,
            'expiry' => time() + $this->cacheExpiry
        ];
    }

    public function clearCache() {
        $this->cache = [];
    }
}
