import React from "react";

function List({ tasks, deleteTask }) {
  return (
    <div className="list-area">
      <h2>タスクリスト</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-content">{task.content}</p>
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-button"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
