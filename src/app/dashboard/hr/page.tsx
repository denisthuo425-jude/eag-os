import { LocumTable } from "@/components/hr/LocumTable";

export default function HRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">HR & Locum Management</h1>
        <p className="text-slate-500 mt-1">Manage staff shifts, locum payouts, and HR alerts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LocumTable />
      </div>
    </div>
  );
}
