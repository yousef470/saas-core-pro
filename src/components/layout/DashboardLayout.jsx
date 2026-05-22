import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // نقطة واحدة تعني نفس الفولدر
import Navbar from "./Navbar";

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false); // نفس الاسم الموحد

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* السايدبار للشاشات الكبيرة يظهر عند lg ليطابق الـ Navbar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Sidebar />
      </div>

      {/* السايدبار الطائر للموايل والتابلت */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 max-w-xs h-full bg-white dark:bg-slate-900 flex flex-col z-50 shadow-xl">
            <Sidebar closeMenu={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        {/* تمرير الدالة الصحيحة */}
        <Navbar setIsOpen={setIsOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full max-w-[1500px] mx-auto min-w-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default DashboardLayout;