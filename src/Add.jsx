import React, { useState } from "react";

function Add({ addTask }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      addTask({ title, content }); // 親コンポーネント呼び出す
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
