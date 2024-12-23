import React, { useState } from "react";

function Add({ addTask }) {
  const [title, setTitle] = useState(""); //タイトル
  const [content, setContent] = useState(""); //タスクの内容
  const [dueDate, setDueDate] = useState(""); // 期限
  const [error, setError] = useState(null); // エラーメッセージ

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, due_date: dueDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          addTask(data);
          setTitle("");
          setContent("");
          setDueDate("");
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>内容</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <label>期限</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">タスク追加</button>
    </form>
  );
}

export default Add;
