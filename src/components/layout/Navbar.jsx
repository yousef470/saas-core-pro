import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Menu,
  Moon,
  Sun,
  Languages,
  X,
  LogOut,
  ChevronDown,
  User,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";

function Navbar({ setIsOpen }) {
  const { darkMode, toggleDarkMode, toggleLanguage, lang } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] =
  useState(false);

const notificationRef = useRef(null);
const userMenuRef = useRef(null);

const notifications = [
  {
    id: 1,
    title: "New payment received",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "New user registered",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "Server updated successfully",
    time: "1 hour ago",
  },
];
const { user, logout } = useAuth();
useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(e.target)
    ) {
      setShowNotifications(false);
    }

    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(e.target)
    ) {
      setShowUserMenu(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

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

<div className="relative" ref={notificationRef}>
  <button
    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }
    className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white relative transition-all hover:scale-105"
    style={{
      background: "var(--bg-main)",
      borderColor: "var(--border)",
    }}
  >
    <Bell size={18} />

    {notifications.length > 0 && (
      <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] flex items-center justify-center text-white font-bold">
        {notifications.length}
      </span>
    )}
  </button>

  <AnimatePresence>
    {showNotifications && (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`absolute top-16 w-[340px] rounded-3xl border shadow-2xl overflow-hidden z-50 ${
          lang === "ar"
            ? "left-0"
            : "right-0"
        }`}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm dark:text-white">
              {lang === "ar"
                ? "التنبيهات"
                : "Notifications"}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {notifications.length} new
              notifications
            </p>
          </div>

          <button
            onClick={() =>
              setShowNotifications(false)
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-4 border-b last:border-none hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>

                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

   {/* بروفايل المستخدم مع حماية ضد الـ Null */}
<div
  className="relative pl-3 border-l ml-2"
  style={{
    borderColor: "var(--border)",
  }}
  ref={userMenuRef}
>
  <button
    onClick={() =>
      setShowUserMenu(!showUserMenu)
    }
    className="flex items-center gap-3 hover:bg-white/[0.04] px-2 py-1.5 rounded-2xl transition-all"
  >
    <div className="hidden sm:block text-right">
      <p className="text-sm font-bold dark:text-white">
        {user?.name || "Guest"}
      </p>

      <p className="text-[10px] text-slate-500">
        Pro Plan
      </p>
    </div>

    <img
      src={
        user?.avatar ||
        "/default-avatar.png"
      }
      alt="User"
      className="w-10 h-10 rounded-full border object-cover"
      style={{
        borderColor: "var(--border)",
      }}
    />

    <ChevronDown
      size={16}
      className={`hidden sm:block text-slate-500 transition-transform ${
        showUserMenu
          ? "rotate-180"
          : ""
      }`}
    />
  </button>

  <AnimatePresence>
    {showUserMenu && (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 10,
          scale: 0.98,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`absolute top-16 w-64 rounded-3xl border shadow-2xl overflow-hidden z-50 ${
          lang === "ar"
            ? "left-0"
            : "right-0"
        }`}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                "/default-avatar.png"
              }
              alt="User"
              className="w-12 h-12 rounded-full border"
            />

            <div>
              <p className="font-bold text-sm dark:text-white">
                {user?.name ||
                  "Guest User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/[0.04] transition-all text-sm dark:text-white"
          >
            <User size={16} />
            Profile
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/[0.04] transition-all text-sm dark:text-white"
          >
            <Settings size={16} />
            Settings
          </button>

          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
      </div>
    </header>
  );
}

export default Navbar;