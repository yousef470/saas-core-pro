import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import useTheme from "../hooks/useTheme";

function Login() {
  // استخدام النظام الجديد (lang === "ar") بدلاً من rtl
  const { lang } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <AuthLayout
      title={lang === "ar" ? "تسجيل الدخول" : "Login"}
      subtitle={lang === "ar" ? "سجل الدخول إلى حسابك" : "Sign in to your account"}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          // عطلنا دالة الـ login() المعلقة مؤقتاً عشان نتخطى الإيرور
          // وتدخل للـ Dashboard علطول وتشوف الترجمة الشغالة!
          navigate("dashboard/"); 
        }}
      >
        <div>
          <label className="block mb-2 text-sm">
            {lang === "ar" ? "البريد الإلكتروني" : "Email"}
          </label>

          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background: "var(--bg-main)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            {lang === "ar" ? "كلمة المرور" : "Password"}
          </label>

          <input
            type="password"
            placeholder="********"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background: "var(--bg-main)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <button
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
        >
          {lang === "ar" ? "دخول" : "Login"}
        </button>

        <p
          className="text-center text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}

          <Link
            to="/register"
            className="text-indigo-500 mx-2" // استبدلنا ml-2 بـ mx-2 عشان الـ RTL والـ LTR
          >
            {lang === "ar" ? "إنشاء حساب" : "Register"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;