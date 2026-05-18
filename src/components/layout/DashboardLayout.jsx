import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../../context/ThemeContext"; // 👈 استدعاء الـ Context بتاعك عشان نعرف الاتجاه (RTL)

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { rtl } = useTheme(); // 👈 سحبنا قيمة الـ rtl عشان نتحكم في الـ Margin ديناميكياً

  return (
    // 1. تعديل الـ bg والـ text عشان يقبلوا الفاتح والغامق بنعومة (transition)
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* 2. التحكم في الـ Margin: لو عربي يسب مسافة من اليمين (mr)، لو إنجليزي يسيب من الشمال (ml) */}
      <div className={`${rtl ? "lg:mr-72 lg:ml-0" : "lg:ml-72 lg:mr-0"} min-h-screen transition-all duration-300`}>
        
        <Navbar setIsOpen={setIsOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;