import { useState } from "react";
import { motion } from "framer-motion";
import useTheme from "../hooks/useTheme";
import { Plus, Search, Shield, Trash2, Edit2 } from "lucide-react";

function Users() {
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات وهمية ممتازة ومناسبة للوحة تحكم SaaS
  const usersData = [
    { id: 1, name: "يوسف أحمد", email: "yousef@nexora.com", role: "Owner", status: "Active", avatar: "Y" },
    { id: 2, name: "أحمد محمد", email: "ahmed@example.com", role: "Admin", status: "Active", avatar: "A" },
    { id: 3, name: "سارة كريم", email: "sara@example.com", role: "Editor", status: "Suspended", avatar: "S" },
    { id: 4, name: "عمر خالد", email: "omar@example.com", role: "User", status: "Active", avatar: "O" },
  ];

  // فلترة المستخدمين بناءً على البحث
  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* هيدر الصفحة والـ Action الرئيسي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === "ar" ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === "ar" ? "إدارة أعضاء الفريق، الصلاحيات وحالات الحسابات ديناميكياً." : "Manage team members, roles, and account statuses dynamically."}
          </p>
        </div>

        <button className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/15 shrink-0">
          <Plus size={18} />
          <span>{lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}</span>
        </button>
      </div>

      {/* شريط أدوات البحث والفلترة بتصميم زجاجي ناعم */}
      <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 max-w-md transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === "ar" ? "البحث عن اسم أو بريد إلكتروني..." : "Search name or email..."}
            className="bg-transparent outline-none text-sm w-full text-slate-800 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* حاوية الجدول المتجاوبة بالكامل تمنع الـ Overflow الأفقي */}
      <div className="w-full rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm">
                <th className="p-4 text-start">{lang === "ar" ? "المستخدم" : "User"}</th>
                <th className="p-4 text-start">{lang === "ar" ? "الصلاحية" : "Role"}</th>
                <th className="p-4 text-start">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-4 text-center">{lang === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* عمود المستخدم (الاسم والإيميل والـ Avatar) */}
                  <td className="p-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shadow-sm shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* عمود الصلاحية بتصميم شارات ملونة شيك */}
                  <td className="p-4 text-start">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Shield size={12} className="text-indigo-500" />
                      {user.role}
                    </div>
                  </td>

                  {/* عمود الحالة مع نقط تتبع مضيئة */}
                  <td className="p-4 text-start">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      user.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                        : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {lang === "ar" ? (user.status === "Active" ? "نشط" : "معطل") : user.status}
                    </span>
                  </td>

                  {/* عمود أزرار التحكم الفورية */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Users;