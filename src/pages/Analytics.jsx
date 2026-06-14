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
  const { lang } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // بيانات كروت الأداء
  const customers = JSON.parse(localStorage.getItem("crm_customers") || "[]");
  const filteredCustomers = customers.filter((customer) => {
    const planMatch = selectedPlan === "all" || customer.plan === selectedPlan;

    const statusMatch =
      selectedStatus === "all" || customer.status === selectedStatus;

    return planMatch && statusMatch;
  });

  const totalRevenue = filteredCustomers.reduce(
    (sum, c) => sum + Number(c.revenue || 0),
    0,
  );

  const totalCustomers = filteredCustomers.length;

  const activeCustomers = filteredCustomers.filter(
    (c) => c.status === "active",
  ).length;



  const avgRevenue =
    totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

  const revenueGrowth =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 100)
      : 0;

const activePlans =
  [
    "Starter",
    "Pro",
    "Enterprise",
  ].filter(
    plan =>
      filteredCustomers.some(
        c => c.plan === plan
      )
  ).length;

  const performanceCards = [
    {
      title: lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
      value: `$${totalRevenue}`,
      isPositive: true,
      icon: <DollarSign size={18} className="text-emerald-500" />,
    },

    {
      title: lang === "ar" ? "العملاء" : "Customers",
      value: totalCustomers,
      isPositive: true,
      icon: <Users size={18} className="text-blue-500" />,
    },

    {
      title: lang === "ar" ? "العملاء النشطون" : "Active Users",
      value: activeCustomers,
      isPositive: true,
      icon: <Activity size={18} className="text-green-500" />,
    },

{
  title:
    lang === "ar"
      ? "الخطط المستخدمة"
      : "Active Plans",

  value: activePlans,

  icon: (
    <Building2
      size={18}
      className="text-violet-500"
    />
  ),
},

    {
      title: lang === "ar" ? "متوسط الإيراد" : "Avg Revenue",
      value: `$${avgRevenue}`,
      isPositive: true,
      icon: <TrendingUp size={18} className="text-cyan-500" />,
    },

    {
      title: lang === "ar" ? "نمو المنصة" : "Growth",

      value: `${revenueGrowth}%`,

      isPositive: true,
      icon: <BarChart3 size={18} className="text-amber-500" />,
    },
  ];

  // بيانات الشارت الخطي (نمو الأرباح)
  const revenueData = [
    {
      name: "Starter",
      revenue: filteredCustomers
        .filter((c) => c.plan === "Starter")
        .reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },

    {
      name: "Pro",
      revenue: filteredCustomers
        .filter((c) => c.plan === "Pro")
        .reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },

    {
      name: "Enterprise",
      revenue: filteredCustomers
        .filter((c) => c.plan === "Enterprise")
        .reduce((sum, c) => sum + Number(c.revenue || 0), 0),
    },
  ];

  // بيانات الشارت الشريطي (المقارنة)
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

      const revenue = planCustomers.reduce(
        (sum, c) => sum + Number(c.revenue || 0),
        0,
      );

      return {
        name: plan,

        sales: planCustomers.length,

        revenue: `$${revenue}`,

        revenueNumber: revenue,

        share:
          totalRevenue > 0
            ? `${Math.round((revenue / totalRevenue) * 100)}%`
            : "0%",
      };
    })
    .sort((a, b) => b.revenueNumber - a.revenueNumber);

  const pieData = [
    {
      name: "Starter",
      value: filteredCustomers.filter((c) => c.plan === "Starter").length,
    },

    {
      name: "Pro",
      value: filteredCustomers.filter((c) => c.plan === "Pro").length,
    },

    {
      name: "Enterprise",
      value: filteredCustomers.filter((c) => c.plan === "Enterprise").length,
    },
  ];

  const totalPlans = pieData.reduce((sum, item) => sum + item.value, 0);

  const activeRate =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 100)
      : 0;

  const bestPlan = [...topPlans].sort(
    (a, b) =>
      Number(b.revenue.replace("$", "")) - Number(a.revenue.replace("$", "")),
  )[0];

  const totalPending = filteredCustomers.filter(
    (c) => c.status === "pending",
  ).length;

  const totalCanceled = filteredCustomers.filter(
    (c) => c.status === "canceled",
  ).length;

  const insights = [
    {
      title: lang === "ar" ? "معدل النشاط" : "Active Rate",

      value: `${activeRate}%`,
       icon: <Gauge size={18} />,
    },

    {
      title: lang === "ar" ? "أفضل خطة" : "Best Plan",

      value: bestPlan?.name || "-",
       icon: <Crown size={18} />,
    },

    {
      title: lang === "ar" ? "قيد الانتظار" : "Pending",

      value: totalPending,
      icon: <Clock3 size={18} />,
    },

    {
      title: lang === "ar" ? "ملغية" : "Canceled",

      value: totalCanceled,
       icon: <XCircle size={18} />,
    },
  ];

  if (customers.length === 0) {
    return (
      <div
        className="
      flex
      flex-col
      items-center
      justify-center
      py-32
      text-center
      "
      >
        <h2 className="text-2xl font-bold mb-3">
          {lang === "ar" ? "لا توجد بيانات حالياً" : "No Analytics Data Yet"}
        </h2>

        <p className="text-slate-500">
          {lang === "ar"
            ? "أضف عملاء من CRM لرؤية التحليلات"
            : "Add customers from CRM to see analytics."}
        </p>
      </div>
    );
  }

  const chartGrid = document.documentElement.classList.contains("dark")
    ? "rgba(255,255,255,.08)"
    : "rgba(0,0,0,.05)";

  const chartText = document.documentElement.classList.contains("dark")
    ? "#cbd5e1"
    : "#64748b";

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      {/* 1️⃣ الهيدر العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ar"
              ? "التحليلات المالية والمبيعات"
              : "Financial Analytics"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {lang === "ar"
              ? "تتبع نمو الإيرادات، خطط الاشتراكات، والصحة المالية لمنصتك."
              : "Track revenue trajectories, cohort retention, and platform fiscal health."}
          </p>
        </div>
      </div>
      <div
        className="
flex
flex-col
lg:flex-row
lg:items-center
lg:justify-between
gap-4
mb-6
"
      >
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="
px-3
py-2
rounded-xl
border
bg-white
dark:bg-slate-900
text-slate-700
dark:text-slate-200
border-slate-300
dark:border-slate-700
shadow-sm
focus:outline-none
focus:ring-2
focus:ring-indigo-500/30
"
          >
            <option value="all">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="
px-3
py-2
rounded-xl
border
bg-white
dark:bg-slate-900
text-slate-700
dark:text-slate-200
border-slate-300
dark:border-slate-700
shadow-sm
focus:outline-none
focus:ring-2
focus:ring-indigo-500/30
"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* =========================================
    STATS CARDS
========================================= */}
      <div
        className="
  rounded-3xl
  border
  p-6
  space-y-6
  "
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {lang === "ar" ? "ملخص الأداء" : "Performance Overview"}
            </h2>

            <p className="text-sm text-slate-500">KPI Metrics</p>
          </div>
        </div>
        <div
          className="grid  grid-cols-1
