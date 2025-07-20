<?php

namespace CoreX\AI\MindLayer\ML\Analysis;

class PerformanceAnalyzer {
    private $ast;
    private $metrics = [];
    private $timeComplexity = 'O(1)';
    private $spaceComplexity = 'O(1)';
    
    public function __construct(string $code) {
        $this->ast = $this->parseCode($code);
    }
    
    public function analyze(): array {
        $this->analyzeTimeComplexity();
        $this->analyzeSpaceComplexity();
        $this->findOptimizationPoints();
        
        return $this->metrics;
    }
    
    private function analyzeTimeComplexity() {
        $loops = [];
        $this->traverseAst($this->ast, function($node) use (&$loops) {
            if ($this->isLoop($node)) {
                $depth = $this->calculateLoopDepth($node);
                $iterationType = $this->determineIterationType($node);
                $loops[] = [
                    'depth' => $depth,
                    'type' => $iterationType
                ];
            }
        });
        
        $this->timeComplexity = $this->calculateOverallComplexity($loops);
        $this->metrics['time_complexity'] = [
            'value' => $this->timeComplexity,
            'details' => $this->explainTimeComplexity(),
            'suggestions' => $this->getOptimizationSuggestions('time')
        ];
    }
    
    private function analyzeSpaceComplexity() {
        $allocations = [];
        $this->traverseAst($this->ast, function($node) use (&$allocations) {
            if ($this->isMemoryAllocation($node)) {
                $size = $this->estimateAllocationSize($node);
                $scope = $this->determineAllocationScope($node);
                $allocations[] = [
                    'size' => $size,
                    'scope' => $scope
                ];
            }
        });
        
        $this->spaceComplexity = $this->calculateSpaceComplexity($allocations);
        $this->metrics['space_complexity'] = [
            'value' => $this->spaceComplexity,
            'details' => $this->explainSpaceComplexity(),
            'suggestions' => $this->getOptimizationSuggestions('space')
        ];
    }
    
    private function findOptimizationPoints() {
        $optimizations = [];
        
        // Suche nach ineffizienten Patterns
        $this->traverseAst($this->ast, function($node) use (&$optimizations) {
            if ($this->isInefficient($node)) {
                $optimizations[] = [
                    'type' => $this->determineInefficientPattern($node),
                    'impact' => $this->assessOptimizationImpact($node),
                    'suggestion' => $this->getOptimizationAdvice($node)
                ];
            }
        });
        
        $this->metrics['optimization_points'] = $optimizations;
    }
    
    private function calculateOverallComplexity(array $loops): string {
        if (empty($loops)) return 'O(1)';
        
        $maxDepth = 0;
        $types = [];
        
        foreach ($loops as $loop) {
            $maxDepth = max($maxDepth, $loop['depth']);
            $types[] = $loop['type'];
        }
        
        // Berechne die Gesamtkomplexität
        if ($maxDepth > 1) {
            if (in_array('n^2', $types)) {
                return "O(n^{$maxDepth})";
            } else {
                return "O(n * log n)";
            }
        } else {
            if (in_array('n^2', $types)) {
                return 'O(n^2)';
            } elseif (in_array('n * log n', $types)) {
                return 'O(n * log n)';
            } else {
                return 'O(n)';
            }
        }
    }
    
    private function explainTimeComplexity(): string {
        $explanations = [
            'O(1)' => 'Konstante Laufzeit - Ausgezeichnete Performance',
            'O(log n)' => 'Logarithmische Laufzeit - Sehr gute Performance',
            'O(n)' => 'Lineare Laufzeit - Gute Performance',
            'O(n * log n)' => 'Linearithmische Laufzeit - Akzeptable Performance',
            'O(n^2)' => 'Quadratische Laufzeit - Überprüfung empfohlen',
            'O(n^3)' => 'Kubische Laufzeit - Optimierung empfohlen',
            'O(2^n)' => 'Exponentielle Laufzeit - Kritisch'
        ];
        
        return $explanations[$this->timeComplexity] ?? 'Komplexe Laufzeit - Analyse empfohlen';
    }
    
