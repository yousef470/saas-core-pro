import { Link, useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme"; 

function Sidebar() {
  const { lang, t } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      name: t.dashboard, 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      path: "/crm",
      name: lang === "ar" ? "إدارة العملاء" : "CRM", 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: "/analytics",
      name: t.salesAnalytics || (lang === "ar" ? "التحليلات" : "Analytics"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      path: "/settings",
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
      className="w-64 min-h-[calc(100vh-64px)] p-4 border-e transition-all shrink-0 flex flex-col"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border)",
      }}
    >
    {/* سيكشن اللوجو المطور لـ SaaS-Core (ثابت بالإنجليزي) */}
<div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-dashed" style={{ borderColor: "var(--border)" }}>
  
  {/* اللوجو الـ SVG الـ Premium */}
  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4L4 8l8 4 8-4-8-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l8 4 8-4M4 16l8 4 8-4" />
    </svg>
  </div>
  
  {/* نصوص الهوية - الاسم ثابت بالإنجليزية */}
  <div className="flex flex-col min-w-0">
    <span className="font-bold text-base tracking-tight truncate" style={{ color: "var(--text-main)" }}>
      SaaS-Core
    </span>
    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70" style={{ color: "var(--text-muted)" }}>
      {lang === "ar" ? "لوحة تحكم احترافية" : "Premium Admin"}
    </span>
  </div>
</div>

      {/* قائمة التنقل */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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
    </aside>
  );
}

export default Sidebar;