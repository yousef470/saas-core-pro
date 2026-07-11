import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../hooks/useTheme";


import { AuthContext } from "../context/auth-context"; 


import { getRevenueStats } from "../services/crmservice";
import { getOrders } from "../services/orderService";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

function Billing() {
  const { lang } = useTheme();
  

  const { users } = useContext(AuthContext) || { users: [] };


  const activeStaffOnly = (users || []).filter(
    (u) => u.status === "Active" && u.role?.toLowerCase() !== "owner"
  );


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState(() => {
    const savedCard = localStorage.getItem("saas_merchant_card");
    return savedCard ? JSON.parse(savedCard) : { number: "4242", expiry: "12/28" };
  });
  
  const [inputNumber, setInputNumber] = useState("");
  const [inputExpiry, setInputExpiry] = useState("");

 
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || ""; 
    setInputNumber(formattedValue);
  };


  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setInputExpiry(value);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!inputNumber || !inputExpiry) return;
    
   
    const lastFour = inputNumber.replace(/\s+/g, "").slice(-4) || "4242";
    const newCard = { number: lastFour, expiry: inputExpiry };
    
    setCardInfo(newCard);
    localStorage.setItem("saas_merchant_card", JSON.stringify(newCard));
    setIsModalOpen(false);
    setInputNumber("");
    setInputExpiry("");
  };

 
  const crmStats = getRevenueStats() || { customers: [], totalRevenue: 0, pendingRevenue: 0, activeCustomers: 0, totalCustomers: 0 };
  const allOrders = getOrders() || [];

 
  const completedOrders = allOrders.filter((o) => o.status === "Completed");
  const pendingOrders = allOrders.filter((o) => o.status === "Pending");

  const cleanAmount = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return Number(val.replace(/[^0-9.-]/g, "")) || 0;
  };

  const productsRevenue = completedOrders.reduce(
    (sum, o) => sum + cleanAmount(o.total),
    0
  );
  
  const productsPending = pendingOrders.reduce(
    (sum, o) => sum + cleanAmount(o.total),
    0
  );

 
  const totalPayrollExpenses = activeStaffOnly.reduce((acc, curr) => {
    const base = Number(curr.baseSalary || 0);
    const allow = Number(curr.allowances || 0);
    const deduct = Number(curr.deductions || 0);
    return acc + (base + allow - deduct);
  }, 0);


  const grossIncome = crmStats.totalRevenue + productsRevenue;
  const netAvailable = grossIncome - totalPayrollExpenses;

  const revenue = {
    subscriptions: crmStats.totalRevenue,
    products: productsRevenue,          
    payrollExpenses: totalPayrollExpenses,
    pending: crmStats.pendingRevenue + productsPending, 
    available: netAvailable >= 0 ? netAvailable : 0,
  };


  const subscriptionInvoices = (crmStats.customers || []).map((c) => ({
    id: c.invoiceId || `INV-SUB-${c.id}`,
    customer: c.name,
    type: lang === "ar" ? "اشتراك CRM" : "CRM Subscription",
    date: c.date || "May 1, 2026",
    rawDate: c.createdAt ? new Date(c.createdAt) : new Date(),
    amount: c.revenue || 0,
    txType: "Income",
    status: c.status === "active" ? "Paid" : c.status === "pending" ? "Pending" : "Cancelled",
  }));

  const orderInvoices = allOrders.map((o) => ({
    id: o.id || `ORD-${o.orderNumber}`,
    customer: o.customer || "Walk-in Customer",
    type: lang === "ar" ? "بيع منتج" : "Product Sale",
    date: o.date || "May 1, 2026",
    rawDate: new Date(o.date || new Date()),
    amount: cleanAmount(o.total),
    txType: "Income",
    status: o.status === "Completed" ? "Paid" : o.status === "Pending" ? "Pending" : "Cancelled",
  }));

  const payrollInvoices = activeStaffOnly
    .filter(u => u.baseSalary || u.allowances)
    .map((u) => {
      const netSalary = Number(u.baseSalary || 0) + Number(u.allowances || 0) - Number(u.deductions || 0);
      return {
        id: `PAY-${u.id}-${new Date().getMonth() + 1}`,
        customer: u.name,
        type: lang === "ar" ? "راتب موظف" : "Staff Payroll",
        date: new Date().toLocaleDateString(lang === "ar" ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rawDate: new Date(),
        amount: netSalary,
        txType: "Expense",
        status: "Paid",
      };
    });

  const dynamicInvoices = [...subscriptionInvoices, ...orderInvoices, ...payrollInvoices].sort(
    (a, b) => b.rawDate - a.rawDate
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]";
      default:
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)]";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-8 max-w-[1600px] mx-auto px-1 ${lang === "ar" ? "text-right" : "text-left"}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Title Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar" ? "الاشتراكات والتدفقات المالية الموحدة" : "Billing & Dynamic Revenue Ledger"}
          </h1>
          <p className="text-sm mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>
            {lang === "ar"
              ? "متابعة حية متكاملة تربط مبيعات المنتجات، اشتراكات الـ CRM، ومصاريف رواتب الموظفين ديناميكياً."
              : "Realtime synchronized ecosystem blending CRM Subscriptions, Product Sales, and Team Payroll."}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {lang === "ar" ? "متصل حياً بالنظام الموحد" : "Live Ledger Synced"}
        </div>
      </motion.div>

      {/* Grid: Overview Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Analytics Summary Card */}
        <div
          className="p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
          <h2 className="text-lg font-bold mb-6 tracking-wide text-slate-800 dark:text-slate-100">
            {lang === "ar" ? "ملخص نظام العمل والعملاء" : "Ecosystem & Customer Summary"}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/5">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{lang === "ar" ? "المشتركين الحاليين" : "Active Customers Count"}</p>
                <h3 className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">{crmStats.activeCustomers}</h3>
                <span className="text-[11px] text-slate-400 font-normal">{lang === "ar" ? "حساب نشط" : "Active accounts"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/5">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{lang === "ar" ? "القوة البشرية النشطة" : "Active Core Staff"}</p>
                <h3 className="text-2xl font-black mt-1 text-indigo-500">
                  {activeStaffOnly.length}
                </h3>
                <span className="text-[11px] text-indigo-400/80 font-normal">{lang === "ar" ? "موظف (دون المالك)" : "Staff (Excl. Owner)"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{lang === "ar" ? "إجمالي مجتمع العملاء المسجلين" : "Total Ecosystem Size"}</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-700 dark:text-slate-300">{crmStats.totalCustomers} {lang === "ar" ? "ملف عميل متصل" : "Total Leads Logged"}</p>
              </div>
              <div className="text-end">
                <p className="text-xs text-slate-400 dark:text-slate-500">{lang === "ar" ? "مزامنة البيانات الحية" : "Sync Frequency"}</p>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5 justify-end">
                  {lang === "ar" ? "لحظية مدمجة" : "Realtime dynamic"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Payment Info Gateway View */}
        <div
          className="p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <h2 className="text-lg font-bold mb-6 tracking-wide text-slate-800 dark:text-slate-100">
            {lang === "ar" ? "بوابة التسوية وسحب الأرباح" : "Primary Payout Settlement"}
          </h2>
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/5 relative bg-gradient-to-b from-slate-500/[0.01] to-slate-500/[0.03]" style={{ background: "var(--bg-main)" }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{lang === "ar" ? "الحساب البنكي المعتمد للمشروع" : "Primary Merchant Settler"}</p>
                <h3 className="text-xl font-bold mt-2 tracking-wider text-slate-800 dark:text-white">Visa •••• {cardInfo.number}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{lang === "ar" ? "تاريخ الانتهاء:" : "Expires:"} {cardInfo.expiry}</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-slate-500/10 rounded-md text-slate-500">
                Merchant
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-500 font-semibold hover:text-indigo-600 transition text-xs flex items-center gap-1 cursor-pointer"
              >
                {lang === "ar" ? "تعديل الحساب البنكي" : "Change Bank Account"}
              </button>
              <span className="text-[11px] text-slate-400">{lang === "ar" ? "حفظ تلقائي محلي" : "Saved in LocalStorage"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Metrics Financial Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{lang === "ar" ? "أرباح الاشتراكات (CRM)" : "Subscription Revenue"}</p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">${revenue.subscriptions.toLocaleString()}</h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-500">
            <span>✔</span>
            <span>{lang === "ar" ? "اشتركات نشطة حية" : "Live Subs"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{lang === "ar" ? "أرباح مبيعات المنتجات" : "Products Revenue"}</p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">${revenue.products.toLocaleString()}</h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-indigo-500">
            <span>✔</span>
            <span>{lang === "ar" ? "طلبات مكتملة" : "Orders Done"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-rose-500/10 transition-all hover:translate-y-[-2px] duration-200" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-bold text-rose-500/90">{lang === "ar" ? "مسيرات الرواتب (دون المالك)" : "Staff Payroll Expenses"}</p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-rose-500">-${revenue.payrollExpenses.toLocaleString()}</h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-rose-400/80">
            <span>⚙</span>
            <span>{lang === "ar" ? "تم تصفية الأونر" : "Owner Excluded"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border transition-all hover:translate-y-[-2px] duration-200" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{lang === "ar" ? "الرصيد المعلق" : "Pending Balance"}</p>
          <h3 className="text-2xl font-black mt-3 tracking-tight text-slate-800 dark:text-slate-100">${revenue.pending.toLocaleString()}</h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-amber-500">
            <span className="animate-pulse">⏱</span>
            <span>{lang === "ar" ? "قيد المعالجة" : "Processing"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent to-emerald-500/[0.02] flex flex-col justify-between transition-all hover:translate-y-[-2px] duration-200 sm:col-span-2 lg:col-span-1" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lang === "ar" ? "الصافي المتاح للسحب" : "Net Profit Available"}</p>
            <h3 className="text-2xl font-black mt-2 tracking-tight text-emerald-600 dark:text-emerald-400">${revenue.available.toLocaleString()}</h3>
          </div>
          <button className="mt-4 w-full h-9 text-xs rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold shadow-md active:scale-[0.98]">
            {lang === "ar" ? "سحب الأرباح" : "Withdraw"}
          </button>
        </div>
      </motion.div>

      {/* Dynamic Billing History Log Table */}
      <motion.div
        variants={itemVariants}
        className="rounded-[24px] border backdrop-blur-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.01)]"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div className="p-6 pb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {lang === "ar" ? "سجل المعاملات والتدفقات المالية الموحد" : "Unified Financial Audit Log"}
          </h2>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}>
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-semibold text-xs bg-slate-500/[0.02]">
                <th className="py-4 px-6">{lang === "ar" ? "التاريخ" : "Date"}</th>
                <th className="py-4 px-4">{lang === "ar" ? "رقم المرجع" : "Reference ID"}</th>
                <th className="py-4 px-4">{lang === "ar" ? "الجهة / العميل" : "Entity / Customer"}</th>
                <th className="py-4 px-4">{lang === "ar" ? "التصنيف" : "Classification"}</th>
                <th className="py-4 px-4">{lang === "ar" ? "المبلغ" : "Amount"}</th>
                <th className="py-4 px-6 text-center">{lang === "ar" ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
              {dynamicInvoices.slice(0, 12).map((invoice, index) => (
                <tr key={index} className="hover:bg-slate-500/[0.015] transition-colors duration-150">
                  <td className="py-4 px-6 text-slate-400 dark:text-slate-500 font-normal text-xs whitespace-nowrap">{invoice.date}</td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-xs tracking-tight">{invoice.id}</td>
                  <td className="py-4 px-4 text-slate-900 dark:text-white font-semibold">{invoice.customer}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      invoice.txType === "Expense" ? "bg-rose-500/10 text-rose-500" : "bg-indigo-500/10 text-indigo-500"
                    }`}>
                      {invoice.type}
                    </span>
                  </td>
                  <td className={`py-4 px-4 font-black text-base ${invoice.txType === "Expense" ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                    {invoice.txType === "Expense" ? "-" : "+"}${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[75px] ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Premium Glassmorphism Modal for Changing Bank Account Card */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            
            {/* Content Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-3xl border shadow-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {lang === "ar" ? "تحديث كارت الحساب البنكي" : "Update Settlement Card"}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                {lang === "ar" ? "سيتم تخزين آخر 4 أرقام محلياً في المتصفح بكل أمان." : "Data securely managed via local browser context storage."}
              </p>

             <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">{lang === "ar" ? "رقم الكارت" : "Card Number"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="4242 4242 4242 4242"
                    value={inputNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19" // 16 رقم + 3 مسافات
                    className="w-full h-11 px-3 rounded-xl border text-sm font-mono tracking-widest font-semibold outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                    style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">{lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY"
                    value={inputExpiry}
                    onChange={handleExpiryChange}
                    maxLength="5" // رقمان للشهر + / + رقمان للسنة
                    className="w-full h-11 px-3 rounded-xl border text-sm font-mono tracking-widest font-semibold outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                    style={{ background: "var(--bg-main)", borderColor: "var(--border)" }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition">
                    {lang === "ar" ? "حفظ التغييرات" : "Save Card"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 h-10 rounded-xl border text-xs font-semibold text-slate-500" style={{ borderColor: "var(--border)" }}>
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Billing;