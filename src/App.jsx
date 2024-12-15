import React, { useState, useEffect } from "react";
import Add from "./Add.jsx";
import List from "./List.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null); // ログインmessage
  const [error, setError] = useState(null); // エラーmessage

  useEffect(() => {
    if (user) {
      // タスクとログインフェッチ
      fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setTasks(data))
        .catch((err) => setError("タスクの取得に失敗しました。"));
    }
  }, [user]);

  // ユーザーハンドル
  const handleRegister = (data) => {
    setUser({
      id: data.id,
      username: data.username,
      token: "some-jwt-token",
    });
  };

  // ログインハンドル
  const handleLogin = (data) => {
    setUser({
      id: data.id,
      username: data.username,
      token: "some-jwt-token",
    });
  };

  // ログアウトハンドル
  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  return (
    <div className="app-area">
      <h1 className="title">TaskBoard</h1>

      {user ? (
        <>
          <p>ようこそ、{user.username}さん</p>
          <button onClick={handleLogout}>ログアウト</button>
          <Add addTask={(newTask) => setTasks([...tasks, newTask])} />
          <List
            tasks={tasks}
            deleteTask={(taskId) =>
              setTasks(tasks.filter((task) => task.id !== taskId))
            }
          />
        </>
      ) : (
        <div>
          {error && <p>{error}</p>}
          <Login onLogin={handleLogin} />
          <Register onRegister={handleRegister} />
        </div>
      )}
    </div>
  );
}

export default App;
