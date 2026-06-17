# coreX AI MindLayer v4.0.0

**AIM is a compact project compass for AI-assisted development.**

The coreX AI MindLayer keeps the long-lived truths of a project in structured `.ai.json` files: project identity, red lines, architecture, workflow rules, feature references and user preferences. It is built for humans and AI assistants who need fast orientation without reading an entire repository first.

## Compass, Not Chronicle

AIM v4 follows one central rule:

> Keep the project memory small, current and actionable.

The MindLayer is not a changelog, chat archive or documentation dump. It should help an assistant answer three questions quickly:

- What is this project?
- What must never be violated?
- Where should deeper feature knowledge be loaded from?

Detailed documentation can still live in Markdown files, feature detail files or normal project docs. AIM points to them deliberately instead of copying everything into one oversized context file.

## What v4 Provides

- Root Compass schema for `.ai.json`
- Optional feature index and feature detail schemas
- AJV-based CLI validation
- VS Code extension with Project Compass view
- Commands for initialization, validation, agent anchors and AI onboarding
- Snippets for `ai-root`, `ai-index` and `ai-details`
- Public release docs under MIT license

## Quick Start

```bash
git clone https://github.com/AIQIA/corex-ai-mindlayer.git
cd corex-ai-mindlayer
npm install
npm run validate:example
```

Create your own AIM file from the example:

```bash
cp .ai.json.example .ai.json
npm run validate:all
```

For PHP syntax validation of the initializer:

```bash
php -l ai-init.php
```

## VS Code Extension

The extension lives in `vscode-extension/`.

Useful commands:

- `AIM: Initialize Project`
- `AIM: Validate Workspace`
- `AIM: Copy Context for AI`
- `AIM: Install Agent Anchors`
- `AIM: Prepare AI Onboarding Briefing`
- `AIM: Add Feature Details File`

Development workflow:

```bash
cd vscode-extension
npm install
npm run compile
```

Use `F5` in VS Code to start an Extension Development Host.

## Validation

Main validation commands:

```bash
npm run validate:example
npm run validate:all
npm run lint
```

`validate.js` registers the schema files with stable local keys. The schema files do not need public `$id` values for local validation.

## File Overview

| File | Purpose |
| ---- | ------- |
| `.ai.json.example` | Minimal v4 Root Compass example |
| `.ai.json` | AIM for this repository itself |
| `.ai.features.index.json` | Optional feature index in AIM-enabled projects |
| `.ai.features.*.details.json` | Optional feature-specific knowledge files |
| `validate.js` | CLI validator for AIM JSON files |
| `ai-init.php` | PHP initializer/scanner entry point |
| `vscode-extension/` | VS Code extension source and VSIX build files |
| `CHANGELOG.md` | Public release history |
| `CONTRIBUTING.md` | Contributor rules |

## Documentation

- [CHANGELOG.md](CHANGELOG.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [FAQ.md](FAQ.md)
- [REQUIREMENTS.md](REQUIREMENTS.md)

## Links

- Homepage: [aim.aiqia.de](https://aim.aiqia.de)
- coreX: [corex.aiqia.de](https://corex.aiqia.de)
- Repository: [github.com/AIQIA/corex-ai-mindlayer](https://github.com/AIQIA/corex-ai-mindlayer)

## License

MIT License. See [LICENSE](LICENSE).

---

Making every project AI-ready, one focused compass at a time.
