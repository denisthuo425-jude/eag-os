"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Demographic = "Adult" | "Pediatric";
type PaymentType = "Cash" | "Insurance" | "Corporate";
type Gender = "Male" | "Female";

interface PatientVisit {
  id: string;
  visit_date: string;
  demographic: Demographic;
  payment_type: PaymentType;
  age: number;
  gender: Gender;
}

export function LogPatientVisitForm() {
  const [formDate, setFormDate] = useState("");
  const [formDemographic, setFormDemographic] = useState<Demographic>("Adult");
  const [formPaymentType, setFormPaymentType] = useState<PaymentType>("Cash");
  const [formAge, setFormAge] = useState("");
  const [formGender, setFormGender] = useState<Gender>("Male");
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState<PatientVisit[]>([]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDate || !formDemographic || !formPaymentType || !formAge) return;
    setLoading(true);

    const payload = {
      visit_date: formDate,
      age: Number(formAge),
      gender: formGender,
      demographic: formDemographic,
      payment_type: formPaymentType
    };

    console.log("PAYLOAD:", payload);

    const { data, error } = await supabase
      .from('patient_visits')
      .insert([payload])
      .select();

    if (error) {
      console.error("Error logging visit:", error);
      alert("Error saving visit: " + error.message);
    } else if (data) {
      setVisits([data[0] as PatientVisit, ...visits]);
      setFormDate("");
      setFormDemographic("Adult");
      setFormPaymentType("Cash");
      setFormAge("");
      setFormGender("Male");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Patient Visit</CardTitle>
        <CardDescription>Record new patient visits to track demographics and payment types.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
            <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
            <input type="number" value={formAge} onChange={e => setFormAge(e.target.value)} className="w-full text-sm p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
            <select value={formGender} onChange={e => setFormGender(e.target.value as Gender)} className="w-full text-sm p-2 border rounded bg-white">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Demographic</label>
            <select value={formDemographic} onChange={e => setFormDemographic(e.target.value as Demographic)} className="w-full text-sm p-2 border rounded bg-white">
              <option value="Adult">Adult</option>
              <option value="Pediatric">Pediatric</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Payment Type</label>
            <select value={formPaymentType} onChange={e => setFormPaymentType(e.target.value as PaymentType)} className="w-full text-sm p-2 border rounded bg-white">
              <option value="Cash">Cash</option>
              <option value="Insurance">Insurance</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-6 flex justify-end">
            <button type="submit" disabled={loading} className="w-48 flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-50">
              <UserPlus className="w-4 h-4 mr-1" /> Log Visit
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 border-b pb-2">Recently Logged (Current Session)</h3>
          {visits.length === 0 ? (
            <p className="text-xs text-slate-500">No visits logged in this session yet.</p>
          ) : (
            <ul className="space-y-2">
              {visits.map(visit => (
                <li key={visit.id} className="text-sm flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-700">{visit.visit_date}</span>
                  <span className="font-medium text-slate-900">{visit.demographic} - {visit.payment_type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
