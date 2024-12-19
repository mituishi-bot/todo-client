import React, { useState, useEffect } from "react";
import Add from "./Add.jsx";
import List from "./List.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null); // ログインしたユーザー情報
  const [view, setView] = useState("login"); // 表示画面: login, register, taskboard
  const [error, setError] = useState(null); // エラー表示用

  useEffect(() => {
    if (user) {
      // ログイン後にタスクを取得
      fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //ここ更新されない
          setTasks(data);
        })
        .catch((err) => setError("タスクの取得に失敗しました。"));
    }
  }, [user]);

  const handleRegister = (data) => {
    setUser({
      id: data.id,
      username: data.username,
      token: data.token,
    });
    setView("taskboard"); // タスク画面に切り替え
  };

  const handleLogin = (data) => {
    setUser({
      id: data.id,
      username: data.username,
      token: data.token,
    });
    setView("taskboard"); // タスク画面に切り替え
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setView("login"); // ログイン画面に戻る
  };

  return (
    <div className="app-area">
      <h1 className="title">TaskBoard</h1>

      {view === "login" && (
        <div>
          {error && <p>{error}</p>}
          <Login onLogin={handleLogin} />
          <p>
            新規登録はこちら →{" "}
            <button onClick={() => setView("register")}>登録</button>
          </p>
        </div>
      )}

      {view === "register" && (
        <div>
          <Register onRegister={handleRegister} />
          <p>
            既にアカウントをお持ちの方 →{" "}
            <button onClick={() => setView("login")}>ログイン</button>
          </p>
        </div>
      )}

      {view === "taskboard" && user && (
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
      )}
    </div>
  );
}

export default App;
