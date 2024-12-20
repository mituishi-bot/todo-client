import React from "react";
import Home from "./page/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Task from "./page/Task";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Task />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
