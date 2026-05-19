"use client";

import { useState } from "react";
import { LocumTable } from "@/components/hr/LocumTable";
import { StaffDirectory } from "@/components/hr/StaffDirectory";
import { OvertimeManager } from "@/components/hr/OvertimeManager";
import { LeaveManager } from "@/components/hr/LeaveManager";
import { Users, Clock, CalendarDays, Stethoscope } from "lucide-react";

type Tab = "staff" | "overtime" | "leave" | "locum";

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<Tab>("staff");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">HR & Locum Management</h1>
        <p className="text-slate-500 mt-1">Manage staff shifts, locum payouts, and HR alerts.</p>
      </div>

      {/* Polished Tab Selection Header */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "staff" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <Users className="w-4 h-4 mr-2" /> Staff Directory
        </button>
        <button
          onClick={() => setActiveTab("overtime")}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "overtime" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <Clock className="w-4 h-4 mr-2" /> Overtime
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "leave" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <CalendarDays className="w-4 h-4 mr-2" /> Leave
        </button>
        <button
          onClick={() => setActiveTab("locum")}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "locum" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <Stethoscope className="w-4 h-4 mr-2" /> Locum
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === "staff" && <StaffDirectory />}
        {activeTab === "overtime" && <OvertimeManager />}
        {activeTab === "leave" && <LeaveManager />}
        {activeTab === "locum" && <LocumTable />}
      </div>
    </div>
  );
}
