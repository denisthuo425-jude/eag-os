import { LogPatientVisitForm } from "@/components/operations/LogPatientVisitForm";
import { UnfulfilledServicesLog } from "@/components/operations/UnfulfilledServicesLog";
import { PatientAnalytics } from "@/components/dashboard/PatientAnalytics";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Patient Logs & Demographics</h1>
        <p className="text-slate-500 mt-1">Record and track daily patient footfall, demographics, and payment types.</p>
      </div>

      {/* Analytics Engine */}
      <PatientAnalytics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <LogPatientVisitForm />
        <UnfulfilledServicesLog />
      </div>
    </div>
  );
}
