#!/usr/bin/env node

/**
 * coreX AI MindLayer - Docker Integration
 * 
 * Dieses Script analysiert Dockerfile und docker-compose.yml Dateien
 * und aktualisiert die .ai.json mit den gefundenen Informationen.
 * 
 * Verwendung:
 * - `node docker-scanner.js` (standard)
 * - `node docker-scanner.js --verbose` (ausführliche Ausgabe)
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const yaml = require('js-yaml'); // Abhängigkeit für YAML-Parsing
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Konfiguration
const CONFIG = {
  aiJsonPath: '.ai.json',
  dockerfilePaths: ['Dockerfile', 'docker/Dockerfile', '.docker/Dockerfile'],
  dockerComposePaths: ['docker-compose.yml', 'docker-compose.yaml'],
  verbose: false
};

// CLI Argumente parsen
const args = process.argv.slice(2);
CONFIG.verbose = args.includes('--verbose');

/**
 * Haupt-Ausführungsfunktion
 */
async function runDockerScanner() {
  try {
    console.log('🐳 coreX AI MindLayer - Docker Scanner\n');
    
    // .ai.json laden oder erstellen
    let aiJsonContent = await loadAiJson();
    
    if (!aiJsonContent) {
      console.error('❌ Keine gültige .ai.json gefunden. Bitte zuerst erstellen.');
      process.exit(1);
    }
    
    console.log('✅ .ai.json erfolgreich geladen');
    
    // Ensure infrastructure section exists
    if (!aiJsonContent.architecture) {
      aiJsonContent.architecture = {};
    }
    
    if (!aiJsonContent.architecture.infrastructure) {
      aiJsonContent.architecture.infrastructure = {};
    }
    
    // Docker-Informationen sammeln
    const dockerInfo = {
      containers: [],
      services: [],
      networks: [],
      volumes: []
    };
    
    // Dockerfile analysieren
    for (const dockerfilePath of CONFIG.dockerfilePaths) {
      if (fs.existsSync(dockerfilePath)) {
        CONFIG.verbose && console.log(`🔍 Analysiere ${dockerfilePath}...`);
        const dockerfileInfo = await analyzeDockerfile(dockerfilePath);
        dockerInfo.containers.push(dockerfileInfo);
      }
    }
    
    // docker-compose.yml analysieren
    for (const composePath of CONFIG.dockerComposePaths) {
      if (fs.existsSync(composePath)) {
        CONFIG.verbose && console.log(`🔍 Analysiere ${composePath}...`);
        const composeInfo = await analyzeDockerCompose(composePath);
        
        dockerInfo.services = [...dockerInfo.services, ...composeInfo.services];
        dockerInfo.networks = [...dockerInfo.networks, ...composeInfo.networks];
        dockerInfo.volumes = [...dockerInfo.volumes, ...composeInfo.volumes];
      }
    }
    
    // Docker-Informationen in .ai.json speichern
    if (dockerInfo.containers.length > 0 || 
        dockerInfo.services.length > 0 || 
        dockerInfo.networks.length > 0 || 
        dockerInfo.volumes.length > 0) {
        
      aiJsonContent.architecture.infrastructure.docker = dockerInfo;
      
      // Docker als Feature hinzufügen, wenn noch nicht vorhanden
      if (!aiJsonContent.features) {
        aiJsonContent.features = [];
      }
      
      if (!aiJsonContent.features.some(f => f.id === 'docker-integration')) {
        aiJsonContent.features.push({
          "id": "docker-integration",
          "name": "Docker Integration",
          "description": "Containerisierung und Docker-Orchestrierung",
          "type": "infrastructure",
          "category": "ecosystem",
          "status": "active"
        });
      }
      
      // .ai.json aktualisieren
      await saveAiJson(aiJsonContent);
      
      console.log('✅ Docker-Informationen wurden in .ai.json gespeichert');
    } else {
      console.log('ℹ️ Keine Docker-Konfiguration gefunden');
    }
    
  } catch (error) {
    console.error(`❌ Fehler bei der Ausführung: ${error.message}`);
    process.exit(1);
  }
}

/**
 * .ai.json laden
 */
