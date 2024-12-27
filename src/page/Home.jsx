//新規登録orログイン
import React, { useState } from "react";
import Register from "./componets/Register.jsx";
import Login from "./componets/Login.jsx";
import "./Home.css";
import { useNavigate } from "react-router";

function Home() {
  const [view, setView] = useState("login"); // 表示画面: login, register, taskboard
  const navigate = useNavigate();

  // ログイン後・登録後の処理
  const handleUserChange = (data) => {
    console.log("登録またはログイン後のデータ:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    navigate("/tasks");
  };

  // 各画面の表示処理
  const renderView = () => {
    switch (view) {
      case "login": //ログイン系
        return (
          <div>
            <Login onLogin={handleUserChange} />
            <p>
              新規登録はこちら →{" "}
              <button onClick={() => setView("register")}>登録</button>
            </p>
          </div>
        );
      case "register": //新規登録画面
        return (
          <div>
            <Register onRegister={handleUserChange} />
            <p>
              既にアカウントをお持ちの方 →{" "}
              <button onClick={() => setView("login")}>ログイン</button>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-area">
      <h1 className="title">TaskBoard</h1>
      {renderView()}
    </div>
  );
}

export default Home;
