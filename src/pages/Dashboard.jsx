import StatCard from "../components/ui/StatCard";

import SalesChart from "../components/charts/SalesChart";
import RecentOrders from "../components/tables/RecentOrders";

import useTheme from "../hooks/useTheme";
import PageWrapper from "../components/ui/PageWrapper";

import {
  DollarSign,
  Users,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

function Dashboard() {
  const { rtl } = useTheme();

  return (
   <PageWrapper>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {rtl
            ? "لوحة التحكم"
            : "Dashboard"}
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
          }}
        >
          {rtl
            ? "مرحباً بك مجدداً في SaaS Core Pro."
            : "Welcome back to SaaS Core Pro."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={
            rtl ? "الإيرادات" : "Revenue"
          }
          value="$48,290"
          growth="+12.5%"
          icon={DollarSign}
        />

        <StatCard
          title={
            rtl ? "العملاء" : "Customers"
          }
          value="12,450"
          growth="+8.2%"
          icon={Users}
        />

        <StatCard
          title={
            rtl ? "الطلبات" : "Orders"
          }
          value="1,240"
          growth="+5.4%"
          icon={ShoppingCart}
        />

        <StatCard
          title={
            rtl
              ? "الاشتراكات"
              : "Subscriptions"
          }
          value="894"
          growth="+18.1%"
          icon={CreditCard}
        />
      </div>

      <SalesChart />

      <RecentOrders />
  </PageWrapper>
  );
}

export default Dashboard;