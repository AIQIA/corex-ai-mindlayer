const fs = require('fs');
const path = require('path');

// Read config for backup settings
const configFile = path.join(__dirname, '../.ai.json.example');
const moduleFile = path.join(__dirname, '../.ai.modules/update_config.json');
const config = JSON.parse(fs.readFileSync(moduleFile, 'utf8'));
const backupConfig = config.backup;

// Create backup directories if they don't exist
const localBackupDir = path.join(__dirname, '..', backupConfig.local_storage);
const globalBackupDir = backupConfig.global_storage.replace('%APPDATA%', process.env.APPDATA);

[localBackupDir, globalBackupDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create backup with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFiles = [
  '.ai.json.example',
  ...fs.readdirSync(path.join(__dirname, '../.ai.modules'))
    .map(file => path.join('.ai.modules', file))
];

backupFiles.forEach(file => {
  const source = path.join(__dirname, '..', file);
  const localDest = path.join(localBackupDir, `${timestamp}_${path.basename(file)}`);
  const globalDest = path.join(globalBackupDir, `${timestamp}_${path.basename(file)}`);

  fs.copyFileSync(source, localDest);
  fs.copyFileSync(source, globalDest);
});

// Clean up old backups
const cleanupBackups = (dir) => {
  const files = fs.readdirSync(dir);
  const now = Date.now();
  const maxAge = backupConfig.retention_days * 24 * 60 * 60 * 1000;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtime.getTime() > maxAge) {
      fs.unlinkSync(filePath);
    }
  });
};

[localBackupDir, globalBackupDir].forEach(cleanupBackups);

console.log(`Backup created: ${timestamp}`);
