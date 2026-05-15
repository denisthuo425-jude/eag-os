import { HeadachesWidget } from "@/components/dashboard/HeadachesWidget";
import { PartnershipsCard } from "@/components/dashboard/PartnershipsCard";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">High-level view of facility operations and blockers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeadachesWidget />
        <PartnershipsCard />
      </div>
    </div>
  );
}
