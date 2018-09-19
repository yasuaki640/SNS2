var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "post";

exports.handler = (event, context, callback) => {
    //レスポンスの雛形
    var response = {
        statusCode: 200,
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

    //bodyが空だったら返す
    if(!body){
        response.statusCode = 400;
        response.body = JSON.stringify({"message" : "bodyが空です"});
        callback(null, response);
        return;
    }

    //TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
    var param = {
        "TableName": tableName,
        "Item": {
            "userId": body.userId,
            "timestamp": Date.now(),
            "text": body.text,
            "category": body.category
        }
    };

    //userテーブルのvalidation(パラメータのどれかが空だったら返す)
    if(!body.userId || !body.text){
        response.statusCode = 400;
        response.body = JSON.stringify({
            "message": "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    //dynamo.put()でDBにデータを登録
    dynamo.put(param, function(err, data) {
        if (err) {
            //TODO: 登録に失敗した場合の処理を記述
            response.statusCode = 500;
            response.body = JSON.stringify({
             "message": "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        } else {
            //TODO: 登録に成功した場合の処理を記述
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });
};
