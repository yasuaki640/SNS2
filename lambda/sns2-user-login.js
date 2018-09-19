var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "user";

exports.handler = (event, context, callback) => {
    //レスポンスのひな型
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };
    //リクエストbodyを取得し、jsのオブジェクトにパースする
    var body = JSON.parse(event.body);

    var userId = body.userId;
    var password = body.password;

    //TODO: query()に渡すparamを宣言
    var param = {
        "TableName" : tableName,
        //キー、インデックスによる検索の定義
        "KeyConditionExpression" : "userId = :uid",
        //プライマリーキー以外の属性でのフィルタ
        "FilterExpression": "#pass = :pass",
        //属性名のプレースホルダの定義
        "ExpressionAttributeNames" : {
            "#pass": "password"
        },
        //検索値のプレースホルダの定義
        "ExpressionAttributeValues" : {
            ":uid": userId,
            ":pass": password,
        }
    };

    //dynamo.query()を用いてuserIdとpasswordが一致するデータの検索
    dynamo.query(param, function(err, data){
        //userの取得に失敗
        if(err){
            response.statusCode = 500;
            response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました"});
            callback(null, response);
            return;
        }
        //TODO: 該当するデータが見つからない場合の処理を記述(ヒント：data.Itemsの中身が空)
        if (!data.Items.length) {
            response.statusCode = 401;
            response.body = JSON.stringify({
                "message": "userIdまたはpasswordが一致しません"
            });
            callback(null, response);
            return;
        }
        //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述
        response.body = JSON.stringify({
            //tokenを生成
            "token": "sns2" //Math.random().toString(36).slice(-8)
        });
        callback(null, response);
    });
};
