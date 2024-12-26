//タスク一覧を表示する
import React from "react";
import Todo from "./Todo.jsx";
function List({ tasks, deleteTask, editTask }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Sort tasks by priority (High > Medium > Low)
  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="list-area">
      <h2>タスクリスト</h2>
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
