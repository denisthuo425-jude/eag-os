import { LogPatientVisitForm } from "@/components/operations/LogPatientVisitForm";
import { UnfulfilledServicesLog } from "@/components/operations/UnfulfilledServicesLog";
import { PatientAnalytics } from "@/components/dashboard/PatientAnalytics";
import { DailyHMISUpload } from "@/components/operations/DailyHMISUpload";

export default function PatientsPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Patient Logs & Demographics</h1>
        <p className="text-slate-500 mt-1">Record and track daily patient footfall, demographics, and payment types.</p>
      </div>

      {/* Section 1: Executive Analytics (Top Full Width) */}
      <PatientAnalytics />

      {/* Section 2: Data Entry & Operational Logs (Bottom Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <LogPatientVisitForm />
          <DailyHMISUpload />
        </div>
        <div className="lg:col-span-7">
          <UnfulfilledServicesLog />
        </div>
      </div>
    </div>
  );
}
