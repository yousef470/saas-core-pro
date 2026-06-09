import useAuth from "../hooks/useAuth";
// بدلاً من السطر القديم، استخدم هذا فقط:
import { User, Shield, Clock } from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const activities = user?.activityLog?.slice(0, 5) || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your identity, subscription, and security.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          Edit Profile
        </button>
      </div>

      {/* Hero Card with Gradient Border */}
      <div className="relative p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-[22px] flex items-center gap-6">
          <img src={user?.avatar} alt="avatar" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex gap-3 mt-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">Premium Plan</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
                  <p className="text-slate-400 text-xs font-bold uppercase">{item.label}</p>
                  <p className="font-semibold text-slate-800 mt-1">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
            <p className="text-slate-400 text-sm mb-4">Last login: 2 hours ago from Chrome/Windows.</p>
            <button className="w-full py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-all">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
        </h3>
        <div className="grid gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-4" />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{activity.action}</p>
                <p className="text-xs text-slate-500">{activity.description}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// تأكد من وجود هذا السطر في أسفل الملف
export default Profile;