import { useState } from "react";
import { useEffect } from "react";
import Add from "./componets/Add";
import List from "./componets/List";
import { useNavigate } from "react-router";
import "./Home.css";

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

  const deleteTaskFromDB = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("タスクの削除に失敗しました。");
      }

      // ローカル状態からも削除
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("タスク削除エラー:", error);
      alert("タスクの削除に失敗しました。");
    }
  };

  const editTaskInDB = async (taskId, updatedTask) => {
    if (!taskId) {
      // 修正: taskId が正しく渡されているか確認
      console.error("IDが不正です");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("タスクの編集に失敗しました。");
      }

      const updatedData = await response.json();

      // ローカル状態を更新
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedData } : task
        )
      );
    } catch (error) {
      console.error("タスク編集エラー:", error);
      alert("タスクの編集に失敗しました。");
    }
  };

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
        deleteTask={(taskId) => deleteTaskFromDB(taskId)}
        editTask={(taskId, updatedTask) => editTaskInDB(taskId, updatedTask)}
      />
    </div>
  );
}

export default Task;
