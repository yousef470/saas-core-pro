import { Bell, Search, Menu, Moon, Sun, Languages } from "lucide-react";
// قراءة مباشرة من الـ Context الموحد اللي صلحناه
import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";

function Navbar({ setIsOpen }) {
  // سحبنا المتغيرات والدوال الجديدة والموحدة من الـ Context
  const { darkMode, toggleDarkMode, lang, toggleLanguage } = useTheme();

  return (
    <header
      className="h-20 border-b px-4 lg:px-8 flex items-center justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shrink-0 w-full"
    >
      <div className="flex items-center gap-4">
        {/* زرار الموبايل: مضبوط على lg:hidden عشان يتماشى مع الـ Sidebar الكبير اللي بيظهر عند lg */}
        <button
          onClick={() => setIsOpen(true)} // شغال تماماً مع الدالة بتاعتك
          className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border text-slate-600 dark:text-slate-300"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          <Menu size={20} />
        </button>

        <div
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl w-64 lg:w-80 border transition-all"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className="bg-transparent outline-none text-sm w-full dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* زرار تبديل اللغة الموحد */}
        <button
          onClick={toggleLanguage}
          className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          <Languages size={18} />
        </button>

        {/* زرار تبديل الوضع الداكن الموحد */}
        <button
          onClick={toggleDarkMode}
          className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* زرار الإشعارات */}
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          <Bell size={18} />
        </button>
        
        {/* زرار تسجيل الدخول - تم تقليص الـ padding في الشاشات الصغيرة لحمايته من التداخل */}
        <Link
          to="/login"
          className="px-3 sm:px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center justify-center text-xs sm:text-sm font-medium shrink-0 shadow-lg shadow-indigo-600/15"
        >
          {lang === "ar" ? "تسجيل الدخول" : "Login"}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;