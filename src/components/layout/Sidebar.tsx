import Link from "next/link";
import { LayoutDashboard, DollarSign, Users, ShieldAlert, FileText } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Financials", href: "/dashboard/financials", icon: DollarSign },
  { name: "HR & Locum", href: "/dashboard/hr", icon: Users },
  { name: "Operations", href: "/dashboard/operations", icon: ShieldAlert },
  { name: "Partnerships", href: "/dashboard/partnerships", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-full shadow-xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider">EAG-OS</h1>
        <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">Medical ERP</p>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-800 hover:text-white group"
          >
            <item.icon className="w-5 h-5 text-blue-300 group-hover:text-white" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-800">
        <div className="text-sm text-blue-300 text-center">
          &copy; {new Date().getFullYear()} Equity Afya
        </div>
      </div>
    </aside>
  );
}
