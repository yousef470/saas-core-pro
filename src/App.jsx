import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

// استيراد الـ Hook بتاع الثيم
import useTheme from "./hooks/useTheme";

function App() {
  // نادينا على الـ Hook عشان يشتغل ويقرا الـ Context، من غير ما نفكك متغيرات مش محتاجينها هنا
  useTheme();

  return (
    <BrowserRouter>
      {/* الحاوية الأساسية للموقع بالكامل */}
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{
          background: "var(--bg-main)",
        }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            {/* Dashboard Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/crm"
              element={
                <DashboardLayout>
                  <CRM />
                </DashboardLayout>
              }
            />

            <Route
              path="/analytics"
              element={
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />

            {/* Auth Pages */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;