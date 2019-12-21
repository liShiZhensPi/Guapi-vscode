import { ClassProvider } from "./ClassProvider";
import * as vscode from "vscode";
import { NetRequest } from "./NetRequest";
import { studentId } from "./Student";
import { Exam } from "./Exam";


export var classProvider = new ClassProvider([]);


export class Class {


    public static async flush() {
        if (studentId === null) {
            vscode.window.showWarningMessage("未登录");
            return;
        }
        var result = await NetRequest.getClass();
        classProvider.data = [];//清空
        for (let _class of result) {
            classProvider.data.push(new vscode.TreeItem(_class.teacherName + " : " + _class.className));
        }
        vscode.window.registerTreeDataProvider('class', classProvider);
        // for (let data of classProvider.data) {
        //     console.log(data.id);
        //     console.log(data);
        // }
    }

    public static async join() {
        if (studentId === null) {
            vscode.window.showWarningMessage("尚未登录");
            return;
        }

        vscode.window.showInputBox({
            password: false,
            ignoreFocusOut: false,
            placeHolder: "请输入课程号",
            validateInput: (text) => {
                if (text === null || text === "") {
                    return "课程号不能为空";
                }
            }
        }).then(async function (classId) {
            if (classId === undefined) {
                return;
            }
            let url = "http://localhost:8080/class/joinClass";
            let requestData = {
                "studentId": studentId,
                "classId": parseInt(classId)
            };

            let result = await NetRequest.post(url, JSON.stringify(requestData));

            //console.log(result);
            if (result.id <0) {
                vscode.window.showWarningMessage("加入失败，课程不存在");
                return;
            } else {
                if (result.id === null) {
                    vscode.window.showWarningMessage("已经加入该课程");
                    return;
                }
                Class.flush();
                Exam.flush();
                vscode.window.showInformationMessage("加入成功: " + result.classId);
            }
        });
    }
}