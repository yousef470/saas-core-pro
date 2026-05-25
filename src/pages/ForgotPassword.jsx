import { useState } from "react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

function ForgotPassword() {
  const { lang } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا الـ Logic بتاع إرسال لينك إعادة التعيين للـ API
    setIsSubmitted(true);
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* خلفية الـ Glowing Premium Ambient */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-600 rounded-full filter blur-[130px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600 rounded-full filter blur-[130px] opacity-25 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
      >
        {/* هيدر الصفحة واللوجو الصغير */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <KeyRound size={22} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {lang === "ar" ? "استعادة كلمة المرور" : "Forgot Password?"}
          </h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            {isSubmitted 
              ? (lang === "ar" ? "تفقد بريدك الإلكتروني للحصول على رابط إعادة التعيين." : "Check your inbox for the reset link instructions.")
              : (lang === "ar" ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمنًا لتعيين كلمة مرور جديدة." : "Enter your email and we'll send you a secure link to reset your password.")
            }
          </p>
        </div>

        {!isSubmitted ? (
          // فورمة إدخال البريد الإلكتروني
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 focus-within:border-indigo-500 transition-all">
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

            <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
              {lang === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
            </button>
          </form>
        ) : (
          // حالة النجاح بعد الإرسال
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 space-y-4">
            <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {lang === "ar" ? "تم الإرسال بنجاح ✔" : "Sent Successfully ✔"}
            </div>
            <p className="text-xs text-gray-400">
              {lang === "ar" ? "لم يصلك الرمز؟ تفقد مجلد الرسائل غير المرغوب فيها (Spam)." : "Didn't receive the email? Check your spam folder."}
            </p>
          </motion.div>
        )}

        {/* زر العودة لصفحة تسجيل الدخول */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            {lang === "ar" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{lang === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default ForgotPassword;