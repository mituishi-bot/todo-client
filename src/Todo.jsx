import React from "react";
import "./App.css";

export default function Todo({
  done,
  title,
  content,
  setTodoStatus,
  deleteTodoState,
  index,
}) {
  const className = done ? "done" : "undone";
  const status = done ? "未完了" : "完了";
  const todoDelete = done ? "削除する" : "";
  const undoStatus = done ? "" : "未達成"; // For marking as "未達成" (unfinished)

  return (
    <div className={className}>
      <div className="Todo">
        <div className="status">
          {/* Toggle task status */}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setTodoStatus({ index, done: !done });
            }}
          >
            {status}にする
          </a>
          　　
          {/* Mark as unfinished ("未達成") */}
          {!done && (
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                setTodoStatus({ index, done: false });
              }}
            >
              {undoStatus}
            </a>
          )}
          {/* Delete task */}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              deleteTodoState({ index });
            }}
          >
            {todoDelete}
          </a>
        </div>

        <table>
          <tr>
            <th>件名：</th>
            <td>{title}</td>
          </tr>
          <tr>
            <th>内容：</th>
            <td>{content}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
