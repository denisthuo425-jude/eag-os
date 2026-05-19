"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus } from "lucide-react";
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
  const [staffId, setStaffId] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch staff for dropdown
    const { data: staffData } = await supabase
      .from('staff')
      .select('*')
      .order('first_name', { ascending: true });
      
    if (staffData) {
      setStaffList(staffData as Staff[]);
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
    if (!dateWorked || !staffId || !hoursWorked) return;

    const { data, error } = await supabase
      .from('overtime_logs')
      .insert([
        {
          date_worked: dateWorked,
          staff_id: staffId,
          hours_worked: parseFloat(hoursWorked),
          description,
          status: "Logged"
        }
      ])
      .select('*, staff(*)');

    if (error) {
      console.error("Error adding overtime log:", error);
    } else if (data) {
      setLogs([data[0] as OvertimeLog, ...logs]);
      setDateWorked("");
      setStaffId("");
      setHoursWorked("");
      setDescription("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime Management</CardTitle>
        <CardDescription>Log and track staff overtime hours.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Entry Form */}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Date Worked</label>
            <input type="date" value={dateWorked} onChange={e => setDateWorked(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Staff Member</label>
            <select value={staffId} onChange={e => setStaffId(e.target.value)} className="w-full text-sm p-2 border rounded bg-white" required>
              <option value="" disabled>Select Staff</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.department})</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Hours Worked</label>
            <input type="number" step="0.5" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="0" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="Reason..." />
          </div>
          <div className="col-span-1 flex items-end">
            <button type="submit" className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Log Overtime
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
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
                    {log.staff ? `${log.staff.first_name} ${log.staff.last_name}` : "Unknown"}
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
