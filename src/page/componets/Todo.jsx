import React, { useState, useEffect } from "react";
function Todo({ task, deleteTask, editTask }) {
  const { title, content, due_date, id } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newDueDate, setNewDueDate] = useState("");

  // 期限の日付をYYYY-MM-DD形式に変換
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 期限メッセージを生成
  const getDeadlineMessage = (dueDate) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const differenceInTime = due - currentDate;
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays === 0) {
      return "期限が今日です！";
    } else if (differenceInDays === -1) {
      return "期限が昨日です！";
    } else if (differenceInDays > 0) {
      return `期限まであと${differenceInDays}日です。`;
    } else {
      return "期限が過ぎています！";
    }
  };

  useEffect(() => {
    if (due_date) {
      setNewDueDate(formatDate(due_date)); // 初期表示のためにフォーマット
    }
  }, [due_date]);

  const handleEdit = () => {
    editTask(id, {
      title: newTitle,
      content: newContent,
      due_date: newDueDate,
    });
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
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)} // 期限を変更
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
              <tr>
                <th>期限：</th>
                <td>{formatDate(due_date)}</td>
              </tr>
              <tr>
                <th>状態：</th>
                <td>{getDeadlineMessage(due_date)}</td>
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
