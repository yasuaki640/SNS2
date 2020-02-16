var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    // Vue.jsで使う変数はここに記述する
    user: {
      userId: null,
      password: null,
      nickname: null,
      age: null
    }
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    //以下、更新処理
    submit: function() {
      fetch(url + "/user", {
          method: 'PUT',
          headers: new Headers({
            "Authorization": localStorage.getItem('token')
        }),
          body: JSON.stringify({ 
            "userId": vm.user.userId,
            "password": vm.user.password,
            "nickname": vm.user.nickname,
            "age": Number(vm.user.age)
          })
        })
        .then(function (response) {
        　//以下、編集に成功したらコンソールにbody出力する
          if (response.status == 200) {
            return response.json();
          }
          // 200番以外のレスポンスはエラーを投げる
          return response.json().then(function(json) {
            throw new Error(json.message);
          });
        })
        .then(function(json) {
          var content = JSON.stringify(json, null, 2);
          window.console.log("User Updated\n" + content);
          alert("更新完了");
        })
        .catch(function(err) {
          window.console.error(err.message);
        });
    },
    
    deleteUser: function() {
      fetch(url + "/user", {
          method: 'DELETE',
          headers: new Headers({
            "Authorization": localStorage.getItem('token')
        }),
          body: JSON.stringify({ 
            "userId": vm.user.userId,
          })
        })
        .then(function (response) {
        　//以下、削除に成功したらコンソールにbody出力する
          if (response.status == 200) {
            return response.json();
          }
          // 200番以外のレスポンスはエラーを投げる
          return response.json().then(function(json) {
            throw new Error(json.message);
          });
        })
        .then(function () {
          //トークンを削除し、ログイン画面に遷移する
          localStorage.removeItem('token');
          location.href = "./login.html"
        })
        .catch(function(err) {
          window.console.error(err.message);
        });
    },
  },
  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // APIにGETリクエストを送る
    fetch(url + "/user" +
    "?userId=" + localStorage.getItem('userId'), {
      method: "GET"
    })
    .then(function(response) {
    if (response.status == 200) {
      return response.json();
    }
    // 200番以外のレスポンスはエラーを投げる
    return response.json().then(function(json) {
      throw new Error(json.message);
    });
    })
    .then(function(json) {
    // レスポンスが200番で返ってきたときの処理はここに記述する
      vm.user.userId = localStorage.getItem('userId');
    })
    .catch(function(err) {
    // レスポンスがエラーで返ってきたときの処理はここに記述する
    });


  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  }
});
