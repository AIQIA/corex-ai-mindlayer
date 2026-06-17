# coreX AI MindLayer (AIM)

AI MindLayer is a lightweight project memory layer for AI-assisted development. It provides a structured way to manage project context, rules, and architecture, ensuring that AI assistants like GitHub Copilot or Claude always have the right information at hand without being overwhelmed by noise.

**Compass, not Chronicle.**

## Key Features

- 🏗️ **Project Compass**: A semantic view of your project's identity, red lines, and architecture.
- 🟥 **Red Lines**: Define strict boundaries and rules that AI assistants must follow.
- 🧩 **Modular Context**: Keep the root context small and load feature-specific details only when needed.
- 🛡️ **Health Check**: Automatic validation of AIM files, including schema checks, dead reference detection, and secret scanning.
- 📋 **Context Export**: Easily copy formatted project context for use in AI chat interfaces.
- ⚓ **Agent Anchors**: Seamlessly integrate AIM references into `AGENTS.md` or `CLAUDE.md`.
- 🤖 **AI Onboarding**: Direct mission briefing for agents to setup your project memory.

## Getting Started

1. Install the extension.
2. Open a project.
3. Run the command `AIM: Initialize Project` to create your `.ai.json`.
4. Define your project's `red_lines` and `architecture`.
5. Use the **Project Compass** in the Activity Bar to explore your AI memory.

## File Ecosystem

- `.ai.json`: The root compass of your project.
- `.ai.features.index.json`: A map of feature areas and their detail files.
- `.ai.features.*.details.json`: Deep-dive information for specific modules.

## Links & Community

- **Homepage**: [aim.aiqia.de](https://aim.aiqia.de)
- **Powered by**: [coreX CMS](https://corex.aiqia.de)
- **Coming soon**: [corex-cms.com](https://corex-cms.com) / [corex-cms.de](https://corex-cms.de)

## License

MIT - Created by [AIQIA](https://aiqia.de) / coreX
