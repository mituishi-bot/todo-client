import React, { useState } from "react";

function Add({ addTask }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium"); // New state for priority
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, due_date: dueDate, priority }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          addTask(data);
          setTitle("");
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
      <label>優先度</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
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
