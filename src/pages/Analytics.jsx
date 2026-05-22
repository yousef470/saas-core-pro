import { useState } from "react";
import useTheme from "../hooks/useTheme";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

function SalesAnalytics() {
  const { lang } = useTheme();
  const [timeframe, setTimeframe] = useState("30d");

  // بيانات كروت الأداء
  const performanceCards = [
    { title: lang === "ar" ? "العائد الشهري المتكرر (MRR)" : "Monthly Recurring Revenue", value: "$14,250", change: "+14.2%", isPositive: true },
    { title: lang === "ar" ? "العائد السنوي المتكرر (ARR)" : "Annual Recurring Revenue", value: "$171,000", change: "+18.5%", isPositive: true },
    { title: lang === "ar" ? "العيمة العمرية للعميل (LTV)" : "Customer Lifetime Value", value: "$1,450", change: "-0.8%", isPositive: false },
  ];

  // بيانات الشارت الخطي (نمو الأرباح)
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 5500 },
    { name: "Mar", revenue: 4800 },
    { name: "Apr", revenue: 7000 },
    { name: "May", revenue: 8500 },
    { name: "Jun", revenue: 11000 },
    { name: "Jul", revenue: 14250 },
  ];

  // بيانات الشارت الشريطي (المقارنة)
  const acquisitionData = [
    { name: "Mon", New: 24, Renewals: 40 },
    { name: "Tue", New: 13, Renewals: 30 },
    { name: "Wed", New: 35, Renewals: 45 },
    { name: "Thu", New: 28, Renewals: 50 },
    { name: "Fri", New: 45, Renewals: 65 },
    { name: "Sat", New: 30, Renewals: 41 },
    { name: "Sun", New: 55, Renewals: 70 },
  ];

  const topPlans = [
    { name: "Pro Plan", sales: "642", revenue: "$31,458", share: "52%" },
    { name: "Enterprise Plan", sales: "128", revenue: "$25,472", share: "41%" },
    { name: "Starter Plan", sales: "478", revenue: "$9,082", share: "7%" },
  ];

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      
      {/* 1️⃣ الهيدر العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar" ? "التحليلات المالية والمبيعات" : "Financial Analytics"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {lang === "ar" ? "تتبع نمو الإيرادات، خطط الاشتراكات، والصحة المالية لمنصتك." : "Track revenue trajectories, cohort retention, and platform fiscal health."}
          </p>
        </div>

        {/* فلاتر زمنية */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border shrink-0" style={{ borderColor: "var(--border)" }}>
          {[
            { id: "7d", labelAr: "٧ أيام", labelEn: "7D" },
            { id: "30d", labelAr: "٣٠ يوم", labelEn: "30D" },
            { id: "12m", labelAr: "١٢ شهر", labelEn: "12M" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-3.5 h-8 rounded-lg text-xs font-semibold transition-all ${
                timeframe === item.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {lang === "ar" ? item.labelAr : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 2️⃣ كروت الأداء المالي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceCards.map((card, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border backdrop-blur-md shadow-sm flex flex-col justify-between"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.title}</span>
            <div className="flex justify-between items-baseline mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">{card.value}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                card.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3️⃣ سيكشن الرسوم البيانية الحية (Dynamic Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* المخطط الخطي المساحي المتدرج */}
        <div className="p-6 rounded-2xl border flex flex-col justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {lang === "ar" ? "صافي تدفق الإيرادات (MRR Growth)" : "Revenue Growth Curve"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "ar" ? "معدل الصعود المالي شهرياً" : "Monthly compounding revenue velocity"}</p>
          </div>
          
          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* المخطط الشريطي للمقارنة */}
        <div className="p-6 rounded-2xl border flex flex-col justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {lang === "ar" ? "نوعية الاشتراكات الجدد ضد التجديد" : "New Subscriptions vs. Renewals"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "ar" ? "تحليل نسبة الاحتفاظ بالعملاء وطبيعة البيع" : "Retention vs acquisition analysis"}</p>
          </div>

          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={acquisitionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="New" name={lang === "ar" ? "مشترك جديد" : "New Sales"} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Renewals" name={lang === "ar" ? "تجديد اشتراك" : "Renewals"} fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4️⃣ جدول أداء الخطط */}
      <div className="p-6 rounded-2xl border shadow-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-4">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {lang === "ar" ? "أداء خطط الأسعار" : "Subscription Tiers Performance"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{lang === "ar" ? "توزيع الإيرادات والمبيعات بناءً على نوع الخطة." : "Revenue share breakdown per active price tier."}</p>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-inline-start">
            <thead>
              <tr className="text-xs text-slate-400 border-b" style={{ borderColor: "var(--border)" }}>
                <th className="pb-3 font-semibold text-start">{lang === "ar" ? "الخطة" : "Tier Name"}</th>
                <th className="pb-3 font-semibold text-start">{lang === "ar" ? "عدد المبيعات" : "Sales Count"}</th>
                <th className="pb-3 font-semibold text-start">{lang === "ar" ? "إجمالي الإيرادات" : "Total Earnings"}</th>
                <th className="pb-3 font-semibold text-center">{lang === "ar" ? "الحصة السوقية" : "Revenue Share"}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {topPlans.map((plan, index) => (
                <tr key={index} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">{plan.name}</td>
                  <td className="py-3.5">{plan.sales}</td>
                  <td className="py-3.5 font-bold">{plan.revenue}</td>
                  <td className="py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: plan.share }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-8">{plan.share}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default SalesAnalytics;