    private function explainSpaceComplexity(): string {
        $explanations = [
            'O(1)' => 'Konstanter Speicherverbrauch - Optimal',
            'O(log n)' => 'Logarithmischer Speicherverbrauch - Sehr gut',
            'O(n)' => 'Linearer Speicherverbrauch - Akzeptabel',
            'O(n * log n)' => 'Linearithmischer Speicherverbrauch - Überprüfen',
            'O(n^2)' => 'Quadratischer Speicherverbrauch - Optimierung empfohlen'
        ];
        
        return $explanations[$this->spaceComplexity] ?? 'Komplexer Speicherverbrauch - Analyse empfohlen';
    }
    
    private function getOptimizationSuggestions(string $type): array {
        $suggestions = [];
        
        if ($type === 'time') {
            if (strpos($this->timeComplexity, '^') !== false) {
                $suggestions[] = "Verschachtelte Schleifen vermeiden";
                $suggestions[] = "Datenstrukturen für schnelleren Zugriff verwenden";
                $suggestions[] = "Algorithmus überdenken - evtl. Divide & Conquer";
            }
        } else if ($type === 'space') {
            if (strpos($this->spaceComplexity, '^') !== false) {
                $suggestions[] = "Speicherallokationen überprüfen";
                $suggestions[] = "Generator-Funktionen in Betracht ziehen";
                $suggestions[] = "Referenzen statt Kopien verwenden";
            }
        }
        
        return $suggestions;
    }
    
    private function parseCode(string $code) {
        return token_get_all($code);
    }
    
    private function traverseAst(array $ast, callable $visitor) {
        foreach ($ast as $node) {
            $visitor($node);
            
            if (is_array($node) && isset($node['children'])) {
                $this->traverseAst($node['children'], $visitor);
            }
        }
    }
    
    private function isLoop($node): bool {
        if (!is_array($node)) return false;
        return in_array($node[0], [T_FOR, T_FOREACH, T_WHILE, T_DO]);
    }
    
    private function isMemoryAllocation($node): bool {
        if (!is_array($node)) return false;
        return in_array($node[0], [T_NEW, T_ARRAY]);
    }
    
    private function isInefficient($node): bool {
        if (!is_array($node)) return false;
        
        // Beispiele für ineffiziente Patterns
        $inefficientPatterns = [
            'array_merge' => 'Häufiges Array-Merging in Schleifen',
            '.' => 'String-Konkatenation in Schleifen',
            T_NEW => 'Objektinstanziierung in Schleifen'
        ];
        
        return isset($inefficientPatterns[$node[0]]);
    }
    
    // Hilfsmethoden für die Analyse
    private function calculateLoopDepth($node): int {
        // Implementierung der Schleifentiefenberechnung
        return 1;
    }
    
    private function determineIterationType($node): string {
        // Implementierung der Iterationstyp-Bestimmung
        return 'n';
    }
    
    private function estimateAllocationSize($node): string {
        // Implementierung der Größenschätzung
        return 'n';
    }
    
    private function determineAllocationScope($node): string {
        // Implementierung der Scope-Bestimmung
        return 'local';
    }
    
    private function calculateSpaceComplexity(array $allocations): string {
        // Implementierung der Speicherkomplexitätsberechnung
        return 'O(n)';
    }
    
    private function determineInefficientPattern($node): string {
        // Implementierung der Pattern-Erkennung
        return 'unoptimized_loop';
    }
    
    private function assessOptimizationImpact($node): string {
        // Implementierung der Impact-Bewertung
        return 'medium';
    }
    
    private function getOptimizationAdvice($node): string {
        // Implementierung der Optimierungsvorschläge
        return 'Consider optimizing loop structure';
    }
}
