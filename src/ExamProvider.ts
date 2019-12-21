import { TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";


export class ExamProvider implements TreeDataProvider<ExamItem>{
    onDidChangeTreeData?: import("vscode").Event<ExamItem | null | undefined> | undefined;

    data: ExamItem[];

    constructor(data: ExamItem[]) {
        this.data = data;
    }

    getTreeItem(element: ExamItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: ExamItem | undefined): import("vscode").ProviderResult<ExamItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }


    
}


export class ExamItem extends TreeItem{
    public children: ExamItem[] | undefined;
    constructor(label: string, children?: ExamItem[] | undefined) {
        super(label, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
        this.children = children;
    }
}