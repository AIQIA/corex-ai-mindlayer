<?php

namespace CoreX\AI\MindLayer\ML\Context;

class ContextPattern {
    private $type;
    private $indicators;
    private $weight;
    private $conditions;
    private $actions;
    
    public function __construct(array $data) {
        $this->type = $data['type'];
        $this->indicators = $data['indicators'];
        $this->weight = $data['weight'];
        $this->conditions = $data['conditions'] ?? [];
        $this->actions = $data['actions'] ?? [];
    }
    
    public function matches(array $context): bool {
        foreach ($this->conditions as $condition) {
            if (!$this->evaluateCondition($condition, $context)) {
                return false;
            }
        }
        
        $indicatorMatches = 0;
        foreach ($this->indicators as $indicator) {
            if ($this->containsIndicator($context, $indicator)) {
                $indicatorMatches++;
            }
        }
        
        return ($indicatorMatches / count($this->indicators)) >= 0.7;
    }
    
    public function getImportance(array $context): float {
        $baseImportance = $this->weight;
        
        // Erhöhe Wichtigkeit basierend auf Kontext
        if ($this->isHighPriority($context)) {
            $baseImportance *= 1.5;
        }
        
        // Berücksichtige Abhängigkeiten
        if ($this->hasCriticalDependencies($context)) {
            $baseImportance *= 1.3;
        }
        
        return min(1.0, $baseImportance);
    }
    
    public function getActions(): array {
        return $this->actions;
    }
    
    public function getType(): string {
        return $this->type;
    }
    
    private function evaluateCondition(array $condition, array $context): bool {
        $path = $condition['path'];
        $operator = $condition['operator'];
        $value = $condition['value'];
        
        $actual = $this->getValueFromPath($context, $path);
        
        switch ($operator) {
            case 'equals':
                return $actual === $value;
            case 'contains':
                return is_array($actual) ? in_array($value, $actual) : strpos($actual, $value) !== false;
            case 'greater_than':
                return $actual > $value;
            case 'less_than':
                return $actual < $value;
            case 'exists':
                return $actual !== null;
            default:
                return false;
        }
    }
    
    private function containsIndicator(array $context, string $indicator): bool {
        $json = json_encode($context);
        return stripos($json, $indicator) !== false;
    }
    
    private function getValueFromPath(array $context, string $path) {
        $parts = explode('.', $path);
        $current = $context;
        
        foreach ($parts as $part) {
            if (!isset($current[$part])) {
                return null;
            }
            $current = $current[$part];
        }
        
        return $current;
    }
    
    private function isHighPriority(array $context): bool {
        $highPriorityIndicators = [
            'security',
            'critical',
            'urgent',
            'blocking',
            'high_impact'
        ];
        
        foreach ($highPriorityIndicators as $indicator) {
            if ($this->containsIndicator($context, $indicator)) {
                return true;
            }
        }
        
        return false;
    }
    
    private function hasCriticalDependencies(array $context): bool {
        if (!isset($context['dependencies'])) {
            return false;
        }
        
        $criticalDependencies = [
            'core',
            'security',
            'authentication',
            'database'
        ];
        
        foreach ($context['dependencies'] as $dependency) {
            if (isset($dependency['type']) && in_array($dependency['type'], $criticalDependencies)) {
                return true;
            }
        }
        
        return false;
    }
    
    public function toArray(): array {
        return [
            'type' => $this->type,
            'indicators' => $this->indicators,
            'weight' => $this->weight,
            'conditions' => $this->conditions,
            'actions' => $this->actions
        ];
    }
}
