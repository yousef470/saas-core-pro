import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import { AppProvider } from "./context/AppContext"; // 👈 ضفنا الـ Provider هنا

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider> {/* 👈 لفينا الـ App عشان الـ Theme والـ RTL يشتغلوا في المشروع كله */}
      <App />
    </AppProvider>
  </React.StrictMode>
);