import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  // مصفوفة اللينكات النظيفة بدون تكرار
  const menuItems = [
    {
      path: "/",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      labelAr: "لوحة التحكم",
    },
    {
      path: "/crm",
      icon: <Users size={20} />,
      label: "CRM & Leads",
      labelAr: "العملاء",
    },
    {
      path: "/analytics",
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      labelAr: "التحليلات",
    },
    {
      path: "/billing",
      icon: <CreditCard size={20} />,
      label: "Billing",
      labelAr: "الاشتراكات",
    },
    {
      path: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
      labelAr: "الإعدادات",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* الخلفية الشفافة (Overlay) للموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* الـ Sidebar Container مع ضبط كامل للـ RTL والـ Responsive */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col border-e transition-all duration-300 ease-in-out
          lg:ltr:left-0 lg:rtl:right-0
          ${
            isOpen
              ? "ltr:left-0 rtl:right-0 shadow-2xl"
              : "ltr:-left-72 rtl:-right-72"
          }
        `}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {/* الهيدر (اللوجو وزرار القفل) */}
        <div
          className="h-20 px-6 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              N
            </div>
            <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Saas-core Pro
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* لينكات التنقل */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path} // المفتاح بقا فريد ومستحيل يضرب إيرور
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }
                `}
              >
                <span
                  className={`transition-transform duration-200 group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* الزرار السفلي */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;