# coreX AI MindLayer by Sascha Buscher - aiqia.de

**Universal `.ai.json`-based standard for assistant-readable architecture and AI-ready project knowledge.**

---

## 🧠 What is the coreX AI MindLayer?

The **coreX AI MindLayer** is a developer-centric context layer that transforms static project knowledge into a structured, machine-readable format for use by AI assistants like ChatGPT, GitHub Copilot, Cody, and others.

At its core is the `.ai.json` file – a living, structured map of your project's architecture, logic, error patterns, and task flows. It empowers intelligent tooling to understand what you're building – and why.

---

## 🚀 Why It Matters

- Enables **context-aware support** from AI tools
- Speeds up **onboarding**, **troubleshooting**, and **assistant interaction**
- Introduces a **standardized language** between devs and AI
- Powers features like code explanations, error diagnostics, and auto-generated documentation

---

## 🔧 Core Components

| File | Purpose |
|------|---------|
| `.ai.json` | Main structured knowledge layer for assistants |
| `AI-INTEGRATION.md` | Integration guide for AI systems |
| `ai-init.php` | Automatic detection hook (optional) |
| `README.md` | Human-facing project intro |
| `LICENSE.md` | Custom MIT license with attribution requirement |

---

## 📂 Status

> This is the official first release of the coreX AI MindLayer  
> Authored and published by **Sascha Nothelle (AIQIA)** on **2025-07-04**

---

## 📝 License

Licensed under the **MIT license** with attribution requirement.  
See [LICENSE.md](LICENSE.md) for terms.

---

## 🌐 More Coming Soon

- AI playground
- Docusaurus documentation site
- `.ai.json` schema validator
- Composer/NPM integrations

> Questions, ideas, or collaborations?  
> [info@aiqia.de](mailto:info@aiqia.de)

---

## 📘 Beispiel: `.ai.json.example`

Im Repository befindet sich eine **Vorlagendatei namens `.ai.json.example`**.

Diese dient als **strukturierte Orientierung** für eigene Projekte und soll als Ausgangspunkt für die Erstellung einer individuellen `.ai.json` genutzt werden.

🛠️ Vorgehensweise:

1. Kopiere `.ai.json.example` → `.ai.json`
2. Fülle projektspezifische Informationen aus
3. Die Datei wird automatisch vom `ai-init.php` erkannt und kann von KI-Systemen genutzt werden

⚠️ Hinweis: Die Datei `.ai.json` ist standardmäßig in `.gitignore` enthalten und wird nicht versioniert.