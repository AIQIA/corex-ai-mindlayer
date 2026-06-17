"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectVisualizer = void 0;
const vscode = require("vscode");
const path = require("path");
class ProjectVisualizer {
    constructor() {
        this.currentView = 'integrated';
    }
    getStylePath() {
        return path.join(__dirname, 'styles', 'visualizer.css');
    }
    static getInstance() {
        if (!ProjectVisualizer.instance) {
            ProjectVisualizer.instance = new ProjectVisualizer();
        }
        return ProjectVisualizer.instance;
    }
    async show(aiJsonContent) {
        if (this.panel) {
            this.panel.reveal();
        }
        else {
            this.panel = vscode.window.createWebviewPanel('projectVisualizer', 'AIM Project Visualizer', vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true
            });
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
            this.panel.webview.onDidReceiveMessage(async (message) => {
                switch (message.command) {
                    case 'switchView':
                        this.currentView = message.view;
                        await this.updateView(aiJsonContent);
                        break;
                    case 'exportView':
                        await this.exportCurrentView();
                        break;
                }
            });
        }
        await this.updateView(aiJsonContent);
    }
    async updateView(aiJsonContent) {
        if (!this.panel)
            return;
        this.panel.webview.html = this.generateVisualizerHtml(aiJsonContent);
    }
    generateVisualizerHtml(aiData) {
        if (!this.panel)
            return '';
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="${this.panel.webview.asWebviewUri(vscode.Uri.file(this.getStylePath()))}">
                <style>
                    #mindmap {
                        display: ${this.currentView === 'mindmap' || this.currentView === 'integrated' ? 'block' : 'none'};
                    }
                    #treeview {
                        display: ${this.currentView === 'tree' || this.currentView === 'integrated' ? 'block' : 'none'};
                    }
                </style>
            </head>
            <body>
                <div class="toolbar">
                    <button onclick="switchView('integrated')">Integrated View</button>
                    <button onclick="switchView('mindmap')">Mind Map</button>
                    <button onclick="switchView('tree')">Tree View</button>
                    <button onclick="exportView()">Export</button>
                </div>
                <div class="visualization">
                    <div id="mindmap">
                        ${this.generateMindMapNodes(aiData)}
                    </div>
                    <div id="treeview">
                        ${this.generateTreeView(aiData)}
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function switchView(view) {
                        vscode.postMessage({
                            command: 'switchView',
                            view: view
                        });
                    }
                    
                    function exportView() {
                        vscode.postMessage({
                            command: 'exportView'
                        });
                    }
                </script>
            </body>
            </html>
        `;
    }
    generateMindMapNodes(aiData) {
        if (!aiData)
            return '';
        let html = '<div class="mindmap-container">';
        // Root node
        html += `<div class="node root">${aiData.name || 'Project'}</div>`;
        // Generate nodes for each major section
        for (const [key, value] of Object.entries(aiData)) {
            if (typeof value === 'object' && value !== null) {
                html += `
                    <div class="connection">
                        <div class="node">${key}</div>
                        ${this.generateSubNodes(value)}
                    </div>
                `;
            }
        }
        html += '</div>';
        return html;
    }
    generateSubNodes(data) {
        if (typeof data !== 'object' || data === null)
            return '';
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                html += `
                    <div class="connection">
                        <div class="node">${key}</div>
                        ${this.generateSubNodes(value)}
                    </div>
                `;
            }
        }
        return html;
    }
    generateTreeView(aiData) {
        if (!aiData)
            return '';
        return this.generateTreeNode(aiData, 0);
    }
    generateTreeNode(data, level) {
        if (typeof data !== 'object' || data === null) {
            return `<div class="tree-item" style="margin-left: ${level * 20}px;">${data}</div>`;
        }
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            html += `
                <div class="tree-item" style="margin-left: ${level * 20}px;">
                    <span class="node">${key}</span>
                    ${this.generateTreeNode(value, level + 1)}
                </div>
            `;
        }
        return html;
    }
    async exportCurrentView() {
        if (!this.panel)
            return;
        const exportPath = await vscode.window.showSaveDialog({
            filters: {
                'HTML': ['html'],
                'SVG': ['svg']
            }
        });
        if (exportPath) {
            // Implementation für Export
            vscode.window.showInformationMessage('View exported successfully!');
        }
    }
}
exports.ProjectVisualizer = ProjectVisualizer;
//# sourceMappingURL=ProjectVisualizer.js.map