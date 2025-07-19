<?php

namespace CoreX\AI\MindLayer\ML\Analysis;

class ComplexityAnalyzer {
    private $ast;
    private $metrics = [];
    
    public function __construct(string $code) {
        $this->ast = $this->parseCode($code);
    }
    
    public function analyze(): array {
        $this->calculateCyclomaticComplexity();
        $this->calculateCognitiveComplexity();
        $this->analyzeNestingDepth();
        
        return $this->metrics;
    }
    
    private function calculateCyclomaticComplexity() {
        $complexity = 1; // Basis-Komplexität
        
        $this->traverseAst($this->ast, function($node) use (&$complexity) {
            // Erhöhe Komplexität für Verzweigungen
            if ($this->isDecisionPoint($node)) {
                $complexity++;
            }
        });
        
        $this->metrics['cyclomatic'] = [
            'value' => $complexity,
            'interpretation' => $this->interpretCyclomaticComplexity($complexity),
            'suggestions' => $this->getSuggestions('cyclomatic', $complexity)
        ];
    }
    
    private function calculateCognitiveComplexity() {
        $complexity = 0;
        $nesting = 0;
        
        $this->traverseAst($this->ast, function($node) use (&$complexity, &$nesting) {
            if ($this->isNestingStructure($node)) {
                $complexity += $nesting;
                $nesting++;
            }
            if ($this->isLogicalOperation($node)) {
                $complexity++;
            }
        });
        
        $this->metrics['cognitive'] = [
            'value' => $complexity,
            'interpretation' => $this->interpretCognitiveComplexity($complexity),
            'suggestions' => $this->getSuggestions('cognitive', $complexity)
        ];
    }
    
    private function analyzeNestingDepth() {
        $maxDepth = 0;
        $currentDepth = 0;
        
        $this->traverseAst($this->ast, function($node) use (&$maxDepth, &$currentDepth) {
            if ($this->isNestingStructure($node)) {
                $currentDepth++;
                $maxDepth = max($maxDepth, $currentDepth);
            }
        }, function($node) use (&$currentDepth) {
            if ($this->isNestingStructure($node)) {
                $currentDepth--;
            }
        });
        
        $this->metrics['nesting'] = [
            'value' => $maxDepth,
            'interpretation' => $this->interpretNestingDepth($maxDepth),
            'suggestions' => $this->getSuggestions('nesting', $maxDepth)
        ];
    }
    
    private function interpretCyclomaticComplexity(int $value): string {
        if ($value <= 5) return "Sehr gut wartbar";
        if ($value <= 10) return "Gut wartbar";
        if ($value <= 20) return "Moderate Komplexität";
        if ($value <= 30) return "Hohe Komplexität";
        return "Kritische Komplexität";
    }
    
    private function interpretCognitiveComplexity(int $value): string {
        if ($value <= 5) return "Leicht verständlich";
        if ($value <= 10) return "Gut verständlich";
        if ($value <= 20) return "Moderat komplex";
        if ($value <= 30) return "Schwer verständlich";
        return "Sehr schwer verständlich";
    }
    
    private function interpretNestingDepth(int $value): string {
        if ($value <= 2) return "Optimal";
        if ($value <= 3) return "Gut";
        if ($value <= 4) return "Akzeptabel";
        if ($value <= 5) return "Überdenken";
        return "Zu tief verschachtelt";
    }
    
    private function getSuggestions(string $metric, int $value): array {
        $suggestions = [];
        
        switch ($metric) {
            case 'cyclomatic':
                if ($value > 10) {
                    $suggestions[] = "Methode in kleinere Funktionen aufteilen";
                    $suggestions[] = "Komplexe Bedingungen in separate Funktionen auslagern";
                }
                break;
                
            case 'cognitive':
                if ($value > 15) {
                    $suggestions[] = "Verschachtelungen durch frühe Returns reduzieren";
                    $suggestions[] = "Bedingungen vereinfachen und klarer strukturieren";
                }
                break;
                
            case 'nesting':
                if ($value > 3) {
                    $suggestions[] = "Guard Clauses verwenden";
                    $suggestions[] = "Logik in separate Funktionen auslagern";
                    $suggestions[] = "Verschachtelungstiefe durch Umstrukturierung reduzieren";
                }
                break;
        }
        
        return $suggestions;
    }
    
    private function parseCode(string $code) {
        return token_get_all($code);
    }
    
    private function traverseAst(array $ast, callable $visitor, callable $postVisitor = null) {
        foreach ($ast as $node) {
            $visitor($node);
            
            if (is_array($node) && isset($node['children'])) {
                $this->traverseAst($node['children'], $visitor, $postVisitor);
            }
            
            if ($postVisitor) {
                $postVisitor($node);
            }
        }
    }
    
    private function isDecisionPoint($node): bool {
        if (!is_array($node)) return false;
        
        $decisionTokens = [
            T_IF, T_ELSE, T_ELSEIF, T_SWITCH, T_CASE, 
            T_WHILE, T_DO, T_FOR, T_FOREACH, T_BREAK, 
            T_CONTINUE, T_RETURN
        ];
        
        return in_array($node[0], $decisionTokens);
    }
    
    private function isNestingStructure($node): bool {
        if (!is_array($node)) return false;
        
        $nestingTokens = [
            T_IF, T_SWITCH, T_WHILE, T_DO, T_FOR, 
            T_FOREACH, T_FUNCTION, T_CLASS, T_INTERFACE, 
            T_TRAIT
        ];
        
        return in_array($node[0], $nestingTokens);
    }
    
    private function isLogicalOperation($node): bool {
        if (!is_array($node)) return false;
        
        $logicalTokens = [
            T_LOGICAL_AND, T_LOGICAL_OR, T_LOGICAL_XOR,
            T_BOOLEAN_AND, T_BOOLEAN_OR
        ];
        
        return in_array($node[0], $logicalTokens);
    }
}
