import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HeadachesWidget } from "@/components/dashboard/HeadachesWidget";
import { PatientInsightsWidget } from "@/components/dashboard/PatientInsightsWidget";
import { DollarSign, Users, AlertCircle, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Force Next.js to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Calculate Financials
  const { data: expensesData } = await supabase.from("expenses").select("amount");
  const { data: suppliesData } = await supabase.from("departmental_supplies").select("amount");
  const { data: revenueData } = await supabase.from("clinic_revenue").select("amount");
  
  const totalOpEx = (expensesData || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalSupplies = (suppliesData || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalExpenses = totalOpEx + totalSupplies;
  
  const totalRevenue = (revenueData || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  
  const netProfit = totalRevenue - totalExpenses;

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
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-slate-400 mt-1">Live from clinic_revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Expenses</CardTitle>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-slate-400 mt-1">OpEx + Departmental Supplies</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-300">Net Profit</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Revenue minus Expenses</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] lg:h-[600px]">
        <HeadachesWidget />
        <PatientInsightsWidget />
      </div>
    </div>
  );
}