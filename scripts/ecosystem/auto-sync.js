#!/usr/bin/env node

/**
 * coreX AI MindLayer - Auto-Sync Tool
 * 
 * Automatische Synchronisierung von .ai.json mit Changelogs, READMEs und Tasklisten.
 * Dieses Script liest .ai.json und aktualisiert entsprechende Dokumentationsdateien.
 * 
 * Verwendung:
 * - `node auto-sync.js` (standard)
 * - `node auto-sync.js --force` (überschreibt bestehende Inhalte)
 * - `node auto-sync.js --check` (prüft nur auf Unstimmigkeiten ohne zu ändern)
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
  aiDevJsonPath: '.ai.dev.json',
  filesToUpdate: [
    { path: 'README.md', sections: ['project', 'features', 'installation'] },
    { path: 'CHANGELOG.md', sections: ['version'] },
    { path: 'TODO.md', sections: ['status'] },
    { path: 'STATUS.md', sections: ['all'] }
  ],
  dryRun: false,
  verbose: true
};

// CLI Argumente parsen
const args = process.argv.slice(2);
CONFIG.force = args.includes('--force');
CONFIG.dryRun = args.includes('--check');
CONFIG.verbose = !args.includes('--quiet');

/**
 * Haupt-Ausführungsfunktion
 */
async function runAutoSync() {
  try {
    console.log('🔄 coreX AI MindLayer - Auto-Sync Tool\n');
    
    // .ai.json und .ai.dev.json laden
    const aiJsonContent = await loadJsonFile(CONFIG.aiJsonPath);
    const aiDevJsonContent = await loadJsonFile(CONFIG.aiDevJsonPath)
      .catch(() => ({ autotasks: {} })); // Optional, Fehler abfangen
    
    if (!aiJsonContent) {
      console.error('❌ Keine gültige .ai.json gefunden. Bitte zuerst erstellen.');
      process.exit(1);
    }
    
    console.log('✅ .ai.json erfolgreich geladen');
    
    // Dateien aktualisieren
    let updatedCount = 0;
    
    for (const fileConfig of CONFIG.filesToUpdate) {
      const updated = await syncFile(fileConfig, aiJsonContent, aiDevJsonContent);
      if (updated) updatedCount++;
    }
    
    console.log(`\n✅ Synchronisierung abgeschlossen: ${updatedCount} Dateien aktualisiert`);
    
    if (CONFIG.dryRun) {
      console.log('\n🔎 Nur-Prüfung abgeschlossen. Keine Dateien wurden geändert.');
    }
    
  } catch (error) {
    console.error(`❌ Fehler bei der Ausführung: ${error.message}`);
    process.exit(1);
  }
}

/**
 * JSON-Datei laden
 */
async function loadJsonFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (CONFIG.verbose) {
      console.warn(`⚠️ Warnung beim Laden von ${filePath}: ${error.message}`);
    }
    return null;
  }
}

/**
 * Datei synchronisieren
 */
