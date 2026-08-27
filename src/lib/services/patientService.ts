import { supabase } from "@/lib/supabase";
import { PatientVisitPayload, patientVisitSchema } from "../schemas/patientSchema";

export const patientService = {
  async logPatientVisit(payload: PatientVisitPayload) {
    try {
      const validatedData = patientVisitSchema.parse(payload);
      const { error } = await supabase
        .from('patient_visits')
        .insert([validatedData]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Unknown validation or database error.");
    }
  }
};
