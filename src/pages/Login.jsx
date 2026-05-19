import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";

import useTheme from "../hooks/useTheme";

import useAuth from "../hooks/useAuth";

function Login() {
  const { rtl } = useTheme();

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  return (
    <AuthLayout
      title={
        rtl ? "تسجيل الدخول" : "Login"
      }
      subtitle={
        rtl
          ? "سجل الدخول إلى حسابك"
          : "Sign in to your account"
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          login(email);

          navigate("/");
        }}
      >
        <div>
          <label className="block mb-2 text-sm">
            {rtl
              ? "البريد الإلكتروني"
              : "Email"}
          </label>

          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background:
                "var(--bg-main)",

              borderColor:
                "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            {rtl
              ? "كلمة المرور"
              : "Password"}
          </label>

          <input
            type="password"
            placeholder="********"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            style={{
              background:
                "var(--bg-main)",

              borderColor:
                "var(--border)",
            }}
          />
        </div>

        <button
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
        >
          {rtl ? "دخول" : "Login"}
        </button>

        <p
          className="text-center text-sm"
          style={{
            color:
              "var(--text-muted)",
          }}
        >
          {rtl
            ? "ليس لديك حساب؟"
            : "Don't have an account?"}

          <Link
            to="/register"
            className="text-indigo-500 ml-2"
          >
            {rtl
              ? "إنشاء حساب"
              : "Register"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;