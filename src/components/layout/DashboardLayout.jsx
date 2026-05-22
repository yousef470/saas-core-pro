import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  // ستيت للتحكم في فتح وقفل الـ Sidebar على الموبايل
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* الـ Sidebar وبنمرر له الـ isOpen والـ setIsOpen عشان الموبايل */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* الجزء الخاص بالمحتوى والـ Navbar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ltr:pl-72 lg:rtl:pr-72 transition-[padding] duration-300">
        
        {/* الـ Navbar وبنمرر له الـ setIsOpen عشان زرار المنيو يفتح الـ Sidebar */}
        <Navbar setIsOpen={setIsOpen} />
        
        {/* محتوى الصفحة الديناميكي مع مسافات مريحة للعين */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;