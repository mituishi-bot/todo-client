//タスク一覧を表示する
import React, { useState } from "react";
import Todo from "./Todo.jsx";

function List({ tasks, deleteTask, editTask }) {
  const [sortConfig, setSortConfig] = useState({ key: "added", order: "asc" });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let compare = 0;

    if (sortConfig.key === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      compare = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortConfig.key === "dueDate") {
      compare = new Date(a.due_date) - new Date(b.due_date);
    } else if (sortConfig.key === "added") {
      compare = a.id - b.id;
    }

    return sortConfig.order === "asc" ? compare : -compare;
  });

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
      <div className="sort-buttons">
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
