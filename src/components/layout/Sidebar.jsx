import { Link, useLocation } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

import {
  LayoutDashboard,
  Users,
  BarChart3,
  UserCog,
  CreditCard,
  Settings,

  ChevronRight,

  KanbanSquare,
  MessageCircle,
  CalendarDays,
  Boxes,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";

import { motion } from "framer-motion";

function Sidebar({ closeMenu }) {
  const { lang, t } = useTheme();
  const location = useLocation();

  // تعريف القائمة باستخدام الأيقونات الجديدة
const menuItems = [
  {
    section:
      lang === "ar"
        ? "الرئيسية"
        : "MAIN",

    items: [
      {
        path: "/dashboard",
        name:
          t.dashboard || "Dashboard",
        icon: (
          <LayoutDashboard size={20} />
        ),
      },

      {
        path: "/dashboard/analytics",
        name:
          t.analytics ||
          "Analytics",
        icon: <BarChart3 size={20} />,
      },

      {
        path: "/dashboard/crm",
        name: t.crm || "CRM",
        icon: <Users size={20} />,
      },
    ],
  },

  {
    section:
      lang === "ar"
        ? "الإدارة"
        : "MANAGEMENT",

    items: [
      {
        path: "/dashboard/users",
        name: t.users || "Users",
        icon: <UserCog size={20} />,
      },

      {
        path: "/dashboard/billing",
        name:
          t.billing || "Billing",
        icon: (
          <CreditCard size={20} />
        ),
      },

      {
        path: "/dashboard/settings",
        name:
          t.settings ||
          "Settings",
        icon: <Settings size={20} />,
      },
    ],
  },

  {
    section:
      lang === "ar"
        ? "التطبيقات"
        : "APPS",

    items: [
      {
        path: "/dashboard/kanban",
        name: "Kanban",
        icon: <KanbanSquare size={20} />,
      },

      {
        path: "/dashboard/chat",
        name: "Chat",
        icon: <MessageCircle size={20} />,
      },

      {
        path: "/dashboard/calendar",
        name: t.calendar,
        icon: <CalendarDays size={20} />,
      },

      {
        path: "/dashboard/components",
        name: "Components",
        icon: <Boxes size={20} />,
      },

      {
        path: "/dashboard/products",
        name: t.products,
        icon: <ShoppingBag size={20} />,
      },

      {
        path: "/dashboard/orders",
        name: t.orders,
        icon: <ClipboardList size={20} />,
      },
    ],
  },
];

  return (
    <aside 
      className="w-full h-full p-4 transition-all flex flex-col"
      style={{ background: "var(--bg-sidebar)", borderColor: "var(--border)" }}
    >
      {/* اللوجو */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <span className="font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none" style={{ color: "var(--text-main)" }}>SaaS-Core</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">{t.premium}</p>
          </div>
        </div>
        
        {closeMenu && (
          <button onClick={closeMenu} className="lg:hidden p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
            {/* أيقونة إغلاق بسيطة */}
            <span className="text-xl">×</span>
          </button>
        )}
      </div>
      
      {/* الروابط */}
     <nav className="flex-1 space-y-7 overflow-y-auto pr-1">
  {menuItems.map((group) => (
    <div key={group.section}>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-3">
        {group.section}
      </p>

      <div className="space-y-1">
        {group.items.map((item) => {
          const isActive =
            location.pathname ===
            item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
            >
              <motion.div
                whileHover={{
                  x:
                    lang === "ar"
                      ? -4
                      : 4,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all overflow-hidden ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-500"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="ActiveSidebar"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-600/20"
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {item.icon}
                  </div>

                  <span className="text-sm font-semibold">
                    {item.name}
                  </span>
                </div>

                <ChevronRight
                  size={16}
                  className={`relative z-10 transition-all ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  ))}
</nav>



      {/* الـ Footer للسايدبار */}
      
    </aside>
  );
}

export default Sidebar;