import React, { useState, useEffect } from "react";
import Add from "./Add.jsx"; // Addコンポーネント
import List from "./List.jsx"; // Listコンポーネント
import "./App.css"; // CSSスタイルシート

function App() {
  const [tasks, setTasks] = useState([]); // タスクの状態を管理

  // タスクの取得
  useEffect(() => {
    fetch("http://localhost:5000/tasks") // Flaskのエンドポイント
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  // タスクの追加
  const addTask = (newTask) => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => setTasks([...tasks, data])); // 新しいタスクを追加
  };

  // タスクの削除
  const deleteTask = (taskId) => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== taskId)); // 削除後、タスクリストを更新
    });
  };

  return (
    <div className="app-area">
      <h1 className="title">TaskBoard</h1>
      <Add addTask={addTask} /> {/* タスク作成フォーム */}
      <List tasks={tasks} deleteTask={deleteTask} /> {/* タスク一覧 */}
    </div>
  );
}

export default App;
