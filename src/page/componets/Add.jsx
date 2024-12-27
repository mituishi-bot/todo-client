//タスク追加フォーム
import React, { useState } from "react";

function Add({ addTask }) {
  const [title, setTitle] = useState(""); //タスクのタイトル
  const [content, setContent] = useState(""); //タスクの内容
  const [dueDate, setDueDate] = useState(""); //タスクの期限
  const [priority, setPriority] = useState("Medium"); //タスクの優先度
  const [error, setError] = useState(null); //エラーメッセージ

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); //ローカルストレージへトークン
    fetch("http://localhost:5000/tasks", {
      //サーバーにリクエスト
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, due_date: dueDate, priority }),
    })
      .then((response) => response.json()) // レスポンスをJSONとして
      .then((data) => {
        if (data.id) {
          addTask(data); //新しいタスクを追加
          setTitle(""); //フォームをリセット
          setContent("");
          setDueDate("");
          setPriority("Medium");
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("エラーが発生しました。"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>件名</label>
      <input
        type="text"
        value={title} //タイトル入力フォーム
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>内容</label>
      <textarea
        value={content} //内容入力フォーム
        onChange={(e) => setContent(e.target.value)}
      />
      <label>期限</label>
      <input
        type="date"
        value={dueDate} //日付入力フォーム
        onChange={(e) => setDueDate(e.target.value)}
      />
      <label>優先度</label>
      <select
        value={priority} //優先度セレクトボックス
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">高</option>
        <option value="Medium">中</option>
        <option value="Low">低</option>
      </select>
      <button type="submit">タスク追加</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Add;
