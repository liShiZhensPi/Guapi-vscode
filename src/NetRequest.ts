import * as request from "request";


export class NetRequest {
    public static async post(url: string, data: any | null): Promise<any | null> {
        var result: any | null = null;

        console.log(JSON.stringify(data));

        return new Promise(function (resolve, reject) {
            request({
                url: url,
                method: "POST",
                //json: true,  必须删掉
                headers: {
                    Accept: "*/*",
                    "content-type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify(data)
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {


                    result = JSON.parse(body);
                    console.log(result);
                    resolve(result);

                } else {
                    resolve(result);
                    //vscode.window.showErrorMessage("login error " + response.statusCode);
                }
            });
        });
    }

    public static async login(studentId : any, password:any): Promise<string | null> {
        var url = "http://localhost:8080/student/login.do";
        var requestData = {
            "studentId": studentId,
            "password": password
        };
        let result =  await NetRequest.post(url, requestData);
        if (result !== null&& result.result==="successful") {
            return Promise.resolve(result.name);
        } else {
            return Promise.resolve(null);
        }

    }
}