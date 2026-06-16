import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HeadachesWidget } from "@/components/dashboard/HeadachesWidget";
import { PatientInsightsWidget } from "@/components/dashboard/PatientInsightsWidget";
import { DollarSign, Users, AlertCircle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Force Next.js to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Calculate Financials with Time-Travel (MoM)
  const { data: expensesData } = await supabase.from("expenses").select("amount, date_logged");
  const { data: suppliesData } = await supabase.from("departmental_supplies").select("amount, date_logged");
  const { data: revenueData } = await supabase.from("clinic_revenue").select("amount, date_logged");
  
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const isCurrentMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= currentMonthStart;
  };

  const isPrevMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= prevMonthStart && d <= prevMonthEnd;
  };

  // Current Month Totals
  const revCurrent = (revenueData || []).filter(r => isCurrentMonth(r.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const expCurrent = (expensesData || []).filter(e => isCurrentMonth(e.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0) +
                     (suppliesData || []).filter(s => isCurrentMonth(s.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const profitCurrent = revCurrent - expCurrent;

  // Previous Month Totals
  const revPrev = (revenueData || []).filter(r => isPrevMonth(r.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const expPrev = (expensesData || []).filter(e => isPrevMonth(e.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0) +
                  (suppliesData || []).filter(s => isPrevMonth(s.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const calcPct = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const revPct = calcPct(revCurrent, revPrev);
  const expPct = calcPct(expCurrent, expPrev);

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
            <div className="text-2xl font-bold text-white">{formatCurrency(revCurrent)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${revPct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {revPct >= 0 ? '+' : ''}{revPct.toFixed(1)}%
              </span>
              <p className="text-xs text-slate-400 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Expenses</CardTitle>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(expCurrent)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${expPct <= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {expPct > 0 ? '+' : ''}{expPct.toFixed(1)}%
              </span>
              <p className="text-xs text-slate-400 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${profitCurrent >= 0 ? 'from-slate-900 to-slate-800 border-slate-700' : 'from-rose-950 to-rose-900 border-rose-800'} text-white shadow-lg relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${profitCurrent >= 0 ? 'bg-primary/20' : 'bg-rose-500/20'} blur-2xl rounded-full`}></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className={`text-sm font-medium ${profitCurrent >= 0 ? 'text-slate-300' : 'text-rose-200'}`}>Net Profit</CardTitle>
            <Activity className={`w-4 h-4 ${profitCurrent >= 0 ? 'text-primary' : 'text-rose-400'}`} />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${profitCurrent >= 0 ? 'text-white' : 'text-rose-100'}`}>
              {formatCurrency(profitCurrent)}
            </div>
            <div className="flex items-center mt-1">
              {profitCurrent >= 0 ? (
                <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 mr-1" /> On track
                </span>
              ) : (
                <span className="flex items-center text-xs font-semibold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                  <TrendingDown className="w-3 h-3 mr-1" /> Needs attention
                </span>
              )}
            </div>
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