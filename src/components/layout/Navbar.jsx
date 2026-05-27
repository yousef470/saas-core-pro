import { useState } from "react";
import { useContext } from "react";
import { Bell, Menu, Moon, Sun, Languages, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../../hooks/useTheme";
import { AuthContext } from "../../context/AuthContext";

function Navbar({ setIsOpen }) {
  const { darkMode, toggleDarkMode, toggleLanguage, lang } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
 const { user } = useContext(AuthContext);

  return (
    // النافبار شفاف وبخلفية Blur وبدون حدود سفلية (ليندمج مع السايدبار)
    <header className="h-20 px-4 lg:px-8 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0 w-full transition-colors duration-300">
      
      {/* الجانب الأيسر: زر القائمة للموبايل */}
      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border text-slate-600 dark:text-slate-300"
          style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* الجانب الأيمن: الأزرار + بروفايل المستخدم الديناميكي */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        <button onClick={toggleLanguage} className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white" style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}>
          <Languages size={18} />
        </button>

        <button onClick={toggleDarkMode} className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white" style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white relative" style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}>
            <Bell size={18} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                className={`absolute top-16 w-80 p-4 rounded-2xl border shadow-xl z-50 ${lang === "ar" ? "left-0" : "right-0"}`} 
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold dark:text-white">{lang === "ar" ? "التنبيهات" : "Notifications"}</h3>
                  <button onClick={() => setShowNotifications(false)} className="dark:text-white"><X size={16} /></button>
                </div>
                <p className="text-xs text-slate-500">{lang === "ar" ? "تم قبول مشروعك بنجاح!" : "Your project was accepted!"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

   {/* بروفايل المستخدم مع حماية ضد الـ Null */}
<div className="flex items-center gap-3 pl-3 border-l ml-2" style={{ borderColor: "var(--border)" }}>
  <div className="hidden sm:block text-right">
    <p className="text-sm font-bold dark:text-white">{user?.name || "زائر"}</p>
    <p className="text-[10px] text-slate-500">Pro Plan</p>
  </div>
  <img
    src={user?.avatar || "/default-avatar.png"}
    alt="User"
    className="w-10 h-10 rounded-full border object-cover"
    style={{ borderColor: "var(--border)" }}
  />
</div>
      </div>
    </header>
  );
}

export default Navbar;