sm:grid-cols-2
xl:grid-cols-3 gap-5"
        >
          {performanceCards.map((card, idx) => (
            <div
              key={idx}
              className="
      relative
      overflow-hidden
      rounded-3xl
      border
      p-5
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      "
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl" />

             <div className="flex items-center justify-between">

  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
    {card.title}
  </p>

  <div
    className="
    h-10
    w-10
    rounded-xl
    flex
    items-center
    justify-center
    bg-slate-500/10
    "
  >
    {card.icon}
  </div>

</div>

              <h2 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">
                {card.value}
              </h2>

              {card.change && (
                <div className="mt-3">
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                    {card.change}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
       charts
========================================= */}

      {/* 3️⃣ سيكشن الرسوم البيانية الحية (Dynamic Charts) */}
      <div className="grid grid-cols-1 2xl:grid-cols-3   gap-6">
        {/* المخطط الخطي المساحي المتدرج */}
        <div
          className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {lang === "ar"
                ? "صافي تدفق الإيرادات (MRR Growth)"
                : "Revenue By Plan"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "ar"
                ? "معدل الصعود المالي شهرياً"
                : "Monthly compounding revenue velocity"}
            </p>
          </div>

          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGrid}
                />

                <XAxis dataKey="name" stroke={chartText} tickLine={false} />

                <YAxis stroke={chartText} tickLine={false} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          className="
p-6
rounded-3xl
border
shadow-sm
"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="font-bold mb-6">
            {lang === "ar" ? "توزيع الخطط" : "Plan Distribution"}
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Legend />
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                cornerRadius={8}
                stroke="transparent"
                nameKey="name"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} stroke="transparent" />
                ))}
              </Pie>

              <Tooltip />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white"
              >
                <tspan x="50%" dy="-5" fontSize="28" fontWeight="700">
                  {totalPlans}
                </tspan>

                <tspan x="50%" dy="22" fontSize="12">
                  Plans
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* المخطط الشريطي للمقارنة */}
        <div
          className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="mb-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {lang === "ar"
                ? "نوعية الاشتراكات الجدد ضد التجديد"
                : "Customer Status Distribution"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "ar"
                ? "تحليل نسبة الاحتفاظ بالعملاء وطبيعة البيع"
                : "Retention vs acquisition analysis"}
            </p>
          </div>

          <div className="w-full h-64 text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={acquisitionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGrid}
                />

                <XAxis dataKey="name" stroke={chartText} tickLine={false} />

                <YAxis stroke={chartText} tickLine={false} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                <Bar dataKey="Active" fill="#10b981" />

                <Bar dataKey="Pending" fill="#f59e0b" />

                <Bar dataKey="Canceled" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================
 BUSINESS INSIGHTS
