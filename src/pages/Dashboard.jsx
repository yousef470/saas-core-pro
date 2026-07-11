import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getCustomers,
  getRevenueStats,
  getSubscriptionPlanStats,
  getRevenueChartData,
} from "../services/crmService";

import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";

import { getUsers } from "../services/userService";

import { getBusinessGoals } from "../services/settingsService";
import { getOrders } from "../services/orderService";

const GoalBar = ({
  title,
  current,
  target,
  percent,
  color,
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {current} / {target}
        </p>
      </div>

      <span className="text-sm font-bold">
        {percent}%
      </span>
    </div>

    <div
      className="w-full h-2 rounded-full overflow-hidden"
      style={{
        background: "var(--bg-main)",
      }}
    >
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  </div>
);

function Dashboard() {
  const { user } = useAuth();
  const { lang } = useTheme();

  const customers = getCustomers();
  const orders = getOrders();

  const { totalCustomers, activeCustomers, totalRevenue } = getRevenueStats();

  const goals = getBusinessGoals();

const totalSales = getOrders()
  .filter((o) => o.status === "Completed")
  .reduce((sum, order) => {
    return sum + Number(order.total.replace("$", ""));
  }, 0);

const salesGoal = Math.min(
  Math.round((totalSales / goals.sales) * 100),
  100
);

const subscriptionGoal = Math.min(
  Math.round((totalRevenue / goals.subscriptions) * 100),
  100
);

const customerGoal = Math.min(
  Math.round((totalCustomers / goals.customers) * 100),
  100,
);



const totalOrders = orders.length;



const ordersGoal = Math.min(
  Math.round((totalOrders / goals.orders) * 100),
  100
);

 





  const stats = [
    {
      title: "Customers",
      value: totalCustomers,
      change: "+12%",
      isPositive: true,
      icon: <Users size={20} />,
      iconColor:
        "text-slate-600 dark:text-slate-300 bg-slate-200/40 dark:bg-slate-700/30",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      change: "+8%",
      isPositive: true,
      icon: <TrendingUp size={20} />,
      iconColor: "text-emerald-500 bg-emerald-500/10",
    },

    {
      title: "Revenue",
      value: `$${totalRevenue}`,
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign size={20} />,
      iconColor: "text-amber-500 bg-amber-500/10",
    },
  ];

  const revenueData = getRevenueChartData();
  console.log(revenueData);

  const tierData = getSubscriptionPlanStats().map((plan) => ({
    name: plan.name,
    value: plan.count,
    color:
      plan.name === "Starter"
        ? "#4f46e5"
        : plan.name === "Pro"
          ? "#06b6d4"
          : "#8b5cf6",
  }));

  const users = getUsers();

  const teamMembers = users.slice(0, 5).map((user) => ({
    name: user.name,
    role: user.role,
    status: user.status,
    image: user.avatar,
  }));

  const transactions = customers.slice(0, 5).map((customer) => ({
    user: customer.name,
    amount: `$${customer.revenue}`,
    status:
      customer.status === "active"
        ? "Completed"
        : customer.status === "pending"
          ? "Pending"
          : "Canceled",
  }));

  const activities = user?.activityLog?.slice(0, 8) || [];

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    return `${days} d ago`;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden space-y-6 sm:space-y-8 px-1"
    >
      {/* Background Glow - تم تعديل الألوان لتقليل البنفسجي */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 blur-[100px] sm:blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-600/5 blur-[100px] sm:blur-[140px]" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* =========================================
            HERO HERO SECTION
        ========================================= */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 p-5 sm:p-8 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_40%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-normal">
                {lang === "ar"
                  ? `مرحباً، ${user?.name || "زائر"} 👋`
                  : `Welcome back, ${user?.name || "Guest"} 👋`}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                {lang === "ar"
                  ? "تابع أداء مشروعك وتحليلات المستخدمين والإيرادات لحظة بلحظة."
                  : "Track your revenue, analytics, and customer growth in real-time."}
              </p>

              <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-slate-200/50 dark:bg-slate-700/40 text-xs sm:text-sm font-medium">
                  {totalCustomers} Customers
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs sm:text-sm font-medium">
                  {activeCustomers} Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            STATS CARDS GRID
        ========================================= */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-xl ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-normal">
                    {stat.value}
                  </h3>

                  <span
                    className={`flex items-center gap-0.5 text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full ${
                      stat.isPositive
                        ? "text-emerald-500 bg-emerald-500/10"
                        : "text-red-500 bg-red-500/10"
                    }`}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight size={12} sm:size={14} />
                    ) : (
                      <ArrowDownRight size={12} sm:size={14} />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            CHARTS SECTION (RESPONSIVE)
        ========================================= */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          {/* AREA CHART */}
          <div
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-xl xl:col-span-2 min-h-[350px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>
              <p
                className="text-xs sm:text-sm mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Monthly revenue performance
              </p>
            </div>

            <div
  style={{
    width: "100%",
    height: "300px",
  }}
>
              <ResponsiveContainer width={700} height={300}>
                <AreaChart data={revenueData} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#4f46e5"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    strokeOpacity={0.08}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="chartMonth" // تم التعديل هنا ليقرأ الأشهر المضمونة فقط
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#fff",
                      stroke: "#6366f1",
                      strokeWidth: 3,
                    }}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-xl min-h-[350px] flex flex-col"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Subscription Plans
              </h2>
              <p
                className="text-xs sm:text-sm mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                User distribution
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: "16px",
                      padding: "10px",
                    }}
                    labelStyle={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                    itemStyle={{
                      color: "#818cf8",
                      fontWeight: 600,
                    }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current"
                  >
                    <tspan className="text-xl sm:text-2xl font-bold">
                      {totalCustomers}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="20"
                      className="text-[10px] sm:text-xs fill-slate-400 font-medium"
                    >
                      subscriptions
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around    items-center mt-5 border-t border-slate-200 dark:border-slate-800 pt-5">
              {tierData.map((tier, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: tier.color }}
                    />
                    <span className="truncate">{tier.name}</span>
                  </div>
                  <div className="font-bold text-lg  sm:text-sm mt-0.5">
                    {tier.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            WIDGETS: TEAM & TIMELINE
        ========================================= */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* TEAM MEMBERS */}
          <div
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-5">
              Team Members
            </h2>

            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.role}
                    </p>
                  </div>
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      member.status === "active"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY TIMELINE */}
          <div
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-5">
              Activity Timeline
            </h2>

            <div className="space-y-6 relative pl-1">
              {activities.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No activity yet
                </div>
              )}

              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4 relative"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 z-10 mt-1" />
                    {index !== activities.length - 1 && (
                      <div
                        className="w-[1.5px] absolute bottom-[-24px] top-3 bg-slate-200 dark:bg-slate-800"
                        style={{ left: "4px" }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-xs sm:text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            GOAL & TRANSACTIONS
        ========================================= */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
{/* GOALS */}
<div
  className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl"
  style={{
    background: "var(--bg-card)",
    borderColor: "var(--border)",
  }}
>
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
        Goals
      </h2>
      <p
        className="text-xs mt-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        Monthly business targets
      </p>
    </div>

    <TrendingUp className="text-indigo-400 w-5 h-5" />
  </div>

  <div className="space-y-5">

<div className="space-y-6">

  {/* Customers */}
  <GoalBar
    title="Customers"
    current={totalCustomers}
    target={goals.customers}
    percent={customerGoal}
    color="from-emerald-500 to-green-400"
  />

  {/* Subscriptions */}
  <GoalBar
    title="Subscriptions"
    current={`$${totalRevenue}`}
    target={`$${goals.subscriptions}`}
    percent={subscriptionGoal}
    color="from-indigo-500 to-cyan-500"
  />

  {/* Orders */}
  <GoalBar
    title="Orders"
    current={totalOrders}
    target={goals.orders}
    percent={ordersGoal}
    color="from-amber-500 to-orange-400"
  />

  {/* Product Sales */}
  <GoalBar
    title="Product Sales"
    current={`$${totalSales}`}
    target={`$${goals.sales}`}
    percent={salesGoal}
    color="from-purple-500 to-pink-500"
  />

</div>

  </div>
</div>

          {/* TRANSACTIONS */}
          <div
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-5">
              Recent Payments
            </h2>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5 scrollbar-none">
              {transactions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40"
                  style={{ background: "var(--bg-main)" }}
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hidden xs:block">
                      <CreditCard size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">
                        {item.user}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Subscription Payment
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="font-bold text-xs sm:text-sm">
                      {item.amount}
                    </p>
                    <span
                      className={`text-[10px] font-semibold ${
                        item.status === "Completed"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
