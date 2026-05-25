import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import { UserProvider } from "./context/UserContext";

import { ThemeProvider } from "./context/ThemeProvider";
import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
       <AuthProvider>
        <UserProvider>
      <App />
      </UserProvider>
        </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
