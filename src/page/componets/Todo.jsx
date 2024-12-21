import React, { useState } from "react";

function Todo({ task, deleteTask, editTask }) {
  const { title, content, id } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  const handleEdit = () => {
    // task.id を渡す部分で、task.id が正しく渡されていることを確認
    editTask(id, { title: newTitle, content: newContent });
    setIsEditing(false);
  };

  return (
    <div className="Todo">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleEdit}>保存</button>
          <button onClick={() => setIsEditing(false)}>キャンセル</button>
        </div>
      ) : (
        <div>
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
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => deleteTask(id)}>削除</button>
        </div>
      )}
    </div>
  );
}

export default Todo;
