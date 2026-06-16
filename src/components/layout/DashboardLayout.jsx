import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  
  const [isOpen, setIsOpen] = useState(false);

return (
<div
  className="
    relative
    flex
    h-screen
    w-full
    overflow-hidden
    transition-colors
    duration-300
    bg-[var(--bg-main)]
  "
>

      {/* قسم السايدبار الثابت للشاشات الكبيرة */}
<div
  className="
    hidden
    lg:block
    w-72
    shrink-0
    h-full
    border-r
    border-white/10
    
    bg-white
   dark:bg-[#0f1117]
  "
>
        <Sidebar />
      </div>

      {/* قسم السايدبار الطائر للموبايل والتابلت */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 "
            onClick={() => setIsOpen(false)}
          />
<div
  className="
    relative
    w-72
    max-w-xs
    h-full
    flex
    flex-col
    z-50
    shadow-2xl
    border-r
    border-white/10
bg-white
dark:bg-[#0f1117]
  "
>
            <Sidebar closeMenu={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* الحاوية الرئيسية للمحتوى */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        
        {/* النافبار: الآن ثابت في الأعلى وبفضل كلاسات الشفافية سيبدو رائعاً */}
        <Navbar setIsOpen={setIsOpen} />
        
        {/* المحتوى الديناميكي: هو الوحيد الذي يحتوي على سكرول */}
<main
  className="
    flex-1
    overflow-y-auto
    w-full
    max-w-[1600px]
    mx-auto
    p-4
    sm:p-6
    lg:p-8
    hide-scrollbar
  "
>
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default DashboardLayout;