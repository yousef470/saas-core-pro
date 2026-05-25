import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* قسم السايدبار الثابت للشاشات الكبيرة */}
      <div className="hidden lg:block w-64 shrink-0 h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Sidebar />
      </div>

      {/* قسم السايدبار الطائر للموبايل والتابلت */}
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

      {/* الحاوية الرئيسية للمحتوى */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        
        {/* النافبار: الآن ثابت في الأعلى وبفضل كلاسات الشفافية سيبدو رائعاً */}
        <Navbar setIsOpen={setIsOpen} />
        
        {/* المحتوى الديناميكي: هو الوحيد الذي يحتوي على سكرول */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-[1500px] mx-auto hide-scrollbar">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default DashboardLayout;