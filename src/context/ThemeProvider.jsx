import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const translations = {
    en: {
      dashboard: "Dashboard",
      welcome: "Welcome back, Yousef",
      subtitle: "Here's what's happening with your SaaS platform today.",
      totalRevenue: "Total Revenue",
      ActiveUsers: "Active Users",
      newSubscriptions: "New Subscriptions",
      conversionRate: "Conversion Rate",
      revenueOverview: "Revenue Overview",
      monthlyBreakdown: "Monthly breakdown of your platform earnings.",
      salesAnalytics: "Sales Analytics",
      distribution: "Distribution by subscription tier.",
      starter: "Starter",
      pro: "Pro",
      enterprise: "Enterprise",
      jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun", jul: "Jul",
          orders: "Orders",
analytics: "Analytics",
crm: "CRM",
users: "Users",
billing: "Billing",
settings: "Settings",

products: "Products",
calendar: "Calendar",
chat: "Chat",
components: "Components",

notifications: "Notifications",
profile: "Profile",
logout: "Logout",

searchOrders: "Search orders...",
addOrder: "Add Order",
editOrder: "Edit Order",
deleteOrder: "Delete Order",

save: "Save",
cancel: "Cancel",

previous: "Previous",
next: "Next",

exportAll: "Export All",
exportSelected: "Export Selected",

total: "Total",
completed: "Completed",
pending: "Pending",
cancelled: "Cancelled",

usersPage: {
  title: "User Management",
  subtitle: "Manage team members and roles.",
  addUser: "Add User",
  search: "Search name or email...",
  role: "Role",
  status: "Status",
  Active: "Active",
  suspended: "Suspended",
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  user: "User",
  save: "Save",
  cancel: "Cancel",
  update: "Update",
  delete: "Delete",
  confirmDelete: "Are you sure?",
  filterRole: "Filter by Role",
  filterStatus: "Filter by Status",
  userDetails: "User Details",
  userActivity: "User Activity",
}
    },

    ar: {
      dashboard: "لوحة التحكم",
      welcome: "أهلاً بعودتك، يوسف",
      subtitle: "إليك نظرة سريعة على ما يحدث في منصتك اليوم.",
      totalRevenue: "إجمالي الإيرادات",
      ActiveUsers: "المستخدمين النشطين",
      newSubscriptions: "الاشتراكات الجديدة",
      conversionRate: "معدل التحويل",
      revenueOverview: "نظرة عامة على الإيرادات",
      monthlyBreakdown: "تحليل شهري لأرباح المنصة الخاصة بك.",
      salesAnalytics: "تحليلات المبيعات",
      distribution: "توزيع المبيعات حسب باقات الاشتراك.",
      starter: "الباقة الأساسية",
      pro: "الباقة الاحترافية",
      enterprise: "باقة الشركات",
      jan: "يناير", feb: "فبراير", mar: "مارس", apr: "أبريل", may  : "مايو", jun: "يونيو", jul: "يوليو",
     
     orders: "الطلبات",
analytics: "التحليلات",
crm: "إدارة العملاء",
users: "المستخدمون",
billing: "الفواتير",
settings: "الإعدادات",

products: "المنتجات",
calendar: "التقويم",
chat: "المحادثات",
components: "المكونات",

notifications: "الإشعارات",
profile: "الملف الشخصي",
logout: "تسجيل الخروج",

searchOrders: "ابحث في الطلبات...",
addOrder: "إضافة طلب",
editOrder: "تعديل الطلب",
deleteOrder: "حذف الطلب",

save: "حفظ",
cancel: "إلغاء",

previous: "السابق",
next: "التالي",

exportAll: "تصدير الكل",
exportSelected: "تصدير المحدد",

total: "الإجمالي",
completed: "مكتمل",
pending: "قيد الانتظار",
cancelled: "ملغي",

usersPage: {
  title: "إدارة المستخدمين",
  subtitle: "إدارة أعضاء الفريق والصلاحيات",
  addUser: "إضافة مستخدم",
  search: "ابحث بالاسم أو البريد",
  role: "الصلاحية",
  status: "الحالة",
  Active: "نشط",
  suspended: "موقوف",
  owner: "مالك",
  admin: "مدير",
  editor: "محرر",
  user: "مستخدم",
  save: "حفظ",
  cancel: "إلغاء",
  update: "تعديل",
  delete: "حذف",
  confirmDelete: "هل أنت متأكد؟",
  filterRole: "فلترة بالصلاحية",
  filterStatus: "فلترة بالحالة",
  userDetails: "بيانات المستخدم",
  userActivity: "نشاط المستخدم",
}

    }

    
  };

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || false
  );
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  const t = translations[lang];

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, lang, toggleLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}