var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "post";

exports.handler = (event, context, callback) => {
  const GET_MAX = 100; //postを取得できる最大件数
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      "message": ""
    })
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


  var queryStrings = event.queryStringParameters || null;
  //クエリストリングが空だったら返す
  if (!queryStrings) {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "パラメータが不正です"
    });
    callback(null, response);
    return;
  }

  //クエリストリングから値をとってくる
  var userId = queryStrings.userId;
  var start = queryStrings.start;
  var end = queryStrings.end;
  var category = queryStrings.category;

　//各パラメータの存在パターン判定
  var errValidFlg = true;
  if (!userId) {
    errValidFlg = false;
  } else if (!start && !end && !category) {
    errValidFlg = true;
  } else if (!start && !end && category) {
    errValidFlg = false;
  } else if (!start || !end) {
    errValidFlg = false;
  }

  if (!errValidFlg) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "パラメータが不正です"
    });
    callback(null, response);
    return;
  }

  var param = {};

　//bodyを場合分け
  if (start && end && category) { //期間,カテゴリー,userIdが指定されている場合
    param = {
      TableName: tableName,
      KeyConditionExpression: "userId = :uid AND #time BETWEEN :time1 AND :time2",
      FilterExpression: "#cat = :cat",
      ExpressionAttributeNames: {
        "#cat": "category",
        "#time": "timestamp"
      },
      ExpressionAttributeValues: {
        ":cat": category,
        ":uid": userId,
        ":time1": Number(start),
        ":time2": Number(end)
      },
      Limit: GET_MAX
    };
  } else if (start && end && !category) {
    param = {
      TableName: tableName,
      KeyConditionExpression: "userId = :uid AND #time BETWEEN :time1 AND :time2",
      ExpressionAttributeNames: {
        "#time": "timestamp"
      },
      ExpressionAttributeValues: {
        ":uid": userId,
        ":time1": Number(start),
        ":time2": Number(end)
      },
      Limit: GET_MAX
    };
  } else if (!start && !end && !category) {
    param = {
      TableName: tableName,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": userId,
        ":time1": Number(start),
        ":time2": Number(end)
      },
      Limit: GET_MAX
    };
  }
  dynamo.query(param, function(err, data) {
    if (err) {
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました" + err
      });
      callback(null, response);
      return;
    } else {
      response.body = JSON.stringify({
        posts: data.Items
      });
      callback(null, response);
      return;
    }
  });
};
