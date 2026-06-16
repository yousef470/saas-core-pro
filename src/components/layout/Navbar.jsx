import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Menu,
  Moon,
  Sun,
  Languages,

  LogOut,
  ChevronDown,
  User,
  Settings,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { BellRing } from "lucide-react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ setIsOpen }) {

  const { darkMode, toggleDarkMode, toggleLanguage, lang } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] =
  useState(false);

const notificationRef = useRef(null);
const userMenuRef = useRef(null);



const {
  user,
  logout,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} = useAuth();

const notifications =
  user?.notifications || [];

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

const unreadCount =
  notifications.filter(
    
    (n) => !n.read
  ).length;
console.log("Unread:", unreadCount);

const formatTime = (date) => {
  
const now = new Date();
  const diff =
    now.getTime() -
    new Date(date).getTime();

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 1)
    return "Just now";

  if (minutes < 60)
    return `${minutes} min ago`;

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24)
    return `${hours} h ago`;

  const days = Math.floor(
    hours / 24
  );

  return `${days} d ago`;
};
const navigate = useNavigate();

  return (
 
<header
className="
relative
z-50
h-20
px-4
lg:px-8
flex
items-center
justify-between
bg-white
dark:bg-slate-900
shrink-0
w-full
transition-colors
duration-300
"
>
      
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
    className="w-11 h-11 rounded-xl flex items-center justify-center border dark:text-white relative transition-all hover:scale-105 "
    style={{
      background: "var(--bg-main)",
      borderColor: "var(--border)",
    }}
  >
    <Bell size={18} />

{unreadCount > 0 && (
  <span
    className="
      absolute
      -top-1
      -right-1
      min-w-[18px]
      h-[18px]
      px-1
      rounded-full
      bg-rose-500
      text-[10px]
      flex
      items-center
      justify-center
      text-white
      font-bold
    "
  >
    {unreadCount}
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
className={`absolute top-16 z-[9999] w-[380px] rounded-3xl border shadow-2xl overflow-hidden ${
          lang === "ar"
            ? "left-0"
            : "right-0"
        }`}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
             zIndex: 9999,
        }}
      >
        
         <div
  className="p-5 border-b"
  style={{
    borderColor: "var(--border)",
  }}
>
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-bold text-base">
        Notifications
      </h3>

<p className="text-xs text-slate-500 mt-1">
  {unreadCount} unread notifications
</p>
    </div>

<button
  onClick={markAllNotificationsAsRead}
  className="px-3 py-1 rounded-xl text-xs bg-indigo-500/10 text-indigo-500 font-semibold hover:bg-indigo-500/20"
>
  Mark all read
</button>
  </div>
</div>
        <div className="max-h-[320px] overflow-y-auto">



              {notifications.length === 0 && (
  <div className="p-8 text-center text-slate-500">
    No notifications
  </div>
)}
          {notifications.map((item) => (
       <div
  key={item.id}
  onClick={() =>
    markNotificationAsRead(item.id)
  }
  style={{
    borderColor: "var(--border)",
  }}
  className={`
    mx-3
    my-2
    p-4
    rounded-2xl
    transition-all
    cursor-pointer
    border
    hover:bg-indigo-500/5
    ${
      item.read
        ? "opacity-60"
        : "bg-indigo-500/5"
    }
  `}
>
             <div className="flex items-start gap-3">
   <div className="p-2 rounded-xl bg-indigo-500/10">
  <BellRing
    size={14}
    className="text-indigo-500"
  />
</div>

                <div className="flex-1">
<p className="text-sm font-medium dark:text-white">
  {item.title}
</p>

<p className="text-xs text-slate-500 mt-1">
  {item.message}
</p>

<p className="text-[11px] text-slate-400 mt-2">
  {formatTime(item.createdAt)}
</p>
                </div>

                <button

  onClick={(e) => {

    e.stopPropagation();

    deleteNotification(item.id);

  }}

  className="text-slate-400 hover:text-red-500"

>

  <X size={14} />

</button>
              </div>
            </div>
          ))}
        </div>


<div
  className="p-4 border-t"
  style={{
    borderColor: "var(--border)",
  }}
>
<button
  onClick={clearAllNotifications}
  className="
      w-full
      h-11
      rounded-xl
      bg-red-500
      text-white
      font-semibold
      hover:bg-red-600
      transition-all
    "
>
  Clear All Notifications
</button>
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
  alt="avatar"
  className="
    w-9
    h-9
    rounded-full
    object-cover
  "
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
        className={`absolute top-16 w-64 rounded-3xl border shadow-2xl overflow-hidden  ${
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
  onClick={() => {
    navigate("/dashboard/profile")
    setShowUserMenu(false);
  }}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/[0.04] transition-all text-sm dark:text-white"
>
  <User size={16} />
  Profile
</button>

<button
  onClick={() => {
    navigate("/settings");
    setShowUserMenu(false);
  }}
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