import useAuth from "../hooks/useAuth";
import { User, Shield, Clock, CreditCard, Settings, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme"; // استخدام نفس الـ hook الخاص بمشروعك
import Avatar from "../components/ui/Avatar";

function Profile() {
  const { t } = useTheme(); // جلب كائن الترجمة بنفس الطريقة المستخدمة في بقية الصفحات
  const { user } = useAuth();
  const activities = user?.activityLog?.slice(0, 5) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t.profilePage.header.title}
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {t.profilePage.header.subtitle}
          </p>
        </div>
        <Link
          to="/settings"
          className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
        >
          <Settings className="w-4 h-4" /> {t.profilePage.header.btnSettings}
        </Link>
      </div>

      {/* 2. Hero Card & Profile Progress */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main User Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size={96}
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {user?.name || t.profilePage.hero.defaultName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {user?.email || t.profilePage.hero.defaultEmail}
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-slate-200/40 dark:bg-slate-700/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 rounded-lg text-xs font-bold uppercase tracking-wider">
                {user?.plan || t.profilePage.hero.starterPlan} {t.profilePage.hero.planLabel}
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-lg text-xs font-bold uppercase tracking-wider">
                {t.profilePage.hero.statusActive}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-sm dark:text-white">{t.profilePage.progress.title}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">75%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" style={{ width: "75%" }} />
          </div>
          <p className="text-xs text-slate-400 mt-3">{t.profilePage.progress.description}</p>
        </div>
      </div>

      {/* 3. Main Info & Security Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Info Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-5 h-5 slate" /> {t.profilePage.info.title}
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: t.profilePage.info.fields.fullName, val: user?.name || t.profilePage.info.fields.notProvided },
                { label: t.profilePage.info.fields.email, val: user?.email || t.profilePage.info.fields.notProvided },
                { label: t.profilePage.info.fields.phone, val: user?.phone || t.profilePage.info.fields.notProvided },
                { label: t.profilePage.info.fields.role, val: user?.role || t.profilePage.info.fields.defaultRole },
              ].map((item, index) => (
                <div key={index} className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1 text-sm break-all">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Sidebar */}
        <div className="bg-white dark:bg-slate-950 
                        text-slate-900 dark:text-white
                        p-6 md:p-8 rounded-3xl shadow-sm
                        border border-slate-200 dark:border-slate-800
                        flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Shield className="w-5 h-5 text-indigo-400" /> {t.profilePage.security.title}
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 
                            p-4 rounded-xl 
                            border border-slate-200 dark:border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">{t.profilePage.security.lastLogin}</p>
              <p className="text-sm font-semibold text-indigo-300 mt-1">{user?.lastLogin || t.profilePage.security.noHistory}</p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              {t.profilePage.security.description}
            </p>
          </div>
          <Link
            to="/settings"
            className="block w-full text-center mt-8 py-3
                       bg-indigo-600 text-white
                       rounded-xl text-sm font-semibold
                       hover:bg-indigo-700
                       transition-all shadow-md"
          >
            {t.profilePage.security.btnUpdatePassword}
          </Link>
        </div>
      </div>

      {/* 4. Quick Links Navigation Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: t.profilePage.quickLinks.settings, path: "/settings", icon: <Settings className="w-5 h-5 slate" /> },
          { title: t.profilePage.quickLinks.billing, path: "/billing", icon: <CreditCard className="w-5 h-5 text-emerald-500" /> },
          { title: t.profilePage.quickLinks.privacy, path: "/settings", icon: <Shield className="w-5 h-5 text-amber-500" /> }
        ].map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                {link.icon}
              </div>
              <h4 className="font-bold text-sm dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {link.title}
              </h4>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* 5. Recent Activity Log */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          <Clock className="w-5 h-5 slate" /> {t.profilePage.activity.title}
        </h3>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start sm:items-center p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-950/50 transition-all gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 sm:mt-0 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{activity.action}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
            {t.profilePage.activity.empty}
          </div>
        )}
      </div>

    </div>
  );
}

export default Profile;