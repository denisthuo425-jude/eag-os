import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HeadachesWidget } from "@/components/dashboard/HeadachesWidget";
import { PartnershipsCard } from "@/components/dashboard/PartnershipsCard";
import { DollarSign, Users, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Force Next.js to always fetch fresh data
export const dynamic = 'force-dynamic';

const GROSS_REVENUE = 2500000;

export default async function DashboardPage() {
  // 1. Calculate Net Profit
  const { data: expensesData } = await supabase.from("expenses").select("amount");
  const { data: suppliesData } = await supabase.from("departmental_supplies").select("amount");
  
  const totalOpEx = (expensesData || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalSupplies = (suppliesData || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = GROSS_REVENUE - (totalOpEx + totalSupplies);

  // 2. Fetch Active Personnel Count
  const { count: staffCount } = await supabase
    .from("staff")
    .select("*", { count: 'exact', head: true });

  // 3. Fetch Unresolved Blockers Count
  const { count: headachesCount } = await supabase
    .from("headaches")
    .select("*", { count: 'exact', head: true })
    .neq("status", "Resolved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Executive Command Center</h1>
        <p className="text-slate-500 mt-1">Live overview of facility operations and performance metrics.</p>
      </div>

      {/* Top Row: Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Net Profit (Baseline)</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-slate-500 mt-1">Based on KES 2.5M Gross Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Personnel</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{staffCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Registered staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Unresolved Blockers</CardTitle>
            <AlertCircle className="w-4 h-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{headachesCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Active operational headaches</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <HeadachesWidget />
        <PartnershipsCard />
      </div>
    </div>
  );
}