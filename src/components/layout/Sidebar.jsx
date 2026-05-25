import { Link, useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme"; 
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  UserCog, 
  CreditCard, 
  Settings, 
  ArrowLeftRight 
} from "lucide-react"; 

function Sidebar({ closeMenu }) {
  const { lang, t } = useTheme();
  const location = useLocation();

  // تعريف القائمة باستخدام الأيقونات الجديدة
  const menuItems = [
    { path: "/dashboard", name: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { path: "/dashboard/crm", name: t.crm || "CRM", icon: <Users size={20} /> },
    { path: "/dashboard/analytics", name: t.analytics || "Analytics", icon: <BarChart3 size={20} /> },
    { path: "/dashboard/users", name: t.users || "Users", icon: <UserCog size={20} /> },
    { path: "/dashboard/billing", name: t.billing || "Billing", icon: <CreditCard size={20} /> },
    { path: "/dashboard/settings", name: t.settings || "Settings", icon: <Settings size={20} /> },
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
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* الـ Footer للسايدبار */}
      <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowLeftRight size={20} />
          <span>{lang === "ar" ? "الموقع الرئيسي" : "Main Website"}</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;