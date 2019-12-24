import * as request from "request";
import { studentId } from "./Student";
import * as vscode from "vscode";


//let host_url = "http://127.0.0.1:8080";
let host_url = "http://47.101.33.255:8080";

export class NetRequest {
    public static async post(url: string, data: any | null): Promise<any | null> {
        var result: any | null = null;

        console.log("send to url: " + host_url+url);
        console.log(data);

        return new Promise(function (resolve, reject) {
            request({
                url: host_url+url,
                method: "POST",
                //json: true,  必须删掉
                headers: {
                    Accept: "*/*",
                    "content-type": "application/json;charset=UTF-8",
                },
                body: data
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {


                    result = JSON.parse(body);
                    console.log("from url: " +host_url+url);
                    console.log(result);
                    resolve(result);

                } else {
                    vscode.window.showErrorMessage("访问失败："+url);
                    resolve(result);
                    //vscode.window.showErrorMessage("login error " + response.statusCode);
                }
            });
        });
    }

    public static async login(studentId : any, password:any): Promise<string | null> {
        var url = "/student/login.do";
        var requestData = {
            "studentId": studentId,
            "password": password
        };
        let result =  await NetRequest.post(url, JSON.stringify(requestData));
        if (result !== null&& result.result==="successful") {
            return Promise.resolve(result.name);
        } else {
            return Promise.resolve(null);
        }

    }

    public static async getClass() {
        if (studentId === null) {
            vscode.window.showInformationMessage("未登录,无法获得课程信息");
            return;
        }
        var url = "/class/findClass";
        var requestData = studentId;
        let result = await NetRequest.post(url, requestData);
        return Promise.resolve(result);
    }
}