import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function ResetPassword() {
  const { lang } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(lang === "ar" ? "كلمات المرور غير متطابقة!" : "Passwords do not match!");
      return;
    }
    setError("");
    setIsSuccess(true);
    
    // توجيه لصفحة تسجيل الدخول بعد 3 ثواني من النجاح
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* الخلفية المضيئة المعتمدة */}
      <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-blue-600 rounded-full filter blur-[130px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600 rounded-full filter blur-[130px] opacity-25 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
      >
        {!isSuccess ? (
          <>
            {/* الهيدر */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/30">
                <Lock size={22} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {lang === "ar" ? "تعيين كلمة المرور" : "Reset Password"}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                {lang === "ar" ? "قم بكتابة كلمة المرور الجديدة وتأكيدها لحماية حسابك." : "Enter your new secure password below to update your account."}
              </p>
            </div>

            {/* الفورم */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {/* كلمة المرور الجديدة */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-blue-500 transition-all relative">
                  <Lock size={16} className="text-gray-500 shrink-0" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 text-gray-500 hover:text-white transition-colors flex items-center px-3"
                    style={{ [lang === "ar" ? "left" : "right"]: "4px" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {lang === "ar" ? "تأكيد كلمة المرور" : "Confirm New Password"}
                </label>
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-blue-500 transition-all">
                  <Lock size={16} className="text-gray-500 shrink-0" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-2">
                {lang === "ar" ? "تحديث كلمة المرور" : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          // واجهة النجاح التكتيكية
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-400">
              {lang === "ar" ? "تم تغيير كلمة المرور بنجاح!" : "Password Updated!"}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              {lang === "ar" ? "تم تحديث بيانات أمان حسابك. جاري تحويلك الآن تلقائياً إلى صفحة تسجيل الدخول..." : "Your security settings have been updated. Redirecting you to the login screen now..."}
            </p>
          </motion.div>
        )}

        {/* رجوع */}
        {!isSuccess && (
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
              {lang === "ar" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{lang === "ar" ? "إلغاء والعودة" : "Cancel and Go Back"}</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ResetPassword;