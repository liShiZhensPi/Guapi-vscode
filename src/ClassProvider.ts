import { TreeDataProvider, TreeItem } from "vscode";

export class ClassProvider implements TreeDataProvider<TreeItem>{

    public data: TreeItem[];
    constructor(data: TreeItem[]) {
        this.data = data;
    }

    onDidChangeTreeData?: import("vscode").Event<TreeItem | null | undefined> | undefined;
    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: TreeItem | undefined): import("vscode").ProviderResult<TreeItem[]> {
        return this.data;
    }


}