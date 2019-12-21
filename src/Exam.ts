import { ExamProvider, ExamItem } from "./ExamProvider";
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
        
        let url = "http://localhost:8080/exam/getExam";
        let requestData = studentId;

        let result = await NetRequest.post(url, requestData);

        console.log(result);

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
                    item.contextValue = "start";
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

    public static async start(offest : any) {
        console.log(offest);
    }

}