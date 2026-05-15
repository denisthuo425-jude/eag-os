"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

type Department = "Pharmacy" | "Lab" | "Nursing" | "Clinical Doctor" | "Housekeeper" | "Admin";

interface LocumEntry {
  id: string;
  name: string;
  department: Department;
  date: string;
  hours: number;
  rate: number;
}

const DEPARTMENTS: Department[] = ["Pharmacy", "Lab", "Nursing", "Clinical Doctor", "Housekeeper", "Admin"];

export function LocumTable() {
  const [entries, setEntries] = useState<LocumEntry[]>([
    { id: "1", name: "Jane Doe", department: "Nursing", date: "2023-10-25", hours: 12, rate: 500 },
    { id: "2", name: "Dr. Smith", department: "Clinical Doctor", date: "2023-10-26", hours: 8, rate: 1500 },
  ]);

  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState<Department>("Nursing");
  const [newDate, setNewDate] = useState("");
  const [newHours, setNewHours] = useState("");
  const [newRate, setNewRate] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate || !newHours || !newRate) return;

    const entry: LocumEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      department: newDept,
      date: newDate,
      hours: parseFloat(newHours),
      rate: parseFloat(newRate),
    };

    setEntries([...entries, entry]);
    setNewName("");
    setNewHours("");
    setNewRate("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locum Staff Management</CardTitle>
        <CardDescription>Track ad-hoc shifts and calculate payouts.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Entry Form */}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="Name" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
            <select value={newDept} onChange={e => setNewDept(e.target.value as Department)} className="w-full text-sm p-2 border rounded bg-white">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Hours</label>
            <input type="number" step="0.5" value={newHours} onChange={e => setNewHours(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="0" required />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Rate (KES)</label>
            <input type="number" value={newRate} onChange={e => setNewRate(e.target.value)} className="w-full text-sm p-2 border rounded" placeholder="0" required />
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
                <th className="px-4 py-3">Locum Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Shift Date</th>
                <th className="px-4 py-3 text-right">Hours</th>
                <th className="px-4 py-3 text-right">Rate</th>
                <th className="px-4 py-3 text-right">Total Payout</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{entry.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{entry.department}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3 text-right">{entry.hours}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(entry.rate)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(entry.hours * entry.rate)}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No locum shifts recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