========================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {insights.map((item, index) => {
          const colors = [
            "text-emerald-500",
            "text-indigo-500",
            "text-amber-500",
            "text-red-500",
          ];

          return (
            <div
              key={index}
              className="
      rounded-3xl
      border
      p-6
      shadow-sm
      "
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
<div className="flex justify-between items-start">

  <div>

    <p className="text-sm text-slate-500">
      {item.title}
    </p>

    <h2
      className={`
      text-3xl
      font-bold
      mt-3
      ${colors[index]}
      `}
    >
      {item.value}
    </h2>

  </div>

  <div
    className="
    h-11
    w-11
    rounded-xl
    flex
    items-center
    justify-center
    bg-slate-500/10
    text-slate-500
    "
  >
    {item.icon}
  </div>

</div>
            </div>
          );
        })}
      </div>

      {/* =========================================
 TOP PLANS TABLE
========================================= */}

      <div
        className="rounded-3xl border overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-lg">
            {lang === "ar" ? "أفضل الخطط" : "Top Performing Plans"}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {lang === "ar"
              ? "تفاصيل أداء كل خطة"
              : "Performance breakdown by subscription plan"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${
              lang === "ar" ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr
                className={`  text-sm ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
                style={{
                  background: "rgba(99,102,241,.05)",
                }}
              >
                <th className="p-4">{lang === "ar" ? "الخطة" : "Plan"}</th>

                <th className="p-4">
                  {lang === "ar" ? "العملاء" : "Customers"}
                </th>

                <th className="p-4">{lang === "ar" ? "الإيراد" : "Revenue"}</th>

                <th className="p-4">{lang === "ar" ? "الحصة" : "Share"}</th>
              </tr>
            </thead>

            <tbody>
              {topPlans.map((plan, index) => (
                <tr
                  key={index}
                  className="border-t
             hover:bg-slate-50
 dark:hover:bg-slate-800/40
 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <td className="p-4">
                    <span
                      className="
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    bg-indigo-500/10
    text-indigo-500
    "
                    >
                      {plan.name}

                      {index === 0 && (
                        <span
                          className="
    ml-2
    px-2
    py-1
    text-[10px]
    rounded-full
    bg-emerald-500/10
    text-emerald-500
    "
                        >
                          TOP
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="p-4">{plan.sales}</td>

                  <td className="p-4 font-bold text-indigo-500">
                    {plan.revenue}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{
                            width: plan.share,
                          }}
                        />
                      </div>

                      <span className="text-xs font-semibold">
                        {plan.share}
                      </span>
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
