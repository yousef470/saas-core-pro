import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="lg:ml-72 min-h-screen">
        <Navbar setIsOpen={setIsOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;