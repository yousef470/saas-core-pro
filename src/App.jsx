import DashboardLayout from "./components/layout/DashboardLayout";
import StatCard from "./components/ui/StatCard";
import SalesChart from "./components/charts/SalesChart";
import RecentOrders from "./components/tables/RecentOrders";

import {
  DollarSign,
  Users,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

function App() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Dashboard
        </h1>

        <p className="text-slate-400">
          Welcome back to SaaS Core Pro.
        </p>
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue"
          value="$48,290"
          growth="+12.5%"
          icon={DollarSign}
        />

        <StatCard
          title="Customers"
          value="12,450"
          growth="+8.2%"
          icon={Users}
        />

        <StatCard
          title="Orders"
          value="1,240"
          growth="+5.4%"
          icon={ShoppingCart}
        />

        <StatCard
          title="Subscriptions"
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