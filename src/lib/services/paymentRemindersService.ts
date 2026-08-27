import { supabase } from "@/lib/supabase";

export interface PaymentReminderPayload {
  title: string;
  amount: number;
  due_date: string;
  status: string;
}

export interface PaymentReminderResponse extends PaymentReminderPayload {
  id: string;
}

export const paymentRemindersService = {
  async fetchReminders(): Promise<PaymentReminderResponse[]> {
    const { data, error } = await supabase
      .from('payment_reminders')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as PaymentReminderResponse[]) || [];
  },

  async addReminder(payload: PaymentReminderPayload): Promise<PaymentReminderResponse> {
    const { data, error } = await supabase
      .from('payment_reminders')
      .insert([payload])
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("No data returned from insert.");
    return data[0] as PaymentReminderResponse;
  },

  async rolloverReminder(id: string, currentDueDate: string, amount: number, title: string): Promise<PaymentReminderResponse> {
    // a) Insert into expenses
    const expensePayload = {
      amount: Number(amount),
      category: 'Facility Bills',
      description: `Paid Reminder: ${title}`,
      logged_by_name: 'Admin',
      date_logged: new Date().toISOString().split('T')[0]
    };
    
    const { error: expError } = await supabase.from('expenses').insert([expensePayload]);
    if (expError) throw new Error(expError.message);

    // b) Update payment_reminders
    const oldDate = new Date(currentDueDate);
    oldDate.setMonth(oldDate.getMonth() + 1);
    const newDueDate = oldDate.toISOString().split('T')[0];

    const { data, error: remError } = await supabase
      .from('payment_reminders')
      .update({ due_date: newDueDate, status: 'Upcoming' })
      .eq('id', id)
      .select();

    if (remError) throw new Error(remError.message);
    if (!data || data.length === 0) throw new Error("No data returned from update.");
    
    return data[0] as PaymentReminderResponse;
  }
};
