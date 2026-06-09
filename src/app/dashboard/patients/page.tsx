import { LogPatientVisitForm } from "@/components/operations/LogPatientVisitForm";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Patient Logs & Demographics</h1>
        <p className="text-slate-500 mt-1">Record and track daily patient footfall, demographics, and payment types.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LogPatientVisitForm />
      </div>
    </div>
  );
}
