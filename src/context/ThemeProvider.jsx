import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const translations = {
    en: {
      dashboard: "Dashboard",
      welcome: "Welcome back, Yousef",
      subtitle: "Here's what's happening with your SaaS platform today.",
      totalRevenue: "Total Revenue",
      activeUsers: "Active Users",
      newSubscriptions: "New Subscriptions",
      conversionRate: "Conversion Rate",
      revenueOverview: "Revenue Overview",
      monthlyBreakdown: "Monthly breakdown of your platform earnings.",
      salesAnalytics: "Sales Analytics",
      distribution: "Distribution by subscription tier.",
      starter: "Starter",
      pro: "Pro",
      enterprise: "Enterprise",
      jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun", jul: "Jul"
    },
    ar: {
      dashboard: "لوحة التحكم",
      welcome: "أهلاً بعودتك، يوسف",
      subtitle: "إليك نظرة سريعة على ما يحدث في منصتك اليوم.",
      totalRevenue: "إجمالي الإيرادات",
      activeUsers: "المستخدمين النشطين",
      newSubscriptions: "الاشتراكات الجديدة",
      conversionRate: "معدل التحويل",
      revenueOverview: "نظرة عامة على الإيرادات",
      monthlyBreakdown: "تحليل شهري لأرباح المنصة الخاصة بك.",
      salesAnalytics: "تحليلات المبيعات",
      distribution: "توزيع المبيعات حسب باقات الاشتراك.",
      starter: "الباقة الأساسية",
      pro: "الباقة الاحترافية",
      enterprise: "باقة الشركات",
      jan: "يناير", feb: "فبراير", mar: "مارس", apr: "أبريل", may: "مايو", jun: "يونيو", jul: "يوليو"
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