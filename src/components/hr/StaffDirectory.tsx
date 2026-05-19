"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Department = "Pharmacy" | "Lab" | "Nursing" | "Clinical Doctor" | "Housekeeper" | "Admin" | "Front Office";

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  department: Department;
  position: string;
}

const DEPARTMENTS: Department[] = ["Pharmacy", "Lab", "Nursing", "Clinical Doctor", "Housekeeper", "Admin", "Front Office"];

export function StaffDirectory() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState<Department>("Nursing");
  const [position, setPosition] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('first_name', { ascending: true });
      
    if (error) {
      console.error("Error fetching staff:", error);
    } else {
      setStaff(data as Staff[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !position) return;

    const { data, error } = await supabase
      .from('staff')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          department,
          position
        }
      ])
      .select();

    if (error) {
      console.error("Error adding staff:", error);
    } else if (data) {
      setStaff([...staff, ...data]);
      setFirstName("");
      setLastName("");
      setPosition("");
      setDepartment("Nursing");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Directory</CardTitle>
        <CardDescription>Manage your hospital personnel and their departments.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Entry Form */}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="First Name" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="Last Name" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value as Department)} className="w-full text-sm p-2 border rounded bg-white">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Position</label>
            <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="Position" required />
          </div>
          <div className="col-span-1 flex items-end">
            <button type="submit" className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Position</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Loading staff...</td>
                </tr>
              ) : staff.map(member => (
                <tr key={member.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{member.first_name} {member.last_name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{member.department}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{member.position}</td>
                </tr>
              ))}
              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No staff members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
