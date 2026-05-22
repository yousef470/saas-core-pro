import { useState } from "react";
import useTheme from "../hooks/useTheme";

function CRM() {
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const customers = [
    { id: 1, name: "Ahmed Ali", email: "ahmed@example.com", plan: "Enterprise", status: "active", date: "May 10, 2026", price: "$199/mo" },
    { id: 2, name: "Sarah Connor", email: "sarah@example.com", plan: "Pro", status: "active", date: "May 12, 2026", price: "$49/mo" },
    { id: 3, name: "John Doe", email: "john@example.com", plan: "Starter", status: "pending", date: "May 15, 2026", price: "$19/mo" },
    { id: 4, name: "Yasmin Omar", email: "yasmin@example.com", plan: "Pro", status: "canceled", date: "Apr 20, 2026", price: "$49/mo" },
    { id: 5, name: "Michael Scott", email: "michael@example.com", plan: "Enterprise", status: "active", date: "May 01, 2026", price: "$199/mo" },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // دالة لتحديد ألوان ورموز الخطط المختلفة
  const getPlanStyle = (plan) => {
    switch(plan.toLowerCase()) {
      case 'enterprise': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'pro': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      
      {/* 1️⃣ الهيدر العلوي بنظام الـ Premium Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar" ? "إدارة مجتمع العملاء" : "Customer Ecosystem"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {lang === "ar" ? "التحكم الكامل في الاشتراكات، الحالات، والتدفق المالي للعملاء." : "Full control over subscriptions, lifecycle stages, and user revenue metrics."}
          </p>
        </div>
        
        <button className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm shadow-xl shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}
        </button>
      </div>

      {/* 2️⃣ بار التحكم والبحث بتصميم الـ Floating Card */}
      <div 
        className="p-3.5 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-md shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        {/* حقل البحث الانسيابي مع أيقونة مدمجة */}
        <div className="relative w-full md:w-80 flex items-center">
          <svg className="w-4 h-4 absolute start-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن عميل بالاسم أو الإيميل..." : "Search across name, email, plan..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 ps-11 pe-4 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-900/30 focus:outline-none focus:border-indigo-500 focus:bg-transparent transition-all"
            style={{ color: "var(--text-main)", borderColor: "var(--border)" }}
          />
        </div>

        {/* أزرار التصفية الفاخرة بنظام الكبسولات المفرغة */}
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", labelAr: "كل المشتركين", labelEn: "All Users" },
            { id: "active", labelAr: "النشطين", labelEn: "Active" },
            { id: "pending", labelAr: "قيد الانتظار", labelEn: "Pending" },
            { id: "canceled", labelAr: "الملغية حساباتهم", labelEn: "Canceled" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-4 h-10 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                statusFilter === btn.id 
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {lang === "ar" ? btn.labelAr : btn.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 3️⃣ الجدول بتصميمه الجديد المتطور (Frameless Table Style) */}
      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm text-inline-start border-collapse">
          {/* هيدر الجدول النحيف والأنيق */}
          <thead className="text-[11px] font-bold uppercase tracking-wider border-b text-slate-400 dark:text-slate-500" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.01)" }}>
            <tr>
              <th className="px-6 py-4 font-bold">{lang === "ar" ? "تفاصيل المستخدم" : "User Profiles"}</th>
              <th className="px-6 py-4 font-bold">{lang === "ar" ? "مستوى الخطة" : "Subscription Tier"}</th>
              <th className="px-6 py-4 font-bold">{lang === "ar" ? "تاريخ التفعيل" : "Billing Date"}</th>
              <th className="px-6 py-4 font-bold">{lang === "ar" ? "العائد المالي" : "MRR Impact"}</th>
              <th className="px-6 py-4 font-bold">{lang === "ar" ? "حالة الاشتراك" : "Status"}</th>
              <th className="px-6 py-4 font-bold text-center">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          
          <tbody className="divide-y" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-all duration-200"
                >
                  {/* عمود الهوية الشخصية */}
                  <td className="px-6 py-4.5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{customer.name}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{customer.email}</span>
                    </div>
                  </td>

                  {/* عمود الخطة المطور */}
                  <td className="px-6 py-4.5">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${getPlanStyle(customer.plan)}`}>
                      {customer.plan}
                    </span>
                  </td>

                  {/* تاريخ الاشتراك */}
                  <td className="px-6 py-4.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    {customer.date}
                  </td>

                  {/* القيمة المالية الإيجابية للمشروع */}
                  <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-slate-100">
                    {customer.price}
                  </td>

                  {/* كبسولة الحالة بنظام الـ Glow الخفيف */}
                  <td className="px-6 py-4.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      customer.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      customer.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        customer.status === "active" ? "bg-emerald-500" :
                        customer.status === "pending" ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                      {customer.status === "active" ? (lang === "ar" ? "نشط" : "Active") :
                       customer.status === "pending" ? (lang === "ar" ? "معلق" : "Pending") :
                       (lang === "ar" ? "ملغي" : "Canceled")}
                    </span>
                  </td>

                  {/* أزرار الأكشن السريعة والفاخرة */}
                  <td className="px-6 py-4.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="h-8 px-3 rounded-lg border text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100" style={{ borderColor: "var(--border)", color: "var(--text-main)" }}>
                        {lang === "ar" ? "تعديل" : "Edit"}
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  {lang === "ar" ? "لم نجد أي مستخدم يطابق بحثك الحالي." : "No users match your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4️⃣ الباجينيشن السفلي النظيف */}
      <div className="flex justify-between items-center text-xs px-2" style={{ color: "var(--text-muted)" }}>
        <p>{lang === "ar" ? "إجمالي الصفوف: 5 مستخدمين" : "Displaying 5 institutional profiles"}</p>
        <div className="flex gap-2">
          <button className="h-9 px-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium" style={{ borderColor: "var(--border)", color: "var(--text-main)" }}>
            {lang === "ar" ? "السابق" : "Back"}
          </button>
          <button className="h-9 px-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium" style={{ borderColor: "var(--border)", color: "var(--text-main)" }}>
            {lang === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default CRM;