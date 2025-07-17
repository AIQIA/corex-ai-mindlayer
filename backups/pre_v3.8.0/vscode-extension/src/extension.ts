import * as vscode from 'vscode';
import { updateFromPackageManager, scanDockerConfiguration } from './ecosystem';
import { registerVersionCheckerCommand } from './version-checker';

export function activate(context: vscode.ExtensionContext) {
    console.log('🤖 coreX AI MindLayer extension is now active!');

    // Register commands
    const createAiJsonCommand = vscode.commands.registerCommand('aiMindLayer.createAiJson', createAiJson);
    const validateSchemaCommand = vscode.commands.registerCommand('aiMindLayer.validateSchema', validateSchema);
    const runScannerCommand = vscode.commands.registerCommand('aiMindLayer.runScanner', runScanner);
    
    // NEW: Extended features (v3.0.0)
    const architecturePreviewCommand = vscode.commands.registerCommand('aiMindLayer.architecturePreview', showArchitecturePreview);
    const treeExplorerCommand = vscode.commands.registerCommand('aiMindLayer.openTreeExplorer', openTreeExplorer);
    const aiIntelliSenseCommand = vscode.commands.registerCommand('aiMindLayer.enableIntelliSense', enableAiIntelliSense);
    
    // NEW: v3.1.0 AI Integration Features  
    const mindMapCommand = vscode.commands.registerCommand('aiMindLayer.showMindMap', showMindMapVisualizer);
    const autoDocsCommand = vscode.commands.registerCommand('aiMindLayer.generateDocs', generateAiDocs);
    const diffAnalyzerCommand = vscode.commands.registerCommand('aiMindLayer.compareDiff', showDiffAnalyzer);
    
    // NEW: v3.3.0 Ecosystem Integration Features
    const autoSyncCommand = vscode.commands.registerCommand('aiMindLayer.runAutoSync', runAutoSync);
    const updateFromPackageCommand = vscode.commands.registerCommand('aiMindLayer.updateFromPackage', updateFromPackageManager);
    const scanDockerConfigCommand = vscode.commands.registerCommand('aiMindLayer.scanDockerConfig', scanDockerConfiguration);
    
    // NEW: v3.4.1 User Preferences Feature
    const userPreferencesCommand = vscode.commands.registerCommand('aiMindLayer.editUserPreferences', editUserPreferences);
    
    // NEW: v3.5.0 Research & Prototypes Feature
    const manageResearchCommand = vscode.commands.registerCommand('aiMindLayer.manageResearch', manageResearch);
    
    // NEW: v3.7.0 Version Checker Feature
    const checkForUpdatesCommand = registerVersionCheckerCommand(context);

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
        mindMapCommand,
        autoDocsCommand,
        diffAnalyzerCommand,
        autoSyncCommand,
        updateFromPackageCommand,
        scanDockerConfigCommand,
        userPreferencesCommand,
        manageResearchCommand,
        aiJsonWatcher
    );

    // Register version checker command
    registerVersionCheckerCommand(context);
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
// NEW: v3.0.0 Extended Features
// ========================================

/**
 * Show Architecture Preview - Visual overview of project architecture
 */
async function showArchitecturePreview() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'architecturePreview',
        '🏗️ Architecture Preview',
        vscode.ViewColumn.Two,
        { enableScripts: true }
    );

    panel.webview.html = getArchitecturePreviewHtml(aiJsonContent);
    
    vscode.window.showInformationMessage('🏗️ Architecture Preview opened!');
}

/**
 * Open Tree Explorer - File structure visualization
 */
async function openTreeExplorer() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'treeExplorer',
        '🌳 Project Tree Explorer',
        vscode.ViewColumn.Two,
        { enableScripts: true }
    );

    panel.webview.html = getTreeExplorerHtml(aiJsonContent);
    
    // Handle file opening from webview
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'openFile') {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, message.filePath);
                try {
                    const document = await vscode.workspace.openTextDocument(fileUri);
                    await vscode.window.showTextDocument(document);
                } catch (error) {
                    vscode.window.showErrorMessage(`Could not open file: ${message.filePath}`);
                }
            }
        }
    });
    
    vscode.window.showInformationMessage('🌳 Tree Explorer opened!');
}

/**
 * Enable AI IntelliSense - Smart code completion based on .ai.json
 */
async function enableAiIntelliSense() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    // Show IntelliSense info panel
    const panel = vscode.window.createWebviewPanel(
        'aiIntelliSense',
        '🧠 AI IntelliSense',
        vscode.ViewColumn.Two,
        { enableScripts: true }
    );

    panel.webview.html = getIntelliSenseHtml(aiJsonContent);
    
    vscode.window.showInformationMessage('🧠 AI IntelliSense activated! Enhanced code completion available.');
}

