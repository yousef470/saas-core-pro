import { motion } from "framer-motion";
import { DollarSign, Users, CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
// استيراد مكونات Recharts للرسم البياني
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// استيراد الـ Hook الموحد للثيم واللغة
import useTheme from "../hooks/useTheme";
import { useUser } from "../context/UserContext";


function Dashboard() {
const { user } = useUser();
  const { t, lang } = useTheme();
  
console.log("Dashboard Lang Is:", lang, "Dashboard Dictionary Is:", t);
  // 1. بيانات الرسم البياني للمبيعات والأرباح (مترجمة ديناميكياً لأسماء الشهور)
  const revenueData = [
    { name: t.jan, Revenue: 4000, Sales: 2400 },
    { name: t.feb, Revenue: 5000, Sales: 2210 },
    { name: t.mar, Revenue: 6800, Sales: 3290 },
    { name: t.apr, Revenue: 5800, Sales: 2000 },
    { name: t.may, Revenue: 7900, Sales: 3181 },
    { name: t.jun, Revenue: 9200, Sales: 4300 },
    { name: t.jul, Revenue: 11248, Sales: 5100 },
  ];

  
  // 2. بيانات الدائرة البيانية لخطط الاشتراك (مترجمة ديناميكياً للغات)
  const tierData = [
    { name: t.starter, value: 400, color: "#6366f1" }, // Indigo
    { name: t.pro, value: 300, color: "#a855f7" },    // Purple
    { name: t.enterprise, value: 200, color: "#0ea5e9" }, // Sky
  ];

  const stats = [
    {
      title: t.totalRevenue,
      value: "$48,259.45",
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
    {
      title: t.newSubscriptions,
      value: "1,248",
      change: "-3.1%",
      isPositive: false,
      icon: <CreditCard size={22} />,
      iconColor: "text-amber-500 bg-amber-500/10",
    },
    {
      title: t.conversionRate,
      value: "4.83%",
      change: "+2.4%",
      isPositive: true,
      icon: <TrendingUp size={22} />,
      iconColor: "text-sky-500 bg-sky-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* الهيدر الترحيبي المترجم */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold">
        {lang === "ar" ? `مرحباً بك يا ${user.name} 👋` : `Welcome back, ${user.name} 👋`}
      </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.subtitle}
        </p>
      </div>

      {/* شبكة كروت الإحصائيات */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-md dark:hover:shadow-none"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-xl ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold tracking-tight">
                {stat.value}
              </h3>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
                  ${stat.isPositive 
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" 
                    : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30"
                  }
                `}
              >
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* قسم الـ Charts الديناميكي */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* 1. الرسم البياني الكبير (Area Chart) */}
        <div
          className="p-6 rounded-2xl border lg:col-span-2 min-h-[380px] flex flex-col"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold">{t.revenueOverview}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.monthlyBreakdown}</p>
          </div>
          
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                {/* قلب المحور الأفقي في حالة اللغة العربية عشان الـ Chart يقرا صح من اليمين لليسار */}
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} reversed={lang === "ar"} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} orientation={lang === "ar" ? "right" : "left"} />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--bg-card)", 
                    borderColor: "var(--border)", 
                    borderRadius: "12px",
                    color: "currentColor",
                    textAlign: lang === "ar" ? "right" : "left"
                  }} 
                />
                <Area type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. الرسم الدائري (Pie Chart) */}
        <div
          className="p-6 rounded-2xl border min-h-[380px] flex flex-col"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mb-2">
            <h2 className="text-base font-semibold">{t.salesAnalytics}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.distribution}</p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--bg-card)", 
                    borderColor: "var(--border)", 
                    borderRadius: "12px",
                    textAlign: lang === "ar" ? "right" : "left"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* الليجند السفلي المخصص (Custom Legend) لشرح الألوان ومترجم بالكامل */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            {tierData.map((tier, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  {tier.name}
                </div>
                <span className="text-sm font-bold mt-0.5">{tier.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Dashboard;