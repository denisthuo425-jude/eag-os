import { z } from "zod";

export const patientVisitSchema = z.object({
  visit_date: z.string().min(1, "Visit date is required"),
  age: z.number().min(0, "Age must be positive"),
  gender: z.string().min(1, "Gender is required"),
  demographic: z.string().min(1, "Demographic is required"),
  payment_type: z.string().min(1, "Payment type is required"),
  diagnosis: z.string().optional(),
});

export type PatientVisitPayload = z.infer<typeof patientVisitSchema>;
