<?php

namespace CoreX\AI\MindLayer\ML\Context;

class LearningExperience {
    private $pattern;
    private $context;
    private $outcome;
    private $timestamp;
    private $confidence;
    
    public function __construct(array $data) {
        $this->pattern = $data['pattern'] ?? [];
        $this->context = $data['context'] ?? [];
        $this->outcome = $data['outcome'] ?? [];
        $this->timestamp = $data['timestamp'] ?? time();
        $this->confidence = $data['confidence'] ?? 0.0;
    }
    
    public function matches(array $currentContext): float {
        $similarity = $this->calculateContextSimilarity($currentContext);
        return $similarity * $this->confidence;
    }
    
    public function applyLearning(array &$currentContext): void {
        foreach ($this->pattern as $key => $value) {
            if (isset($currentContext[$key])) {
                $currentContext[$key] = $this->adaptValue($currentContext[$key], $value);
            }
        }
    }
    
    public function updateConfidence(bool $wasSuccessful): void {
        $learningRate = 0.1;
        if ($wasSuccessful) {
            $this->confidence = min(1.0, $this->confidence + $learningRate);
        } else {
            $this->confidence = max(0.0, $this->confidence - $learningRate);
        }
    }
    
    private function calculateContextSimilarity(array $currentContext): float {
        $similarities = [];
        
        foreach ($this->context as $key => $value) {
            if (isset($currentContext[$key])) {
                $similarities[] = $this->compareValues($value, $currentContext[$key]);
            }
        }
        
        return empty($similarities) ? 0.0 : array_sum($similarities) / count($similarities);
    }
    
    private function compareValues($a, $b): float {
        if (is_array($a) && is_array($b)) {
            return $this->compareArrays($a, $b);
        }
        
        if (is_string($a) && is_string($b)) {
            return $this->compareStrings($a, $b);
        }
        
        if (is_numeric($a) && is_numeric($b)) {
            return $this->compareNumbers($a, $b);
        }
        
        return $a === $b ? 1.0 : 0.0;
    }
    
    private function compareArrays(array $a, array $b): float {
        $commonKeys = array_intersect_key($a, $b);
        if (empty($commonKeys)) return 0.0;
        
        $similarities = [];
        foreach ($commonKeys as $key => $value) {
            $similarities[] = $this->compareValues($a[$key], $b[$key]);
        }
        
        return array_sum($similarities) / count($similarities);
    }
    
    private function compareStrings(string $a, string $b): float {
        similar_text($a, $b, $percent);
        return $percent / 100;
    }
    
    private function compareNumbers($a, $b): float {
        $max = max(abs($a), abs($b));
        if ($max === 0) return 1.0;
        return 1 - (abs($a - $b) / $max);
    }
    
    private function adaptValue($current, $learned) {
        if (is_array($current) && is_array($learned)) {
            return array_merge($learned, $current);
        }
        
        if (is_numeric($current) && is_numeric($learned)) {
            return ($current + $learned) / 2;
        }
        
        return $current;
    }
    
    public function toArray(): array {
        return [
            'pattern' => $this->pattern,
            'context' => $this->context,
            'outcome' => $this->outcome,
            'timestamp' => $this->timestamp,
            'confidence' => $this->confidence
        ];
    }
}