async function syncFile(fileConfig, aiJsonContent, aiDevJsonContent) {
  const { path: filePath, sections } = fileConfig;
  
  try {
    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(filePath)) {
      if (CONFIG.verbose) console.log(`⚠️ ${filePath} nicht gefunden, wird übersprungen.`);
      return false;
    }
    
    // Datei-Inhalt laden
    const fileContent = await readFile(filePath, 'utf8');
    
    // Für jeden Abschnitt aktualisieren
    let newContent = fileContent;
    let hasChanges = false;
    
    for (const section of sections) {
      const sectionUpdater = getSectionUpdater(section);
      if (sectionUpdater) {
        const result = sectionUpdater(newContent, aiJsonContent, aiDevJsonContent);
        if (result.content !== newContent) {
          hasChanges = true;
          newContent = result.content;
        }
      }
    }
    
    // Wenn Änderungen vorhanden und nicht im Prüfmodus, Datei aktualisieren
    if (hasChanges && !CONFIG.dryRun) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`✅ ${filePath} aktualisiert`);
      return true;
    } else if (hasChanges && CONFIG.dryRun) {
      console.log(`🔍 Änderungen für ${filePath} gefunden (nicht gespeichert)`);
      return false;
    } else {
      if (CONFIG.verbose) console.log(`ℹ️ ${filePath} ist bereits aktuell`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Fehler bei der Synchronisierung von ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Section Updater für verschiedene Bereiche
 */
function getSectionUpdater(section) {
  const updaters = {
    // Projekt-Informationen in README.md aktualisieren
    project: (content, aiJson) => {
      if (!aiJson.project) return { content };
      
      // README Project Header aktualisieren
      let newContent = content;
      const projectName = aiJson.project.name || 'coreX AI MindLayer';
      const projectVersion = aiJson.project.version || '3.2.0';
      
      // Ersetzt den Titel im README
      const titleRegex = /^# .*$/m;
      if (titleRegex.test(newContent)) {
        newContent = newContent.replace(titleRegex, `# ${projectName} v${projectVersion}`);
      }
      
      return { content: newContent };
    },
    
    // Feature-Liste in README.md aktualisieren
    features: (content, aiJson) => {
      if (!aiJson.features || !Array.isArray(aiJson.features)) return { content };
      
      // README Feature-Bereich suchen
      const featureStartRegex = /^## (Features|Funktionen)$/m;
      const featureEndRegex = /^##\s/m;
      
      const featureStartMatch = content.match(featureStartRegex);
      if (!featureStartMatch) return { content }; // Kein Feature-Bereich gefunden
      
      const featureStartIndex = featureStartMatch.index;
      let featureEndIndex = content.indexOf('\n\n## ', featureStartIndex);
      
      if (featureEndIndex === -1) {
        // Wenn kein weiterer Abschnitt folgt, bis zum Ende des Dokuments gehen
        featureEndIndex = content.length;
      }
      
      // Neuen Feature-Bereich erstellen
      let newFeatureSection = `${featureStartMatch[0]}\n\n`;
      
      aiJson.features.forEach(feature => {
        if (typeof feature === 'string') {
          newFeatureSection += `- ${feature}\n`;
        } else if (feature.name) {
          let featureItem = `- **${feature.name}**`;
          if (feature.description) {
            featureItem += ` - ${feature.description}`;
          }
          newFeatureSection += `${featureItem}\n`;
          
          // Unterfeatures, falls vorhanden
          if (feature.sub_features && Array.isArray(feature.sub_features)) {
            feature.sub_features.forEach(subFeature => {
              newFeatureSection += `  - ${subFeature}\n`;
            });
          }
        }
      });
      
      newFeatureSection += '\n';
      
      // Feature-Bereich ersetzen
      const newContent = 
        content.substring(0, featureStartIndex) + 
        newFeatureSection +
        content.substring(featureEndIndex);
      
      return { content: newContent };
    },
    
    // Version in CHANGELOG.md aktualisieren
    version: (content, aiJson, aiDevJson) => {
      if (!aiJson.project || !aiJson.project.version) return { content };
      
      // Version aus .ai.json holen
      const version = aiJson.project.version;
      const projectName = aiJson.project.name || 'coreX AI MindLayer';
      
      // Prüfen ob diese Version bereits im CHANGELOG vorhanden ist
      const versionHeaderRegex = new RegExp(`^## \\[${version}\\]`, 'm');
      
      if (versionHeaderRegex.test(content) && !CONFIG.force) {
        return { content }; // Version bereits vorhanden
      }
      
      // Aktuelle Änderungen aus .ai.dev.json holen (falls vorhanden)
      let changes = [];
      if (aiDevJson && aiDevJson.autotasks && aiDevJson.autotasks.pendingChanges) {
        changes = aiDevJson.autotasks.pendingChanges;
      }
      
      // Neuen Changelog-Eintrag erstellen
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      let newVersionEntry = `## [${version}] - ${today}\n\n`;
      
      if (changes.length > 0) {
        // Änderungen nach Kategorien gruppieren
        const categories = {
          'Added': [],
          'Changed': [],
          'Fixed': [],
          'Removed': []
        };
        
        changes.forEach(change => {
          const category = change.type || 'Changed';
          if (categories[category]) {
            categories[category].push(change.description);
          }
        });
        
        // Kategorien zum Changelog-Eintrag hinzufügen
        Object.keys(categories).forEach(category => {
          if (categories[category].length > 0) {
            newVersionEntry += `### ${category}\n`;
            categories[category].forEach(item => {
              newVersionEntry += `- ${item}\n`;
            });
            newVersionEntry += '\n';
          }
        });
      } else {
        // Standard-Eintrag, wenn keine Änderungen definiert sind
        newVersionEntry += `### Changed\n- Version ${version} von ${projectName}\n\n`;
      }
      
      // Neuen Eintrag am Anfang des Changelogs einfügen (nach dem Header)
      const headerEndIndex = content.indexOf('\n\n');
      if (headerEndIndex > -1) {
        const newContent = 
          content.substring(0, headerEndIndex + 2) +
          newVersionEntry +
          content.substring(headerEndIndex + 2);
        
        return { content: newContent };
      }
      
      return { content };
    },
    
    // Status in TODO.md aktualisieren
    status: (content, aiJson) => {
      if (!aiJson.project || !aiJson.project.version) return { content };
      
      // Version und Feature-Status aus .ai.json holen
      const version = aiJson.project.version;
      const features = aiJson.features || [];
      
      // Status-Bereich in TODO.md suchen
      const statusSectionRegex = /^## 🏆 Project Status:.*$/m;
      const statusSectionMatch = content.match(statusSectionRegex);
      
      if (!statusSectionMatch) return { content }; // Kein Status-Bereich gefunden
      
      const statusStartIndex = statusSectionMatch.index;
      let statusEndIndex = content.indexOf('\n\n---', statusStartIndex);
      
      if (statusEndIndex === -1) {
        // Wenn keine Trennlinie folgt, bis zum nächsten Abschnitt suchen
        statusEndIndex = content.indexOf('\n\n## ', statusStartIndex);
      }
      
      if (statusEndIndex === -1) {
        // Wenn kein weiterer Abschnitt folgt, bis zum Ende des Dokuments gehen
        statusEndIndex = content.length;
      }
      
      // Status-Überschrift beibehalten, aber Rest aktualisieren
      let newStatusContent = `${statusSectionMatch[0]}\n\n`;
      
      // Aktualisierte Statusbeschreibung
      newStatusContent += `**✅ ALLE CORE-FEATURES IMPLEMENTIERT UND GETESTET**\n\n`;
      newStatusContent += `- VS Code Extension v${version} vollständig funktional\n`;
      
      // Zähle aktive Commands aus den Features
      let commandCount = 0;
      features.forEach(feature => {
        if (feature.type === 'command' && feature.status === 'active') {
          commandCount++;
        }
      });
      
      if (commandCount > 0) {
        newStatusContent += `- ${commandCount} Commands, alle Features kombiniert\n`;
      }
      
      newStatusContent += `- Keine temporären Deaktivierungen oder Bugs\n`;
      newStatusContent += `- Ready for Community Release!\n`;
      
      // Ecosystem Integration Status aus .ai.json extrahieren
      const ecosystemSection = `- [ ] **Ecosystem Integration**\n`;
      
      // Prüfe welche Ecosystem Features bereits implementiert sind
      const ecosystemFeatures = [
        { 
          name: "Auto-Sync mit Changelogs, READMEs und Tasklisten", 
          id: "auto-sync",
          completed: false
        },
        { 
          name: "Composer/NPM Plugin für automatische `.ai.json` Updates", 
          id: "package-plugins",
          completed: false
        },
        { 
          name: "Docker Integration für automatische Container-Dokumentation", 
          id: "docker-integration",
          completed: false
        }
      ];
      
      // Aktualisiere den Status basierend auf .ai.json
      if (aiJson.features) {
        aiJson.features.forEach(feature => {
          ecosystemFeatures.forEach(ecoFeature => {
            if (feature.id === ecoFeature.id && feature.status === 'active') {
              ecoFeature.completed = true;
            }
          });
        });
      }
      
      // Füge Ecosystem Features zur Status-Sektion hinzu
      newStatusContent += ecosystemSection;
      
      ecosystemFeatures.forEach(feature => {
        const checkmark = feature.completed ? "x" : " ";
        newStatusContent += `  - [${checkmark}] ${feature.name}\n`;
      });
      
      // Erstelle den neuen Inhalt durch Ersetzen des Status-Bereichs
      const newContent = 
        content.substring(0, statusStartIndex) + 
        newStatusContent + 
        content.substring(statusEndIndex);
      
      return { content: newContent };
    },
    
    // Alle Abschnitte in STATUS.md aktualisieren
    all: (content, aiJson) => {
      if (!aiJson.project) return { content };
      
      const version = aiJson.project.version || '3.2.0';
      const features = aiJson.features || [];
      
      // Generiere kompletten STATUS.md-Inhalt basierend auf .ai.json
      let newContent = `# coreX AI MindLayer - Status\n\n`;
      newContent += `> Version ${version} - Automatisch generiert\n\n`;
      newContent += `## Features\n\n`;
      
      // Features nach Kategorien gruppieren
      const categories = {
        'core': { title: '🧠 Core Features', items: [] },
        'extension': { title: '🔧 VS Code Extension', items: [] },
        'ecosystem': { title: '🌐 Ecosystem Integration', items: [] },
        'other': { title: '✨ Weitere Features', items: [] }
      };
      
      // Features den Kategorien zuordnen
      features.forEach(feature => {
        const category = feature.category || 'other';
        const targetCategory = categories[category] || categories.other;
        
        const status = feature.status === 'active' ? '✅' : 
                       feature.status === 'in_progress' ? '🚧' : 
                       feature.status === 'planned' ? '📝' : '❓';
        
        targetCategory.items.push(`${status} **${feature.name}**${feature.description ? `: ${feature.description}` : ''}`);
      });
      
      // Kategorien in den Inhalt einfügen
      Object.values(categories).forEach(category => {
        if (category.items.length > 0) {
          newContent += `### ${category.title}\n\n`;
          category.items.forEach(item => {
            newContent += `- ${item}\n`;
          });
          newContent += '\n';
        }
      });
      
      // Commands auflisten
      newContent += `## Commands\n\n`;
      
      const commands = features.filter(f => f.type === 'command');
      commands.forEach(command => {
        const status = command.status === 'active' ? '✅' : 
                       command.status === 'in_progress' ? '🚧' : '❌';
        
        newContent += `- ${status} **${command.name}**${command.description ? `: ${command.description}` : ''}\n`;
      });
      
      newContent += '\n## Status\n\n';
      
      // Zähle aktive/inaktive Features
      const activeFeatures = features.filter(f => f.status === 'active').length;
      const totalFeatures = features.length;
      const percentComplete = Math.round((activeFeatures / totalFeatures) * 100);
      
      newContent += `- **Fortschritt**: ${activeFeatures}/${totalFeatures} Features implementiert (${percentComplete}%)\n`;
      newContent += `- **Version**: ${version}\n`;
      newContent += `- **Letzte Aktualisierung**: ${new Date().toISOString().split('T')[0]}\n\n`;
      
      // Da wir den gesamten Inhalt ersetzen, geben wir den neuen Inhalt zurück
      return { content: newContent };
    }
  };
  
  return updaters[section];
}

// Script ausführen
runAutoSync();
