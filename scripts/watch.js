const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

const configFile = path.join(__dirname, '../.ai.json.example');
const modulesDir = path.join(__dirname, '../.ai.modules');

console.log('Watching for changes...');

// Watch both the main config and module files
const watcher = chokidar.watch([configFile, `${modulesDir}/*.json`], {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

// Handle file changes
watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);

  // Run validation
  exec('npm run validate', (error, stdout, stderr) => {
    if (error) {
      console.error(`Validation error: ${error}`);
      return;
    }
    console.log(stdout);

    // If main config changed, update modules
    if (path === configFile) {
      exec('node scripts/update-modules.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Update error: ${error}`);
          return;
        }
        console.log(stdout);
      });
    }

    // Create backup
    exec('node scripts/backup.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Backup error: ${error}`);
        return;
      }
      console.log(stdout);
    });
  });
});
