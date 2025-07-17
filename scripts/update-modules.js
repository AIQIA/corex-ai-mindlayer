const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../.ai.modules');
const configFile = path.join(__dirname, '../.ai.json.example');

// Read and parse the main config file
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

// Update each module file
config.$modules.forEach(module => {
  const moduleFile = path.join(__dirname, '..', module.$ref);
  const moduleData = JSON.parse(fs.readFileSync(moduleFile, 'utf8'));
  
  // Update the module file with any new changes
  if (config[module.name] && JSON.stringify(moduleData) !== JSON.stringify(config[module.name])) {
    fs.writeFileSync(moduleFile, JSON.stringify(config[module.name], null, 2));
    console.log(`Updated ${module.name} module`);
  }
});

console.log('All modules are up to date!');
