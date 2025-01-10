import React, { useState } from "react";
import Todo from "./Todo.jsx";

function List({ tasks, deleteTask, editTask }) {
  const [sortConfig, setSortConfig] = useState({ key: "added", order: "asc" }); // ソートの基準と順序
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ
  const [dateQuery, setDateQuery] = useState(""); // 日付検索クエリ

  // 検索クエリでフィルタリング
  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = dateQuery
      ? new Date(task.due_date).toISOString().slice(0, 10) === dateQuery
      : true;
    return matchesTitle && matchesDate;
  });

  // タスクをソートする処理
  const sortedTasks = filteredTasks.sort((a, b) => {
    let compare = 0;

    if (sortConfig.key === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      compare = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortConfig.key === "dueDate") {
      compare = new Date(a.due_date) - new Date(b.due_date);
    } else if (sortConfig.key === "added") {
      compare = a.id - b.id; // タスクを追加順で比較
    }

    return sortConfig.order === "asc" ? compare : -compare;
  });

  // ソートの切り替え処理
  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { key, order: "asc" };
    });
  };

  return (
    <div className="list-area">
      <h2>タスクリスト</h2>

      <div className="tasks-buttons">
        <button onClick={() => toggleSort("priority")}>
          優先順{" "}
          {sortConfig.key === "priority"
            ? sortConfig.order === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <button onClick={() => toggleSort("dueDate")}>
          日付順{" "}
          {sortConfig.key === "dueDate"
            ? sortConfig.order === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <button onClick={() => toggleSort("added")}>
          追加順{" "}
          {sortConfig.key === "added"
            ? sortConfig.order === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <div className="search-buttons">
          <div className="title-search">
            <input
              type="text"
              placeholder="件名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setSearchQuery("")}>クリア</button>
          </div>
          <div className="date-search">
            <input
              type="date"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
            />
            <button onClick={() => setDateQuery("")}>日付クリア</button>
          </div>
        </div>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <Todo task={task} deleteTask={deleteTask} editTask={editTask} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
