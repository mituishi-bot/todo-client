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
  const undoStatus = done ? "" : "未達成";

  return (
    <div className={className}>
      <div className="Todo">
        <div className="status">
          {/* タスクの内容 */}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setTodoStatus({ index, done: !done });
            }}
          >
            {status}にする
          </a>
          　　
          {/* 未達成 */}
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
          {/* タスク消す */}
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
