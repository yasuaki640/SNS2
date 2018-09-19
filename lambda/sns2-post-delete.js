var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "post";

exports.handler = (event, context, callback) => {
    //レスポンスの雛形
    var response = {
        statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };


        //認証情報をチェックする
    if (!event.headers || event.headers.Authorization !== "sns2") {
        response.statusCode = 403;
        response.body = JSON.stringify({
        message: "権限がありません"
        });
        callback(null, response);
        return;
    }
    
    //リクエストbodyを取得し、jsのオブジェクトにパースする
    var body = JSON.parse(event.body);

    //TODO: 削除対象のテーブル名と削除したいデータのkeyをparamに設定
    var param = {
        "TableName": tableName,
        "Key": {
            "userId": body.userId,
            "timestamp": body.timestamp
        }
    };

    //dynamo.delete()を用いてデータを削除
    dynamo.delete(param, function(err, data){
        if(err){
            //TODO: 削除に失敗した場合の処理を記述
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }else{
            //TODO: 削除に成功した場合の処理を記述
            response.body = JSON.stringify({
                "message": "success"
            });
            callback(null, response);
            return;
        }
    });
};
