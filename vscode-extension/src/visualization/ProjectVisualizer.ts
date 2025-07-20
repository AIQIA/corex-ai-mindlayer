import * as vscode from 'vscode';
import * as path from 'path';

export class ProjectVisualizer {
    private static instance: ProjectVisualizer;
    private panel: vscode.WebviewPanel | undefined;
    private currentView: 'mindmap' | 'tree' | 'integrated' = 'integrated';

    private constructor() {}

    private getStylePath(): string {
        return path.join(__dirname, 'styles', 'visualizer.css');
    }

    public static getInstance(): ProjectVisualizer {
        if (!ProjectVisualizer.instance) {
            ProjectVisualizer.instance = new ProjectVisualizer();
        }
        return ProjectVisualizer.instance;
    }

    public async show(aiJsonContent: any) {
        if (this.panel) {
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'projectVisualizer',
                'AIM Project Visualizer',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

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

    private async updateView(aiJsonContent: any) {
        if (!this.panel) return;

        this.panel.webview.html = this.generateVisualizerHtml(aiJsonContent);
    }

    private generateVisualizerHtml(aiData: any): string {
        if (!this.panel) return '';
        
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

    private generateMindMapNodes(aiData: any): string {
        if (!aiData) return '';
        
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

    private generateSubNodes(data: any): string {
        if (typeof data !== 'object' || data === null) return '';
        
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

    private generateTreeView(aiData: any): string {
        if (!aiData) return '';
        
        return this.generateTreeNode(aiData, 0);
    }

    private generateTreeNode(data: any, level: number): string {
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

    private async exportCurrentView() {
        if (!this.panel) return;

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
