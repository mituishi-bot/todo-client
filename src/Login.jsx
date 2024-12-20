//ログインフォーム
import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState(""); //ユーザーネーム
  const [password, setPassword] = useState(""); //パスワード

  //入力されたユーザー名とパスワードをfetchを使用してサーバーに送信
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      //レスポンスとしてトークンやユーザー情報
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.token) {
          //ログイン状態を親コンポーネントに通知します
          onLogin({
            user_id: data.user_id,
            username: data.username,
            token: data.token,
          });
        } else {
          alert("ログインに失敗しました。");
        }
      })
      .catch(() => alert("エラーが発生しました。"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <label>ユーザー名</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <label>パスワード</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="submit">ログイン</button>
    </form>
  );
}

export default Login;
