//タスク一覧を表示する
import React from "react";
import Todo from "./Todo.jsx";

function List({ tasks, deleteTask }) {
  //タスクの配列,タスク削除
  console.log("タスクデータList.jsx: ", tasks); // 追加
  return (
    <div className="list-area">
      <h2>タスクリスト</h2>
      <ul className="task-list">
        {tasks.map((task, index) => (
          // ここではindex、タスクオブジェクト内のtask.id
          <li key={index} className="task-item">
            <Todo task={task} deleteTask={deleteTask} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
