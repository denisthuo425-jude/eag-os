"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "Facility Rent",
  "KPLC (Electricity)",
  "Water",
  "WiFi & Comms",
  "Fundis (Maintenance)",
  "Medical Supplies",
  "Petty Cash"
];

const PAYMENT_METHODS = [
  "M-Pesa",
  "Bank Transfer",
  "Cash",
  "LPO"
];

export function AddExpenseForm() {
  const router = useRouter();
  
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          date,
          category,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          description,
          logged_by_name: 'Admin'
        }
      ]);
      
    setIsSubmitting(false);

    if (error) {
      console.error("Error adding expense:", error);
    } else {
      // Clear form
      setDate("");
      setCategory(CATEGORIES[0]);
      setAmount("");
      setPaymentMethod(PAYMENT_METHODS[0]);
      setDescription("");
      
      // Refresh server components
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Expense</CardTitle>
        <CardDescription>Record facility and operational costs.</CardDescription>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full text-sm p-2 border rounded bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
              <select 
                value={paymentMethod} 
                onChange={e => setPaymentMethod(e.target.value)} 
                className="w-full text-sm p-2 border rounded bg-white"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description / Notes</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="E.g., Monthly internet subscription" 
              className="w-full text-sm p-2 border rounded" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" /> 
            {isSubmitting ? "Logging..." : "Log Expense"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
