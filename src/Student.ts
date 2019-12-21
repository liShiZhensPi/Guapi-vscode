import * as vscode from "vscode";
import { NetRequest } from "./NetRequest";
import { UserItem,UserProvider} from "./UserProvider";
import { Class, classProvider } from "./Class";
import * as cp from "child_process";
import { Command } from "./Command";
import { Exam, examProvider } from "./Exam";

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
                userProvider.data[0] = new UserItem(studentName + "已登陆");
                userProvider.data.push(new UserItem("退出"));
                userProvider.data[2].command = new Command('logout', 'student.logout',undefined);
                vscode.window.registerTreeDataProvider('student', userProvider);
                Class.flush();
                Exam.flush();
            });
        });
    }

    public static logout() {
        if (studentId === null) {
            vscode.window.showWarningMessage("尚未登陆");
            return;
        }
        studentId = null;
        userProvider.data = [];
        userProvider.data.push(new UserItem("登陆"));
	    userProvider.data.push(new UserItem("注册"));
	    userProvider.data[0].command = new Command('login', 'student.login',undefined);
        userProvider.data[1].command = new Command('register', 'student.register',undefined);
        vscode.window.registerTreeDataProvider('student', userProvider);
        classProvider.data = [];
        vscode.window.registerTreeDataProvider('class', classProvider);
        examProvider.data = [];
        vscode.window.registerTreeDataProvider('exam', examProvider);
        vscode.window.showInformationMessage("退出成功");
    }

    public static register() {
        cp.exec('start chrome http://127.0.0.1:8080/student/register');
    }
}