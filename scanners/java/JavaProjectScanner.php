<?php
/**
 * coreX AI MindLayer - Java Project Scanner
 * 
 * Scanner für Java-basierte Projekte, erkennt gängige Java-Frameworks und Build-Tools.
 * 
 * @author Sascha Buscher - AIQIA
 * @version 1.0.0
 */

namespace CoreX\AIMindLayer\Scanners\java;

use CoreX\AIMindLayer\Scanners\ScannerInterface;

class JavaProjectScanner implements ScannerInterface {
    private $frameworks = [];
    
    /**
     * Prüft, ob dieser Scanner für das Projekt anwendbar ist
     */
    public function canHandle(string $projectPath): bool {
        // Prüfen auf Java-spezifische Dateien
        return file_exists("$projectPath/pom.xml") || 
               file_exists("$projectPath/build.gradle") ||
               file_exists("$projectPath/build.gradle.kts") ||
               file_exists("$projectPath/gradle.properties") ||
               file_exists("$projectPath/build.xml") ||
               file_exists("$projectPath/.classpath") ||
               file_exists("$projectPath/src/main/java") ||
               count(glob("$projectPath/*.java")) > 0 ||
               count(glob("$projectPath/src/*/*.java")) > 0;
    }
    
    /**
     * Führt den Scan für Java-Projekte durch
     */
    public function scan(string $projectPath): array {
        $this->frameworks = [];
        
        // Maven basierte Erkennung
        if (file_exists("$projectPath/pom.xml")) {
            $this->scanPomXml("$projectPath/pom.xml");
        }
        
        // Gradle basierte Erkennung
        if (file_exists("$projectPath/build.gradle") || file_exists("$projectPath/build.gradle.kts")) {
            $gradleFile = file_exists("$projectPath/build.gradle") 
                ? "$projectPath/build.gradle" 
                : "$projectPath/build.gradle.kts";
            $this->scanGradleFile($gradleFile);
        }
        
        // Ant basierte Erkennung
        if (file_exists("$projectPath/build.xml")) {
            $this->frameworks[] = 'Apache Ant';
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
        return 'Java';
    }
    
    /**
     * Gibt die Priorität des Scanners zurück
     */
    public function getPriority(): int {
        return 60;
    }
    
    /**
     * Analysiert die pom.xml Datei für Framework-Erkennung
     */
    private function scanPomXml(string $pomFile): void {
        $this->frameworks[] = 'Maven';
        
        $content = file_get_contents($pomFile);
        
        $frameworkDetectors = [
            'org.springframework' => 'Spring',
            'org.springframework.boot' => 'Spring Boot',
            'org.hibernate' => 'Hibernate',
            'javax.servlet' => 'Servlet API',
            'jakarta.servlet' => 'Jakarta EE',
            'javax.ws.rs' => 'JAX-RS',
            'org.apache.wicket' => 'Apache Wicket',
            'org.apache.struts' => 'Apache Struts',
            'com.vaadin' => 'Vaadin',
            'org.eclipse.jetty' => 'Jetty',
            'org.apache.tomcat' => 'Tomcat',
            'io.quarkus' => 'Quarkus',
            'io.micronaut' => 'Micronaut',
            'org.apache.kafka' => 'Apache Kafka',
            'org.elasticsearch' => 'Elasticsearch',
            'io.vertx' => 'Vert.x',
            'org.thymeleaf' => 'Thymeleaf',
            'org.apache.camel' => 'Apache Camel',
            'org.jboss' => 'JBoss',
            'com.fasterxml.jackson' => 'Jackson',
            'org.junit' => 'JUnit',
            'org.testng' => 'TestNG',
            'org.mockito' => 'Mockito',
            'org.slf4j' => 'SLF4J',
            'ch.qos.logback' => 'Logback',
            'org.apache.logging.log4j' => 'Log4j'
        ];
        
        foreach ($frameworkDetectors as $pattern => $framework) {
            if (strpos($content, $pattern) !== false) {
                $this->frameworks[] = $framework;
            }
        }
    }
    
    /**
     * Analysiert die build.gradle Datei für Framework-Erkennung
     */
    private function scanGradleFile(string $gradleFile): void {
        $this->frameworks[] = 'Gradle';
        
        $content = file_get_contents($gradleFile);
        
        $frameworkDetectors = [
            'org.springframework' => 'Spring',
            'org.springframework.boot' => 'Spring Boot',
            'org.jetbrains.kotlin' => 'Kotlin',
            'com.android' => 'Android',
            'io.quarkus' => 'Quarkus',
            'io.micronaut' => 'Micronaut',
            'io.vertx' => 'Vert.x',
            'org.hibernate' => 'Hibernate',
            'javax.servlet' => 'Servlet API',
            'jakarta.servlet' => 'Jakarta EE',
            'com.graphql-java' => 'GraphQL Java',
            'org.junit' => 'JUnit'
        ];
        
        foreach ($frameworkDetectors as $pattern => $framework) {
            if (strpos($content, $pattern) !== false) {
                $this->frameworks[] = $framework;
            }
        }
    }
    
    /**
     * Erkennt Frameworks basierend auf typischen Dateien und Verzeichnissen
     */
    private function detectFrameworksByFiles(string $projectPath): void {
        $indicators = [
            // Android
            ["$projectPath/src/main/res" => 'Android'],
            ["$projectPath/AndroidManifest.xml" => 'Android'],
            
            // Spring
            ["$projectPath/src/main/resources/application.properties" => 'Spring Boot'],
            ["$projectPath/src/main/resources/application.yml" => 'Spring Boot'],
            ["$projectPath/src/main/webapp/WEB-INF" => 'Java Web Application'],
            
            // JavaFX
            ["$projectPath/src/main/resources/fxml" => 'JavaFX'],
            
            // JEE
            ["$projectPath/src/main/webapp/WEB-INF/web.xml" => 'Java EE'],
            ["$projectPath/src/main/webapp/WEB-INF/beans.xml" => 'CDI/Java EE'],
            ["$projectPath/src/main/webapp/WEB-INF/faces-config.xml" => 'JSF/Java EE'],
            
            // Andere Frameworks
            ["$projectPath/src/main/resources/META-INF/microprofile-config.properties" => 'MicroProfile'],
            ["$projectPath/src/main/resources/META-INF/persistence.xml" => 'JPA'],
        ];
        
        foreach ($indicators as $path => $framework) {
            if (is_dir($path) || file_exists($path)) {
                $this->frameworks[] = $framework;
            }
        }
        
        $this->frameworks = array_unique($this->frameworks);
    }
    
    /**
     * Erkennt Frameworks basierend auf Code-Mustern in Java-Dateien
     */
    private function detectByCodePatterns(string $projectPath): void {
        $javaFiles = array_merge(
            glob("$projectPath/*.java"),
            glob("$projectPath/src/*/*.java"),
            glob("$projectPath/src/main/java/*/*.java"),
            glob("$projectPath/src/main/java/*/*/*.java")
        );
        
        $patternMap = [
            'import org.springframework' => 'Spring',
            'import javax.servlet' => 'Servlet API',
            'import jakarta.servlet' => 'Jakarta EE',
            '@RestController' => 'Spring REST',
            '@Controller' => 'Spring MVC',
            '@Entity' => 'JPA',
            'import javax.persistence' => 'JPA',
            'import jakarta.persistence' => 'Jakarta Persistence',
            'import android.' => 'Android',
            'import androidx.' => 'AndroidX',
            'import javafx.' => 'JavaFX',
            'import javax.swing' => 'Swing',
            'import java.awt' => 'AWT',
            'import javax.ws.rs' => 'JAX-RS',
            'import io.quarkus' => 'Quarkus',
            'import io.micronaut' => 'Micronaut',
            'import io.vertx' => 'Vert.x',
            'import org.apache.kafka' => 'Apache Kafka',
            'import org.apache.hadoop' => 'Apache Hadoop',
            'import org.apache.spark' => 'Apache Spark'
        ];
        
        $matches = 0;
        
        foreach ($javaFiles as $file) {
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
