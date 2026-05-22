import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import DashboardLayout from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

// استيراد الـ Hook بتاع الثيم واللغة
import useTheme from "./hooks/useTheme";

function App() {
  // تفعيل الـ Context لقراءة الـ Dark mode واللغة في جذر المشروع
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
            {/* Dashboard Layout - شيلنا الـ ProtectedRoute مؤقتاً عشان يفتح معاك فوراً */}
            <Route
              path="/"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
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