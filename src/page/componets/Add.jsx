//「タスク追加」フォーム
import React, { useState } from "react";

function Add({ addTask }) {
  const [title, setTitle] = useState(""); //タイトル
  const [content, setContent] = useState(""); //タスクの内容
  const [error, setError] = useState(null); // エラーメッセージ

  //title と content が両方とも入力されていれば
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/tasks", {
      //HTTPメソッド,リクエストヘッダーリクエストボディ
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
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

    if (title && content) {
      addTask({ title, content });
      setTitle("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>件名</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>内容</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">タスク追加</button>
    </form>
  );
}

export default Add;
