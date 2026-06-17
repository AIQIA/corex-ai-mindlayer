"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MindLayerTreeProvider = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
class MindLayerTreeProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!this.workspaceRoot) {
            return [];
        }
        if (element) {
            return element.children || [];
        }
        else {
            // Root Level: .ai.json laden
            const aiJsonPath = path.join(this.workspaceRoot, '.ai.json');
            if (!fs.existsSync(aiJsonPath)) {
                return [new MindLayerItem('No .ai.json found', vscode.TreeItemCollapsibleState.None)];
            }
            try {
                const content = JSON.parse(fs.readFileSync(aiJsonPath, 'utf8'));
                return this.parseAiJson(content);
            }
            catch (e) {
                return [new MindLayerItem('Error parsing .ai.json', vscode.TreeItemCollapsibleState.None)];
            }
        }
    }
    parseAiJson(content) {
        const items = [];
        // Project Info
        if (content.project) {
            items.push(new MindLayerItem(`Project: ${content.project.name}`, vscode.TreeItemCollapsibleState.None, {
                iconPath: new vscode.ThemeIcon('project'),
                tooltip: content.project.description
            }));
        }
        // Red Lines
        if (content.red_lines && Array.isArray(content.red_lines)) {
            const redLineItems = content.red_lines.map((line) => new MindLayerItem(line, vscode.TreeItemCollapsibleState.None, {
                iconPath: new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'))
            }));
            items.push(new MindLayerItem('Red Lines', vscode.TreeItemCollapsibleState.Collapsed, {
                children: redLineItems,
                iconPath: new vscode.ThemeIcon('shield')
            }));
        }
        // Architecture
        if (content.architecture) {
            items.push(new MindLayerItem('Architecture', vscode.TreeItemCollapsibleState.None, {
                iconPath: new vscode.ThemeIcon('layers'),
                command: {
                    command: 'vscode.open',
                    title: 'Open .ai.json',
                    arguments: [vscode.Uri.file(path.join(this.workspaceRoot, '.ai.json'))]
                }
            }));
        }
        return items;
    }
}
exports.MindLayerTreeProvider = MindLayerTreeProvider;
class MindLayerItem extends vscode.TreeItem {
    constructor(label, collapsibleState, options) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.contextValue = 'mindLayerItem';
        this.children = options?.children;
        this.iconPath = options?.iconPath;
        this.tooltip = options?.tooltip;
        this.command = options?.command;
    }
}
//# sourceMappingURL=mindLayerTree.js.map