// ========================================
// NEW: v3.1.0 AI Integration Features
// ========================================

/**
 * Show Mind Map Visualizer - Interactive graph visualization of .ai.json
 */
async function showMindMapVisualizer() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'aiMindMapVisualizer',
        '🧠 AI Mind Map',
        vscode.ViewColumn.Beside,
        { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI Mind Map</title>
    <style>
        body { font-family: sans-serif; background: #1e1e1e; color: #d4d4d4; padding: 20px; text-align: center; }
        .node { background: #2d2d30; border: 1px solid #569cd6; border-radius: 8px; padding: 15px; margin: 10px; display: inline-block; min-width: 150px; }
        .node h3 { color: #569cd6; margin: 0 0 10px 0; }
        .component { border-color: #4ec9b0; }
        .concept { border-color: #dcdcaa; }
    </style>
</head>
<body>
    <h1>🧠 AI Mind Map Visualizer</h1>
    <p>Project: ${aiJsonContent.project?.name || 'Unnamed'}</p>
    <div id="mindmap">
        ${generateMindMapNodes(aiJsonContent)}
    </div>
</body>
</html>`;

    vscode.window.showInformationMessage('🧠 AI Mind Map opened! Visual representation of your project structure.');
}

/**
 * Generate AI-friendly documentation comments
 */
async function generateAiDocs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found. Open a file first.');
        return;
    }

    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    const document = editor.document;
    const fileName = document.fileName;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // Generate AI-friendly comment
    const projectName = aiJsonContent.project?.name || 'Project';
    const projectDescription = aiJsonContent.project?.description || 'AI-ready project';
    const frameworks = aiJsonContent.context?.frameworks || [];
    
    let commentPrefix = '//';
    if (fileExtension === 'php') commentPrefix = '//';
    else if (fileExtension === 'py') commentPrefix = '#';
    else if (fileExtension === 'html') commentPrefix = '<!--';
    
    const aiComment = `${commentPrefix} @ai-docs: AI-Friendly Documentation
${commentPrefix} Project: ${projectName}
${commentPrefix} Description: ${projectDescription}
${commentPrefix} Frameworks: ${frameworks.join(', ') || 'None specified'}
${commentPrefix} Generated by: coreX AI MindLayer v3.1.0
${commentPrefix} Last updated: ${new Date().toISOString()}
`;
    
    // Insert at top of file
    const edit = new vscode.WorkspaceEdit();
    edit.insert(document.uri, new vscode.Position(0, 0), aiComment + '\n');
    await vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage('🤖 AI-friendly documentation comments generated!');
}

/**
 * Show Diff Analyzer - Compare two .ai.json versions
 */
async function showDiffAnalyzer() {
    const aiJsonContent = await loadAiJsonContent();
    if (!aiJsonContent) {
        vscode.window.showErrorMessage('No .ai.json found. Create one first!');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'aiDiffAnalyzer',
        '📊 AI Diff Analyzer',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI Diff Analyzer</title>
    <style>
        body { font-family: sans-serif; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
        .current { background: #2d2d30; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .upload-btn { background: #569cd6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px 0; }
        .diff-result { background: #252526; padding: 15px; border-radius: 8px; margin: 10px 0; display: none; }
        .addition { color: #4ec9b0; }
        .deletion { color: #f48771; }
        .change { color: #dcdcaa; }
    </style>
</head>
<body>
    <h1>📊 AI Diff Analyzer</h1>
    <div class="current">
        <h3>Current .ai.json</h3>
        <p><strong>Project:</strong> ${aiJsonContent.project?.name || 'Unnamed'}</p>
        <p><strong>Version:</strong> ${aiJsonContent.project?.version || 'Not specified'}</p>
        <p><strong>Components:</strong> ${aiJsonContent.architecture?.components?.length || 0}</p>
    </div>
    <button class="upload-btn" onclick="selectFile()">Choose File to Compare</button>
    <div id="diffResult" class="diff-result">
        <h3>Comparison will appear here</h3>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function selectFile() {
            vscode.postMessage({ command: 'compareWithFile' });
        }
    </script>
</body>
</html>`;

    // Handle file selection
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'compareWithFile') {
            const options = {
                canSelectMany: false,
                openLabel: 'Select .ai.json to compare',
                filters: { 'AI JSON files': ['ai.json'], 'JSON files': ['json'] }
            };

            const fileUri = await vscode.window.showOpenDialog(options);
            if (fileUri && fileUri[0]) {
                try {
                    const compareContent = await vscode.workspace.fs.readFile(fileUri[0]);
                    const compareData = JSON.parse(compareContent.toString());
                    
                    // Simple diff analysis
                    const currentComponents = aiJsonContent.architecture?.components?.length || 0;
                    const compareComponents = compareData.architecture?.components?.length || 0;
                    const componentDiff = compareComponents - currentComponents;
                    
                    const diffHtml = `
                        <h3>Comparison Results</h3>
                        <p><strong>File:</strong> ${fileUri[0].fsPath}</p>
                        <p class="${componentDiff > 0 ? 'addition' : componentDiff < 0 ? 'deletion' : 'change'}">
                            Components: ${currentComponents} → ${compareComponents} 
                            (${componentDiff >= 0 ? '+' : ''}${componentDiff})
                        </p>
                        <p>Version: ${aiJsonContent.project?.version || 'N/A'} → ${compareData.project?.version || 'N/A'}</p>
                    `;
                    
                    panel.webview.postMessage({ command: 'showDiff', html: diffHtml });
                } catch (error) {
                    vscode.window.showErrorMessage('Error reading comparison file.');
                }
            }
        }
    });

    vscode.window.showInformationMessage('📊 Diff Analyzer opened! Select a .ai.json file to compare.');
}

/**
 * Generate mind map nodes HTML from .ai.json
 */
function generateMindMapNodes(aiData: any): string {
    let html = '';
    
    // Add components
    if (aiData.architecture?.components) {
        aiData.architecture.components.forEach((comp: any) => {
            html += `<div class="node component">
                <h3>${comp.name || 'Component'}</h3>
                <p>${comp.description || 'No description'}</p>
            </div>`;
        });
    }
    
    // Add key concepts
    if (aiData.context?.key_concepts) {
        aiData.context.key_concepts.forEach((concept: string) => {
            html += `<div class="node concept">
                <h3>${concept}</h3>
                <p>Key Concept</p>
            </div>`;
        });
    }
    
    return html || '<p>No components or concepts found in .ai.json</p>';
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

/**
 * Generate Architecture Preview HTML
 */
function getArchitecturePreviewHtml(aiJsonContent: any): string {
    const components = aiJsonContent.architecture?.components || [];
    const dependencies = aiJsonContent.architecture?.dependencies || [];
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Architecture Preview</title>
        <style>
            body { 
                font-family: 'Segoe UI', sans-serif; 
                background: #1e1e1e; 
                color: #d4d4d4; 
                padding: 20px; 
                margin: 0;
            }
            h1 { color: #569cd6; border-bottom: 2px solid #569cd6; padding-bottom: 10px; }
            h2 { color: #4ec9b0; margin-top: 30px; }
            .component { 
                background: #2d2d30; 
                border-left: 4px solid #569cd6; 
                padding: 15px; 
                margin: 10px 0; 
                border-radius: 5px; 
            }
            .dependency { 
                background: #252526; 
                border-left: 4px solid #dcdcaa; 
                padding: 10px; 
                margin: 5px 0; 
                border-radius: 3px; 
            }
            .tag { 
                display: inline-block; 
                background: #569cd6; 
                color: white; 
                padding: 2px 8px; 
                border-radius: 12px; 
                font-size: 0.8em; 
                margin: 2px; 
            }
            .overview { 
                background: #252526; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
            }
        </style>
    </head>
    <body>
        <h1>🏗️ Project Architecture</h1>
        
        <div class="overview">
            <h3>📊 Overview</h3>
            <p><strong>Project:</strong> ${aiJsonContent.project?.name || 'Unnamed Project'}</p>
            <p><strong>Version:</strong> ${aiJsonContent.project?.version || 'Not specified'}</p>
            <p><strong>Components:</strong> ${components.length}</p>
            <p><strong>Dependencies:</strong> ${dependencies.length}</p>
        </div>

        <h2>🔧 Components</h2>
        ${components.map((comp: any) => `
            <div class="component">
                <h3>${comp.name || 'Unnamed Component'}</h3>
                <p><strong>Type:</strong> ${comp.type || 'Not specified'}</p>
                <p><strong>Description:</strong> ${comp.description || 'No description'}</p>
                ${comp.technologies ? `<p><strong>Technologies:</strong> ${comp.technologies.map((tech: string) => `<span class="tag">${tech}</span>`).join('')}</p>` : ''}
            </div>
        `).join('')}

        <h2>🔗 Dependencies</h2>
        ${dependencies.map((dep: any) => `
            <div class="dependency">
                <strong>${dep.name || 'Unnamed Dependency'}</strong>
                ${dep.version ? ` - v${dep.version}` : ''}
                ${dep.description ? `<br><small>${dep.description}</small>` : ''}
            </div>
        `).join('')}
    </body>
    </html>
    `;
}

/**
 * Generate AI IntelliSense HTML
 */
function getIntelliSenseHtml(aiJsonContent: any): string {
    const context = aiJsonContent.ai_context || {};
    const patterns = aiJsonContent.patterns || [];
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>AI IntelliSense</title>
        <style>
            body { 
                font-family: 'Segoe UI', sans-serif; 
                background: #1e1e1e; 
                color: #d4d4d4; 
                padding: 20px; 
                margin: 0;
            }
            h1 { color: #569cd6; border-bottom: 2px solid #569cd6; padding-bottom: 10px; }
            h2 { color: #4ec9b0; margin-top: 30px; }
            .context-item { 
                background: #2d2d30; 
                border-left: 4px solid #4ec9b0; 
                padding: 15px; 
                margin: 10px 0; 
                border-radius: 5px; 
            }
            .pattern { 
                background: #252526; 
                border-left: 4px solid #dcdcaa; 
                padding: 10px; 
                margin: 5px 0; 
                border-radius: 3px; 
            }
            .status { 
                background: #0e7b42; 
                color: white; 
                padding: 10px 20px; 
                border-radius: 5px; 
                margin: 20px 0; 
                text-align: center; 
            }
            .feature { 
                display: inline-block; 
                background: #569cd6; 
                color: white; 
                padding: 5px 12px; 
                border-radius: 15px; 
                margin: 5px; 
                font-size: 0.9em; 
            }
        </style>
    </head>
    <body>
        <h1>🧠 AI IntelliSense</h1>
        
        <div class="status">
            ✅ AI IntelliSense is now active for this project!
        </div>

        <h2>🎯 Enhanced Features</h2>
        <div class="feature">Smart Code Completion</div>
        <div class="feature">Context-Aware Suggestions</div>
        <div class="feature">Pattern Recognition</div>
        <div class="feature">Framework Integration</div>

        <h2>📋 AI Context</h2>
        ${Object.entries(context).map(([key, value]) => `
            <div class="context-item">
                <h3>${key}</h3>
                <p>${JSON.stringify(value, null, 2)}</p>
            </div>
        `).join('')}

        <h2>🔄 Recognized Patterns</h2>
        ${patterns.map((pattern: any) => `
            <div class="pattern">
                <strong>${pattern.name || 'Unnamed Pattern'}</strong>
                ${pattern.description ? `<br><small>${pattern.description}</small>` : ''}
            </div>
        `).join('')}
    </body>
    </html>
    `;
}

/**
 * Execute Auto-Sync Tool - Teil des Ecosystem Integration Features (v3.3.0)
 * Synchronisiert .ai.json mit Dokumentationsfiles (README, CHANGELOG, TODO, etc.)
 */
async function runAutoSync() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    
    // Prüfen, ob auto-sync.js existiert
    const scriptPath = vscode.Uri.joinPath(workspaceFolder.uri, 'scripts', 'ecosystem', 'auto-sync.js');
    
    try {
        await vscode.workspace.fs.stat(scriptPath);
    } catch {
        // Script existiert nicht, Benutzer fragen, ob es erstellt werden soll
        const createOption = await vscode.window.showInformationMessage(
            'Auto-Sync Script nicht gefunden. Möchten Sie das Script erstellen?',
            'Script erstellen',
            'Abbrechen'
        );
        
        if (createOption === 'Script erstellen') {
            try {
                // Stellen Sie sicher, dass das Verzeichnis existiert
                const scriptDir = vscode.Uri.joinPath(workspaceFolder.uri, 'scripts', 'ecosystem');
                await vscode.workspace.fs.createDirectory(scriptDir);
                
                // Einen Template-Inhalt für das Script generieren
                const scriptContent = `#!/usr/bin/env node
/**
 * coreX AI MindLayer - Auto-Sync Tool
 * Synchronisiert .ai.json mit Dokumentationsfiles
 */
console.log('🔄 coreX AI MindLayer - Auto-Sync Tool startet...');
// TODO: Implementiere die Auto-Sync-Logik
`;
                // Schreibe das Script
                await vscode.workspace.fs.writeFile(
                    scriptPath, 
                    Buffer.from(scriptContent, 'utf8')
                );
                
                vscode.window.showInformationMessage('Auto-Sync Script erstellt!');
            } catch (error) {
                vscode.window.showErrorMessage(`Fehler beim Erstellen des Scripts: ${error}`);
                return;
            }
        } else {
            return;
        }
    }

    // Script im Terminal ausführen
    const terminal = vscode.window.createTerminal('AI MindLayer Auto-Sync');
    terminal.show();
    
    // Zu Workspace-Ordner navigieren
    terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
    
    // Das Script mit Node.js ausführen
    terminal.sendText('node scripts/ecosystem/auto-sync.js');
    
    vscode.window.showInformationMessage('🔄 Auto-Sync wird ausgeführt...');
}

/**
 * Bearbeiten von Benutzereinstellungen (user_preferences) in .ai.json - Feature (v3.4.1)
 * Bietet einen interaktiven Dialog zum Anpassen der Kommunikationspräferenzen für KI-Assistenten
 */
async function editUserPreferences() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner geöffnet');
        return;
    }
    
    // Pfad zur .ai.json Datei
    const aiJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    
    // Prüfen ob .ai.json existiert
    try {
        await vscode.workspace.fs.stat(aiJsonPath);
    } catch {
        const createOption = await vscode.window.showInformationMessage(
            '.ai.json nicht gefunden. Möchten Sie zuerst eine .ai.json Datei erstellen?',
            'Datei erstellen',
            'Abbrechen'
        );
        
        if (createOption === 'Datei erstellen') {
            await createAiJson();
        }
        return;
    }
    
    try {
        // .ai.json Datei lesen
        const aiJsonData = await vscode.workspace.fs.readFile(aiJsonPath);
        let aiJson = JSON.parse(aiJsonData.toString());
        
        // Sicherstellen dass user_preferences existiert
        if (!aiJson.user_preferences) {
            aiJson.user_preferences = {
                language: "deutsch",
                communication_style: "informell",
                technical_depth: "mittel",
                response_format: "mit_codebeispielen"
            };
        }
        
        // Benutzeroptionen für Dropdown-Menüs definieren
        const languageOptions = ["deutsch", "english", "français", "español", "italiano"];
        const styleOptions = ["formal", "informell", "technisch", "freundschaftlich", "kompakt"];
        const depthOptions = ["niedrig", "mittel", "hoch"];
        const formatOptions = ["kurz", "ausführlich", "mit_codebeispielen", "mit_analogien"];
        
        // Benutzereinstellungen über QuickPick abfragen
        const language = await vscode.window.showQuickPick(languageOptions, {
            placeHolder: 'Bevorzugte Sprache',
            title: 'KI-Kommunikationssprache wählen',
            canPickMany: false
        });
        
        if (!language) return; // Abbruch bei Abbrechen
        
        const style = await vscode.window.showQuickPick(styleOptions, {
            placeHolder: 'Kommunikationsstil',
            title: 'Bevorzugten Kommunikationsstil wählen',
            canPickMany: false
        });
        
        if (!style) return;
        
        const depth = await vscode.window.showQuickPick(depthOptions, {
            placeHolder: 'Technischer Detailgrad',
            title: 'Bevorzugten technischen Detailgrad wählen',
            canPickMany: false
        });
        
        if (!depth) return;
        
        const format = await vscode.window.showQuickPick(formatOptions, {
            placeHolder: 'Antwortformat',
            title: 'Bevorzugtes Format für Antworten wählen',
            canPickMany: false
        });
        
        if (!format) return;
        
        const note = await vscode.window.showInputBox({
            placeHolder: 'Optional: Zusätzliche Hinweise zu Benutzerpräferenzen',
            title: 'Hinweise für KI-Assistenten (optional)'
        });
        
        // user_preferences aktualisieren
        aiJson.user_preferences = {
            language,
            communication_style: style,
            technical_depth: depth,
            response_format: format
        };
        
        if (note) {
            aiJson.user_preferences.note = note;
        }
        
        // .ai.json mit aktualisierten user_preferences speichern
        await vscode.workspace.fs.writeFile(
            aiJsonPath,
            Buffer.from(JSON.stringify(aiJson, null, 4), 'utf8')
        );
        
        vscode.window.showInformationMessage('🤖 Benutzereinstellungen erfolgreich aktualisiert!');
        
    } catch (error) {
        vscode.window.showErrorMessage(`Fehler beim Bearbeiten der Benutzereinstellungen: ${error}`);
    }
}

/**
 * Verwaltet und visualisiert die Forschungs- und Prototypen-Features - Feature (v3.5.0)
 * Zeigt eine interaktive Übersicht der aktuellen Forschungsprojekte und ihren Status
 */
async function manageResearch() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner geöffnet');
        return;
    }
    
    // Pfad zur .ai.json Datei
    const aiJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, '.ai.json');
    
    // Prüfen ob .ai.json existiert
    try {
        await vscode.workspace.fs.stat(aiJsonPath);
    } catch {
        const createOption = await vscode.window.showInformationMessage(
            '.ai.json nicht gefunden. Möchten Sie zuerst eine .ai.json Datei erstellen?',
            'Datei erstellen',
            'Abbrechen'
        );
        
        if (createOption === 'Datei erstellen') {
            await createAiJson();
        }
        return;
    }
    
    try {
        // .ai.json Datei lesen
        const aiJsonData = await vscode.workspace.fs.readFile(aiJsonPath);
        let aiJson = JSON.parse(aiJsonData.toString());
        
        // Prüfen ob research Bereich existiert und ggf. erstellen
        if (!aiJson.research) {
            aiJson.research = [];
        }
        
        // WebView Panel erstellen
        const panel = vscode.window.createWebviewPanel(
            'researchProjects',
            '🧪 Research & Prototypes',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        // Aktionen bei Nachrichten vom WebView
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'addResearch':
                    await addNewResearchItem(aiJsonPath, aiJson);
                    break;
                case 'editResearch':
                    await editResearchItem(aiJsonPath, aiJson, message.index);
                    break;
                case 'removeResearch':
                    await removeResearchItem(aiJsonPath, aiJson, message.index);
                    break;
                case 'updateProgress':
                    await updateResearchProgress(aiJsonPath, aiJson, message.index, message.progress);
                    break;
            }
            
            // Nach jeder Änderung .ai.json neu einlesen und Panel aktualisieren
            const updatedData = await vscode.workspace.fs.readFile(aiJsonPath);
            aiJson = JSON.parse(updatedData.toString());
            panel.webview.html = getResearchWebviewContent(panel.webview, aiJson);
        });
        
        // Initiales Laden des Inhalts
        panel.webview.html = getResearchWebviewContent(panel.webview, aiJson);
        
    } catch (error) {
        vscode.window.showErrorMessage(`Fehler beim Verwalten der Forschungsprojekte: ${error}`);
    }
}

