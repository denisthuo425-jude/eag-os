import { supabase } from "@/lib/supabase";
import { OvertimeLogPayload, overtimeLogSchema } from "../schemas/overtimeSchema";
import { z } from "zod";

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  department?: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface OvertimeLogResponse extends OvertimeLogPayload {
  id: string;
}

export const overtimeService = {
  async fetchStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as Staff[]) || [];
  },

  async fetchOvertimeLogs(): Promise<OvertimeLogResponse[]> {
    const { data, error } = await supabase
      .from('overtime_logs')
      .select('*')
      .order('date_logged', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as OvertimeLogResponse[]) || [];
  },

  async bulkLogOvertime(payloads: OvertimeLogPayload[]): Promise<OvertimeLogResponse[]> {
    try {
      // Validate all payloads
      const validatedData = z.array(overtimeLogSchema).parse(payloads);

      const { data, error } = await supabase
        .from('overtime_logs')
        .insert(validatedData)
        .select();

      if (error) throw error;
      return data as OvertimeLogResponse[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Unknown validation or database error.");
    }
  }
};
