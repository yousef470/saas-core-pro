import {
  Bell,
  Search,
  Menu,
} from "lucide-react";



function Navbar({ setIsOpen }) {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl w-80">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              Yousef Ahmed
            </p>

            <span className="text-xs text-slate-400">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;