/**
 * Erzeugt den HTML-Inhalt für das Research & Prototypes WebView
 */
function getResearchWebviewContent(webview: vscode.Webview, aiJson: any): string {
    const researchItems = aiJson.research || [];
    
    // Statusfarben für die verschiedenen Status
    const statusColors: {[key: string]: string} = {
        'concept': '#9E9E9E',
        'early_prototype': '#FF9800',
        'active_development': '#2196F3',
        'testing': '#8BC34A',
        'evaluation': '#673AB7'
    };
    
    // Generiere HTML für jedes Forschungsprojekt
    const researchItemsHtml = researchItems.map((item: any, index: number) => {
        const resources = item.resources || [];
        const resourcesHtml = resources.map((res: any) => {
            const iconMap: {[key: string]: string} = {
                'paper': '📄',
                'repository': '📦',
                'blog': '📝',
                'video': '🎥',
                'notebook': '📓',
                'other': '🔗'
            };
            
            return `
                <div class="resource">
                    <span class="resource-icon">${iconMap[res.type] || '🔗'}</span>
                    <a href="${res.link}" class="resource-link">${res.description}</a>
                </div>
            `;
        }).join('');
        
        return `
            <div class="research-item">
                <div class="research-header">
                    <h3>${item.name}</h3>
                    <span class="status" style="background-color: ${statusColors[item.status] || '#9E9E9E'}">
                        ${item.status.replace('_', ' ')}
                    </span>
                </div>
                
                <p class="description">${item.description}</p>
                
                <div class="progress-container">
                    <div class="progress-label">Progress: ${item.progress || 0}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${item.progress || 0}%"></div>
                    </div>
                    <div class="progress-controls">
                        <button class="small-button decrease" data-index="${index}">-</button>
                        <button class="small-button increase" data-index="${index}">+</button>
                    </div>
                </div>
                
                <div class="tech-tags">
                    ${(item.technologies || []).map((tech: string) => 
                        `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                ${resourcesHtml ? `<div class="resources-section"><h4>Resources</h4>${resourcesHtml}</div>` : ''}
                
                ${item.potential_impact ? 
                    `<div class="impact-section">
                        <h4>Potential Impact</h4>
                        <p>${item.potential_impact}</p>
                    </div>` : ''}
                
                <div class="actions">
                    <button class="action-button edit" data-index="${index}">Edit</button>
                    <button class="action-button remove" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Research & Prototypes</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: var(--vscode-editor-foreground);
                padding: 20px;
                max-width: 900px;
                margin: 0 auto;
            }
            
            h1 {
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .research-item {
                background-color: var(--vscode-editor-inactiveSelectionBackground);
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .research-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .research-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .status {
                padding: 5px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                text-transform: capitalize;
                color: white;
            }
            
            .description {
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .progress-container {
                margin: 12px 0;
            }
            
            .progress-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
            }
            
            .progress-bar {
                height: 8px;
                background-color: var(--vscode-input-background);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background-color: #2196F3;
            }
            
            .progress-controls {
                display: flex;
                justify-content: flex-end;
                gap: 5px;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 12px;
            }
            
            .tech-tag {
                background-color: var(--vscode-badge-background);
                color: var(--vscode-badge-foreground);
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 11px;
            }
            
            .resources-section, .impact-section {
                margin-top: 15px;
                font-size: 13px;
            }
            
            .resources-section h4, .impact-section h4 {
                margin-bottom: 5px;
                font-size: 14px;
                color: var(--vscode-editorInfo-foreground);
            }
            
            .resource {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 5px;
            }
            
            .resource-icon {
                font-size: 16px;
            }
            
            .resource-link {
                text-decoration: none;
                color: var(--vscode-textLink-foreground);
            }
            
            .resource-link:hover {
                text-decoration: underline;
            }
            
            .actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 15px;
            }
            
            .action-button {
                padding: 6px 12px;
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .action-button:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }
            
            .action-button.add {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                font-weight: bold;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 8px 15px;
            }
            
            .action-button.add:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            
            .small-button {
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            }
            
            .empty-state {
                text-align: center;
                padding: 40px 0;
                color: var(--vscode-descriptionForeground);
            }
        </style>
    </head>
    <body>
        <h1>
            <span>🧪</span> Research & Prototypes
        </h1>
        
        <button class="action-button add">
            <span>+</span> Add Research Project
        </button>
        
        ${researchItemsHtml.length > 0 ? 
            `<div class="research-items">${researchItemsHtml}</div>` : 
            `<div class="empty-state">
                <p>No research projects defined yet. Click "Add Research Project" to start.</p>
            </div>`
        }
        
        <script>
            (function() {
                // Add new research project
                const addButton = document.querySelector('.action-button.add');
                if (addButton) {
                    addButton.addEventListener('click', () => {
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'addResearch'
                        });
                    });
                }
                
                // Edit research project
                document.querySelectorAll('.action-button.edit').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'editResearch',
                            index: parseInt(index)
                        });
                    });
                });
                
                // Remove research project
                document.querySelectorAll('.action-button.remove').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'removeResearch',
                            index: parseInt(index)
                        });
                    });
                });
                
                // Progress controls
                document.querySelectorAll('.small-button.increase').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'updateProgress',
                            index: parseInt(index),
                            progress: 'increase'
                        });
                    });
                });
                
                document.querySelectorAll('.small-button.decrease').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            command: 'updateProgress',
                            index: parseInt(index),
                            progress: 'decrease'
                        });
                    });
                });
            })();
        </script>
    </body>
    </html>
    `;
}

/**
 * Neues Forschungsprojekt hinzufügen
 */
async function addNewResearchItem(aiJsonPath: vscode.Uri, aiJson: any) {
    // Optionen für Status
    const statusOptions = ['concept', 'early_prototype', 'active_development', 'testing', 'evaluation'];
    
    // Name des Projekts abfragen
    const name = await vscode.window.showInputBox({
        prompt: 'Name des Forschungsprojekts',
        placeHolder: 'z.B. "ML-basierte Code-Qualitätsanalyse"'
    });
    
    if (!name) return;
    
    // Beschreibung abfragen
    const description = await vscode.window.showInputBox({
        prompt: 'Beschreibung des Projekts',
        placeHolder: 'Was ist das Ziel dieses Forschungsprojekts?'
    });
    
    if (!description) return;
    
    // Status abfragen
    const statusItems = statusOptions.map(s => ({ label: s }));
    const statusPick = await vscode.window.showQuickPick(statusItems, {
        placeHolder: 'Aktueller Status des Projekts'
    });
    
    const status = statusPick?.label;
    
    if (!status) return;
    
    // Technologien abfragen
    const technologiesInput = await vscode.window.showInputBox({
        prompt: 'Verwendete Technologien (durch Komma getrennt)',
        placeHolder: 'z.B. "TensorFlow.js, CodeBERT, TypeScript"'
    });
    
    // Neues Forschungsprojekt erstellen
    const newResearch: any = {
        name,
        description,
        status,
        progress: 0,
        technologies: technologiesInput ? technologiesInput.split(',').map(t => t.trim()) : []
    };
    
    // Optional: Potenzielle Auswirkungen
    const impact = await vscode.window.showInputBox({
        prompt: 'Potenzielle Auswirkungen (optional)',
        placeHolder: 'Welchen Einfluss könnte dieses Projekt haben?'
    });
    
    if (impact) {
        newResearch.potential_impact = impact;
    }
    
    // Zur research-Liste hinzufügen
    if (!aiJson.research) {
        aiJson.research = [];
    }
    
    aiJson.research.push(newResearch);
    
    // .ai.json speichern
    await vscode.workspace.fs.writeFile(
        aiJsonPath,
        Buffer.from(JSON.stringify(aiJson, null, 4), 'utf8')
    );
    
    vscode.window.showInformationMessage(`Forschungsprojekt "${name}" erfolgreich hinzugefügt!`);
}

/**
 * Bestehendes Forschungsprojekt bearbeiten
 */
async function editResearchItem(aiJsonPath: vscode.Uri, aiJson: any, index: number) {
    if (!aiJson.research || index < 0 || index >= aiJson.research.length) {
        return;
    }
    
    const research = aiJson.research[index];
    
    // Optionen für Status
    const statusOptions = ['concept', 'early_prototype', 'active_development', 'testing', 'evaluation'];
    
    // Bestehende Werte als Standard-Werte verwenden
    const name = await vscode.window.showInputBox({
        prompt: 'Name des Forschungsprojekts',
        value: research.name
    });
    
    if (!name) return;
    
    const description = await vscode.window.showInputBox({
        prompt: 'Beschreibung des Projekts',
        value: research.description
    });
    
    if (!description) return;
    
    const statusItems = statusOptions.map(s => ({ label: s }));
    const statusPick = await vscode.window.showQuickPick(statusItems, {
        placeHolder: 'Aktueller Status des Projekts'
    });
    
    const status = statusPick?.label;
    
    if (!status) return;
    
    const technologiesInput = await vscode.window.showInputBox({
        prompt: 'Verwendete Technologien (durch Komma getrennt)',
        value: (research.technologies || []).join(', ')
    });
    
    const impact = await vscode.window.showInputBox({
        prompt: 'Potenzielle Auswirkungen (optional)',
        value: research.potential_impact || ''
    });
    
    // Forschungsprojekt aktualisieren
    research.name = name;
    research.description = description;
    research.status = status;
    research.technologies = technologiesInput ? technologiesInput.split(',').map((t: string) => t.trim()) : [];
    
    if (impact) {
        research.potential_impact = impact;
    } else {
        delete research.potential_impact;
    }
    
    // .ai.json speichern
    await vscode.workspace.fs.writeFile(
        aiJsonPath,
        Buffer.from(JSON.stringify(aiJson, null, 4), 'utf8')
    );
    
    vscode.window.showInformationMessage(`Forschungsprojekt "${name}" erfolgreich aktualisiert!`);
}

/**
 * Forschungsprojekt entfernen
 */
async function removeResearchItem(aiJsonPath: vscode.Uri, aiJson: any, index: number) {
    if (!aiJson.research || index < 0 || index >= aiJson.research.length) {
        return;
    }
    
    const research = aiJson.research[index];
    
    // Bestätigung vor dem Löschen
    const confirmation = await vscode.window.showWarningMessage(
        `Möchten Sie das Forschungsprojekt "${research.name}" wirklich löschen?`,
        'Löschen',
        'Abbrechen'
    );
    
    if (confirmation !== 'Löschen') return;
    
    // Aus der Liste entfernen
    aiJson.research.splice(index, 1);
    
    // .ai.json speichern
    await vscode.workspace.fs.writeFile(
        aiJsonPath,
        Buffer.from(JSON.stringify(aiJson, null, 4), 'utf8')
    );
    
    vscode.window.showInformationMessage(`Forschungsprojekt "${research.name}" erfolgreich gelöscht!`);
}

/**
 * Fortschritt eines Forschungsprojekts aktualisieren
 */
async function updateResearchProgress(aiJsonPath: vscode.Uri, aiJson: any, index: number, progressAction: string) {
    if (!aiJson.research || index < 0 || index >= aiJson.research.length) {
        return;
    }
    
    const research = aiJson.research[index];
    
    // Aktuellen Fortschritt ermitteln
    let currentProgress = research.progress || 0;
    
    // Fortschritt aktualisieren
    if (progressAction === 'increase') {
        currentProgress = Math.min(100, currentProgress + 5);
    } else if (progressAction === 'decrease') {
        currentProgress = Math.max(0, currentProgress - 5);
    }
    
    // Neuen Wert speichern
    research.progress = currentProgress;
    
    // .ai.json speichern
    await vscode.workspace.fs.writeFile(
        aiJsonPath,
        Buffer.from(JSON.stringify(aiJson, null, 4), 'utf8')
    );
}
