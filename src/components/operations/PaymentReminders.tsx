"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Clock, CalendarDays, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function getReminderStatus(dueDateStr: string, dbStatus?: string) {
  if (dbStatus === 'Paid') return 'Paid';
  
  const due = new Date(dueDateStr);
  const today = new Date();
  
  // Reset time part to purely compare dates
  due.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Overdue";
  if (diffDays <= 3) return "Due Soon";
  return "Upcoming";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function PaymentReminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        // Map and calculate status dynamically
        const processedData = data.map(rem => ({
          ...rem,
          status: getReminderStatus(rem.due_date, rem.status),
          type: rem.type || 'One-off'
        }));
        setReminders(processedData);
      }
    } catch (error) {
      console.error("Error fetching payment reminders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount || !newDueDate) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('payment_reminders').insert([
        {
          title: newTitle,
          amount: parseFloat(newAmount),
          due_date: newDueDate,
          status: 'Upcoming', // Default
          type: 'One-off'
        }
      ]);

      if (error) throw error;

      // Reset form
      setNewTitle("");
      setNewAmount("");
      setNewDueDate("");
      setIsAdding(false);

      // Refresh list
      await fetchReminders();
    } catch (error) {
      console.error("Error adding payment reminder:", error);
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
        
        {isAdding && (
          <form onSubmit={handleAddReminder} className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">Add New Reminder</h4>
            <div className="space-y-2">
              <input type="text" placeholder="Title (e.g. WiFi Bill)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded text-xs" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" placeholder="Amount (KES)" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full p-2 border rounded text-xs" required />
                <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="w-full p-2 border rounded text-xs text-slate-500" required />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsAdding(false)} disabled={isSubmitting} className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-3 py-1 text-xs font-medium bg-primary text-white hover:bg-blue-800 rounded disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Reminder"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: '350px' }}>
          {isLoading ? (
            <div className="text-center py-6 text-sm text-slate-500">Loading reminders...</div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">
              No upcoming payment reminders.
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {reminder.status === "Paid" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {(reminder.status === "Upcoming" || reminder.status === "One-off") && <Clock className="w-5 h-5 text-blue-500" />}
                    {reminder.status === "Due Soon" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    {reminder.status === "Overdue" && <AlertCircle className="w-5 h-5 text-danger" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{reminder.title}</p>
                    <p className="text-xs text-slate-500">Due on {formatDate(reminder.due_date)} • {reminder.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">
                    {reminder.amount ? `KES ${Number(reminder.amount).toLocaleString()}` : "Varies"}
                  </p>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                    reminder.status === "Paid" ? "bg-green-100 text-green-700" :
                    reminder.status === "Due Soon" ? "bg-yellow-100 text-yellow-700" :
                    reminder.status === "Overdue" ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {reminder.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
