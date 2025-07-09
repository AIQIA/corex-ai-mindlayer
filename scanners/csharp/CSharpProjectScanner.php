<?php
/**
 * coreX AI MindLayer - C# Project Scanner
 * 
 * Scanner für C#/.NET basierte Projekte, erkennt gängige .NET Frameworks und Projekte.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\csharp;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class CSharpProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf C#/.NET-spezifische Dateien
        return file_exists("$projectPath/global.json") || 
               count(glob("$projectPath/*.csproj")) > 0 ||
               count(glob("$projectPath/*.sln")) > 0 ||
               count(glob("$projectPath/*/*.csproj")) > 0 ||
               count(glob("$projectPath/*.cs")) > 0 ||
               file_exists("$projectPath/nuget.config");
    }
    
    /**
     * Führt den Scan für C#/.NET-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // Projekt-Datei basierte Erkennung
        $this->scanCsprojFiles($projectPath);
        
        // Solution-Datei basierte Erkennung
        $this->scanSolutionFiles($projectPath);
        
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
        return 'C#';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 65;
    }
    
    /**
     * Analysiert .csproj Dateien für Framework-Erkennung
     */
    private function scanCsprojFiles(string $projectPath): void {
        $csprojFiles = array_merge(
            glob("$projectPath/*.csproj"),
            glob("$projectPath/*/*.csproj")
        );
        
        foreach ($csprojFiles as $csprojFile) {
            if (!file_exists($csprojFile)) continue;
            
            $content = file_get_contents($csprojFile);
            
            // .NET Framework Version erkennen
            if (preg_match('/<TargetFrameworkVersion>v([0-9\.]+)<\/TargetFrameworkVersion>/i', $content, $matches)) {
                $this->frameworks[] = '.NET Framework ' . $matches[1];
            }
            
            // .NET Core / .NET 5+ erkennen
            if (preg_match('/<TargetFramework>net([0-9\.]+)<\/TargetFramework>/i', $content, $matches)) {
                $frameworkVersion = $matches[1];
                if ($frameworkVersion >= 5) {
                    $this->frameworks[] = '.NET ' . $frameworkVersion;
                } else {
                    $this->frameworks[] = '.NET Core ' . $frameworkVersion;
                }
            }
            
            // ASP.NET Core erkennen
            if (strpos($content, 'Microsoft.AspNetCore') !== false) {
                $this->frameworks[] = 'ASP.NET Core';
            }
            
            // Blazor erkennen
            if (strpos($content, 'Microsoft.AspNetCore.Components.Web') !== false || 
                strpos($content, 'Microsoft.AspNetCore.Components.WebAssembly') !== false) {
                $this->frameworks[] = 'Blazor';
            }
            
            // Entity Framework erkennen
            if (strpos($content, 'Microsoft.EntityFrameworkCore') !== false) {
                $this->frameworks[] = 'Entity Framework Core';
            }
            
            // MAUI erkennen
            if (strpos($content, 'Microsoft.Maui') !== false) {
                $this->frameworks[] = 'MAUI';
            }
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
    
    /**
     * Analysiert .sln Dateien für Projekt-Struktur
     */
    private function scanSolutionFiles(string $projectPath): void {
        $slnFiles = glob("$projectPath/*.sln");
        
        if (count($slnFiles) > 0) {
            $this->frameworks[] = 'Visual Studio Solution';
        }
    }
    
    /**
     * Erkennt Frameworks basierend auf typischen Dateien und Verzeichnissen
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $indicators = [
            // Xamarin
            ["$projectPath/Resources/values" => 'Xamarin'],
            ["$projectPath/Resources/layout" => 'Xamarin.Android'],
            ["$projectPath/*.iOS" => 'Xamarin.iOS'],
            
            // Unity
            ["$projectPath/Assets" => 'Unity'],
            ["$projectPath/ProjectSettings" => 'Unity'],
            
            // Windows Forms
            ["$projectPath/Form1.cs" => 'Windows Forms'],
            ["$projectPath/Form1.Designer.cs" => 'Windows Forms'],
            
            // WPF
            ["$projectPath/App.xaml" => 'WPF'],
            ["$projectPath/MainWindow.xaml" => 'WPF'],
            
            // Weitere .NET Typen
            ["$projectPath/Web.config" => 'ASP.NET'],
            ["$projectPath/Global.asax" => 'ASP.NET'],
            ["$projectPath/Startup.cs" => 'ASP.NET Core']
        ];
        
        foreach ($indicators as $path => $framework) {
            if (is_dir($path) || (is_string($path) && file_exists($path)) || 
                (!is_string($path) && count(glob($path)) > 0)) {
                $this->frameworks[] = $framework;
            }
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
    
    /**
     * Erkennt Frameworks basierend auf Code-Mustern in .cs Dateien
     */
    private function detectByCodePatterns(string $projectPath): void {
        $codeFiles = array_merge(
            glob("$projectPath/*.cs"),
            glob("$projectPath/*/*.cs"),
            glob("$projectPath/*/*/*.cs")
        );
        
        $patternMap = [
            'using Microsoft.AspNetCore' => 'ASP.NET Core',
            'using Microsoft.EntityFrameworkCore' => 'Entity Framework Core',
            'using Xamarin' => 'Xamarin',
            'using System.Windows.Forms' => 'Windows Forms',
            'using System.Web.Mvc' => 'ASP.NET MVC',
            'using System.Web.Http' => 'ASP.NET Web API',
            'using Microsoft.ML' => 'ML.NET',
            'using Blazorise' => 'Blazorise',
            'using Microsoft.Azure' => 'Azure SDK',
            'using Avalonia' => 'Avalonia UI',
            'using Microsoft.Extensions.Hosting' => '.NET Worker Service',
            'using System.Windows' => 'WPF',
            'using Unity' => 'Unity',
            'using MonoGame' => 'MonoGame'
        ];
        
        $matches = 0;
        
        foreach ($codeFiles as $file) {
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
