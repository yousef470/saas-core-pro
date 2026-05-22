import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import useTheme from "../hooks/useTheme";

function Login() {
  const { lang } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // 1️⃣ دالة الـ Submit منفصلة ومضمونة لمنع الريفريش والتوجيه الصح
  const handleSubmit = (e) => {
    e.preventDefault(); // منع المتصفح من عمل ريفريش وعلامة الاستفهام القديمة
    e.stopPropagation(); // منع أي أكشن تاني يعطل التوجيه
    
    console.log("Submitting form, navigating to home...");
    navigate("/"); // التوجيه للمسار الرئيسي المظبوط
  };

  return (
    <AuthLayout
      title={lang === "ar" ? "تسجيل الدخول" : "Login"}
      subtitle={lang === "ar" ? "سجل الدخول إلى حسابك" : "Sign in to your account"}
    >
      {/* 2️⃣ ربط الفورم بالدالة الجديدة النظيفة */}
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            required
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
            required
          />
        </div>

        {/* 3️⃣ تأكيد أن التايب هو submit */}
        <button
          type="submit"
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

          <Link to="/register" className="text-indigo-500 mx-2">
            {lang === "ar" ? "إنشاء حساب" : "Register"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;