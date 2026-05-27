import { useState, useEffect } from "react";
import useTheme from "../hooks/useTheme";

function CRM() {
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // بيانات الـ State مع تحميلها من الـ LocalStorage
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("crm_customers");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Ahmed Ali", email: "ahmed@example.com", plan: "Enterprise", status: "active", date: "May 10, 2026", price: "$199/mo" },
      { id: 2, name: "Sarah Connor", email: "sarah@example.com", plan: "Pro", status: "active", date: "May 12, 2026", price: "$49/mo" },
      { id: 3, name: "John Doe", email: "john@example.com", plan: "Starter", status: "pending", date: "May 15, 2026", price: "$19/mo" },
      { id: 4, name: "Yasmin Omar", email: "yasmin@example.com", plan: "Pro", status: "canceled", date: "Apr 20, 2026", price: "$49/mo" },
      { id: 5, name: "Michael Scott", email: "michael@example.com", plan: "Enterprise", status: "active", date: "May 01, 2026", price: "$199/mo" },
    ];
  });

  const [formData, setFormData] = useState({ name: "", email: "", plan: "Pro", status: "active", price: "$49/mo" });

  // حفظ البيانات تلقائياً في LocalStorage عند تغير الـ customers
  useEffect(() => {
    localStorage.setItem("crm_customers", JSON.stringify(customers));
  }, [customers]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    const newUser = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setCustomers([newUser, ...customers]);
    setFormData({ name: "", email: "", plan: "Pro", status: "active", price: "$49/mo" });
    setIsModalOpen(false);
  };

  const getPlanStyle = (plan) => {
    switch(plan.toLowerCase()) {
      case 'enterprise': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'pro': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      
      {/* الهيدر العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar" ? "إدارة مجتمع العملاء" : "Customer Ecosystem"}
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {lang === "ar" ? "التحكم الكامل في الاشتراكات، الحالات، والتدفق المالي." : "Full control over subscriptions and revenue metrics."}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm shadow-xl shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}
        </button>
      </div>

      {/* بار البحث والفلترة */}
      <div className="p-3.5 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-md shadow-sm bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن عميل..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 ps-11 pe-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-900/30 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "active", "pending", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 h-10 rounded-xl text-xs font-semibold transition-all shrink-0 ${statusFilter === status ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-start border-collapse">
          <thead className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4">{lang === "ar" ? "المستخدم" : "User"}</th>
              <th className="px-6 py-4">{lang === "ar" ? "الخطة" : "Plan"}</th>
              <th className="px-6 py-4">{lang === "ar" ? "التاريخ" : "Date"}</th>
              <th className="px-6 py-4">{lang === "ar" ? "السعر" : "Price"}</th>
              <th className="px-6 py-4">{lang === "ar" ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium">{customer.name}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getPlanStyle(customer.plan)}`}>{customer.plan}</span></td>
                <td className="px-6 py-4 text-slate-500">{customer.date}</td>
                <td className="px-6 py-4 font-bold">{customer.price}</td>
                <td className="px-6 py-4 text-xs font-semibold">{customer.status.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* المودال */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "إضافة مستخدم" : "Add User"}</h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input required placeholder="Name" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" onChange={e => setFormData({...formData, email: e.target.value})} />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white">{lang === "ar" ? "حفظ" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRM;