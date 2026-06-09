import { motion } from "framer-motion";

import {
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
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

import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";
import { getUsers } from "../services/userService";

function Dashboard() {
  const { user } = useAuth();

  const { t, lang } = useTheme();
  const revenueGoal = 78;

  const users = getUsers();

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const adminUsers = users.filter((user) => user.role === "Admin").length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      change: "+12%",
      isPositive: true,
      icon: <Users size={22} />,
      iconColor: "text-indigo-500 bg-indigo-500/10",
    },

    {
      title: "Active Users",
      value: activeUsers,
      change: "+8%",
      isPositive: true,
      icon: <TrendingUp size={22} />,
      iconColor: "text-emerald-500 bg-emerald-500/10",
    },

    {
      title: "Admins",
      value: adminUsers,
      change: "+3%",
      isPositive: true,
      icon: <Users size={22} />,
      iconColor: "text-violet-500 bg-violet-500/10",
    },

    {
      title: "Revenue",
      value: "$48,259",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign size={22} />,
      iconColor: "text-amber-500 bg-amber-500/10",
    },
  ];

  const revenueData = [
    { name: t.jan, Revenue: 4000 },
    { name: t.feb, Revenue: 5000 },
    { name: t.mar, Revenue: 6800 },
  ];

  const tierData = [
    { name: t.starter, value: 400, color: "#6366f1" },
    { name: t.pro, value: 300, color: "#a855f7" },
  ];

  const teamMembers = users.slice(0, 5).map((user) => ({
    name: user.name,
    role: user.role,
    status: user.status,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name,
    )}&background=6366f1&color=fff`,
  }));

  const transactions = [
    {
      user: "Ahmed",
      amount: "$120",
      status: "Completed",
    },

    {
      user: "Mohamed",
      amount: "$79",
      status: "Completed",
    },

    {
      user: "Sara",
      amount: "$199",
      status: "Pending",
    },

    {
      user: "Ali",
      amount: "$49",
      status: "Completed",
    },
  ];

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
      className="relative min-h-screen overflow-hidden space-y-8"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[140px]" />

      <div className="relative z-10 space-y-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-200 dark:border-white/10 p-8 bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {lang === "ar"
                  ? `مرحباً، ${user?.name || "زائر"} 👋`
                  : `Welcome back, ${user?.name || "Guest"} 👋`}
              </h1>

              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
                {lang === "ar"
                  ? "تابع أداء مشروعك وتحليلات المستخدمين والإيرادات لحظة بلحظة."
                  : "Track your revenue, analytics, and customer growth in real-time."}
              </p>
              <div className="mt-5 flex gap-3 flex-wrap">
                <span className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-500 text-sm font-medium">
                  {totalUsers} Users
                </span>

                <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                  {activeUsers} Active
                </span>

                <span className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-500 text-sm font-medium">
                  {adminUsers} Admins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
group
relative
overflow-hidden
p-6
rounded-3xl
border
backdrop-blur-xl
transition-all
duration-300
hover:-translate-y-1
hover:border-indigo-500/30
"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-slate-500">{stat.title}</span>

                  <div className={`p-3 rounded-2xl ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black tracking-tight">
                    {stat.value}
                  </h3>

                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
                    ${
                      stat.isPositive
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          {/* AREA CHART */}
          <div
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-200 dark:border-white/10  backdrop-blur-xl xl:col-span-2 min-h-[320px] md:min-h-[380px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>

              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Monthly revenue performance
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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
                        stopColor="#6366f1"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.08}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />

                  <Tooltip
                    contentStyle={{
                      background: "#11131a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div
            className="p-6 rounded-3xl border border-slate-200 dark:border-white/10  backdrop-blur-xl min-h-[380px] flex flex-col"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Subscription Plans
              </h2>

              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                User distribution
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current"
                  >
                    <tspan className="text-2xl font-bold">{totalUsers}</tspan>

                    <tspan x="50%" dy="24" className="text-xs fill-slate-400">
                      Users
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {tierData.map((tier, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: tier.color }}
                    />
                    {tier.name}
                  </div>

                  <div className="font-bold mt-1">{tier.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXTRA WIDGETS */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* TEAM MEMBERS */}
          <div
            className="p-6 rounded-3xl border backdrop-blur-xl min-h-[420px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Team Members
            </h2>

            <div className="space-y-5">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-16 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {member.role}
                    </p>
                  </div>

                  <div
                    className={`w-3 h-3 rounded-full ${
                      member.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* activity timeline */}

          <div
            className="p-6 rounded-3xl border backdrop-blur-xl min-h-[420px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-xl font-bold mb-6">Activity Timeline</h2>

            <div className="space-y-8">
              {activities.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No activity yet
                </div>
              )}

              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />

                    {index !== activities.length - 1 && (
                      <div
                        className="absolute left-1/2 top-3 w-[2px] h-16 -translate-x-1/2"
                        style={{
                          background: "var(--border)",
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>

                    <p className="text-sm text-slate-500">
                      {activity.description}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* REVENUE GOAL */}
          <div
            className="p-6 rounded-3xl border backdrop-blur-xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Revenue Goal
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Monthly target progress
                </p>
              </div>

              <TrendingUp className="text-indigo-400" />
            </div>

            <div className="mb-4 flex items-end justify-between">
              <h3 className="text-4xl font-black">{revenueGoal}%</h3>

              <span className="text-emerald-400 font-semibold">
                +12% this month
              </span>
            </div>

            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{
                background: "var(--bg-main)",
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{
                  width: `${revenueGoal}%`,
                }}
              />
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div
            className="p-6 rounded-3xl border backdrop-blur-xl min-h-[420px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Recent Payments
            </h2>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {transactions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{
                    background: "var(--bg-main)",
                  }}
                >
                  <div>
                    <p className="font-medium">{item.user}</p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subscription Payment
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-medium ${
                        item.status === "Completed"
                          ? "text-emerald-400"
                          : "text-amber-400"
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

      {/* BOTTOM SECTION */}
      <div className="grid gap-6 lg:grid-cols-2"></div>
    </motion.div>
  );
}

export default Dashboard;
