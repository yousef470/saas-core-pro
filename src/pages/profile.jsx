import useAuth from "../hooks/useAuth";
// بدلاً من السطر القديم، استخدم هذا فقط:
import { User, Shield, Clock } from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const activities = user?.activityLog?.slice(0, 5) || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Manage your identity, subscription, and security.
          </p>
        </div>
        <button className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-lg">
          Edit Profile
        </button>
      </div>

      {/* Hero Card - متناغمة مع كروت الـ CRM */}
      <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
        <img 
          src={user?.avatar} 
          alt="avatar" 
          className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-lg" 
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
          <div className="flex gap-3 mt-3">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
              Premium Plan
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <User className="w-5 h-5 text-indigo-500" /> Account Information
          </h3>
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: "Full Name", val: user?.name },
              { label: "Email", val: user?.email },
              { label: "Plan", val: user?.plan },
              { label: "Role", val: user?.role },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">{item.label}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Sidebar */}
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Security</h3>
          <p className="text-slate-400 text-sm mb-6">Last login: 2 hours ago from Chrome/Windows.</p>
          <button className="w-full py-3 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-all">
            Update Password
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
          <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
        </h3>
        <div className="grid gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-4" />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{activity.action}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// تأكد من وجود هذا السطر في أسفل الملف
export default Profile;