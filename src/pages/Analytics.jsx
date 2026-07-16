import { useState } from "react";
import useTheme from "../hooks/useTheme";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  DollarSign,
  Users,
  Activity,
  Building2,
  TrendingUp,
  BarChart3,
  Gauge,
  Crown,
  Clock3,
  XCircle,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

function SalesAnalytics() {
  const { lang, t } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // بيانات كروت الأداء
  const customers = JSON.parse(localStorage.getItem("crm_customers") || "[]");
  const filteredCustomers = customers.filter((customer) => {
    const planMatch = selectedPlan === "all" || customer.plan === selectedPlan;
    const statusMatch = selectedStatus === "all" || customer.status === selectedStatus;
    return planMatch && statusMatch;
  });

  const totalRevenue = filteredCustomers.reduce((sum, c) => sum + Number(c.revenue || 0), 0);
  const totalCustomers = filteredCustomers.length;
  const activeCustomers = filteredCustomers.filter((c) => c.status === "active").length;

  const avgRevenue = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;
  const revenueGrowth = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;

  const activePlans = ["Starter", "Pro", "Enterprise"].filter(
    (plan) => filteredCustomers.some((c) => c.plan === plan)
  ).length;

  const performanceCards = [
    {
      title: t.salesAnalyticsPage.totalRevenue,
      value: `$${totalRevenue}`,
      icon: <DollarSign size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />,
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      title: t.salesAnalyticsPage.customers,
      value: totalCustomers,
      icon: <Users size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />,
      gradient: "from-blue-500/10 to-transparent",
    },
    {
      title: t.salesAnalyticsPage.activeUsers,
      value: activeCustomers,
      icon: <Activity size={20} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />,
      gradient: "from-indigo-500/10 to-transparent",
    },
    {
      title: t.salesAnalyticsPage.activePlans,
      value: activePlans,
      icon: <Building2 size={20} className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />,
      gradient: "from-violet-500/10 to-transparent",
    },
    {
      title: t.salesAnalyticsPage.avgRevenue,
      value: `$${avgRevenue}`,
      icon: <TrendingUp size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" />,
      gradient: "from-cyan-500/10 to-transparent",
    },
    {
      title: t.salesAnalyticsPage.growth,
      value: `${revenueGrowth}%`,
      icon: <BarChart3 size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />,
      gradient: "from-amber-500/10 to-transparent",
    },
  ];

  const revenueData = [
    {
      name: t.salesAnalyticsPage.starter,
      revenue: filteredCustomers.filter((c) => c.plan === "Starter").reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },
    {
      name: t.salesAnalyticsPage.starter,
      revenue: filteredCustomers.filter((c) => c.plan === "Pro").reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },
    {
      name: t.salesAnalyticsPage.enterprise,
      revenue: filteredCustomers.filter((c) => c.plan === "Enterprise").reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },
  ];

  const acquisitionData = [
    {
      name: "Customers",
      Active: filteredCustomers.filter((c) => c.status === "active").length,
      Pending: filteredCustomers.filter((c) => c.status === "pending").length,
      Canceled: filteredCustomers.filter((c) => c.status === "canceled").length,
    },
  ];

  const topPlans = ["Starter", "Pro", "Enterprise"]
    .map((plan) => {
      const planCustomers = filteredCustomers.filter((c) => c.plan === plan);
      const revenue = planCustomers.reduce((sum, c) => sum + Number(c.revenue || 0), 0);
      return {
        name: plan,
        sales: planCustomers.length,
        revenue: `$${revenue}`,
        revenueNumber: revenue,
        share: totalRevenue > 0 ? `${Math.round((revenue / totalRevenue) * 100)}%` : "0%",
      };
    })
    .sort((a, b) => b.revenueNumber - a.revenueNumber);

  const pieData = [
    { name: t.salesAnalyticsPage.starter, value: filteredCustomers.filter((c) => c.plan === "Starter").length },
    { name:t.salesAnalyticsPage.pro, value: filteredCustomers.filter((c) => c.plan === "Pro").length },
    { name: t.salesAnalyticsPage.enterprise, value: filteredCustomers.filter((c) => c.plan === "Enterprise").length },
  ];

  const totalPlans = pieData.reduce((sum, item) => sum + item.value, 0);
  const activeRate = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;
const bestPlan = [...topPlans].sort((a, b) => {
  const revB = b.revenue !== undefined && b.revenue !== null ? String(b.revenue) : "0";
  const revA = a.revenue !== undefined && a.revenue !== null ? String(a.revenue) : "0";
  return (Number(revB.replace("$", "")) || 0) - (Number(revA.replace("$", "")) || 0);
})[0];
  const totalPending = filteredCustomers.filter((c) => c.status === "pending").length;
  const totalCanceled = filteredCustomers.filter((c) => c.status === "canceled").length;

  const insights = [
    { title: t.salesAnalyticsPage.activeRate, value: `${activeRate}%`, icon: <Gauge size={18} />, color: "text-emerald-400" },
    { title: t.salesAnalyticsPage.bestPlan, value: bestPlan?.name || "-", icon: <Crown size={18} />, color: "text-indigo-400" },
    { title: t.salesAnalyticsPage.pendingUsers, value: totalPending, icon: <Clock3 size={18} />, color: "text-amber-400" },
    { title:t.salesAnalyticsPage.canceledUsers, value: totalCanceled, icon: <XCircle size={18} />, color: "text-rose-400" },
  ];

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
{t.salesAnalyticsPage.noData}
        </h2>
        <p className="text-slate-400 text-sm">
{t.salesAnalyticsPage.noDataSubtitle}
        </p>
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains("dark");
  const chartGrid = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";
  const chartText = isDark ? "#94a3b8" : "#64748b";
  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-7 animate-fade-in pb-10 text-slate-900 dark:text-slate-100">
      {/* 1️⃣ الهيدر العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t.salesAnalyticsPage.title}
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
{t.salesAnalyticsPage.subtitle}
          </p>
        </div>

        {/* الفلاتر الفاخرة */}
        <div className="flex flex-wrap gap-3">
          {["selectedPlan", "selectedStatus"].map((filterType) => {
            const isPlan = filterType === "selectedPlan";
            return (
              <select
                key={filterType}
                value={isPlan ? selectedPlan : selectedStatus}
                onChange={(e) => (isPlan ? setSelectedPlan(e.target.value) : setSelectedStatus(e.target.value))}
                className="px-3 py-2 rounded-xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-sm font-medium text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
              >
                {isPlan ? (
                  <>
                    <option value="all">{t.salesAnalyticsPage.allPlans}</option>
                    <option value="Starter">{t.salesAnalyticsPage.starter}</option>
                    <option value="Pro">{t.salesAnalyticsPage.pro}</option>
                    <option value="Enterprise">{t.salesAnalyticsPage.enterprise}</option>
                  </>
                ) : (
                  <>
                  <option value="all">{t.salesAnalyticsPage.allStatus}</option>
                    <option value="active">{t.salesAnalyticsPage.active}</option>
                    <option value="pending">{t.salesAnalyticsPage.pending}</option>
                    <option value="canceled">{t.salesAnalyticsPage.canceled}</option>
                  </>
                )}
              </select>
            );
          })}
        </div>
      </div>

      {/* =========================================
           STATS CARDS (Glassmorphic)
         ========================================= */}
      <div className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
           {t.salesAnalyticsPage.performanceOverview}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.salesAnalyticsPage.performanceSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {performanceCards.map((card, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/20 group"
            >
              {/* تأثير الإضاءة الخلفية المتدرجة عند التحويم */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">{card.title}</p>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-500/5 border border-slate-200/10 shadow-inner">
                  {card.icon}
                </div>
              </div>

              <h2 className="relative z-10 text-2xl font-bold mt-4 tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
           CHARTS SECTION
         ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* شارت مساحي متدرج فاخر */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/40 dark:bg-slate-900/40 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {t.salesAnalyticsPage.revenueByPlan}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.salesAnalyticsPage.revenueByPlanSubtitle}
            </p>
          </div>

          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* شارت الدونات الفاخر */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/40 dark:bg-slate-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-1">
              {t.salesAnalyticsPage.planDistribution}
            </h3>
            <p className="text-xs text-slate-400 mb-6">{t.salesAnalyticsPage.planDistributionSubtitle}</p>
          </div>

          <div className="relative flex justify-center items-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Legend iconType="circle" wrapperStyle={{ bottom: -5, fontSize: "11px" }} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke={isDark ? "#0f172a" : "#ffffff"}
                  strokeWidth={2}
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* النص الداخلي الفاخر في الدونات شارت */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{totalPlans}</span>
              <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">{t.salesAnalyticsPage.totalUsers}</span>
            </div>
          </div>
        </div>

        {/* شارت الأعمدة للمقارنة */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/40 dark:bg-slate-900/40 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {t.salesAnalyticsPage.customerStatus}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
{t.salesAnalyticsPage.customerStatusSubtitle}
            </p>
          </div>

          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={acquisitionData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    borderColor: "transparent",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="Active" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Canceled" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================
           BUSINESS INSIGHTS
         ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {insights.map((item, index) => (
          <div
            key={index}
            className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm hover:border-slate-400/20 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400">{item.title}</p>
                <h2 className={`text-2xl font-bold mt-2 tracking-tight ${item.color}`}>{item.value}</h2>
              </div>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-500/10 text-slate-400">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
           TOP PLANS TABLE
         ========================================= */}
      <div className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200/40 dark:border-slate-800/40">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
           {t.salesAnalyticsPage.topPlans}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t.salesAnalyticsPage.topPlansSubtitle}</p>
        </div>

        {/* شاشات الـ Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}>
            <thead>
              <tr className="text-xs text-slate-400 font-semibold" style={{ background: "rgba(99,102,241,.03)" }}>
                <th className="p-4 uppercase tracking-wider">
                  {t.salesAnalyticsPage.plan}</th>
                <th className="p-4 uppercase tracking-wider">
                   {t.salesAnalyticsPage.customers}</th>
                <th className="p-4 uppercase tracking-wider">
                   {t.salesAnalyticsPage.customers}</th>
                <th className="p-4 uppercase tracking-wider">
                  {t.salesAnalyticsPage.share}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
              {topPlans.map((plan, index) => (
                <tr key={index} className="hover:bg-white/40 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-medium">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 inline-flex items-center border border-slate-200/40 dark:border-slate-700/40">
                      {
plan.name === "Starter"
  ? t.salesAnalyticsPage.starter
  : plan.name === "Pro"
  ? t.salesAnalyticsPage.pro
  : t.salesAnalyticsPage.enterprise
}
                      {index === 0 && (
                        <span className={`${lang === "ar" ? "mr-2" : "ml-2"} px-1.5 py-0.5 text-[9px] font-black rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                          {t.salesAnalyticsPage.leader}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{plan.sales}</td>
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{plan.revenue}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: plan.share }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{plan.share}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* شاشات الـ Mobile */}
        <div className="block sm:hidden divide-y divide-slate-200/20 dark:divide-slate-800/20">
          {topPlans.map((plan, index) => (
            <div key={index} className="p-5 space-y-3 text-sm bg-white/20 dark:bg-transparent">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">{t.salesAnalyticsPage.plan}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                  {
plan.name === "Starter"
  ? t.salesAnalyticsPage.starter
  : plan.name === "Pro"
  ? t.salesAnalyticsPage.pro
  : t.salesAnalyticsPage.enterprise
}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">{t.salesAnalyticsPage.customers}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{plan.sales}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">{t.salesAnalyticsPage.revenue}</span>
                <span className="font-bold text-indigo-500">{plan.revenue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">{t.salesAnalyticsPage.share}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: plan.share }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{plan.share}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalesAnalytics;