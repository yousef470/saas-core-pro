import { motion } from "framer-motion";

import {
  DollarSign,
  Users,

  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Bell,
  CalendarDays,
  Download,
  Plus,
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

import { useEffect, useState } from "react";

import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";

function Dashboard() {

  const { user } = useAuth();

  const { t, lang } = useTheme();

  const [dashboardData, setDashboardData] = useState({
    stats: [],
    revenueData: [],
    tierData: [],
    teamMembers: [],
    transactions: [],
    notifications: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {

      setDashboardData({
        stats: [
          {
            title: t.totalRevenue,
            value: "$48,259",
            change: "+12.5%",
            isPositive: true,
            icon: <DollarSign size={22} />,
            iconColor: "text-emerald-500 bg-emerald-500/10",
          },
          {
            title: t.activeUsers,
            value: "10,482",
            change: "+8.2%",
            isPositive: true,
            icon: <Users size={22} />,
            iconColor: "text-indigo-500 bg-indigo-500/10",
          },
        ],

        revenueData: [
          { name: t.jan, Revenue: 4000 },
          { name: t.feb, Revenue: 5000 },
          { name: t.mar, Revenue: 6800 },
        ],

        tierData: [
          { name: t.starter, value: 400, color: "#6366f1" },
          { name: t.pro, value: 300, color: "#a855f7" },
        ],

        teamMembers: [
          {
            name: "Ahmed Hassan",
            role: "UI Designer",
            image: "https://i.pravatar.cc/100?u=1",
          },
        ],

        transactions: [
          {
            user: "Ahmed",
            amount: "$120",
            status: "Completed",
          },
        ],

        notifications: [
          "New payment received",
        ],
      });

      setLoading(false);

    }, 1000);

  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 backdrop-blur-xl">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {lang === "ar"
                  ? `مرحباً، ${user?.name || "زائر"} 👋`
                  : `Welcome back, ${user?.name || "Guest"} 👋`}
              </h1>

              <p className="mt-3 text-slate-400 max-w-xl">
                {lang === "ar"
                  ? "تابع أداء مشروعك وتحليلات المستخدمين والإيرادات لحظة بلحظة."
                  : "Track your revenue, analytics, and customer growth in real-time."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                <Plus size={18} />
                Create
              </button>

              <button className="h-12 px-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardData.stats.map((stat, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                p-6
                rounded-3xl
                border
                border-slate-200
                dark:border-white/10
                bg-white/70
                dark:bg-[#11131a]/80
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-500/30
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-slate-500">
                    {stat.title}
                  </span>

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
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl xl:col-span-2 min-h-[320px] md:min-h-[380px]">
            
            <div className="mb-8">
              <h2 className="text-xl font-bold">
                Revenue Overview
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Monthly revenue performance
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueData}>
                  
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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

                  <YAxis
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                  />

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
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl min-h-[380px] flex flex-col">

            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Subscription Plans
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                User distribution
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>

                  <Pie
                    data={dashboardData.tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.tierData.map((entry, index) => (
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
                    <tspan className="text-2xl font-bold">
                      900
                    </tspan>

                    <tspan
                      x="50%"
                      dy="24"
                      className="text-xs fill-slate-400"
                    >
                      Users
                    </tspan>
                  </text>

                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {dashboardData.tierData.map((tier, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: tier.color }}
                    />
                    {tier.name}
                  </div>

                  <div className="font-bold mt-1">
                    {tier.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXTRA WIDGETS */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">

          {/* TEAM MEMBERS */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6">
              Team Members
            </h2>

            <div className="space-y-5">
              {dashboardData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-4">
                  
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">
                      {member.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {member.role}
                    </p>
                  </div>

                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6">
              Recent Transactions
            </h2>

            <div className="space-y-4">
              {dashboardData.transactions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03]"
                >
                  <div>
                    <p className="font-medium">
                      {item.user}
                    </p>

                    <p className="text-xs text-slate-400">
                      Subscription Payment
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {item.amount}
                    </p>

                    <span className="text-xs text-emerald-400">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Notifications
              </h2>

              <Bell size={18} className="text-indigo-400" />
            </div>

            <div className="space-y-4">
              {dashboardData.notifications.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-2xl bg-white/[0.03]"
                >
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  </div>

                  <div>
                    <p className="text-sm">
                      {item}
                    </p>

                    <span className="text-xs text-slate-500">
                      Just now
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">

          {/* REVENUE GOAL */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  Revenue Goal
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Monthly target progress
                </p>
              </div>

              <TrendingUp className="text-indigo-400" />
            </div>

            <div className="mb-4 flex items-end justify-between">
              <h3 className="text-4xl font-black">
                78%
              </h3>

              <span className="text-emerald-400 font-semibold">
                +12% this month
              </span>
            </div>

            <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[78%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </div>

          {/* CALENDAR */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#11131a]/80 backdrop-blur-xl">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  Upcoming Schedule
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Meetings & events
                </p>
              </div>

              <CalendarDays className="text-indigo-400" />
            </div>

            <div className="space-y-4">

              <div className="p-4 rounded-2xl bg-white/[0.03] flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Team Meeting
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    10:00 AM - Zoom
                  </p>
                </div>

                <span className="text-sm text-indigo-400">
                  Today
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Product Launch
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Marketing Event
                  </p>
                </div>

                <span className="text-sm text-indigo-400">
                  Tomorrow
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Dashboard;