import DashboardLayout from "./components/layout/DashboardLayout";
import StatCard from "./components/ui/StatCard";
import SalesChart from "./components/charts/SalesChart";
import RecentOrders from "./components/tables/RecentOrders";
import { useApp } from "./context/AppContext"; // 👈 استدعاء الهوك هنا

import {
  DollarSign,
  Users,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

function App() {
  const { theme, toggleTheme, dir, toggleDir } = useApp(); // 👈 استخراج البيانات والتحكم

  return (
    <DashboardLayout>
      {/* هيدر الصفحة مع أزرار التحكم للتجربة */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">
            {dir === "rtl" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-slate-400">
            {dir === "rtl" ? "مرحباً بك مجدداً في SaaS Core Pro." : "Welcome back to SaaS Core Pro."}
          </p>
        </div>

        {/* أزرار اختبار الـ Dark Mode والـ RTL */}
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition shadow-md"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={toggleDir}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-md"
          >
            {dir === "ltr" ? "🔄 العربية (RTL)" : "🔄 English (LTR)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={dir === "rtl" ? "الإيرادات" : "Revenue"}
          value="$48,290"
          growth="+12.5%"
          icon={DollarSign}
        />

        <StatCard
          title={dir === "rtl" ? "العملاء" : "Customers"}
          value="12,450"
          growth="+8.2%"
          icon={Users}
        />

        <StatCard
          title={dir === "rtl" ? "الطلبات" : "Orders"}
          value="1,240"
          growth="+5.4%"
          icon={ShoppingCart}
        />

        <StatCard
          title={dir === "rtl" ? "الاشتراكات" : "Subscriptions"}
          value="894"
          growth="+18.1%"
          icon={CreditCard}
        />
      </div>

      <SalesChart />
      <RecentOrders />
    </DashboardLayout>
  );
}

export default App;