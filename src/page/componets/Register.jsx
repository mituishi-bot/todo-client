//新規登録
import React, { useState } from "react";

function Register({ onRegister }) {
  const [username, setUsername] = useState(""); //入力されたユーザー名を保持
  const [password, setPassword] = useState(""); //入力されたパスWordを保持
  const [error, setError] = useState(""); //エラーメッセージ

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/register", {
      //HTTPメソッド,リクエストヘッダーリクエストボディ
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          onRegister(data);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("エラーが発生しました。"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>新規登録</h2>
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
      {error && <p>{error}</p>}
      <button type="submit">登録</button>
    </form>
  );
}

export default Register;
