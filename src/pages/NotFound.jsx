import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative flex flex-col items-center"
      >
        {/* رقم الخطأ الـ Premium */}
        <h1 className="text-9xl font-extrabold tracking-widest text-indigo-600 dark:text-indigo-500 drop-shadow-sm select-none">
          404
        </h1>
        
        <div className="bg-indigo-600 text-white px-3 py-1 text-xs md:text-sm rounded-md rotate-12 absolute top-10 md:top-12 font-semibold shadow-md whitespace-nowrap">
          Page Not Found
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-2 text-slate-800 dark:text-slate-100">
          عذراً، الصفحة غير موجودة!
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-sm md:text-base">
          يبدو أنك سلكت مساراً خاطئاً أو أن الصفحة قد تم نقلها. لا تقلق، يمكنك العودة دائماً.
        </p>

        {/* زرار العودة للرئيسية */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium text-sm shadow-lg shadow-indigo-600/20"
        >
          العودة للوحة التحكم
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;