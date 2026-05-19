import { Bell, Search, Menu, Moon, Sun, Languages } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";

function Navbar({ setIsOpen }) {
  const { darkMode, setDarkMode, rtl, setRtl } = useTheme();

  return (
    <header
      className="h-20 border-b px-4 lg:px-8 flex items-center justify-between"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
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
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRtl(!rtl)}
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--bg-main)",
          }}
        >
          <Languages size={18} />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
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
        <Link
          to="/login"
          className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center justify-center font-medium"
        >
          {rtl ? "تسجيل الدخول" : "Login"}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
