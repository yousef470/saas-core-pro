import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

import { NavLink } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

const menuItems = [
  {
    title: "Dashboard",
    titleAr: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "CRM",
    titleAr: "العملاء",
    icon: Users,
    path: "/crm",
  },
  {
    title: "Analytics",
    titleAr: "التحليلات",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Settings",
    titleAr: "الإعدادات",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar({ isOpen }) {
  const { rtl } = useTheme();

  return (
    <motion.aside

    initial={{
  x: rtl ? 100 : -100,
  opacity: 0,
}}

animate={{
  x: 0,
  opacity: 1,
}}

transition={{
  duration: 0.4,
}}
      className={`
        fixed top-0 z-50
        ${rtl ? "right-0" : "left-0"}
        w-72 h-screen
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : rtl ? "translate-x-full" : "-translate-x-full"}
        lg:translate-x-0
      `}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        borderRightWidth: rtl ? 0 : "1px",
        borderLeftWidth: rtl ? "1px" : 0,
      }}
    >
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-10">
          SaaS Core
        </h2>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "hover:bg-slate-800/40"
                }
              `
              }
            >
              <item.icon size={20} />

              <span className="font-medium">
                {rtl
                  ? item.titleAr
                  : item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}

export default Sidebar;