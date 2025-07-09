#!/usr/bin/env node

/**
 * coreX AI MindLayer - NPM Plugin
 * 
 * Dieses Script wird bei der Installation des NPM-Pakets ausgeführt
 * und hilft bei der Einrichtung der .ai.json für das Projekt.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

console.log(chalk.blue('🤖 coreX AI MindLayer - NPM Plugin Setup'));
console.log(chalk.gray('Automatische .ai.json Verwaltung für Ihr Projekt\n'));

// Prüfen ob .ai.json existiert
const aiJsonPath = path.join(process.cwd(), '.ai.json');

async function setup() {
  try {
    if (fs.existsSync(aiJsonPath)) {
      console.log(chalk.green('✅ .ai.json wurde gefunden!'));
      
      // Bestehende .ai.json lesen
      const aiJson = JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
      
      // Nach Aktualisierungen fragen
      const { update } = await inquirer.prompt([{
        type: 'confirm',
        name: 'update',
        message: 'Möchten Sie die bestehende .ai.json aktualisieren?',
        default: false
      }]);
      
      if (update) {
        await updateAiJson(aiJson);
      } else {
        console.log(chalk.yellow('⏭️ Aktualisierung übersprungen'));
      }
    } else {
      console.log(chalk.yellow('⚠️ Keine .ai.json gefunden'));
      
      // Fragen, ob eine erstellt werden soll
      const { create } = await inquirer.prompt([{
        type: 'confirm',
        name: 'create',
        message: 'Möchten Sie eine .ai.json für dieses Projekt erstellen?',
        default: true
      }]);
      
      if (create) {
        await createAiJson();
      } else {
        console.log(chalk.yellow('⏭️ Erstellung übersprungen'));
      }
    }
    
    console.log(chalk.green('\n✅ Setup abgeschlossen!'));
    console.log(chalk.blue('📖 Dokumentation: https://github.com/AIQIA/corex-ai-mindlayer'));
    
  } catch (error) {
    console.error(chalk.red(`❌ Fehler: ${error.message}`));
    process.exit(1);
  }
}

async function createAiJson() {
  // Projekt-Informationen sammeln
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Projektname:',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'description',
      message: 'Kurze Beschreibung:',
      default: 'Ein AI-freundliches Projekt'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Projekttyp:',
      choices: [
        'webapp',
        'api',
        'library',
        'cli-tool',
        'documentation',
        'other'
      ],
      default: 'webapp'
    }
  ]);
  
  // Grundlegende .ai.json erstellen
  const aiJson = {
    "project": {
      "name": answers.name,
      "description": answers.description,
      "type": answers.type,
      "version": "0.1.0"
    },
    "ai_context": {
      "purpose": "General project information",
      "key_concepts": []
    },
    "architecture": {
      "components": [],
      "dependencies": []
    }
  };
  
  // .ai.json schreiben
  fs.writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf8');
  console.log(chalk.green('✅ .ai.json erstellt!'));
}

async function updateAiJson(aiJson) {
  // Aktuelle NPM-Abhängigkeiten hinzufügen
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Dependencies sammeln
      const deps = [];
      if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([name, version]) => {
          deps.push({ name, version });
        });
      }
      
      // Zu .ai.json hinzufügen
      if (!aiJson.architecture) aiJson.architecture = {};
      if (!aiJson.architecture.dependencies) aiJson.architecture.dependencies = [];
      
      // Bestehende dependencies mit neuen Daten aktualisieren/ergänzen
      const existingDeps = aiJson.architecture.dependencies;
      deps.forEach(dep => {
        const existingIndex = existingDeps.findIndex(d => d.name === dep.name);
        if (existingIndex >= 0) {
          existingDeps[existingIndex].version = dep.version;
        } else {
          existingDeps.push(dep);
        }
      });
      
      // .ai.json aktualisieren
      fs.writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf8');
      console.log(chalk.green('✅ NPM Abhängigkeiten in .ai.json aktualisiert!'));
    }
  } catch (error) {
    console.error(chalk.yellow(`⚠️ Warnung: Konnte package.json nicht verarbeiten: ${error.message}`));
  }
}

// Setup ausführen
setup();
