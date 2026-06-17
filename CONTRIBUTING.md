# Contributing to coreX AI MindLayer

Thanks for helping improve AIM.

AIM v4 follows the principle **Compass, not Chronicle**: project memory should stay compact, current and actionable. Contributions should strengthen that idea instead of turning `.ai.json` into a documentation dump or chat archive.

## Development Setup

```bash
git clone https://github.com/AIQIA/corex-ai-mindlayer.git
cd corex-ai-mindlayer
npm install
npm run validate:example
```

For VS Code extension work:

```bash
cd vscode-extension
npm install
npm run compile
```

Use `F5` in VS Code to start the Extension Development Host.

## Contribution Rules

- Keep the core lightweight and modular.
- Do not add automatic writes to project files without explicit user consent.
- Treat `.ai.json` as a project compass, not a full documentation mirror.
- Add or update JSON Schema validation when changing AIM file structures.
- Keep examples minimal, valid and useful for AI onboarding.
- Do not commit secrets, tokens, private keys or real credentials.
- Keep public documentation clear, practical and free of sensitive implementation details.
- Do not commit generated build artifacts such as `vscode-extension/out/` or `.vsix` packages.

## Local Checks

Run the relevant checks before submitting changes:

```bash
npm run validate:example
npm run validate:all
npm run lint
php -l ai-init.php
```

For extension changes, also run:

```bash
cd vscode-extension
npm run compile
```

## Documentation

When behavior changes, update the matching documentation:

- `README.md` for the public project overview
- `CHANGELOG.md` for release-relevant changes
- `.ai.json.example` for the minimal AIM example
- `vscode-extension/src/schemas/` when the data model changes

## Links

- Homepage: [aim.aiqia.de](https://aim.aiqia.de)
- coreX: [corex.aiqia.de](https://corex.aiqia.de)
