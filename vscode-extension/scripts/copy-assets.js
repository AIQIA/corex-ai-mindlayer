const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const assets = [
  ['src/schemas', 'out/schemas'],
  ['src/templates', 'out/templates'],
];

for (const [from, to] of assets) {
  const source = path.join(root, from);
  const target = path.join(root, to);

  if (!fs.existsSync(source)) {
    continue;
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}
