import { Link, useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme"; 
import { ArrowLeftRight } from "lucide-react"; 

function Sidebar({ closeMenu }) { // closeMenu كـ Prop لقفل القائمة في الموبايل
  const { lang, t } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      name: t.dashboard, 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/crm",
      name: lang === "ar" ? "إدارة العملاء" : "CRM", 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/analytics",
      name: t.salesAnalytics || (lang === "ar" ? "التحليلات" : "Analytics"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/users",
      name: lang === "ar" ? "إدارة المستخدمين" : "Users Management",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/billing",
      name: lang === "ar" ? "الاشتراكات والفواتير" : "Billing & Plans",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/settings",
      name: lang === "ar" ? "الإعدادات" : "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside 
      className="w-full h-full p-4 border-e transition-all flex flex-col"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border)",
      }}
    >
      {/* سيكشن اللوجو المطور لـ SaaS-Core */}
      <div className="flex items-center justify-between mb-6 border-b border-dashed pb-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 px-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4L4 8l8 4 8-4-8-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l8 4 8-4M4 16l8 4 8-4" />
            </svg>
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base tracking-tight truncate" style={{ color: "var(--text-main)" }}>
              SaaS-Core
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70 truncate" style={{ color: "var(--text-muted)" }}>
              {lang === "ar" ? "لوحة تحكم احترافية" : "Premium Admin"}
            </span>
          </div>
        </div>

        {closeMenu && (
          <button 
            onClick={closeMenu} 
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* قائمة التنقل (مرنة لتأخذ باقي المساحة المتاحة) */}
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          // عدلت المقارنة للتأكد من مطابقة المسار بشكل صحيح دائمًا
          const isActive = location.pathname === item.path || location.pathname === `${item.path}/`;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu} 
              className={`flex items-center gap-3 px-4 h-12 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              style={{
                color: isActive ? "#fff" : "var(--text-main)",
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🔽 هنا الكعب المستقل (Footer) للسايد بار من تحت خالص بره قائمة الـ nav */}
      <div className="pt-4 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 w-full px-4 h-12 rounded-xl text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 group"
          style={{ color: "var(--text-main)" }}
        >
          <ArrowLeftRight 
            size={18} 
            className="text-slate-400 group-hover:text-indigo-500 transition-colors" 
          />
          <span>
            {lang === "ar" ? "الموقع الرئيسي" : "Main Website"}
          </span>
        </Link>
      </div>

    </aside>
  );
}

export default Sidebar;