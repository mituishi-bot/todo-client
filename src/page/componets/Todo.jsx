import React, { useState } from "react";

function Todo({ task, deleteTask, editTask }) {
  const { title, content, due_date, status, priority, id } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState(status);
  const [newPriority, setNewPriority] = useState(priority || "Medium");

  // 優先度を日本語に変換
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "High":
        return "高";
      case "Medium":
        return "中";
      case "Low":
        return "低";
      default:
        return "不明";
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEdit = () => {
    editTask(id, {
      title: newTitle,
      content: newContent,
      due_date: newDueDate,
      status: newStatus,
      priority: newPriority,
    });
    setIsEditing(false);
  };

  return (
    <div>
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
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="未完了">未完了</option>
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="High">高</option>
            <option value="Medium">中</option>
            <option value="Low">低</option>
          </select>
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
                <th>ステータス：</th>
                <td>{status}</td>
              </tr>
              <tr>
                <th>優先度：</th>
                <td>{getPriorityLabel(priority)}</td>
              </tr>{" "}
              {/* 日本語で表示 */}
            </tbody>
          </table>
          <p>{getDeadlineMessage(due_date)}</p>{" "}
          {/* Display the deadline message */}
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => deleteTask(id)}>削除</button>
        </div>
      )}
    </div>
  );
}

export default Todo;
