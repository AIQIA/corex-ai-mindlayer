const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { red, green, blue } = require('colorette');

const root = resolve(__dirname, '..');

function readRequired(relativePath) {
  const absolutePath = resolve(root, relativePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }

  return readFileSync(absolutePath, 'utf8');
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`${label} is missing required text: ${needle}`);
  }
}

function assertNotIncludes(content, needle, label) {
  if (content.includes(needle)) {
    throw new Error(`${label} still contains obsolete/private reference: ${needle}`);
  }
}

function validateReadme(readme) {
  console.log(blue('Checking README.md...'));

  assertIncludes(readme, '# coreX AI MindLayer v4.0.0', 'README.md');
  assertIncludes(readme, 'Compass, Not Chronicle', 'README.md');
  assertIncludes(readme, '.ai.json', 'README.md');
  assertIncludes(readme, 'npm run validate:all', 'README.md');
  assertNotIncludes(readme, 'v3.8.5', 'README.md');
  assertNotIncludes(readme, 'Version 3.7.0', 'README.md');
  assertNotIncludes(readme, 'INITIALIZE.md', 'README.md');
  assertNotIncludes(readme, '.ai.json-conzept.md', 'README.md');
}

function validateContributing(contributing) {
  console.log(blue('Checking CONTRIBUTING.md...'));

  assertIncludes(contributing, 'Compass, not Chronicle', 'CONTRIBUTING.md');
  assertIncludes(contributing, 'npm run validate:all', 'CONTRIBUTING.md');
  assertIncludes(contributing, 'Do not commit generated build artifacts', 'CONTRIBUTING.md');
  assertNotIncludes(contributing, 'INITIALIZE.md', 'CONTRIBUTING.md');
  assertNotIncludes(contributing, '.ai.json-conzept.md', 'CONTRIBUTING.md');
}

function validateChangelog(changelog, packageJson) {
  console.log(blue('Checking CHANGELOG.md...'));

  const currentVersion = packageJson.version;
  assertIncludes(changelog, `## [${currentVersion}]`, 'CHANGELOG.md');
  assertIncludes(changelog, 'AJV Schema-Registrierung', 'CHANGELOG.md');
  assertIncludes(changelog, 'interne Konzeptnotizen bleiben privat', 'CHANGELOG.md');
}

function validateVersions(packageJson, extensionPackageJson) {
  console.log(blue('Checking version consistency...'));

  if (packageJson.version !== '4.0.0') {
    throw new Error(`Root package.json must be 4.0.0, got ${packageJson.version}`);
  }

  if (extensionPackageJson.version !== packageJson.version) {
    throw new Error(
      `Version mismatch: root=${packageJson.version}, extension=${extensionPackageJson.version}`,
    );
  }
}

function validatePrivateFiles() {
  console.log(blue('Checking private concept handling...'));

  const gitignore = readRequired('.gitignore');
  assertIncludes(gitignore, '.ai.json-conzept.md', '.gitignore');
}

function validateDocs() {
  console.log(blue('Starting AIM v4 documentation validation...'));

  try {
    const packageJson = JSON.parse(readRequired('package.json'));
    const extensionPackageJson = JSON.parse(readRequired('vscode-extension/package.json'));
    const readme = readRequired('README.md');
    const contributing = readRequired('CONTRIBUTING.md');
    const changelog = readRequired('CHANGELOG.md');

    validateReadme(readme);
    validateContributing(contributing);
    validateChangelog(changelog, packageJson);
    validateVersions(packageJson, extensionPackageJson);
    validatePrivateFiles();

    console.log(green('AIM v4 documentation validation passed.'));
  } catch (error) {
    console.error(red('AIM v4 documentation validation failed:'));
    console.error(red(error.message));
    process.exit(1);
  }
}

validateDocs();
