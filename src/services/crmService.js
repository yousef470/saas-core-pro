// crmservice.js

// 1. جلب العملاء
export const getCustomers = () => {
  const saved = localStorage.getItem("crm_customers");
  return saved ? JSON.parse(saved) : [];
};

// 2. دالة مساعدة لحساب سعر الخطة
export const getRevenueByPlan = (plan) => {
  switch (plan) {
    case "Starter": return 19;
    case "Pro": return 49;
    case "Enterprise": return 199;
    default: return 0;
  }
};

// 3. إحصائيات صفحة Revenue Overview & CRM Cards
export const getRevenueStats = () => {
  const customers = getCustomers();
  
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  
  // إجمالي الأرباح (يفضل حساب النشطين فقط ليتوافق مع الـ Chart، أو احسب الكل حسب رغبتك)
  const totalRevenue = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + Number(c.revenue || 0), 0);

  // توزيع الأرباح حسب الحالات (Overview)
  const pendingRevenue = customers
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + Number(c.revenue || 0), 0);

  const canceledRevenue = customers
    .filter((c) => c.status === "canceled")
    .reduce((sum, c) => sum + Number(c.revenue || 0), 0);

  return {
    totalCustomers,
    activeCustomers,
    totalRevenue,
    pendingRevenue,
    canceledRevenue,
    customers
  };
};

// 4. إحصائيات صفحة Subscription Plans
export const getSubscriptionPlanStats = () => {
  const customers = getCustomers();
  
  // عدد المشتركين النشطين في كل خطة
  const starterCount = customers.filter((c) => c.plan === "Starter" && c.status === "active").length;
  const proCount = customers.filter((c) => c.plan === "Pro" && c.status === "active").length;
  const enterpriseCount = customers.filter((c) => c.plan === "Enterprise" && c.status === "active").length;

  return [
    { name: "Starter", count: starterCount, price: 19, totalRevenue: starterCount * 19 },
    { name: "Pro", count: proCount, price: 49, totalRevenue: proCount * 49 },
    { name: "Enterprise", count: enterpriseCount, price: 199, totalRevenue: enterpriseCount * 199 },
  ];
};

export const getRevenueChartData = () => {
  const customers = getCustomers();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((month, index) => {
    const monthlyRevenue = customers
      .filter((c) => {
        if (c.status !== "active") return false;
        
        if (c.createdAt) {
          const customerMonthIndex = new Date(c.createdAt).getMonth();
          return customerMonthIndex === index;
        }
        
        if (c.month) {
          const cMonth = c.month.trim().substring(0, 3).toLowerCase();
          return cMonth === month.toLowerCase();
        }

        return false;
      })
      .reduce((sum, c) => sum + Number(c.revenue || 0), 0);

    return {
      chartMonth: month, 
      Revenue: monthlyRevenue
    };
  });
};