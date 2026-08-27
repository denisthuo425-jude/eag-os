import { z } from "zod";

export const overtimeLogSchema = z.object({
  date_logged: z.string().min(1, "Date logged is required"),
  staff_id: z.string().min(1, "Staff ID is required"),
  staff_name: z.string().min(1, "Staff name is required"),
  hours_worked: z.number().min(0.5, "Hours worked must be at least 0.5"),
  rate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Logged", "Approved"]),
});

export type OvertimeLogPayload = z.infer<typeof overtimeLogSchema>;
