import React from "react";

function Todo({ task, deleteTask }) {
  const { title, content, id } = task;

  return (
    <div className="Todo">
      <table>
        <tbody>
          <tr>
            <th>件名：</th>
            <td>{title}</td>
          </tr>
          <tr>
            <th>内容：</th>
            <td>{content}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => deleteTask(id)}>削除</button>
    </div>
  );
}

export default Todo;