async function loadAiJson() {
  try {
    if (fs.existsSync(CONFIG.aiJsonPath)) {
      const content = await readFile(CONFIG.aiJsonPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`⚠️ Warnung beim Laden von ${CONFIG.aiJsonPath}: ${error.message}`);
  }
  
  return null;
}

/**
 * .ai.json speichern
 */
async function saveAiJson(aiJsonContent) {
  try {
    await writeFile(CONFIG.aiJsonPath, JSON.stringify(aiJsonContent, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Speichern von ${CONFIG.aiJsonPath}: ${error.message}`);
    return false;
  }
}

/**
 * Dockerfile analysieren
 */
async function analyzeDockerfile(dockerfilePath) {
  try {
    const content = await readFile(dockerfilePath, 'utf8');
    const lines = content.split('\n');
    
    const container = {
      name: path.dirname(dockerfilePath) !== '.' ? path.dirname(dockerfilePath) : 'main',
      path: dockerfilePath,
      baseImage: null,
      exposedPorts: [],
      environment: [],
      commands: []
    };
    
    // Dockerfile parsen
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('FROM ')) {
        container.baseImage = trimmedLine.substring(5).trim();
      }
      
      if (trimmedLine.startsWith('EXPOSE ')) {
        const ports = trimmedLine.substring(7).trim().split(' ');
        container.exposedPorts.push(...ports);
      }
      
      if (trimmedLine.startsWith('ENV ')) {
        const envParts = trimmedLine.substring(4).trim().split('=');
        if (envParts.length >= 2) {
          container.environment.push({
            key: envParts[0].trim(),
            value: envParts.slice(1).join('=').trim().replace(/^["']|["']$/g, '')
          });
        }
      }
      
      if (trimmedLine.startsWith('RUN ')) {
        container.commands.push(trimmedLine.substring(4).trim());
      }
    }
    
    return container;
  } catch (error) {
    console.error(`❌ Fehler beim Analysieren von ${dockerfilePath}: ${error.message}`);
    return {
      name: path.basename(dockerfilePath, '.dockerfile'),
      path: dockerfilePath,
      error: error.message
    };
  }
}

/**
 * docker-compose.yml analysieren
 */
async function analyzeDockerCompose(composePath) {
  try {
    const content = await readFile(composePath, 'utf8');
    const composeConfig = yaml.load(content);
    
    const result = {
      services: [],
      networks: [],
      volumes: []
    };
    
    // Services extrahieren
    if (composeConfig.services) {
      for (const [serviceName, serviceConfig] of Object.entries(composeConfig.services)) {
        const service = {
          name: serviceName,
          image: serviceConfig.image || null,
          build: serviceConfig.build ? 
            (typeof serviceConfig.build === 'string' ? 
              { context: serviceConfig.build } : 
              serviceConfig.build) : 
            null,
          ports: serviceConfig.ports || [],
          environment: serviceConfig.environment || []
        };
        
        // Environment in Key-Value Format umwandeln, falls es ein Array ist
        if (Array.isArray(service.environment)) {
          service.environment = service.environment.map(item => {
            if (typeof item === 'string' && item.includes('=')) {
              const parts = item.split('=');
              return {
                key: parts[0],
                value: parts.slice(1).join('=')
              };
            }
            return item;
          });
        } else if (typeof service.environment === 'object') {
          // Wenn es ein Objekt ist, in ein Array umwandeln
          service.environment = Object.entries(service.environment).map(([key, value]) => ({
            key,
            value
          }));
        }
        
        result.services.push(service);
      }
    }
    
    // Networks extrahieren
    if (composeConfig.networks) {
      for (const [networkName, networkConfig] of Object.entries(composeConfig.networks)) {
        result.networks.push({
          name: networkName,
          ...networkConfig
        });
      }
    }
    
    // Volumes extrahieren
    if (composeConfig.volumes) {
      for (const [volumeName, volumeConfig] of Object.entries(composeConfig.volumes)) {
        result.volumes.push({
          name: volumeName,
          ...volumeConfig
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Fehler beim Analysieren von ${composePath}: ${error.message}`);
    return {
      services: [],
      networks: [],
      volumes: [],
      error: error.message
    };
  }
}

// Script ausführen
runDockerScanner();
