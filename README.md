# coreX AI MindLayer v3.6.1 by Sascha Buscher - aiqia.de

## 🔧 Core Components

| File                | Purpose                                        |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `.ai.json`          | Main structured knowledge layer for assistants |
| `schema.json`       | 📋 **JSON Schema validation for .ai.json**     |
| `AI-INTEGRATION.md` | Integration guide for AI systems               |
| `ai-init.php`       | Automatic detection hook ⚠️ **(experimental)** |
| `INSTALL.md`        | 📦 **Installation guide for all scenarios**    |
| `package.json`      | 📦 **NPM package configuration**               |
| `README.md`         | Human-facing project intro                     |
| `LICENSE`           | MIT license with attribution requirement       | ersal `.ai.json`-based standard for assistant-readable architecture and AI-ready project knowledge.\*\* |

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

## � Quick Start

### 📦 Installation

**Neues Projekt:**

```bash
git clone https://github.com/AIQIA/corex-ai-mindlayer.git mein-projekt
```

**Bestehendes Projekt:**

```bash
# Download & Copy
curl -L https://github.com/AIQIA/corex-ai-mindlayer/archive/main.zip -o ai-layer.zip
unzip ai-layer.zip && cp corex-ai-mindlayer-main/.ai.json.example ./
```

**📋 Komplette Anleitung:** [INSTALL.md](INSTALL.md)

### ⚡ Setup

```bash
cp .ai.json.example .ai.json  # Template kopieren
# → .ai.json an dein Projekt anpassen

# Optional: JSON Schema Validation
npm install -g ajv-cli
ajv validate -s schema.json -d .ai.json
```

---

## �🔧 Core Components

| File                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `.ai.json`          | Main structured knowledge layer for assistants |
| `AI-INTEGRATION.md` | Integration guide for AI systems               |
| `ai-init.php`       | Automatic detection hook ⚠️ **(experimental)** |
| `INSTALL.md`        | 📦 **Installation guide for all scenarios**    |
| `README.md`         | Human-facing project intro                     |
| `LICENSE`           | MIT license with attribution requirement       |

---

## 📂 Status

> This is version 1.0.2 / 3.6.0 of the coreX AI MindLayer  
> Authored and published by **Sascha Buscher - aiqia.de** on **2025-07-09**

---

## 📝 License

Licensed under the **MIT license** with attribution requirement.  
See [LICENSE](LICENSE) for terms.

---

## 🌐 More Coming Soon

- **Intelligente ai-init.php mit Multi-Language Support** 🤖  
  _KI analysiert dein Projekt automatisch in 7 Programmiersprachen und erstellt eine optimale `.ai.json`. Mit interaktivem Onboarding!_
- ✅ **Multi-Language Scanner Support** (PHP, JavaScript, Python, Java, C#, Go, Rust)
- ✅ **JSON Schema Validation** (bereits verfügbar!)
- ✅ **GitHub Actions Integration** (bereits verfügbar!)
- ✅ **VS Code Workspace Support** (bereits verfügbar!)
- AI playground
- Docusaurus documentation site
- Composer/NPM integrations

**🎯 Open Source & Free** - Community-driven AI standard for better project understanding

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

---

## 🚀 Roadmap & Zukünftige Entwicklung

Das coreX AI MindLayer Projekt entwickelt sich kontinuierlich weiter. Hier sind unsere wichtigsten geplanten Features:

### 📋 Skalierbarkeits-Features (v4.0.0)

- Modularisierung großer `.ai.json`-Dateien mit Referenzsystem
- Komprimierungsstrategien für effiziente Datenspeicherung
- Selektive Generierung und Filterung für große Projekte
- Alternative Datenhaltungskonzepte für Enterprise-Anwendungen

### 🤖 Machine Learning Features (v4.0.0)

- Intelligente Architekturanalyse und Pattern-Erkennung
- KI-gestützte Metadaten-Generierung mit NLP
- Code-Qualitäts-Scoring und Anti-Pattern-Erkennung
- Predictive Maintenance für Codebasis-Management

### 🌐 Erweiterte Ecosystem-Integrationen

- Web-Interface und API für browserbasierte Visualisierung
- CI/CD-Pipeline Integration (GitHub Actions, Jenkins, GitLab)
- Multi-IDE-Support (JetBrains, Eclipse, Atom, Sublime)
- Erweiterte KI-Integration mit externen Diensten

Wir freuen uns über Community-Beiträge! Alle Details zur Roadmap finden Sie in der `TODO.md`.
