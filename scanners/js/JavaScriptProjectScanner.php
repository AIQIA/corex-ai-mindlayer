<?php
/**
 * coreX AI MindLayer - JavaScript Project Scanner
 * 
 * Scanner für JavaScript/Node.js basierte Projekte, erkennt gängige JS-Frameworks.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\js;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class JavaScriptProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf JavaScript/Node.js-spezifische Dateien
        return file_exists("$projectPath/package.json") || 
               file_exists("$projectPath/package-lock.json") ||
               file_exists("$projectPath/yarn.lock") ||
               file_exists("$projectPath/webpack.config.js") ||
               count(glob("$projectPath/*.js")) > 0;
    }
    
    /**
     * Führt den Scan für JavaScript/Node.js-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // package.json-basierte Erkennung
        if (file_exists("$projectPath/package.json")) {
            $this->scanPackageJson("$projectPath/package.json");
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
        return 'JavaScript';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 75; // Hohe Priorität für JavaScript-Projekte
    }
    
    /**
     * Analysiert die package.json Datei für Framework-Erkennung
     */
    private function scanPackageJson(string $packageJsonPath): void {
        $packageData = json_decode(file_get_contents($packageJsonPath), true);
        
        if (!isset($packageData['dependencies']) && !isset($packageData['devDependencies'])) {
            return;
        }
        
        $dependencies = array_merge(
            isset($packageData['dependencies']) ? array_keys($packageData['dependencies']) : [],
            isset($packageData['devDependencies']) ? array_keys($packageData['devDependencies']) : []
        );
        
        $frameworkMap = [
            'react' => 'React',
            'vue' => 'Vue.js',
            'angular' => 'Angular',
            'next' => 'Next.js',
            'nuxt' => 'Nuxt.js',
            'express' => 'Express.js',
            'koa' => 'Koa.js',
            'nest' => 'NestJS',
            'gatsby' => 'Gatsby',
            'svelte' => 'Svelte',
            'electron' => 'Electron',
            '@ember' => 'Ember.js',
            'jquery' => 'jQuery',
            'backbone' => 'Backbone.js',
            'meteor' => 'Meteor',
            'fastify' => 'Fastify',
            'hapi' => 'Hapi',
            'sails' => 'Sails.js',
            'adonis' => 'AdonisJS'
        ];
        
        foreach ($dependencies as $dependency) {
            foreach ($frameworkMap as $pattern => $framework) {
                if (strpos($dependency, $pattern) !== false) {
                    $this->frameworks[] = $framework;
                    break;
                }
            }
        }
        
        // Erkennung von Monorepo-Tools
        $monorepoTools = ['lerna', 'nx', '@nrwl/workspace', 'turborepo'];
        foreach ($dependencies as $dependency) {
            if (in_array($dependency, $monorepoTools)) {
                $this->frameworks[] = 'Monorepo';
                break;
            }
        }
        
        // Erkennung von TypeScript
        if (in_array('typescript', $dependencies) || isset($packageData['devDependencies']['typescript'])) {
            $this->frameworks[] = 'TypeScript';
        }
    }
    
    /**
     * Erkennt Frameworks anhand typischer Datei- und Verzeichnismuster
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $detectionRules = [
            // React
            [
                'check' => ['src/App.js', 'src/index.js', 'public/index.html', 'react-app-env.d.ts'],
                'framework' => 'React'
            ],
            // Next.js
            [
                'check' => ['pages/_app.js', 'pages/index.js', 'next.config.js'],
                'framework' => 'Next.js'
            ],
            // Vue.js
            [
                'check' => ['vue.config.js', 'src/main.js', 'src/App.vue'],
                'framework' => 'Vue.js'
            ],
            // Nuxt.js
            [
                'check' => ['nuxt.config.js', 'pages/index.vue'],
                'framework' => 'Nuxt.js'
            ],
            // Angular
            [
                'check' => ['angular.json', 'src/app/app.module.ts', 'src/main.ts'],
                'framework' => 'Angular'
            ],
            // Electron
            [
                'check' => ['electron.js', 'main.electron.js', 'electron/main.js'],
                'framework' => 'Electron'
            ],
            // TypeScript
            [
                'check' => ['tsconfig.json', 'tslint.json', 'src/index.ts'],
                'framework' => 'TypeScript'
            ]
        ];
        
        foreach ($detectionRules as $rule) {
            $matches = 0;
            $required = count($rule['check']);
            
            foreach ($rule['check'] as $checkPath) {
                if (file_exists("$projectPath/$checkPath")) {
                    $matches++;
                }
            }
            
            // Wenn mindestens 2 Kriterien erfüllt sind oder alle bei weniger als 2 Kriterien
            if (($required >= 2 && $matches >= 2) || ($required < 2 && $matches == $required)) {
                if (!in_array($rule['framework'], $this->frameworks)) {
                    $this->frameworks[] = $rule['framework'];
                }
            }
        }
    }
    
    /**
     * Erkennt Frameworks durch Analyse von Code-Mustern
     */
    private function detectByCodePatterns(string $projectPath): void {
        $sampleFiles = array_merge(
            glob("$projectPath/*.js"),
            glob("$projectPath/src/*.js"),
            glob("$projectPath/src/**/*.js"),
            glob("$projectPath/src/*.ts"),
            glob("$projectPath/src/**/*.ts")
        );
        
        $codePatterns = [
            'React' => [
                'import React',
                'React.Component',
                'ReactDOM.render',
                'useState(',
                'useEffect('
            ],
            'Vue.js' => [
                'new Vue(',
                'createApp(',
                'Vue.component(',
                'export default {',
                '<template>'
            ],
            'Angular' => [
                '@Component(',
                '@NgModule(',
                'implements OnInit',
                'platformBrowserDynamic',
                'Injectable'
            ],
            'Express.js' => [
                'const express = require',
                'import express from',
                'app.use(',
                'app.get(',
                'app.listen('
            ],
            'jQuery' => [
                '$(document).ready',
                '$(function',
                '$.ajax',
                'jQuery(',
                '$("#'
            ]
        ];
        
        $sampleLimit = min(15, count($sampleFiles)); // Max. 15 Dateien prüfen
        $sampledFiles = array_slice($sampleFiles, 0, $sampleLimit);
        
        $patternMatches = [];
        
        foreach ($sampledFiles as $file) {
            if (!is_file($file)) continue;
            
            $content = file_get_contents($file);
            
            foreach ($codePatterns as $framework => $patterns) {
                if (!isset($patternMatches[$framework])) {
                    $patternMatches[$framework] = 0;
                }
                
                foreach ($patterns as $pattern) {
                    if (strpos($content, $pattern) !== false) {
                        $patternMatches[$framework]++;
                    }
                }
            }
        }
        
        // Frameworks mit signifikanten Treffern hinzufügen
        foreach ($patternMatches as $framework => $matches) {
            if ($matches >= 2 && !in_array($framework, $this->frameworks)) {
                $this->frameworks[] = $framework;
            }
        }
    }
}
