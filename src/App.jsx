import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import DashboardLayout from "./components/layout/DashboardLayout";

// الصفحات الحالية والـ Landing Page
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

// الصفحات الجديدة
import Users from "./pages/Users";       
import Billing from "./pages/Billing";     
import NotFound from "./pages/NotFound";   

import useTheme from "./hooks/useTheme";

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div 
        className="min-h-screen transition-colors duration-300 overflow-x-hidden w-full"
        style={{
          background: "var(--bg-main)",
        }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            
            {/* 🚀 صفحة الهبوط المستقلة (الواجهة الرئيسية للموقع بره الـ Layout) */}
            <Route path="/" element={<Landing />} />

            {/* 🛡️ نظام مسارات لوحة التحكم المتداخلة - كلها بتبدأ بـ dashboard/ وتفتح جوه الـ Layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} /> {/* index يعني دي الصفحة الرئيسية للداشبورد */}
              <Route path="crm" element={<CRM />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<Users />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            {/* 🔐 صفحات الـ Auth (شاشة كاملة مستقلة) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ⚠️ صفحة الـ 404 لأي مسار عشوائي غير مسجل */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;