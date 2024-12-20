import { useState } from "react";
import { useEffect } from "react";
import Add from "./componets/Add";
import List from "./componets/List";
import { useNavigate } from "react-router";
import "./Home.css"

function Task() {
  const [tasks, setTasks] = useState([]); // タスクの状態
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // ユーザーがログインした後にタスクを取得
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    setUsername(username);
    if (username) {
      fetch("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [username]);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      {username && <p>ようこそ、{username}さん</p>}
      <button onClick={handleLogout}>ログアウト</button>
      <Add addTask={(newTask) => setTasks([...tasks, newTask])} />
      <List
        tasks={tasks}
        deleteTask={(taskId) =>
          setTasks(tasks.filter((task) => task.id !== taskId))
        }
      />
    </div>
  );
}

export default Task;
