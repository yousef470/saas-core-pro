import { Bell, Search, Menu, Moon, Sun, Languages } from "lucide-react";
// تعديل الاستيراد ليقرأ مباشرة من الـ Context الموحد اللي صلحناه
import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";

function Navbar({ setIsOpen }) {
  // سحبنا المتغيرات والدوال الجديدة والموحدة من الـ Context
  const { darkMode, toggleDarkMode, lang, toggleLanguage} = useTheme();

  return (
    <header
      className="h-20 border-b px-4 lg:px-8 flex items-center justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{
            background: "var(--bg-main)",
            borderColor: "var(--border)"
          }}
        >
          <Menu size={20} />
        </button>

        <div
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl w-80"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            // جعل الـ placeholder يقرأ من الترجمة لو حابب تضيفها لاحقاً أو سيبها ثابتة
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* زرار تبديل اللغة الموحد */}
        <button
          onClick={toggleLanguage} // استدعاء دالة التبديل الموحدة
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <Languages size={18} />
        </button>

        {/* زرار تبديل الوضع الداكن الموحد */}
        <button
          onClick={toggleDarkMode} // استدعاء دالة التبديل الموحدة
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <Bell size={18} />
        </button>
        
        {/* زرار تسجيل الدخول المترجم ديناميكياً */}
        <Link
          to="/login"
          className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center justify-center font-medium"
        >
          {lang === "ar" ? "تسجيل الدخول" : "Login"}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;