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

// 🆕 استبدال الـ Login والـ Register بالـ Auth الموحد، وإضافة الـ Reset
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// الصفحات الجديدة والـ Errors
import Users from "./pages/Users";       
import Billing from "./pages/Billing";     
import NotFound from "./pages/NotFound";   

// صفحة الدفع والـ Checkout
import Checkout from "./pages/Checkout"; 

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

            {/* 💳 صفحة الدفع والـ Checkout (مستقلة وبكامل الشاشة بعد اختيار الخطة) */}
            <Route path="/checkout" element={<Checkout />} />

            {/* 🛡️ نظام مسارات لوحة التحكم المتداخلة - كلها بتبدأ بـ dashboard/ وتفتح جوه الـ Layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} /> {/* index يعني دي الصفحة الرئيسية للداشبورد */}
              <Route path="crm" element={<CRM />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<Users />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            {/* 🔐 صفحات الـ Auth الموحدة (شاشة الكتاب المتحرك) */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            
            {/* 🔑 مسارات الـ Auth الإضافية لاستعادة وتعيين كلمة المرور */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ⚠️ صفحة الـ 404 لأي مسار عشوائي غير مسجل */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;