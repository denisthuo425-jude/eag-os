"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SOURCES = [
  "M-Pesa / Cash",
  "Insurance",
  "Corporate"
];

export function AddRevenueForm() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from("clinic_revenue")
      .insert([
        {
          date: date,
          source: source,
          amount: Number(amount),
          reference_number: referenceNumber,
          logged_by_name: 'Admin'
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error adding revenue:", error);
    } else {
      setDate("");
      setSource(SOURCES[0]);
      setAmount("");
      setReferenceNumber("");
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Revenue</CardTitle>
        <CardDescription>Record facility income and payments.</CardDescription>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full text-sm p-2 border rounded bg-white"
              >
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                placeholder="e.g. MPesa Ref"
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
            {isSubmitting ? "Logging..." : "Log Revenue"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
