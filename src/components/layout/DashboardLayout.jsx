import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import useTheme from "../../hooks/useTheme";


function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const { rtl } = useTheme();

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        background: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      <Sidebar
        isOpen={isOpen}
      />

      <div
        className={`
          min-h-screen transition-all duration-300
          ${rtl ? "lg:mr-72" : "lg:ml-72"}
        `}
      >
        <Navbar
          setIsOpen={setIsOpen}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;