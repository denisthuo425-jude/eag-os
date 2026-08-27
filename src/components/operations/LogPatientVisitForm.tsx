"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { patientService } from "@/lib/services/patientService";
import { PatientVisitPayload } from "@/lib/schemas/patientSchema";

export function LogPatientVisitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [demographic, setDemographic] = useState("Adult");
  const [paymentType, setPaymentType] = useState("Cash/M-Pesa");
  const [diagnosis, setDiagnosis] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: PatientVisitPayload = {
        visit_date: visitDate,
        age: Number(age),
        gender: gender,
        demographic: demographic,
        payment_type: paymentType,
      };

      if (diagnosis.trim() !== "") {
        payload.diagnosis = diagnosis.trim();
      }

      await patientService.logPatientVisit(payload);

      setAge("");
      setDiagnosis("");
      
      toast.success("Patient visit logged successfully!");

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("DATABASE REJECTED LOG: " + err.message);
      } else {
        toast.error("DATABASE REJECTED LOG: Unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Log Patient Visit</span>
        </CardTitle>
        <CardDescription>Record daily patient demographics and diagnostics.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
                placeholder="e.g., 50"
                className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-2 border border-slate-300 rounded text-sm bg-white focus:ring-primary focus:border-primary">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Demographic</label>
              <select value={demographic} onChange={e => setDemographic(e.target.value)} className="w-full p-2 border border-slate-300 rounded text-sm bg-white focus:ring-primary focus:border-primary">
                <option value="Adult">Adult</option>
                <option value="Pediatric">Pediatric</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Payment</label>
              <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full p-2 border border-slate-300 rounded text-sm bg-white focus:ring-primary focus:border-primary">
                <option value="Cash/M-Pesa">Cash/M-Pesa</option>
                <option value="Insurance">Insurance</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Primary Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g., Malaria, Upper Respiratory Tract Infection"
              className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center p-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 transition-colors">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Patient Record
          </button>
        </form>
      </CardContent>
    </Card>
  );
}