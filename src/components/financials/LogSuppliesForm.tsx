"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEPARTMENTS = [
  "Pharmacy",
  "Laboratory",
  "Nursing",
  "Clinical",
  "Front Office"
];

export function LogSuppliesForm() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [amount, setAmount] = useState("");
  const [grnNumber, setGrnNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from("departmental_supplies")
      .insert([
        {
          date: date,
          department: department,
          amount: parseFloat(amount),
          grn_number: grnNumber,
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error logging supplies:", error);
    } else {
      setDate("");
      setDepartment(DEPARTMENTS[0]);
      setAmount("");
      setGrnNumber("");
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Departmental Supplies</CardTitle>
        <CardDescription>Record Goods Received Notes (GRN).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-sm p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount (KES)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-sm p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full text-sm p-2 border rounded bg-white"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">GRN Number</label>
              <input
                type="text"
                value={grnNumber}
                onChange={e => setGrnNumber(e.target.value)}
                placeholder="e.g. GRN-001"
                className="w-full text-sm p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isSubmitting ? "Logging..." : "Log Supplies"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
