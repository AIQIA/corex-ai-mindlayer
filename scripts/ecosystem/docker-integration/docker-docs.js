#!/usr/bin/env node

/**
 * coreX AI MindLayer - Docker Dokumentation Generator
 * 
 * Generiert Dokumentation für Docker-Konfigurationen basierend auf .ai.json
 * 
 * Verwendung:
 * - `node docker-docs.js` (standard, generiert DOCKER.md)
 * - `node docker-docs.js --output=custom-file.md` (benutzerdefinierte Ausgabedatei)
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Konfiguration
const CONFIG = {
  aiJsonPath: '.ai.json',
  outputPath: 'DOCKER.md',
  includeServices: true,
  includeNetworks: true,
  includeVolumes: true
};

// CLI Argumente parsen
const args = process.argv.slice(2);
for (const arg of args) {
  if (arg.startsWith('--output=')) {
    CONFIG.outputPath = arg.substring('--output='.length);
  }
}

/**
 * Haupt-Ausführungsfunktion
 */
async function generateDockerDocs() {
  try {
    console.log('📄 coreX AI MindLayer - Docker Dokumentation Generator\n');
    
    // .ai.json laden
    const aiJsonContent = await loadAiJson();
    
    if (!aiJsonContent || !aiJsonContent.architecture || !aiJsonContent.architecture.infrastructure || !aiJsonContent.architecture.infrastructure.docker) {
      console.error('❌ Keine Docker-Konfiguration in .ai.json gefunden.');
      process.exit(1);
    }
    
    console.log('✅ .ai.json erfolgreich geladen');
    
    const dockerInfo = aiJsonContent.architecture.infrastructure.docker;
    const projectName = aiJsonContent.project?.name || 'Projekt';
    
    // Markdown generieren
    let markdown = `# 🐳 Docker-Dokumentation: ${projectName}\n\n`;
    
    markdown += `> Automatisch generierte Dokumentation durch coreX AI MindLayer\n\n`;
    
    // Container Dokumentation
    if (dockerInfo.containers && dockerInfo.containers.length > 0) {
      markdown += `## 📦 Container\n\n`;
      
      for (const container of dockerInfo.containers) {
        markdown += `### ${container.name}\n\n`;
        
        if (container.baseImage) {
          markdown += `- **Base Image:** \`${container.baseImage}\`\n`;
        }
        
        if (container.exposedPorts && container.exposedPorts.length > 0) {
          markdown += `- **Exposed Ports:** ${container.exposedPorts.join(', ')}\n`;
        }
        
        if (container.environment && container.environment.length > 0) {
          markdown += `- **Environment Variables:**\n`;
          
          for (const env of container.environment) {
            if (env.key && env.value) {
              markdown += `  - \`${env.key}=${env.value}\`\n`;
            }
          }
        }
        
        markdown += '\n';
      }
    }
    
    // Services Dokumentation
    if (CONFIG.includeServices && dockerInfo.services && dockerInfo.services.length > 0) {
      markdown += `## 🔄 Services\n\n`;
      
      for (const service of dockerInfo.services) {
        markdown += `### ${service.name}\n\n`;
        
        if (service.image) {
          markdown += `- **Image:** \`${service.image}\`\n`;
        }
        
        if (service.build) {
          if (typeof service.build === 'string') {
            markdown += `- **Build:** \`${service.build}\`\n`;
          } else if (service.build.context) {
            markdown += `- **Build Context:** \`${service.build.context}\`\n`;
            
            if (service.build.dockerfile) {
              markdown += `- **Dockerfile:** \`${service.build.dockerfile}\`\n`;
            }
          }
        }
        
        if (service.ports && service.ports.length > 0) {
          markdown += `- **Ports:** ${service.ports.join(', ')}\n`;
        }
        
        if (service.environment && service.environment.length > 0) {
          markdown += `- **Environment Variables:**\n`;
          
          for (const env of service.environment) {
            if (env.key && env.value) {
              const displayValue = typeof env.value === 'string' && (env.value.includes('PASSWORD') || env.value.includes('SECRET')) ? '***' : env.value;
              markdown += `  - \`${env.key}=${displayValue}\`\n`;
            } else if (typeof env === 'string') {
              markdown += `  - \`${env}\`\n`;
            }
          }
        }
        
        markdown += '\n';
      }
    }
    
    // Networks Dokumentation
    if (CONFIG.includeNetworks && dockerInfo.networks && dockerInfo.networks.length > 0) {
      markdown += `## 🌐 Networks\n\n`;
      
      for (const network of dockerInfo.networks) {
        markdown += `### ${network.name}\n\n`;
        
        if (network.driver) {
          markdown += `- **Driver:** ${network.driver}\n`;
        }
        
        if (network.external === true) {
          markdown += `- **External:** Yes\n`;
        }
        
        markdown += '\n';
      }
    }
    
    // Volumes Dokumentation
    if (CONFIG.includeVolumes && dockerInfo.volumes && dockerInfo.volumes.length > 0) {
      markdown += `## 💾 Volumes\n\n`;
      
      for (const volume of dockerInfo.volumes) {
        markdown += `### ${volume.name}\n\n`;
        
        if (volume.driver) {
          markdown += `- **Driver:** ${volume.driver}\n`;
        }
        
        if (volume.external === true) {
          markdown += `- **External:** Yes\n`;
        }
        
        markdown += '\n';
      }
    }
    
    // Nutzungshinweise
    markdown += `## 🚀 Nutzung\n\n`;
    markdown += `### Starten der Container\n\n`;
    markdown += '```bash\ndocker-compose up -d\n```\n\n';
    
    markdown += `### Stoppen der Container\n\n`;
    markdown += '```bash\ndocker-compose down\n```\n\n';
    
    markdown += `### Logs anzeigen\n\n`;
    markdown += '```bash\ndocker-compose logs -f\n```\n\n';
    
    markdown += `---\n\n`;
    markdown += `> Diese Dokumentation wurde automatisch durch coreX AI MindLayer erstellt und kann durch Änderungen an der Docker-Konfiguration oder der .ai.json aktualisiert werden.\n`;
    
    // Dokumentation speichern
    await writeFile(CONFIG.outputPath, markdown, 'utf8');
    
    console.log(`✅ Docker-Dokumentation wurde in ${CONFIG.outputPath} gespeichert`);
    
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

// Script ausführen
generateDockerDocs();
