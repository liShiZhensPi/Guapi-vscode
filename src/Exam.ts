import { ExamProvider, ExamItem } from "./ExamProvider";
import * as fs from "fs";
import { studentId } from "./Student";
import * as vscode from "vscode";
import { NetRequest } from "./NetRequest";

export var examProvider: ExamProvider = new ExamProvider([]);


export class Exam{

    public static async flush() {
        if (studentId === null) {
            vscode.window.showWarningMessage("尚未登陆");
            return;
        }
        
        let url = "/exam/getExam";
        let requestDate = studentId;

        let result = await NetRequest.post(url, requestDate);

        //console.log(result);

        examProvider.data = [];//刷新，先清除原先数据;
        examProvider.data.push(new ExamItem("未开始",[]));
        examProvider.data.push(new ExamItem("已开始",[]));
        examProvider.data.push(new ExamItem("已结束",[]));
        for (let exam of result) {
            let item = new ExamItem(exam.name);
            
            
            switch (exam.status) {
                case 0:
                    item.tooltip = '实验名：'+exam.name+'\n课程：'+exam.className+'\n开始时间：'+exam.startTime+'\n持续时间：'+exam.time+'\n状态：未开始\n地点：'+exam.address;
                    item.contextValue = "not start";
                    item.id = exam.id;
                    examProvider.data[0].children?.push(item);
                    break;
                case 1:
                    item.tooltip = '实验名：'+exam.name+'\n课程：'+exam.className+'\n开始时间：'+exam.startTime+'\n持续时间：'+exam.time+'\n状态：已开始\n地点：'+exam.address;
                    if (exam.isStarted === 1) {
                        item.contextValue = "isStarted";
                    }
                    if (exam.isStarted === 0) {
                        item.contextValue = "start";
                    }
                    item.id = exam.id;
                    examProvider.data[1].children?.push(item);
                    break;
                case 2:
                    item.tooltip = '实验名：'+exam.name+'\n课程：'+exam.className+'\n开始时间：'+exam.startTime+'\n持续时间：'+exam.time+'\n状态：已结束开始\n地点：'+exam.address;
                    item.contextValue = "end";
                    item.id = exam.id;
                    examProvider.data[2].children?.push(item);
                    break;
            }
            vscode.window.registerTreeDataProvider('exam', examProvider);
        }
        
    }

    public static async start(exam : any) {
        console.log(exam);
        var con = vscode.workspace.getConfiguration();


        var ssh_key_pub: string | undefined = con.get('guapi.ssh_key_pub');
        //console.log(ssh_key_pub);

        var ssh_key: string | undefined = con.get('guapi.ssh_key');
        //console.log(ssh_key);

        var ssh_config_path: string | undefined = con.get('remote.SSH.configFile');
        //console.log(ssh_config_path);

        if (ssh_key_pub === undefined || ssh_config_path === undefined||ssh_key===undefined) {
            vscode.window.showWarningMessage("请配置 guapi.ssh_key_pub,guapi.ssh_key和 remote.SSH.configFile");//判断是否存在配置
            return;
        }
        //else {
        //     if (fs.existsSync(ssh_key_pub)) {
        //         var data = new String(fs.readFileSync(ssh_key_pub));
        //         console.log(data);
        //     } else{
        //         vscode.window.showWarningMessage("找不到公钥 path：" + ssh_key_pub);
        //     }
        // }
        if (!fs.existsSync(ssh_key)) {
            vscode.window.showWarningMessage("密钥不存在：" + ssh_key);
            return;
        }
        if (!fs.existsSync(ssh_key_pub)) {
            vscode.window.showWarningMessage("公钥钥不存在：" + ssh_key_pub);
            return;
        }
        if (!fs.existsSync(ssh_config_path)) {
            vscode.window.showWarningMessage("remote配置文件不存在：" + ssh_config_path);
            return;
        }
        
        let url = "/exam/startExam";
        var sshKey = new String(fs.readFileSync(ssh_key_pub));
        //console.log(sshKey);
        let requestDate = {
            "studentId": studentId,
            "examId": exam.id,
            "ssh_key": sshKey.split("\n")[0]
        };

        //console.log(JSON.stringify(requestDate));
        let result = await NetRequest.post(url, JSON.stringify(requestDate));

        if (result.port===-1) {
            vscode.window.showWarningMessage("开始失败,"+result.name);
            return;
        }

        fs.appendFileSync(ssh_config_path, "Host " + result.name + "\n    HostName " + result.host + "\n    User " + result.user + "\n    Port " + result.port + "\n    IdentityFile " + ssh_key+"\n");
        vscode.window.showInformationMessage("remote配置完成：" + result.name);
        this.flush();
        //console.log(result);
    }

    public static async end(exam: any) {
        //console.log(exam);

        vscode.window.showInformationMessage("结束试验后你的数据将全部丢失，你确定要这样做吗？(请先备份实验数据）",'是的，我确定','让我再想想')
            .then(async function (select) {
                if (select === "让我再想想") {
                    return;
            }
            if (select === "是的，我确定") {
                let url = "/exam/endExam";
                let requestDate = {
                    "studentId": studentId,
                    "examId": exam.id
                };

                let result = await NetRequest.post(url, JSON.stringify(requestDate));

                if (result === true) {
                    vscode.window.showInformationMessage("结束实验:" + exam.label);
                } else {
                    vscode.window.showWarningMessage("结束失败，可能已经结束，刷新一下看看");
                }


                Exam.flush();
            } 
        });
        
        //this.flush();
    }

}