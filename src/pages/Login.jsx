import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, User, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Auth() {
  const { lang } = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // الـ State اللي بتتحكم في قلبة الصفحة

  // States للفورم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // توجيه للـ Dashboard عند نجاح الدخول أو التسجيل
    navigate("/dashboard");
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden select-none">
      
      {/* الـ Ambient Glows الخلفية */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600 rounded-full filter blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-[140px] opacity-20 pointer-events-none"></div>

      {/* شاسيه الكتاب المفتوح الأساسي */}
      <div className="relative w-full max-w-4xl min-h-[600px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* ------------------ الجانب المتحرك: لوجو الموقع والمعلومات الفنية ------------------ */}
        <motion.div 
          animate={{ 
            order: isLogin ? (lang === "ar" ? 2 : 1) : (lang === "ar" ? 1 : 2) 
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="w-full md:w-1/2 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 p-8 md:p-12 flex flex-col justify-between items-center text-center relative border-b md:border-b-0 md:border-x border-white/10"
        >
          {/* خطوط جمالية كأنها صفحات كتاب داخلية */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-white/5 hidden md:block"></div>
          <div className="absolute inset-y-0 left-0 w-[1px] bg-white/5 hidden md:block"></div>

          <div className="my-auto space-y-6">
            <motion.div 
              animate={{ rotate: isLogin ? 0 : 360 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/30"
            >
              <ShieldCheck size={40} />
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                SaaS-Core
              </h1>
              <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider">
                {lang === "ar" ? "نظام الإدارة المحترف" : "Premium Admin Template"}
              </p>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              {isLogin 
                ? (lang === "ar" ? "انضم إلينا واستمتع بأقوى لوحة تحكم لإدارة مشروعك الناشئ لعام 2026." : "Join us and explore the most powerful admin dashboard to scale your startup in 2026.")
                : (lang === "ar" ? "شغل تحليلاتك، أدر فريقك، وضاعف مبيعاتك في مكان واحد." : "Power up your analytics, manage your team, and boost sales in one single place.")
              }
            </p>
          </div>

          {/* زرار القلب التكتيكي الصغير أسفل اللوجو */}
          <div className="text-xs text-gray-400 mt-4">
            <span>{isLogin ? (lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?") : (lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?") }</span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors mx-1 underline"
            >
              {isLogin ? (lang === "ar" ? "سجل الآن" : "Sign Up") : (lang === "ar" ? "دخول" : "Sign In")}
            </button>
          </div>
        </motion.div>

        {/* ------------------ الجانب الديناميكي: الفورم (Login / Register) ------------------ */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              // 1. واجهة تسجيل الدخول (Login View)
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {lang === "ar" ? "تسجيل الدخول" : "Welcome Back"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {lang === "ar" ? "الرجاء إدخال بياناتك للمتابعة" : "Please enter your details to continue"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-indigo-500 transition-all">
                      <Mail size={16} className="text-gray-500 shrink-0" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? "كلمة المرور" : "Password"}</label>
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-indigo-500 transition-all relative">
                      <Lock size={16} className="text-gray-500 shrink-0" />
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 text-gray-500 hover:text-white transition-colors flex items-center px-3" style={{ [lang === "ar" ? "left" : "right"]: "4px" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                    </Link>
                  </div>

                  <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                    <span>{lang === "ar" ? "دخول" : "Sign In"}</span>
                    <LogIn size={16} />
                  </button>
                </form>
              </motion.div>
            ) : (
              // 2. واجهة إنشاء حساب جديد (Register View)
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: lang === "ar" ? 30 : -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {lang === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {lang === "ar" ? "ابدأ رحلتك معنا اليوم مجاناً" : "Get started with your free account today"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? "الاسم بالكامل" : "Full Name"}</label>
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-purple-500 transition-all">
                      <User size={16} className="text-gray-500 shrink-0" />
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Yousef Ahmed" className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-purple-500 transition-all">
                      <Mail size={16} className="text-gray-500 shrink-0" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? "كلمة المرور" : "Password"}</label>
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-purple-500 transition-all relative">
                      <Lock size={16} className="text-gray-500 shrink-0" />
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 text-gray-500 hover:text-white transition-colors flex items-center px-3" style={{ [lang === "ar" ? "left" : "right"]: "4px" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center justify-center gap-2 pt-1">
                    <span>{lang === "ar" ? "تسجيل الحساب" : "Sign Up"}</span>
                    <LogIn size={16} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* زرار العودة للموقع الرئيسي (Landing Page) بلمسة جمالية */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-white transition-colors">
              {lang === "ar" ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
              <span>{lang === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;