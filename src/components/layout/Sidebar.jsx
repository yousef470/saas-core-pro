import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Overlay */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
    className={`
  fixed top-0 left-0 z-50
  w-72 h-screen bg-slate-900 border-r border-slate-800 p-6
  transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0
`}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">
            SaaS Core
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X />
          </button>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;