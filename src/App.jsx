import React, { useState, useEffect } from "react";
import Add from "./Add.jsx";
import List from "./List.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]); // タスクの状態
  const [user, setUser] = useState(null); // ログインユーザー情報
  const [view, setView] = useState("login"); // 表示画面: login, register, taskboard
  const [error, setError] = useState(null); // エラーメッセージ

  // ユーザーがログインした後にタスクを取得
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("取得したタスク: ", data); // 追加
          setTasks(data);
        })
        .catch(() => {
          console.error("タスクの取得に失敗しました。");
          setError("タスクの取得に失敗しました。");
        });
    }
  }, [user]);

  // ログイン後・登録後の処理
  const handleUserChange = (data) => {
    console.log("登録またはログイン後のデータ:", data);
    setUser({ id: data.user_id, username: data.username, token: data.token });
    setView("taskboard");
  };

  // ログアウト処理
  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setView("login");
  };

  // 各画面の表示処理
  const renderView = () => {
    switch (view) {
      case "login": //ログイン系
        return (
          <div>
            {error && <p>{error}</p>}
            <Login onLogin={handleUserChange} />
            <p>
              新規登録はこちら →{" "}
              <button onClick={() => setView("register")}>登録</button>
            </p>
          </div>
        );
      case "register": //新規登録画面
        return (
          <div>
            <Register onRegister={handleUserChange} />
            <p>
              既にアカウントをお持ちの方 →{" "}
              <button onClick={() => setView("login")}>ログイン</button>
            </p>
          </div>
        );
      case "taskboard": //タスクboard
        return (
          <div>
            {user && <p>ようこそ、{user.username}さん</p>}
            <button onClick={handleLogout}>ログアウト</button>
            <Add
              addTask={(newTask) => setTasks([...tasks, newTask])}
              user={user}
            />
            <List
              tasks={tasks}
              deleteTask={(taskId) =>
                setTasks(tasks.filter((task) => task.id !== taskId))
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-area">
      <h1 className="title">TaskBoard</h1>
      {renderView()}
    </div>
  );
}

export default App;
