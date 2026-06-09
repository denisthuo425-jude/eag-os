"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Staff } from "./StaffDirectory";

type OvertimeStatus = "Logged" | "Approved";

interface OvertimeLog {
  id: string;
  date_worked: string;
  staff_id: string;
  hours_worked: number;
  description: string;
  status: OvertimeStatus;
  staff?: Staff; // Joined data
}

export function OvertimeManager() {
  const [logs, setLogs] = useState<OvertimeLog[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [dateWorked, setDateWorked] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [rate, setRate] = useState("");
  const [checkedStaff, setCheckedStaff] = useState<Record<string, boolean>>({});


  const fetchData = async () => {
    setLoading(true);
    
    // Fetch staff for dropdown
    const { data: staffData } = await supabase
      .from('staff')
      .select('*')
      .order('first_name', { ascending: true });
      
    if (staffData) {
      setStaffList(staffData as Staff[]);
      const initialChecked: Record<string, boolean> = {};
      staffData.forEach(s => { initialChecked[s.id] = true; });
      setCheckedStaff(initialChecked);
    }

    // Fetch overtime logs
    const { data: logData, error } = await supabase
      .from('overtime_logs')
      .select('*, staff(*)')
      .order('date_worked', { ascending: false });

    if (error) {
      console.error("Error fetching overtime logs:", error);
    } else if (logData) {
      setLogs(logData as OvertimeLog[]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateWorked || !hoursWorked) return;

    const selectedIds = Object.keys(checkedStaff).filter(id => checkedStaff[id]);
    if (selectedIds.length === 0) {
      alert("Please select at least one staff member.");
      return;
    }

    const payloads = selectedIds.map(id => {
      const staffMember = staffList.find(s => s.id === id);
      return {
        date_worked: dateWorked,
        staff_id: id,
        staff_name: staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : "Unknown",
        hours_worked: parseFloat(hoursWorked),
        description: rate ? `Rate applied: ${rate}` : "Bulk logged overtime",
        status: "Logged",
        date_logged: new Date().toISOString()
      };
    });

    const { data, error } = await supabase
      .from('overtime_logs')
      .insert(payloads)
      .select();

    if (error) {
      console.error("Error adding overtime log:", error);
      alert("Error adding overtime: " + error.message);
    } else if (data) {
      // Data is an array of inserted records
      setLogs([...(data as OvertimeLog[]), ...logs]);
      setDateWorked("");
      setHoursWorked("");
      setRate("");
      
      // Reset checkboxes to all true
      const initialChecked: Record<string, boolean> = {};
      staffList.forEach(s => { initialChecked[s.id] = true; });
      setCheckedStaff(initialChecked);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>Overtime Management</CardTitle>
          <CardDescription>Log and track staff overtime hours.</CardDescription>
        </div>
        <button 
          onClick={() => window.print()} 
          className="print:hidden flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </CardHeader>
      <CardContent>
        {/* Bulk Log Form */}
        <form onSubmit={handleAdd} className="print:hidden mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date Worked</label>
              <input type="date" value={dateWorked} onChange={e => setDateWorked(e.target.value)} className="w-full text-sm p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hours Worked</label>
              <input type="number" step="0.5" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="e.g. 4.5" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rate (Optional)</label>
              <input type="text" value={rate} onChange={e => setRate(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="e.g. KES 1000/hr" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors">
                <Plus className="w-4 h-4 mr-1" /> Bulk Log Overtime
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 border-b pb-1">Staff Present (Uncheck if absent)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-white border rounded">
              {staffList.map(s => (
                <label key={s.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                  <input 
                    type="checkbox" 
                    checked={checkedStaff[s.id] || false}
                    onChange={(e) => setCheckedStaff({...checkedStaff, [s.id]: e.target.checked})}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="truncate">{s.first_name} {s.last_name}</span>
                </label>
              ))}
              {staffList.length === 0 && <span className="text-xs text-slate-500">No staff available.</span>}
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto print:overflow-visible print:shadow-none">
          <table className="w-full text-sm text-left print:w-full print:text-black">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Staff Member</th>
                <th className="px-4 py-3 text-right">Hours</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading overtime logs...</td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{log.date_worked}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {(log as any).staff_name || (log.staff ? `${log.staff.first_name} ${log.staff.last_name}` : "Unknown")}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{log.hours_worked}</td>
                  <td className="px-4 py-3 text-slate-600">{log.description || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      log.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No overtime logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
