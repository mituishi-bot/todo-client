import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.token) {
          onLogin({ id: data.id, username: data.username, token: data.token }); // 正しくデータを渡す
        } else {
          alert("ログインに失敗しました。");
        }
      })
      .catch(() => alert("エラーが発生しました。"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <label>
        ユーザー名:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        パスワード:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">ログイン</button>
    </form>
  );
}

export default Login;
