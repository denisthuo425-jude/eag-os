"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Clock, CalendarDays, Plus, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PaymentReminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch live data on load
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from('payment_reminders')
      .select('*')
      .order('due_date', { ascending: true });

    if (data) setReminders(data);
    setIsLoading(false);
  };

  const handleRollover = async (id: string, currentDueDate: string, amount: number, title: string) => {
    try {
      // a) Insert into expenses
      const expensePayload = {
        amount: Number(amount),
        category: 'Facility Bills',
        description: `Paid Reminder: ${title}`,
        logged_by_name: 'Admin',
        date_logged: new Date().toISOString().split('T')[0]
      };
      
      const { error: expError } = await supabase.from('expenses').insert([expensePayload]);
      if (expError) throw expError;

      // b) Update payment_reminders
      const oldDate = new Date(currentDueDate);
      oldDate.setMonth(oldDate.getMonth() + 1);
      const newDueDate = oldDate.toISOString().split('T')[0];

      const { data, error: remError } = await supabase
        .from('payment_reminders')
        .update({ due_date: newDueDate, status: 'Upcoming' })
        .eq('id', id)
        .select();

      if (remError) throw remError;

      // c) Update local React state instantly
      if (data && data.length > 0) {
        setReminders(reminders.map(rem => rem.id === id ? data[0] : rem).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
      }
    } catch (error: any) {
      alert("ERROR processing rollover: " + error.message);
      console.error(error);
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from reloading!
    if (!title || !amount || !dueDate) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title: title,
        amount: Number(amount),
        due_date: dueDate,
        status: 'Upcoming' // Default status for new bills
      };

      const { data, error } = await supabase
        .from('payment_reminders')
        .insert([payload])
        .select();

      if (error) throw error;

      // Update UI instantly
      if (data) {
        setReminders([...reminders, data[0]].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
      }

      // Clear form
      setTitle("");
      setAmount("");
      setDueDate("");
      setIsAdding(false);
    } catch (error: any) {
      alert("DATABASE REJECTED REMINDER: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>Payment Reminders</span>
          </CardTitle>
          <CardDescription>Track recurring facility bills and operational dues.</CardDescription>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-50 text-primary rounded hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">

        {/* The Add Reminder Form */}
        {isAdding && (
          <form onSubmit={handleAddReminder} className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">Add New Bill</h4>
            <div className="grid grid-cols-1 gap-2">
              <input type="text" placeholder="Bill Name (e.g., KPLC Token)" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded text-xs focus:border-primary focus:ring-primary" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Amount (KES)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded text-xs focus:border-primary focus:ring-primary" required />
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded text-xs text-slate-600 focus:border-primary focus:ring-primary" required />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center px-3 py-1 text-xs font-medium bg-primary text-white hover:bg-blue-800 rounded disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save
              </button>
            </div>
          </form>
        )}

        {/* The Live Data List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: '300px' }}>
          {isLoading ? (
            <p className="text-sm text-slate-500 animate-pulse text-center py-4">Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No upcoming payments logged.</p>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {reminder.status === "Paid" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {reminder.status === "Upcoming" && <Clock className="w-5 h-5 text-blue-500" />}
                    {reminder.status === "Due Soon" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors">{reminder.title}</p>
                    <p className="text-xs text-slate-500">Due: {new Date(reminder.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-semibold text-slate-700">
                    KES {Number(reminder.amount).toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button 
                      onClick={() => handleRollover(reminder.id, reminder.due_date, reminder.amount, reminder.title)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Mark Paid (Rolls over to next month)"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${reminder.status === "Paid" ? "bg-green-100 text-green-700" :
                        reminder.status === "Due Soon" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                      }`}>
                      {reminder.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}