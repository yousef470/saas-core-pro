import { Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";

import useTheme from "../hooks/useTheme";

function Register() {
  const { rtl } = useTheme();

  return (
    <AuthLayout
      title={
        rtl ? "إنشاء حساب" : "Register"
      }
      subtitle={
        rtl
          ? "أنشئ حسابك الجديد"
          : "Create your new account"
      }
    >
      <form className="space-y-5">
        <div>
          <label className="block mb-2 text-sm">
            {rtl ? "الاسم" : "Name"}
          </label>

          <input
            type="text"
            placeholder="John Doe"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background: "var(--bg-main)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            {rtl ? "البريد الإلكتروني" : "Email"}
          </label>

          <input
            type="email"
            placeholder="example@email.com"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background: "var(--bg-main)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            {rtl ? "كلمة المرور" : "Password"}
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
          {rtl ? "إنشاء الحساب" : "Create Account"}
        </button>

        <p
          className="text-center text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {rtl
            ? "لديك حساب بالفعل؟"
            : "Already have an account?"}

          <Link
            to="/login"
            className="text-indigo-500 ml-2"
          >
            {rtl ? "تسجيل الدخول" : "Login"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;