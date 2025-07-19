<?php

namespace Tests\CoreX\AI\MindLayer\ML\Communication;

use PHPUnit\Framework\TestCase;
use CoreX\AI\MindLayer\ML\Communication\CommunicationEngine;
use CoreX\AI\MindLayer\ML\Context\ContextEngine;

class CommunicationEngineTest extends TestCase {
    private $contextEngine;
    private $communicationEngine;
    
    protected function setUp(): void {
        $this->contextEngine = new ContextEngine();
        $this->communicationEngine = new CommunicationEngine($this->contextEngine);
    }
    
    public function testBasicRequestProcessing() {
        $input = "Analysiere die Performance des ML-Systems";
        $context = [
            'module' => 'performance',
            'scope' => 'ml-system',
            'current_state' => [
                'cpu_usage' => 45,
                'memory_usage' => 1024,
                'response_time' => 0.8
            ]
        ];
        
        $result = $this->communicationEngine->processRequest($input, $context);
        
        $this->assertArrayHasKey('intent', $result);
        $this->assertArrayHasKey('response', $result);
        $this->assertArrayHasKey('context_awareness', $result);
        $this->assertArrayHasKey('confidence', $result);
        
        $this->assertEquals('code_analysis', $result['intent']['primary']);
        $this->assertGreaterThan(0.7, $result['confidence']);
    }
    
    public function testContextAwareResponse() {
        $input = "Implementiere eine neue Feature";
        $context = [
            'module' => 'features',
            'recent_changes' => [
                'files_changed' => ['context-engine.php', 'learning-experience.php'],
                'commit_messages' => ['Added context analysis', 'Improved learning']
            ],
            'development_focus' => 'ml-capabilities'
        ];
        
        $result = $this->communicationEngine->processRequest($input, $context);
        
        $this->assertArrayHasKey('context_awareness', $result);
        $this->assertArrayHasKey('applied_context', $result['context_awareness']);
        $this->assertNotEmpty($result['context_awareness']['applied_context']);
    }
    
    public function testIntentRecognition() {
        $testCases = [
            [
                'input' => 'Dokumentiere die neue Funktion',
                'expected_intent' => 'documentation',
                'expected_params' => ['format' => 'markdown']
            ],
            [
                'input' => 'Überprüfe den Code auf Fehler',
                'expected_intent' => 'code_analysis',
                'expected_params' => ['scope' => 'locally']
            ],
            [
                'input' => 'Erstelle ein neues Feature mit hoher Priorität',
                'expected_intent' => 'feature_request',
                'expected_params' => ['priority' => 'high']
            ]
        ];
        
        foreach ($testCases as $test) {
            $result = $this->communicationEngine->processRequest($test['input'], []);
            
            $this->assertEquals(
                $test['expected_intent'],
                $result['intent']['primary'],
                "Failed intent recognition for: {$test['input']}"
            );
            
            foreach ($test['expected_params'] as $param => $value) {
                $this->assertEquals(
                    $value,
                    $result['intent']['parameters'][$param],
                    "Failed parameter check for: $param"
                );
            }
        }
    }
    
    public function testLearningAndMemory() {
        // Erste Anfrage
        $input1 = "Analysiere die Performance";
        $context1 = ['module' => 'performance'];
        $result1 = $this->communicationEngine->processRequest($input1, $context1);
        
        // Zweite verwandte Anfrage
        $input2 = "Zeige mir die Details zur letzten Performance-Analyse";
        $context2 = ['module' => 'performance'];
        $result2 = $this->communicationEngine->processRequest($input2, $context2);
        
        // Die zweite Antwort sollte Bezug auf die erste nehmen
        $this->assertNotEmpty($result2['context_awareness']['relevant_patterns']);
        $this->assertGreaterThan(
            $result1['confidence'],
            $result2['confidence'],
            "Confidence should increase with context"
        );
    }
    
    public function testResponseQuality() {
        $input = "Analysiere die Performance des ML-Systems";
        $context = [
            'module' => 'performance',
            'target_audience' => 'developers',
            'complexity_level' => 'advanced'
        ];
        
        // Füge einige Erfahrungen hinzu
        for ($i = 0; $i < 3; $i++) {
            $this->communicationEngine->processRequest(
                "Analysiere System Performance",
                ['module' => 'performance']
            );
        }
        
        $result = $this->communicationEngine->processRequest($input, $context);
        
        $response = $result['response'];
        
        $this->assertArrayHasKey('type', $response);
        $this->assertArrayHasKey('content', $response);
        $this->assertArrayHasKey('actions', $response);
        $this->assertArrayHasKey('context_references', $response);
        
        // Prüfe Qualitätsmerkmale
        $this->assertNotEmpty($response['content']);
        $this->assertGreaterThan(0.8, $result['confidence']);
    }
    
    public function testErrorHandling() {
        // Test mit leerem Input
        $result = $this->communicationEngine->processRequest('', []);
        $this->assertArrayHasKey('error', $result);
        $this->assertEquals('Input cannot be empty', $result['message']);
        $this->assertEquals(0, $result['confidence']);
        
        // Test mit undeutlichem Input
        $result = $this->communicationEngine->processRequest('xyz', []);
        $this->assertArrayNotHasKey('error', $result);
        $this->assertEquals('unknown', $result['intent']['primary']);
        $this->assertEquals(0.3, $result['confidence']);
    }
}
