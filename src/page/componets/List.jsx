//タスク一覧を表示する
import React from "react";
import Todo from "./Todo.jsx";

function List({ tasks, deleteTask, editTask }) {
  // タスクデータをログ出力して確認
  console.log("タスクデータList.jsx: ", tasks);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // 'YYYY-MM-DD'形式にフォーマット
  };

  return (
    <div className="list-area">
      <h2>タスクリスト</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <Todo
              task={{ ...task, due_date: formatDate(task.due_date) }}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
