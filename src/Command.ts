import * as vscode from "vscode";
export class Command implements vscode.Command{
    title: string;
    
    command: string;
    tooltip: string | undefined;
    arguments: any[] | undefined;

    constructor(title: string, command: string,arg: any[]|undefined) {
        this.title = title;
        this.command = command;
        // this.tooltip = tooltip;
        this.arguments = arg;
    }

    
}