"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Staff } from "./StaffDirectory";

type LeaveType = "Annual" | "Sick" | "Compassionate";

interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  staff_id: string;
  staff_name?: string;
  leave_type: LeaveType;
  status?: string;
  notes: string;
  staff?: Staff; // Joined data
}

export function LeaveManager() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staffId, setStaffId] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual");
  const [notes, setNotes] = useState("");

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

    // Fetch leave requests
    const { data: reqData, error } = await supabase
      .from('leave_requests')
      .select('*, staff(*)')
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Error fetching leave requests:", error);
    } else if (reqData) {
      setRequests(reqData as LeaveRequest[]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !staffId) return;

    const staffMember = staffList.find(s => s.id === staffId);
    
    const { data, error } = await supabase
      .from('leave_requests')
      .insert([
        {
          start_date: startDate,
          end_date: endDate,
          staff_id: staffId,
          staff_name: staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : "Unknown",
          leave_type: leaveType,
          status: "Pending",
          notes
        }
      ])
      .select();

    if (error) {
      console.error("Error adding leave request:", error);
    } else if (data) {
      setRequests([data[0] as LeaveRequest, ...requests]);
      setStartDate("");
      setEndDate("");
      setStaffId("");
      setLeaveType("Annual");
      setNotes("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>Leave Management</CardTitle>
          <CardDescription>Track and manage staff leave requests.</CardDescription>
        </div>
        <button 
          onClick={() => window.print()} 
          className="print:hidden flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </CardHeader>
      <CardContent>
        {/* Add Entry Form */}
        <form onSubmit={handleAdd} className="print:hidden grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Staff Member</label>
            <select value={staffId} onChange={e => setStaffId(e.target.value)} className="w-full text-sm p-2 border rounded bg-white" required>
              <option value="" disabled>Select Staff</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.department})</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Leave Type</label>
            <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="w-full text-sm p-2 border rounded bg-white">
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Compassionate">Compassionate</option>
            </select>
          </div>
          <div className="col-span-1 flex items-end">
            <button type="submit" className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Request
            </button>
          </div>
          <div className="col-span-1 md:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="Additional details..." />
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto print:overflow-visible print:shadow-none">
          <table className="w-full text-sm text-left print:w-full print:text-black">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Staff Member</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading leave requests...</td>
                </tr>
              ) : requests.map(req => (
                <tr key={req.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {req.staff_name || (req.staff ? `${req.staff.first_name} ${req.staff.last_name}` : "Unknown")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{req.leave_type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.start_date} to {req.end_date}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{req.notes || "-"}</td>
                </tr>
              ))}
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No leave requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
