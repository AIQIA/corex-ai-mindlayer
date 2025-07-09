#!/usr/bin/env node

/**
 * coreX AI MindLayer - NPM Plugin
 * 
 * Hauptmodul für das NPM Plugin zur .ai.json Verwaltung
 */

const fs = require('fs');
const path = require('path');

/**
 * Lädt die .ai.json für ein Projekt
 * @param {string} projectPath - Pfad zum Projekt (optional, Standard: aktuelles Verzeichnis)
 * @returns {Object} .ai.json Inhalt oder leeres Objekt
 */
function loadAiJson(projectPath = process.cwd()) {
  const aiJsonPath = path.join(projectPath, '.ai.json');
  
  try {
    if (fs.existsSync(aiJsonPath)) {
      return JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
    }
  } catch (error) {
    console.error(`Fehler beim Laden der .ai.json: ${error.message}`);
  }
  
  return {};
}

/**
 * Speichert die .ai.json für ein Projekt
 * @param {Object} aiJson - .ai.json Inhalt
 * @param {string} projectPath - Pfad zum Projekt (optional, Standard: aktuelles Verzeichnis)
 * @returns {boolean} Erfolg
 */
function saveAiJson(aiJson, projectPath = process.cwd()) {
  const aiJsonPath = path.join(projectPath, '.ai.json');
  
  try {
    fs.writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Fehler beim Speichern der .ai.json: ${error.message}`);
    return false;
  }
}

/**
 * Aktualisiert .ai.json Dependencies basierend auf package.json
 * @param {string} projectPath - Pfad zum Projekt (optional, Standard: aktuelles Verzeichnis)
 * @returns {boolean} Erfolg
 */
function syncDependencies(projectPath = process.cwd()) {
  try {
    // package.json laden
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // .ai.json laden
    const aiJson = loadAiJson(projectPath);
    if (!aiJson.architecture) aiJson.architecture = {};
    if (!aiJson.architecture.dependencies) aiJson.architecture.dependencies = [];
    
    // Dependencies aktualisieren
    const existingDeps = aiJson.architecture.dependencies;
    
    // NPM dependencies
    if (packageJson.dependencies) {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        const existingIndex = existingDeps.findIndex(d => d.name === name);
        if (existingIndex >= 0) {
          existingDeps[existingIndex].version = version;
        } else {
          existingDeps.push({ name, version, type: 'npm' });
        }
      });
    }
    
    // Speichern
    return saveAiJson(aiJson, projectPath);
  } catch (error) {
    console.error(`Fehler bei syncDependencies: ${error.message}`);
    return false;
  }
}

/**
 * Aktualisiert .ai.json basierend auf dem gesamten Projekt
 * @param {string} projectPath - Pfad zum Projekt (optional, Standard: aktuelles Verzeichnis)
 * @returns {Object} Aktualisierte .ai.json
 */
function updateAiJsonFromProject(projectPath = process.cwd()) {
  const aiJson = loadAiJson(projectPath);
  
  // Sicherstellen, dass die Grundstruktur existiert
  if (!aiJson.project) aiJson.project = {};
  if (!aiJson.architecture) aiJson.architecture = {};
  
  // Aktualisiere Project aus package.json
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Projekt-Informationen übernehmen
      if (packageJson.name && !aiJson.project.name) {
        aiJson.project.name = packageJson.name;
      }
      
      if (packageJson.version) {
        aiJson.project.version = packageJson.version;
      }
      
      if (packageJson.description && !aiJson.project.description) {
        aiJson.project.description = packageJson.description;
      }
      
      // Aktualisiere Abhängigkeiten
      syncDependencies(projectPath);
    }
  } catch (error) {
    console.error(`Fehler beim Verarbeiten von package.json: ${error.message}`);
  }
  
  // Aktualisiere Features basierend auf dem Projektinhalt
  updateProjectFeatures(aiJson, projectPath);
  
  // Speichern der aktualisierten .ai.json
  saveAiJson(aiJson, projectPath);
  
  return aiJson;
}

/**
 * Aktualisiert die Features in .ai.json basierend auf dem Projektinhalt
 * @param {Object} aiJson - .ai.json Objekt
 * @param {string} projectPath - Projektpfad
 */
function updateProjectFeatures(aiJson, projectPath) {
  if (!aiJson.features) aiJson.features = [];
  
  // Prüfen auf verschiedene Framework-Dateien und Features hinzufügen
  const files = {
    'react': ['src/App.jsx', 'src/App.tsx', 'src/index.jsx', 'src/index.tsx'],
    'vue': ['src/App.vue', 'src/main.js'],
    'angular': ['angular.json', 'src/app/app.module.ts'],
    'express': ['app.js', 'server.js'],
    'nextjs': ['next.config.js', 'pages/index.js', 'pages/index.tsx'],
    'nuxt': ['nuxt.config.js', 'nuxt.config.ts']
  };
  
  // Erkenne Framework
  let detectedFramework = null;
  
  for (const [framework, checkFiles] of Object.entries(files)) {
    for (const file of checkFiles) {
      if (fs.existsSync(path.join(projectPath, file))) {
        detectedFramework = framework;
        break;
      }
    }
    if (detectedFramework) break;
  }
  
  // Framework als Feature hinzufügen, falls erkannt
  if (detectedFramework && !aiJson.features.some(f => f.id === `framework-${detectedFramework}`)) {
    aiJson.features.push({
      "id": `framework-${detectedFramework}`,
      "name": `${detectedFramework.charAt(0).toUpperCase() + detectedFramework.slice(1)} Framework`,
      "type": "framework",
      "category": "core",
      "status": "active"
    });
  }
  
  // Weitere Projektdetails basierend auf Dateistruktur erkennen
  const projectStructure = analyzeProjectStructure(projectPath);
  if (projectStructure.isTypeScript && !aiJson.features.some(f => f.id === 'typescript')) {
    aiJson.features.push({
      "id": "typescript",
      "name": "TypeScript",
      "type": "language",
      "category": "core",
      "status": "active"
    });
  }
  
  if (projectStructure.hasTests && !aiJson.features.some(f => f.id === 'testing')) {
    aiJson.features.push({
      "id": "testing",
      "name": "Testing",
      "type": "development",
      "category": "core",
      "status": "active"
    });
  }
  
  // Speichere auch die Projektstruktur in .ai.json
  if (!aiJson.architecture.structure) {
    aiJson.architecture.structure = {
      "directories": projectStructure.mainDirs
    };
  }
}

/**
 * Analysiert die Projektstruktur
 * @param {string} projectPath - Projektpfad
 * @returns {Object} Erkannte Eigenschaften
 */
function analyzeProjectStructure(projectPath) {
  const result = {
    isTypeScript: false,
    hasTests: false,
    mainDirs: []
  };
  
  // Hauptverzeichnisse ermitteln
  try {
    const rootEntries = fs.readdirSync(projectPath, { withFileTypes: true });
    
    for (const entry of rootEntries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        result.mainDirs.push(entry.name);
        
        // Prüfe auf TypeScript
        if (entry.name === 'src') {
          const srcFiles = fs.readdirSync(path.join(projectPath, 'src'));
          result.isTypeScript = srcFiles.some(file => file.endsWith('.ts') || file.endsWith('.tsx'));
        }
        
        // Prüfe auf Tests
        if (entry.name === 'test' || entry.name === 'tests' || entry.name === '__tests__') {
          result.hasTests = true;
        }
      }
    }
    
    // Prüfe auf tsconfig.json
    if (fs.existsSync(path.join(projectPath, 'tsconfig.json'))) {
      result.isTypeScript = true;
    }
    
    // Prüfe auf Jest oder andere Test-Frameworks
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.devDependencies) {
        const testDeps = ['jest', 'mocha', 'jasmine', 'karma', 'cypress', 'enzyme'];
        result.hasTests = result.hasTests || Object.keys(packageJson.devDependencies).some(dep => testDeps.includes(dep));
      }
    }
  } catch (error) {
    console.error(`Fehler bei der Projektstruktur-Analyse: ${error.message}`);
  }
  
  return result;
}

/**
 * Aktualisiert .ai.json nach einem NPM Install oder Update
 */
function postInstallHook() {
  console.log('📦 Aktualisiere .ai.json nach Paket-Installation...');
  
  const updated = syncDependencies();
  if (updated) {
    console.log('✅ .ai.json wurde mit neuen Abhängigkeiten aktualisiert');
  } else {
    console.log('ℹ️ Keine Änderungen an .ai.json notwendig');
  }
}

module.exports = {
  loadAiJson,
  saveAiJson,
  syncDependencies,
  updateAiJsonFromProject,
  postInstallHook
};
