import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('🤖 coreX AI MindLayer extension is now active!');

    // Register commands
    const createAiJsonCommand = vscode.commands.registerCommand('aiMindLayer.createAiJson', createAiJson);
    const validateSchemaCommand = vscode.commands.registerCommand('aiMindLayer.validateSchema', validateSchema);
    const runScannerCommand = vscode.commands.registerCommand('aiMindLayer.runScanner', runScanner);
    
    // NEW: Extended features
    const architecturePreviewCommand = vscode.commands.registerCommand('aiMindLayer.architecturePreview', showArchitecturePreview);
    const treeExplorerCommand = vscode.commands.registerCommand('aiMindLayer.openTreeExplorer', openTreeExplorer);
    const aiIntelliSenseCommand = vscode.commands.registerCommand('aiMindLayer.enableIntelliSense', enableAiIntelliSense);

    // Register file system watcher for .ai.json files
    const aiJsonWatcher = vscode.workspace.createFileSystemWatcher('**/.ai.json');
    aiJsonWatcher.onDidChange(() => {
        vscode.window.showInformationMessage('🤖 .ai.json file updated!');
    });

    // Auto-validate on save
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.fileName.endsWith('.ai.json')) {
            validateAiJsonDocument(document);
        }
    });

    // Show welcome message if .ai.json doesn't exist
    checkForAiJson();

    // Add all disposables to context
    context.subscriptions.push(
        createAiJsonCommand,
        validateSchemaCommand,
        runScannerCommand,
        architecturePreviewCommand,
        treeExplorerCommand,
        aiIntelliSenseCommand,
        aiJsonWatcher
    );
}

async function createAiJson() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    
    // Check if .ai.json already exists
    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        const overwrite = await vscode.window.showWarningMessage(
            '.ai.json already exists. Overwrite?',
            'Yes', 'No'
        );
        if (overwrite !== 'Yes') return;
    } catch {
        // File doesn't exist, continue
    }

    // Create basic .ai.json template
    const template = {
        "meta": {
            "project": workspaceFolder.name,
            "version": "1.0.0",
            "author": "Your Name",
            "description": "Project description",
            "created": new Date().toISOString().split('T')[0],
            "updated": new Date().toISOString().split('T')[0]
        },
        "architecture": [
            {
                "module": "Core",
                "description": "Main application logic",
                "entrypoints": ["index.js", "main.py", "app.php"],
                "routes": ["/"],
                "dependencies": []
            }
        ],
        "errors": [
            {
                "code": "EXAMPLE_ERROR",
                "message": "Example error description",
                "causes": ["Possible cause 1", "Possible cause 2"],
                "solutions": ["Solution 1", "Solution 2"],
                "severity": "medium"
            }
        ],
        "tasks": [
            {
                "task": "Customize this .ai.json file",
                "priority": "high",
                "status": "open",
                "relatedModules": ["Core"],
                "due": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "tags": ["setup"]
            }
        ],
        "context": [
            {
                "key": "Framework",
                "value": "Add your main framework here",
                "category": "technology"
            }
        ],
        "references": [
            {
                "type": "doc",
                "label": "AI Integration Guide",
                "url": "./AI-INTEGRATION.md",
                "description": "How to integrate AI tools with this project"
            }
        ]
    };

    try {
        const content = JSON.stringify(template, null, 2);
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(aiJsonUri, encoder.encode(content));
        
        vscode.window.showInformationMessage('✅ .ai.json created successfully!');
        
        // Open the file for editing
        const document = await vscode.workspace.openTextDocument(aiJsonUri);
        await vscode.window.showTextDocument(document);
        
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create .ai.json: ${error}`);
    }
}

async function validateSchema() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    
    try {
        const document = await vscode.workspace.openTextDocument(aiJsonUri);
        await validateAiJsonDocument(document);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to validate .ai.json: ${error}`);
    }
}

async function validateAiJsonDocument(document: vscode.TextDocument) {
    try {
        const content = document.getText();
        JSON.parse(content); // Basic JSON validation
        
        vscode.window.showInformationMessage('✅ .ai.json is valid JSON!');
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`❌ Invalid JSON in .ai.json: ${error}`);
        return false;
    }
}

async function runScanner() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    // Check if ai-init.php exists
    const scannerUri = vscode.Uri.joinPath(workspaceFolder.uri, 'ai-init.php');
    
    try {
        await vscode.workspace.fs.stat(scannerUri);
    } catch {
        const download = await vscode.window.showInformationMessage(
            'ai-init.php not found in this workspace. Would you like to copy it from the AI MindLayer project?',
            'Copy Scanner', 'Cancel'
        );
        
        if (download === 'Copy Scanner') {
            vscode.window.showInformationMessage('Please copy ai-init.php from the coreX AI MindLayer repository to your project root.');
        }
        return;
    }

    // Run the scanner in terminal
    const terminal = vscode.window.createTerminal('AI MindLayer Scanner');
    terminal.show();
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    terminal.sendText('php ai-init.php');
    
    vscode.window.showInformationMessage('🤖 Running AI MindLayer scanner...');
}

