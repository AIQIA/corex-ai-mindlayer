
<!-- AI-MINDLAYER:START -->
## AI MindLayer (AIM) - Mandatory Agent Guidance
This project uses **coreX AI MindLayer** for project memory. 

### 🤖 Mandatory Instructions for AI Agents:
1. **Bootstrap Check**: If `.ai.json` is missing or empty, you **must** proactively offer to initialize it.
2. **Scan & Setup**: Analyze the project structure, tech stack, and documentation. Propose a `.ai.json` that defines the project's identity and `red_lines`.
3. **Interview the User**: If project truths (environments, release status, specific constraints) are unclear, ask the user targeted questions (e.g., "What are the core technical boundaries for this project?").
4. **Context Profiles**: Load feature-specific details via `.ai.features.index.json` only when relevant to the task.
5. **Preference Management**: Check `.ai.user-preferences.md` for specific collaboration styles. If missing, ask the user how they prefer to interact (e.g., "Do you want me to explain every step, or just provide the code?").
6. **Maintain Truth**: Keep `.ai.json` updated with long-term project truths. Do not use it for temporary task lists.

*AIM ensures we stay aligned. No context, no coding.*
<!-- AI-MINDLAYER:END -->
