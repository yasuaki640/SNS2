var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "post";

exports.handler = (event, context, callback) => {
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

    //TODO: 取得したいテーブル名をparamオブジェクトに設定する（中身を記述）
    var param = {
        "TableName": tableName
    };

    //dynamo.scan()で全件取得
    dynamo.scan(param, function(err, data){
        if(err){
            //TODO: //データの取得に失敗
            response,statusCode = 500;
            response.body = JSON.stringify({
                "message": "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }

        //TODO: 全ユーザのpasswordを隠蔽する処理を記述
        if(data.Items) {
            data.Items.forEach(function(val, index, arr){});
        }
        //TODO: レスポンスボディの設定とコールバックの記述
        response.body = JSON.stringify({
            "posts": data.Items
        });
        callback(null, response);
    });
};
