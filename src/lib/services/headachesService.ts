import { supabase } from "@/lib/supabase";

export interface HeadachePayload {
  description: string;
  urgency: string;
  department: string;
  status: string;
  reported_by_name: string;
  date_reported: string;
}

export interface HeadacheResponse extends HeadachePayload {
  id: string;
}

export const headachesService = {
  async fetchActiveHeadaches(): Promise<HeadacheResponse[]> {
    const { data, error } = await supabase
      .from('headaches')
      .select('*')
      .neq('status', 'Resolved')
      .order('date_reported', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as HeadacheResponse[]) || [];
  },

  async logHeadache(payload: HeadachePayload): Promise<HeadacheResponse> {
    const { data, error } = await supabase
      .from('headaches')
      .insert([payload])
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("No data returned from insert.");
    return data[0] as HeadacheResponse;
  },

  async resolveHeadache(id: string): Promise<void> {
    const { error } = await supabase
      .from('headaches')
      .update({ status: 'Resolved' })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
