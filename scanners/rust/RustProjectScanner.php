<?php
/**
 * coreX AI MindLayer - Rust Project Scanner
 * 
 * Scanner für Rust basierte Projekte, erkennt gängige Rust-Frameworks und Crates.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\rust;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class RustProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf Rust-spezifische Dateien
        return file_exists("$projectPath/Cargo.toml") || 
               file_exists("$projectPath/Cargo.lock") ||
               file_exists("$projectPath/rust-toolchain.toml") ||
               file_exists("$projectPath/rust-toolchain") ||
               count(glob("$projectPath/src/*.rs")) > 0;
    }
    
    /**
     * Führt den Scan für Rust-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // Cargo.toml basierte Erkennung
        if (file_exists("$projectPath/Cargo.toml")) {
            $this->scanCargoToml("$projectPath/Cargo.toml");
        }
        
        // Datei- und Verzeichnisbasierte Erkennung
        $this->detectFrameworksByFiles($projectPath);
        
        // Erkennung basierend auf Code-Mustern
        $this->detectByCodePatterns($projectPath);
        
        return $this->frameworks;
    }
    
    /**
     * Gibt den Namen der unterstützten Sprache zurück
     */
    public function getLanguageName(): string {
        return 'Rust';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 50;
    }
    
    /**
     * Analysiert die Cargo.toml Datei für Framework-Erkennung
     */
    private function scanCargoToml(string $cargoTomlPath): void {
        $content = file_get_contents($cargoTomlPath);
        
        $frameworkMap = [
            'actix-web' => 'Actix Web',
            'rocket' => 'Rocket',
            'warp' => 'Warp',
            'axum' => 'Axum',
            'diesel' => 'Diesel ORM',
            'tokio' => 'Tokio',
            'sqlx' => 'SQLx',
            'serde' => 'Serde',
            'rusqlite' => 'Rusqlite',
            'mongodb' => 'MongoDB',
            'redis' => 'Redis',
            'reqwest' => 'Reqwest',
            'hyper' => 'Hyper',
            'tonic' => 'Tonic (gRPC)',
            'prost' => 'Prost (Protocol Buffers)',
            'juniper' => 'Juniper (GraphQL)',
            'async-graphql' => 'Async-GraphQL',
            'yew' => 'Yew (WebAssembly)',
            'iced' => 'Iced (GUI)',
            'tracing' => 'Tracing',
            'log' => 'Log',
            'env_logger' => 'Env Logger',
            'clap' => 'Clap (CLI)',
            'structopt' => 'StructOpt',
            'anyhow' => 'Anyhow',
            'thiserror' => 'ThisError',
            'futures' => 'Futures',
            'chrono' => 'Chrono',
            'uuid' => 'UUID',
            'rand' => 'Rand',
            'serde_json' => 'Serde JSON',
            'serde_yaml' => 'Serde YAML',
            'dotenv' => 'Dotenv',
            'config' => 'Config',
            'lettre' => 'Lettre (Email)',
            'aws-sdk' => 'AWS SDK',
            'image' => 'Image',
            'rust-embed' => 'Rust-Embed',
            'wasm-bindgen' => 'WebAssembly',
            'web-sys' => 'Web-sys'
        ];
        
        foreach ($frameworkMap as $pattern => $framework) {
            if (preg_match('/\b' . preg_quote($pattern) . '\s*=/', $content)) {
                $this->frameworks[] = $framework;
            }
        }
        
        // Rust Cargo erkannt
        $this->frameworks[] = 'Cargo';
    }
    
    /**
     * Erkennt Frameworks basierend auf typischen Dateien und Verzeichnissen
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $indicators = [
            // Projektstrukturen
            ["$projectPath/src/main.rs" => 'Rust Binary'],
            ["$projectPath/src/lib.rs" => 'Rust Library'],
            ["$projectPath/benches" => 'Rust Benchmarks'],
            ["$projectPath/examples" => 'Rust Examples'],
            ["$projectPath/migrations" => 'Database Migrations'],
            ["$projectPath/.cargo" => 'Cargo Configuration'],
            
            // Docker und Kubernetes
            ["$projectPath/Dockerfile" => 'Docker'],
            ["$projectPath/docker-compose.yml" => 'Docker Compose'],
            ["$projectPath/k8s" => 'Kubernetes'],
            
            // Web Frameworks
            ["$projectPath/templates" => 'Web Templates'],
            ["$projectPath/static" => 'Static Assets']
        ];
        
        foreach ($indicators as $path => $framework) {
            if (is_dir($path) || file_exists($path)) {
                $this->frameworks[] = $framework;
            }
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
    
    /**
     * Erkennt Frameworks basierend auf Code-Mustern in Rust-Dateien
     */
    private function detectByCodePatterns(string $projectPath): void {
        $rustFiles = array_merge(
            glob("$projectPath/src/*.rs"),
            glob("$projectPath/src/*/*.rs"),
            glob("$projectPath/src/*/*/*.rs")
        );
        
        $patternMap = [
            'use actix_web' => 'Actix Web',
            'use rocket' => 'Rocket',
            'use warp' => 'Warp',
            'use axum' => 'Axum',
            'use diesel' => 'Diesel ORM',
            'use tokio' => 'Tokio',
            'use sqlx' => 'SQLx',
            'use serde' => 'Serde',
            'use rusqlite' => 'Rusqlite',
            'use mongodb' => 'MongoDB',
            'use redis' => 'Redis',
            'use reqwest' => 'Reqwest',
            'use hyper' => 'Hyper',
            'use tonic' => 'Tonic (gRPC)',
            'use prost' => 'Prost (Protocol Buffers)',
            'use juniper' => 'Juniper (GraphQL)',
            'use async_graphql' => 'Async-GraphQL',
            'use yew' => 'Yew (WebAssembly)',
            'use iced' => 'Iced (GUI)',
            'use tracing' => 'Tracing',
            'use log' => 'Log',
            'use env_logger' => 'Env Logger',
            'use clap' => 'Clap (CLI)',
            'use structopt' => 'StructOpt',
            'use anyhow' => 'Anyhow',
            'use thiserror' => 'ThisError',
            'use futures' => 'Futures',
            'use chrono' => 'Chrono',
            'use uuid' => 'UUID',
            'use rand' => 'Rand',
            'use serde_json' => 'Serde JSON',
            'use serde_yaml' => 'Serde YAML',
            'use dotenv' => 'Dotenv',
            'use config' => 'Config',
            'async fn main()' => 'Async Rust',
            'fn main()' => 'Rust Application',
            '#[tokio::main]' => 'Tokio Runtime',
            '#[actix_web::main]' => 'Actix Web',
            '#[rocket::main]' => 'Rocket',
            '#[derive(Debug)]' => 'Debug Trait',
            '#[derive(Serialize)]' => 'Serde Serialize',
            '#[derive(Deserialize)]' => 'Serde Deserialize',
            '#[derive(Clone)]' => 'Clone Trait',
            '#[derive(PartialEq)]' => 'PartialEq Trait'
        ];
        
        $matches = 0;
        
        foreach ($rustFiles as $file) {
            if ($matches > 20) break; // Limit the number of files to scan for performance
            
            $content = file_get_contents($file);
            foreach ($patternMap as $pattern => $framework) {
                if (strpos($content, $pattern) !== false) {
                    $this->frameworks[] = $framework;
                }
            }
            
            $matches++;
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
}
