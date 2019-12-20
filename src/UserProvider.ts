import { TreeDataProvider, TreeItem ,Event,ProviderResult, TreeItemCollapsibleState, EventEmitter} from "vscode";

export class UserProvider implements TreeDataProvider<UserItem>{
    //private _onDidChangeTreeData: EventEmitter<UserItem | undefined> = new EventEmitter<UserItem | undefined>();
    onDidChangedTreeDate: Event<UserItem | null | undefined> | undefined;

    // refresh() {
    //     this._onDidChangeTreeData.fire();
    // }


    getTreeItem(element: UserItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: UserItem | undefined): ProviderResult<UserItem[]> {
        return this.data;
    }

    data: UserItem[];
    constructor(data: UserItem[]) {
        this.data = data;
    }

    

}

export class UserItem extends TreeItem{

}