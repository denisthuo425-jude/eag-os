import { Bell, User, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-slate-400 hover:text-primary transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Dr. Jack</p>
            <p className="text-xs text-secondary">Medical Director / Admin</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-primary border border-slate-200">
            <User className="w-5 h-5" />
          </div>
          <button className="text-slate-400 hover:text-primary transition-colors ml-2">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
