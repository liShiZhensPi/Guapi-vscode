import { ClassProvider } from "./ClassProvider";
import * as vscode from "vscode";
import { NetRequest } from "./NetRequest";
import { studentId } from "./Student";


export var classProvider = new ClassProvider([]);


export class Class{


    public static async flush() {
        if (studentId === null) {
            vscode.window.showInformationMessage("未登录");
            return;
        }
        var result = await NetRequest.getClass();
        classProvider.data = [];//清空
        for (let _class of result) {
            classProvider.data.push(new vscode.TreeItem(_class.teacherName + " : " + _class.className));
        }
        vscode.window.registerTreeDataProvider('class', classProvider);
    }
}