async function checkForAiJson() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;
    
    const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    
    try {
        await vscode.workspace.fs.stat(aiJsonUri);
        // .ai.json exists
        vscode.window.showInformationMessage('🤖 AI MindLayer detected! Your project is AI-ready.');
    } catch {
        // .ai.json doesn't exist, show welcome message
        const action = await vscode.window.showInformationMessage(
            '🤖 Welcome to AI MindLayer! Would you like to make this project AI-ready?',
            'Create .ai.json',
            'Run Scanner',
            'Later'
        );
        
        if (action === 'Create .ai.json') {
            createAiJson();
        } else if (action === 'Run Scanner') {
            runScanner();
        }
    }
}

export function deactivate() {
    console.log('🤖 AI MindLayer extension deactivated');
}

// ========================================
// NEW: Extended Features (v3.0.0)
// ========================================

/**
 * Show Architecture Preview - Visual representation of project structure
 */
async function showArchitecturePreview() {
    const panel = vscode.window.createWebviewPanel(
        'aiArchitecturePreview',
        '🏗️ Architecture Preview',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        panel.webview.html = getErrorHtml('No .ai.json found. Create one first!');
        return;
    }

    panel.webview.html = getArchitecturePreviewHtml(aiJsonContent);
    
    vscode.window.showInformationMessage('🏗️ Architecture Preview opened!');
}

/**
 * Open Tree Explorer - Interactive navigation through AI-structured projects
 */
async function openTreeExplorer() {
    const panel = vscode.window.createWebviewPanel(
        'aiTreeExplorer',
        '🌳 AI Tree Explorer',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        panel.webview.html = getErrorHtml('No .ai.json found. Create one first!');
        return;
    }

    panel.webview.html = getTreeExplorerHtml(aiJsonContent);
    
    // Handle messages from webview
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'openFile') {
            const uri = vscode.Uri.file(message.filePath);
            const document = await vscode.workspace.openTextDocument(uri);
            vscode.window.showTextDocument(document);
        }
    });

    vscode.window.showInformationMessage('🌳 Tree Explorer opened!');
}

/**
 * Enable AI IntelliSense - Context-based code completion from .ai.json
 */
async function enableAiIntelliSense() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    // Register completion provider for all languages
    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file' },
        new AiIntelliSenseProvider(aiJsonContent),
        '.'
    );

    vscode.window.showInformationMessage('🧠 AI IntelliSense enabled! Try typing in your code files.');
}

/**
 * Load and parse .ai.json content from workspace
 */
async function loadAiJsonContent(): Promise<any | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return null;

    try {
        const aiJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
        const content = await vscode.workspace.fs.readFile(aiJsonUri);
        return JSON.parse(content.toString());
    } catch {
        return null;
    }
}

/**
 * AI IntelliSense Provider - Context-aware completions
 */
class AiIntelliSenseProvider implements vscode.CompletionItemProvider {
    private aiData: any;

    constructor(aiData: any) {
        this.aiData = aiData;
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];

        // Add completions based on .ai.json architecture
        if (this.aiData.architecture?.components) {
            this.aiData.architecture.components.forEach((component: any) => {
                const item = new vscode.CompletionItem(
                    component.name,
                    vscode.CompletionItemKind.Module
                );
                item.detail = component.description || 'AI MindLayer Component';
                item.documentation = new vscode.MarkdownString(
                    `**${component.name}**\n\n${component.description || 'Component from .ai.json'}`
                );
                completions.push(item);
            });
        }

        // Add completions for key concepts
        if (this.aiData.context?.key_concepts) {
            this.aiData.context.key_concepts.forEach((concept: string) => {
                const item = new vscode.CompletionItem(
                    concept,
                    vscode.CompletionItemKind.Keyword
                );
                item.detail = 'Key Concept from .ai.json';
                item.insertText = concept;
                completions.push(item);
            });
        }

        return completions;
    }
}

/**
 * Generate HTML for Architecture Preview
 */
