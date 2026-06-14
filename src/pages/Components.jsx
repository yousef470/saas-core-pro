
import { motion } from "framer-motion";
import { Mail, Bell, Settings, Search, CheckCircle, AlertTriangle, Info } from "lucide-react";

function Components() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-12 pb-20"
    >
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black mb-2">Design System</h1>
        <p className="text-slate-400">مجموعة العناصر البريميوم الخاصة بنظام Pro SaaS.</p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><div className="w-1.5 h-6 bg-indigo-500 rounded-full"/> الأزرار (Buttons)</h2>
        <div className="flex flex-wrap gap-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Primary Button</button>
          <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10">Secondary</button>
          <button className="px-8 py-3 border-2 border-dashed border-slate-600 text-slate-400 rounded-2xl font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all">Dashed Outline</button>
          <button className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Settings size={22} /></button>
        </div>
      </section>

      {/* Input Fields Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><div className="w-1.5 h-6 bg-emerald-500 rounded-full"/> حقول الإدخال (Inputs)</h2>
        <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="name@company.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 ml-2">Search Project</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Type keywords..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Badges & Status Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><div className="w-1.5 h-6 bg-amber-500 rounded-full"/> الشارات (Badges)</h2>
        <div className="flex flex-wrap gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-black uppercase tracking-tighter"><CheckCircle size={14} /> Completed</div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-black uppercase tracking-tighter"><AlertTriangle size={14} /> In Progress</div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 text-red-500 rounded-full text-xs font-black uppercase tracking-tighter"><Bell size={14} /> Priority</div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-black uppercase tracking-tighter"><Info size={14} /> Info</div>
        </div>
      </section>

      {/* Glass Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><div className="w-1.5 h-6 bg-pink-500 rounded-full"/> البطاقات (Cards)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 transition-transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-white/70 text-sm mb-6">Get access to unlimited projects and analytics.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-xl font-bold">Start Now</button>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <h3 className="font-bold mb-2">Stat Card</h3>
            <div className="text-3xl font-black mb-1">2,482</div>
            <p className="text-emerald-500 text-xs font-bold">+12.5% Incr.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Components;