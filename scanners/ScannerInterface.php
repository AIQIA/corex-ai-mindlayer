<?php
/**
 * coreX AI MindLayer - Scanner Interface
 * 
 * Definiert die grundlegende Schnittstelle, die alle Sprachspezifischen Scanner implementieren müssen.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners;

interface ScannerInterface {
    /**
     * Prüft, ob der Scanner für dieses Projekt anwendbar ist
     * 
     * @param string $projectPath Der Pfad zum Projektverzeichnis
     * @return bool True, wenn der Scanner anwendbar ist
     */
    public function canHandle(string $projectPath): bool;
    
    /**
     * Führt den Scan des Projekts durch
     * 
     * @param string $projectPath Der Pfad zum Projektverzeichnis
     * @return array Ein Array mit erkannten Frameworks, Mustern und Strukturen
     */
    public function scan(string $projectPath): array;
    
    /**
     * Gibt den Namen der Programmiersprache zurück
     * 
     * @return string Der Name der Programmiersprache
     */
    public function getLanguageName(): string;
    
    /**
     * Gibt den Prioritätswert des Scanners zurück.
     * Ein höherer Wert bedeutet eine höhere Priorität bei der Ausführung.
     * 
     * @return int Prioritätswert (1-100)
     */
    public function getPriority(): int;
}
