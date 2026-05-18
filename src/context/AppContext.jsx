import { createContext, useContext, useState, useEffect } from 'react';

// 1. قاموس الترجمة المبدئي للموقع
const translations = {
  en: {
    dashboard: "Dashboard",
    welcome: "Welcome back to SaaS Core Pro.",
    revenue: "Revenue",
    customers: "Customers",
    orders: "Orders",
    subscriptions: "Subscriptions",
    salesAnalytics: "Sales Analytics",
    monthlyOverview: "Monthly revenue overview",
  },
  ar: {
    dashboard: "لوحة التحكم",
    welcome: "مرحباً بك مجدداً في SaaS Core Pro.",
    revenue: "الإيرادات",
    customers: "العملاء",
    orders: "الطلبات",
    subscriptions: "الاشتراكات",
    salesAnalytics: "تحليلات المبيعات",
    monthlyOverview: "نظرة عامة على الإيرادات الشهرية",
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // إعدادات الـ Theme (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // إعدادات الاتجاه (LTR / RTL)
  const [dir, setDir] = useState(() => {
    return localStorage.getItem('dir') || 'ltr';
  });

  // تطبيق الـ Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // تطبيق الاتجاه
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('dir', dir);
    localStorage.setItem('dir', dir);
  }, [dir]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleDir = () => {
    setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  // 2. دالة الترجمة الذكية (بياخد الـ key ويرجعه حسب اتجاه الـ dir الحالي)
  const t = (key) => {
    const lang = dir === 'rtl' ? 'ar' : 'en';
    return translations[lang][key] || key;
  };

  return (
    // 3. مررنا الـ t هنا عشان الأكواد كلها تقراها والتحذير يختفي
    <AppContext.Provider value={{ theme, toggleTheme, dir, toggleDir, t }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);