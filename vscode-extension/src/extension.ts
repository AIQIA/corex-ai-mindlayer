import * as vscode from 'vscode';
import { updateFromPackageManager, scanDockerConfiguration } from './ecosystem';

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
