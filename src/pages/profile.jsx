import useAuth from "../hooks/useAuth";
import { User, Shield, Clock, CreditCard, Settings, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useAuth();
  const activities = user?.activityLog?.slice(0, 5) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Manage your identity,  security configurations.
          </p>
        </div>
        <Link
          to="/settings"
          className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
        >
          <Settings className="w-4 h-4" /> Account Settings
        </Link>
      </div>

      {/* 2. Hero Card & Profile Progress */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main User Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={user?.avatar || "https://i.pravatar.cc/150"} 
            alt="avatar" 
            className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md" 
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || "User Name"}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email || "user@example.com"}</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 rounded-lg text-xs font-bold uppercase tracking-wider">
                {user?.plan || "Starter"} Plan
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-lg text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-sm dark:text-white">Profile Completion</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">75%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" style={{ width: "75%" }} />
          </div>
          <p className="text-xs text-slate-400 mt-3">Complete your profile details to unlock all features.</p>
        </div>
      </div>

      {/* 3. Main Info & Security Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Info Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-5 h-5 text-indigo-500" /> Account Information
            </h3>
{/* تم تحديث هذا القسم فقط داخل الكود ليتضمن رقم الهاتف */}
<div className="grid sm:grid-cols-2 gap-6">
  {[
    { label: "Full Name", val: user?.name || "Not Provided" },
    { label: "Email Address", val: user?.email || "Not Provided" },
    { label: "Phone Number", val: user?.phone || "Not Provided" }, // السطر الجديد هنا
  
    { label: "Role Account", val: user?.role || "User" },
  ].map((item) => (
    <div key={item.label} className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
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
              <Shield className="w-5 h-5 text-indigo-400" /> Security Control
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 
                p-4 rounded-xl 
                border border-slate-200 dark:border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">Last Login Session</p>
              <p className="text-sm font-semibold text-indigo-300 mt-1">{user?.lastLogin || "No active history"}</p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              We recommend updating your credentials periodically to maintain top-tier account defense.
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
            Update Password
          </Link>
        </div>
      </div>

      {/* 4. Quick Links Navigation Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "Account Settings", path: "/settings", icon: <Settings className="w-5 h-5 text-indigo-500" /> },
          { title: "Billing & Invoices", path: "/billing", icon: <CreditCard className="w-5 h-5 text-emerald-500" /> },
          { title: "Security & Privacy", path: "/settings", icon: <Shield className="w-5 h-5 text-amber-500" /> }
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
          <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity Log
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
            No recent activity recorded for this account.
          </div>
        )}
      </div>

    </div>
  );
}

export default Profile;