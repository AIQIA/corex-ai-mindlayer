<?php
/**
 * coreX AI MindLayer - Go Project Scanner
 * 
 * Scanner für Go (Golang) basierte Projekte, erkennt gängige Go-Frameworks und Bibliotheken.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\go;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class GoProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf Go-spezifische Dateien
        return file_exists("$projectPath/go.mod") || 
               file_exists("$projectPath/go.sum") ||
               file_exists("$projectPath/Gopkg.toml") ||
               file_exists("$projectPath/Gopkg.lock") ||
               file_exists("$projectPath/glide.yaml") ||
               count(glob("$projectPath/*.go")) > 0;
    }
    
    /**
     * Führt den Scan für Go-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // Go Module basierte Erkennung
        if (file_exists("$projectPath/go.mod")) {
            $this->scanGoMod("$projectPath/go.mod");
        }
        
        // Dep basierte Erkennung
        if (file_exists("$projectPath/Gopkg.toml")) {
            $this->scanGopkgToml("$projectPath/Gopkg.toml");
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
        return 'Go';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 55;
    }
    
    /**
     * Analysiert die go.mod Datei für Framework-Erkennung
     */
    private function scanGoMod(string $goModFile): void {
        $content = file_get_contents($goModFile);
        $lines = explode("\n", $content);
        
        $frameworkMap = [
            'github.com/gin-gonic/gin' => 'Gin',
            'github.com/gorilla/mux' => 'Gorilla Mux',
            'github.com/labstack/echo' => 'Echo',
            'github.com/go-chi/chi' => 'Chi',
            'github.com/gofiber/fiber' => 'Fiber',
            'gorm.io/gorm' => 'GORM',
            'github.com/jinzhu/gorm' => 'GORM',
            'github.com/lib/pq' => 'PostgreSQL Driver',
            'github.com/go-sql-driver/mysql' => 'MySQL Driver',
            'github.com/mattn/go-sqlite3' => 'SQLite Driver',
            'github.com/dgrijalva/jwt-go' => 'JWT Go',
            'github.com/golang/protobuf' => 'Protocol Buffers',
            'github.com/spf13/cobra' => 'Cobra CLI',
            'github.com/spf13/viper' => 'Viper',
            'github.com/prometheus/client_golang' => 'Prometheus Client',
            'go.uber.org/zap' => 'Zap Logger',
            'github.com/stretchr/testify' => 'Testify',
            'github.com/graphql-go/graphql' => 'GraphQL',
            'google.golang.org/grpc' => 'gRPC',
            'go.mongodb.org/mongo-driver' => 'MongoDB Driver',
            'github.com/golang-migrate/migrate' => 'Migrate',
            'github.com/gorilla/websocket' => 'Gorilla WebSocket',
            'github.com/swaggo/swag' => 'Swagger',
            'github.com/go-redis/redis' => 'Redis Client',
            'github.com/hashicorp/consul' => 'Consul',
            'github.com/sirupsen/logrus' => 'Logrus',
            'github.com/gin-contrib/cors' => 'Gin CORS',
            'github.com/golang-jwt/jwt' => 'JWT'
        ];
        
        foreach ($lines as $line) {
            foreach ($frameworkMap as $pattern => $framework) {
                if (strpos($line, $pattern) !== false) {
                    $this->frameworks[] = $framework;
                }
            }
        }
        
        // Go Modules erkannt
        $this->frameworks[] = 'Go Modules';
    }
    
    /**
     * Analysiert die Gopkg.toml Datei für Framework-Erkennung
     */
    private function scanGopkgToml(string $gopkgFile): void {
        $content = file_get_contents($gopkgFile);
        
        $frameworkMap = [
            'github.com/gin-gonic/gin' => 'Gin',
            'github.com/gorilla/mux' => 'Gorilla Mux',
            'github.com/labstack/echo' => 'Echo',
            'github.com/go-chi/chi' => 'Chi',
            'github.com/gofiber/fiber' => 'Fiber',
            'github.com/jinzhu/gorm' => 'GORM',
            'github.com/lib/pq' => 'PostgreSQL Driver',
            'github.com/go-sql-driver/mysql' => 'MySQL Driver',
            'github.com/mattn/go-sqlite3' => 'SQLite Driver'
        ];
        
        foreach ($frameworkMap as $pattern => $framework) {
            if (strpos($content, $pattern) !== false) {
                $this->frameworks[] = $framework;
            }
        }
        
        // Dep erkannt
        $this->frameworks[] = 'Dep';
    }
    
    /**
     * Erkennt Frameworks basierend auf typischen Dateien und Verzeichnissen
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $indicators = [
            // Docker und Kubernetes
            ["$projectPath/Dockerfile" => 'Docker'],
            ["$projectPath/docker-compose.yml" => 'Docker Compose'],
            ["$projectPath/k8s" => 'Kubernetes'],
            ["$projectPath/kubernetes" => 'Kubernetes'],
            
            // Typische Go-Strukturen
            ["$projectPath/cmd" => 'Standard Go Layout'],
            ["$projectPath/pkg" => 'Standard Go Layout'],
            ["$projectPath/internal" => 'Standard Go Layout'],
            ["$projectPath/api" => 'API Project'],
            ["$projectPath/docs/swagger" => 'Swagger'],
        ];
        
        foreach ($indicators as $path => $framework) {
            if (is_dir($path) || file_exists($path)) {
                $this->frameworks[] = $framework;
            }
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
    
    /**
     * Erkennt Frameworks basierend auf Code-Mustern in Go-Dateien
     */
    private function detectByCodePatterns(string $projectPath): void {
        $goFiles = array_merge(
            glob("$projectPath/*.go"),
            glob("$projectPath/*/*.go"),
            glob("$projectPath/*/*/*.go")
        );
        
        $patternMap = [
            'import "github.com/gin-gonic/gin"' => 'Gin',
            'import "github.com/gorilla/mux"' => 'Gorilla Mux',
            'import "github.com/labstack/echo"' => 'Echo',
            'import "github.com/go-chi/chi"' => 'Chi',
            'import "github.com/gofiber/fiber"' => 'Fiber',
            'import "gorm.io/gorm"' => 'GORM',
            'import "github.com/jinzhu/gorm"' => 'GORM',
            'import "github.com/lib/pq"' => 'PostgreSQL Driver',
            'import "github.com/go-sql-driver/mysql"' => 'MySQL Driver',
            'import "github.com/mattn/go-sqlite3"' => 'SQLite Driver',
            'import "github.com/dgrijalva/jwt-go"' => 'JWT Go',
            'import "github.com/golang/protobuf"' => 'Protocol Buffers',
            'import "github.com/spf13/cobra"' => 'Cobra CLI',
            'import "github.com/spf13/viper"' => 'Viper',
            'import "github.com/prometheus/client_golang"' => 'Prometheus Client',
            'import "go.uber.org/zap"' => 'Zap Logger',
            'import "github.com/stretchr/testify"' => 'Testify',
            'import "github.com/graphql-go/graphql"' => 'GraphQL',
            'import "google.golang.org/grpc"' => 'gRPC',
            'import "go.mongodb.org/mongo-driver"' => 'MongoDB Driver',
            'func main()' => 'Go Application',
            'http.HandleFunc(' => 'Go Net/HTTP',
            'http.ListenAndServe(' => 'Go Web Server',
            'func TestMain(' => 'Go Tests',
            'func Test' => 'Go Tests',
            'type Server struct {' => 'Go Server',
            'os.Getenv(' => 'Environment Variables',
            'database/sql' => 'SQL Database',
            'context.Context' => 'Context API'
        ];
        
        $matches = 0;
        
        foreach ($goFiles as $file) {
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
