import * as vscode from "vscode";
import { NetRequest } from "./NetRequest";
import { UserItem,UserProvider} from "./UserProvider";
import { Class } from "./Class";

export var studentId: string | null = null;
export var studentName: string | null = null;
export var userProvider = new UserProvider([]);

export class Student{

    
    public static async login() {
        if (studentId !== null) {
            vscode.window.showInformationMessage("已登陆，请先退出");
            return;
        }
        vscode.window.showInputBox({
            password: false,
            ignoreFocusOut: false,
            placeHolder: "请输入学号",
            validateInput: (text) => {
                if (text === null || text === "") {
                    return "学号不能为空";
                }
            }
        }).then(function (student_Id) {
            if (student_Id === undefined) {
                return;
            }
            vscode.window.showInputBox({
                password: true,
                ignoreFocusOut: false,
                placeHolder: "请输入密码",
                validateInput: (text) => {
                    if (text === null || text === "") {
                        return "密码不能为空";
                    }
                }
            }).then(async function (password) {
                if (password === undefined) {
                    return;
                }
                let name = await NetRequest.login(student_Id, password);
                if (name === null) {
                    vscode.window.showInformationMessage("登陆失败");
                    return;
                }
                if (student_Id !== undefined) {
                    studentId = student_Id;
                }
                studentName = name;
                vscode.window.showInformationMessage("欢迎登陆 " + name);
                userProvider.data.push(new UserItem(studentName+"已登陆"));
                vscode.window.registerTreeDataProvider('student', userProvider);
                Class.flush();

            });
        });
    }

    public static logout() {

    }
}