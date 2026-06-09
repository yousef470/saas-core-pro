import { useState, } from "react";
import { useNavigate, Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";

import useAuth from "../hooks/useAuth";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";

import { motion } from "framer-motion";

function Auth() {
  const { lang } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const { login, register } = useAuth()
  const [errors, setErrors] = useState({});
  // States
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();

const result = login(email, loginPassword);

if (result.success) {
  navigate("/dashboard");
} else {
  alert(result.message);
}
};

const handleRegister = (e) => {
  e.preventDefault();

  let newErrors = {};

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.trim().length < 3) {
    newErrors.name =
      "Name must be at least 3 characters";
  }

  if (!emailRegex.test(email)) {
    newErrors.email =
      "Invalid email address";
  }

  if (
    registerPassword !==
    confirmPassword
  ) {
    newErrors.confirmPassword =
      "Passwords do not match";
  }

  if (
    Object.keys(newErrors).length > 0
  ) {
    setErrors(newErrors);
    return;
  }

  const result = register(
    name,
    email,
    registerPassword
  );

  if (result.success) {
    navigate("/dashboard");
  } else {
    alert(result.message);
  }
};

  // حركة الـ Overlay
  const getSlidingX = () => {
    if (lang === "ar") {
      // بالعربي: إذا كان Login (isLogin=true) يجب أن يكون على اليمين (0%)
      // إذا كان Register (isLogin=false) يجب أن يتحرك لليسار (-100%)
      return isLogin ? "0%" : "-100%";
    } else {
      // بالإنجليزي: إذا كان Login (isLogin=true) يجب أن يكون على اليسار (0%)
      // إذا كان Register (isLogin=false) يجب أن يتحرك لليمين (100%)
      return isLogin ? "0%" : "100%";
    }
  };

  const passwordChecks = {
    length: registerPassword.length >= 8,
    uppercase: /[A-Z]/.test(registerPassword),
    lowercase: /[a-z]/.test(registerPassword),
    number: /\d/.test(registerPassword),
    special: /[@$!%*?&]/.test(registerPassword),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0b0c10] text-white flex flex-col items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden select-none"
    >
      {/* Ambient Background */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600 rounded-full blur-[140px] opacity-20 pointer-events-none"></div>

      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-20 pointer-events-none"></div>

      {/* Main Container */}
      <div
        className="
          relative
          w-full
          max-w-5xl
          min-h-[650px]
          bg-[#12141c]
          border
          border-white/10
          rounded-[32px]
          shadow-2xl
          overflow-hidden
          grid
          grid-cols-1
          md:grid-cols-2
        "
      >
        {/* ================= LOGIN FORM ================= */}

        <div className="p-8 md:p-0 flex flex-col justify-center bg-[#0e1017] w-full h-full">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {lang === "ar" ? "تسجيل الدخول" : "Welcome Back"}
              </h2>

              <p className="text-xs text-gray-500 mt-2">
                {lang === "ar"
                  ? "الرجاء إدخال بياناتك للمتابعة"
                  : "Please enter your details to continue"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>

                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 focus-within:border-indigo-500 transition-all">
                  <Mail size={16} className="text-gray-500 shrink-0" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === "ar" ? "كلمة المرور" : "Password"}
                </label>

                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 focus-within:border-indigo-500 transition-all relative">
                  <Lock size={16} className="text-gray-500 shrink-0" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 text-gray-500 hover:text-white transition-colors flex items-center px-3"
                    style={{
                      [lang === "ar" ? "left" : "right"]: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-600
                  to-purple-600
                  hover:from-indigo-500
                  hover:to-purple-500
                  text-white
                  font-semibold
                  text-sm
                  transition-all
                  shadow-lg
                  shadow-indigo-600/20
                  Active:scale-[0.98]
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span>{lang === "ar" ? "دخول" : "Sign In"}</span>

                <LogIn size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* ================= REGISTER FORM ================= */}

        <div className="p-8 md:p-0 flex flex-col justify-center bg-[#0e1017] w-full h-full">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
              </h2>

              <p className="text-xs text-gray-500 mt-2">
                {lang === "ar"
                  ? "ابدأ رحلتك معنا اليوم مجاناً"
                  : "Get started with your free account today"}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">



              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === "ar" ? "الاسم بالكامل" : "Full Name"}
                </label>

                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 focus-within:border-purple-500 transition-all">
                  <User size={16} className="text-gray-500 shrink-0" />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Yousef Ahmed"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />
                </div>

                {errors.name && (
                  <p className="text-red-400 text-xs mt-2 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>





              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 focus-within:border-purple-500 transition-all">
                  <Mail size={16} className="text-gray-500 shrink-0" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-400 text-xs mt-2 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>




                {/* PASSWORD */}
 
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {lang === "ar" ? " كلمة المرور" : " Password"}
              </label>
              <div className="relative">
                <div
                  className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border bg-white/5 transition-all
                  ${
                   registerPassword.length > 0
                  ? isPasswordValid
                    ? "border-green-500"
                         : "border-red-500"
                        : "border-white/10 focus-within:border-purple-500"
                  }`}
                >
                  <Lock size={16} className="text-gray-500 shrink-0" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 text-gray-500 hover:text-white transition-colors flex items-center px-3"
                    style={{
                      [lang === "ar" ? "left" : "right"]: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>


           
                {registerPassword.length > 0 && !isPasswordValid && (
                  <div
                    className={`absolute top-[calc(100%+10px)] z-[100] w-full rounded-2xl border border-white/10 bg-[#161922]/95 backdrop-blur-xl p-4 shadow-2xl ${lang === "ar" ? "right-0" : "left-0"}`}
                  >
                    <div className="space-y-2 text-xs">
                      <p
                        className={
                          passwordChecks.length
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        • At least 8 characters
                      </p>
                      <p
                        className={
                          passwordChecks.uppercase
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        • One uppercase letter
                      </p>
                      <p
                        className={
                          passwordChecks.lowercase
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        • One lowercase letter
                      </p>
                      <p
                        className={
                          passwordChecks.number
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        • One number
                      </p>
                      <p
                        className={
                          passwordChecks.special
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        • One special character
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>

                <div
                  className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border bg-white/5 transition-all relative
    ${
      registerPassword.length > 0
        ? confirmPassword === registerPassword
          ? "border-green-500"
          : "border-red-500"
        : "border-white/10 focus-within:border-purple-500"
    }`}
                >
                  <Lock size={16} className="text-gray-500 shrink-0" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600 pr-10 pl-10"
                  />

                  {/* Eye Button (Fixed RTL/LTR) */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors
        ${lang === "ar" ? "left-3" : "right-3"}`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-xs mt-2 ${
                      confirmPassword === registerPassword
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {confirmPassword === registerPassword
                      ? lang === "ar"
                        ? "✓ كلمة المرور متطابقة"
                        : "✓ Passwords match"
                      : lang === "ar"
                        ? "✗ كلمة المرور غير متطابقة"
                        : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-indigo-600
                  hover:from-purple-500
                  hover:to-indigo-500
                  text-white
                  font-semibold
                  text-sm
                  transition-all
                  shadow-lg
                  shadow-purple-600/20
                  Active:scale-[0.98]
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span>{lang === "ar" ? "تسجيل الحساب" : "Sign Up"}</span>

                <LogIn size={16} />
              </button>
            </form>
          </div>
        </div>
        {/* ================= SLIDING OVERLAY ================= */}
        <motion.div
          initial={false}
          animate={{
            x: getSlidingX(),
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 22,
          }}
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          className="absolute inset-0 z-20 w-1/2 bg-[#131722] hidden md:flex flex-col justify-center items-center text-center 
           will-change-transform overflow-hidden"
        >
          {" "}
          {/* Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b2133] via-[#141824] to-[#0f1118]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_35%)]" />
          {/* Content Container - يأخذ كامل الارتفاع ليتم توسيط اللوجو فيه */}
          <div className="flex-1 flex flex-col justify-center items-center w-full px-10 relative z-10">
            <motion.div
              animate={{
                rotate: isLogin ? 0 : 360,
                scale: isLogin ? 1 : 1.05,
              }}
              transition={{ duration: 0.8 }}
              className="
        w-28 h-28 rounded-[32px] 
        bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 
        flex items-center justify-center 
        text-white mx-auto 
        shadow-[0_0_60px_rgba(99,102,241,0.45)] 
        border border-white/10
      "
            >
              <div className="absolute inset-0 rounded-[32px]  from-white/10 to-transparent" />
              <ShieldCheck size={48} className="relative z-10" />
            </motion.div>

            <div className="space-y-3 mt-8">
              <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                SaaS-Core
              </h1>
              <p className="text-xs text-indigo-300 font-semibold uppercase tracking-[0.3em]">
                Premium Admin Template
              </p>
            </div>

            <motion.p
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-gray-400 mt-6 max-w-[280px] leading-relaxed"
            >
              {!isLogin
                ? "Join us and explore the most powerful admin dashboard to scale your startup in 2026."
                : "Power up your analytics, manage your team, and boost sales in one single place."}
            </motion.p>
          </div>
          {/* Footer Switch - ثابت في الأسفل */}
          <div className="text-xs text-gray-400 pb-8 border-t border-white/5 w-full pt-6 relative z-10">
            <span>
              {isLogin ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors mx-1 underline cursor-pointer"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
