//編集モード
import React, { useState } from "react";

function Todo({ task, deleteTask, editTask }) {
  const { title, content, due_date, status, priority, id, progress } = task; // タスクのプロパティを展開
  const [isEditing, setIsEditing] = useState(false); //編集モード
  const [newTitle, setNewTitle] = useState(title); //タイトルの新しい値
  const [newContent, setNewContent] = useState(content); //内容の新しい値
  const [newDueDate, setNewDueDate] = useState(""); //新しい期限の新しい値
  const [newStatus, setNewStatus] = useState(status); //ステータスの新しい値
  const [newPriority, setNewPriority] = useState(priority || "Medium"); //優先度の新しい値

  const [newProgress, setNewProgress] = useState(
    status === "未完了"
      ? 0
      : status === "進行中"
      ? progress >= 1 && progress <= 99
        ? progress
        : 50
      : 100
  );

  const isOverdue = new Date(due_date) < new Date(); //期限切れかどうか

  // ステータス変更時に進捗を更新
  const handleStatusChange = (newStatus) => {
    setNewStatus(newStatus);
    if (newStatus === "未完了") {
      setNewProgress(0);
    } else if (newStatus === "進行中") {
      setNewProgress(50); // 進行中の初期進捗は50%に設定
    } else if (newStatus === "完了") {
      setNewProgress(100);
    }
  };

  //優先度のラベルを所得する関数
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

  //締め切りに応じたmessageを作成する関数
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

  //日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //編集内容を保存する関数
  const handleEdit = () => {
    // 新しい期限が空でない場合はそれを使用し、空の場合は元の期限を使用
    const finalDueDate = newDueDate || due_date;

    editTask(id, {
      title: newTitle,
      content: newContent,
      due_date: finalDueDate,
      status: newStatus,
      priority: newPriority,
      progress: newProgress,
    });

    setIsEditing(false); //編集終了
  };

  return (
    <div className={`Todo ${isOverdue ? "overdue" : ""}`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle} //タイトルを編集する入力フォーム
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            value={newContent} //内容を編集する入力フォーム
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate} //締切日を編集する入力フォーム
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <select
            value={newStatus} //ステータスを編集するセレクトボックス
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="未完了">未完了</option>
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
          </select>
          <input
            type="number"
            min="0"
            max="100"
            value={newProgress}
            onChange={(e) => setNewProgress(e.target.value)}
          />
          <select
            value={newPriority} //優先度を編集するセレクトボックス
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
        // 通常表示モードの場合
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
                <th>進捗度：</th>
                <td>{newProgress}%</td>
              </tr>
              <tr>
                <th>優先度：</th>
                <td>{getPriorityLabel(priority)}</td>
              </tr>
            </tbody>
          </table>
          <p>{getDeadlineMessage(due_date)}</p>
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => deleteTask(id)}>削除</button>
        </div>
      )}
    </div>
  );
}

export default Todo;