function getArchitecturePreviewHtml(aiData: any): string {
    const components = aiData.architecture?.components || [];
    const patterns = aiData.architecture?.patterns || [];

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Architecture Preview</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: #1e1e1e; 
                color: #d4d4d4; 
                margin: 0; 
                padding: 20px; 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                color: #569cd6; 
            }
            .architecture-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 20px; 
                margin-bottom: 30px; 
            }
            .component-card { 
                background: #2d2d30; 
                border: 1px solid #3e3e42; 
                border-radius: 8px; 
                padding: 20px; 
                transition: transform 0.2s, box-shadow 0.2s; 
            }
            .component-card:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 4px 12px rgba(86, 156, 214, 0.3); 
            }
            .component-name { 
                font-size: 1.2em; 
                font-weight: bold; 
                color: #4ec9b0; 
                margin-bottom: 10px; 
            }
            .component-description { 
                color: #cccccc; 
                line-height: 1.5; 
            }
            .patterns-section { 
                margin-top: 30px; 
                padding: 20px; 
                background: #252526; 
                border-radius: 8px; 
            }
            .pattern-item { 
                padding: 10px; 
                margin: 5px 0; 
                background: #2d2d30; 
                border-left: 4px solid #569cd6; 
                border-radius: 4px; 
            }
            .no-data { 
                text-align: center; 
                color: #858585; 
                font-style: italic; 
                margin: 40px 0; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏗️ Architecture Preview</h1>
            <p>Visual representation of your project structure from .ai.json</p>
        </div>

        <div class="architecture-grid">
            ${components.length > 0 ? components.map((comp: any) => `
                <div class="component-card">
                    <div class="component-name">${comp.name || 'Unnamed Component'}</div>
                    <div class="component-description">${comp.description || 'No description available'}</div>
                    ${comp.responsibilities ? `<div style="margin-top: 10px; font-size: 0.9em; color: #9cdcfe;">
                        <strong>Responsibilities:</strong><br>
                        ${Array.isArray(comp.responsibilities) ? comp.responsibilities.join('<br>') : comp.responsibilities}
                    </div>` : ''}
                </div>
            `).join('') : '<div class="no-data">No components defined in .ai.json</div>'}
        </div>

        ${patterns.length > 0 ? `
            <div class="patterns-section">
                <h2 style="color: #569cd6; margin-bottom: 15px;">🎯 Architecture Patterns</h2>
                ${patterns.map((pattern: string) => `
                    <div class="pattern-item">${pattern}</div>
                `).join('')}
            </div>
        ` : ''}
    </body>
    </html>
    `;
}

/**
 * Generate HTML for Tree Explorer
 */
function getTreeExplorerHtml(aiData: any): string {
    const structure = aiData.project?.structure || {};
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Tree Explorer</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: #1e1e1e; 
                color: #d4d4d4; 
                margin: 0; 
                padding: 20px; 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                color: #569cd6; 
            }
            .tree-container { 
                background: #2d2d30; 
                border-radius: 8px; 
                padding: 20px; 
                overflow: auto; 
            }
            .tree-node { 
                margin: 5px 0; 
                cursor: pointer; 
                padding: 5px 10px; 
                border-radius: 4px; 
                transition: background-color 0.2s; 
            }
            .tree-node:hover { 
                background-color: #3e3e42; 
            }
            .tree-node.folder { 
                color: #dcaa4b; 
                font-weight: bold; 
            }
            .tree-node.file { 
                color: #9cdcfe; 
            }
            .tree-indent { 
                margin-left: 20px; 
            }
            .expand-icon { 
                display: inline-block; 
                width: 12px; 
                text-align: center; 
                margin-right: 5px; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🌳 AI Tree Explorer</h1>
            <p>Interactive navigation through your AI-structured project</p>
        </div>

        <div class="tree-container">
            <div id="tree-root">
                ${generateTreeHtml(structure)}
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            function openFile(filePath) {
                vscode.postMessage({
                    command: 'openFile',
                    filePath: filePath
                });
            }
            
            function toggleFolder(element) {
                const children = element.nextElementSibling;
                if (children && children.classList.contains('tree-indent')) {
                    children.style.display = children.style.display === 'none' ? 'block' : 'none';
                    const icon = element.querySelector('.expand-icon');
                    icon.textContent = children.style.display === 'none' ? '▶' : '▼';
                }
            }
        </script>
    </body>
    </html>
    `;
}

/**
 * Generate tree HTML structure recursively
 */
function generateTreeHtml(structure: any, level: number = 0): string {
    if (!structure || typeof structure !== 'object') {
        return '<div class="no-data">No project structure defined in .ai.json</div>';
    }

    let html = '';
    
    Object.entries(structure).forEach(([key, value]) => {
        const indent = '  '.repeat(level);
        
        if (typeof value === 'object' && value !== null) {
            // Folder
            html += `
                ${indent}<div class="tree-node folder" onclick="toggleFolder(this)">
                    <span class="expand-icon">▼</span>📁 ${key}
                </div>
                <div class="tree-indent">
                    ${generateTreeHtml(value, level + 1)}
                </div>
            `;
        } else {
            // File
            html += `
                ${indent}<div class="tree-node file" onclick="openFile('${value}')">
                    📄 ${key}
                </div>
            `;
        }
    });
    
    return html;
}

/**
 * Generate error HTML
 */
function getErrorHtml(message: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
                font-family: 'Segoe UI', sans-serif; 
                background: #1e1e1e; 
                color: #f48771; 
                text-align: center; 
                padding: 50px; 
            }
            .error-icon { font-size: 3em; margin-bottom: 20px; }
            h1 { color: #f48771; }
        </style>
    </head>
    <body>
        <div class="error-icon">⚠️</div>
        <h1>Error</h1>
        <p>${message}</p>
    </body>
    </html>
    `;
}
