import React from "react";

function List({ tasks, deleteTask }) {
  return (
    <div>
      <h2>タスクリスト</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.content}</p>
            <button onClick={() => deleteTask(task.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
