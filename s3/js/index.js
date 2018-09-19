var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    // Vue.jsで使う変数はここに記述する
    userId: localStorage.getItem('userId'),
    postForm: {
      text: null,
      category: null
    },
    posts: [], //すべてのpostの配列
    query: {
      userId: null,
      category: null,
      start: null,
      end: null
    }
  },
  methods: {
    post: function () {
      //投稿時の処理内容
      fetch(url + "/post", {
        method: "POST",
        headers: new Headers({
          "Authorization": localStorage.getItem('token')
        }),
        body: JSON.stringify({
          userId: vm.userId,
          text: vm.postForm.text,
          category: vm.postForm.category
        })
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
        // レスポンスが200番で帰ってきたとき投稿に時間情報を付加し、入力フォームを空にする
        json.date = new Date(json.timestamp).toLocaleString();
        vm.posts.unshift(json);
        vm.postForm.text = null;
        vm.postForm.category = null;
        alert("投稿完了");
      })
      .catch(function(err) {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        window.console.error(err.message);
        alert("投稿に失敗しました");
      });
    },
    search: function () {
      //検索時の処理内容
      var queryString = "userId=" + vm.userId;
      if (vm.query.userId) {
        queryString += "&userId=" + vm.query.userId;
      }
      if (vm.query.category) {
        queryString += "&category=" + vm.query.category;
      } //getTimeメソッド
      if (vm.query.start) {
        queryString += "&start=" + new Date(vm.query.start.replace("-", "/")).getTime();
      }
      if (vm.query.userId) {
        queryString += "&end=" + new Date(vm.query.end.replace("-", "/") + " 23:59:56").getTime();
      }
      // 投稿の取得リクエストの送信
      fetch(url + "/post?" + queryString, {
        method: "GET",
        headers: new Headers({
          "Authorization": localStorage.getItem('token')
        })
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
      // Date()で日付、時刻表示を生成
        vm.posts = json.posts;
        vm.posts.forEach(function (e) {
          e.date = new Date(e.timestamp).toLocaleString();
        });
      })
      .catch(function(err) {
      // レスポンスがエラーで返ってきたときの処理はここに記述する
      window.console.error(err.message);
      });
    },
    deletePost: function (targetPost) {
      //削除時の処理内容
      fetch(url + "/post", {
        method: 'DELETE',
        headers: new Headers({
          "Authorization": localStorage.getItem('token')
      }),
        body: JSON.stringify({ 
          userId: vm.userId,
          timestamp: targetPost.timestamp
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
          var targetIndex = vm.posts.indexOf(targetPost);
          vm.posts.splice(targetIndex, 1)
      })
      .catch(function(err) {
        window.console.error(err.message);
      });
    }
  },

  created: function () {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // APIにGETリクエストを送る
    fetch(url + "/posts", {
      method: "GET",
      headers: new Headers({
        "Authorization": localStorage.getItem('token')
      })
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
      vm.posts = json.posts;
      vm.posts.forEach(function (e) {
        e.date = new Date(e.timestamp).toLocaleString();
      });
    })
    .catch(function(err) {
    // レスポンスがエラーで返ってきたときの処理はここに記述する
    window.console.error(err.message);
    });
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    sortedPosts: function () {
      return this.posts.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      });
    }
  },
});

