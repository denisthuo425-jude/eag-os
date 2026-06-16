import { FinancialSummary } from "@/components/financials/FinancialSummary";
import { ExpenseBreakdown } from "@/components/financials/ExpenseBreakdown";
import { AddRevenueForm } from "@/components/financials/AddRevenueForm";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function FinancialsPage() {
  const { data: expensesData } = await supabase.from('expenses').select('*');
  const { data: suppliesData } = await supabase.from('departmental_supplies').select('*');
  const { data: revenueData } = await supabase.from('clinic_revenue').select('*'); // Target clinic_revenue instead of revenue
  
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

  const expenses = expensesData || [];
  const departmentalSupplies = suppliesData || [];
  const revenue = revenueData || [];

  // Filter current month
  const currExpenses = expenses.filter(e => isCurrentMonth(e.date_logged));
  const currSupplies = departmentalSupplies.filter(s => isCurrentMonth(s.date_logged));
  const currRevenue = revenue.filter(r => isCurrentMonth(r.date_logged));

  // Current month totals
  const revCurrent = currRevenue.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalOpEx = currExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalSupplies = currSupplies.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const expCurrent = totalOpEx + totalSupplies;

  // Previous month totals
  const revPrev = revenue.filter(r => isPrevMonth(r.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const expPrev = expenses.filter(e => isPrevMonth(e.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0) +
                  departmentalSupplies.filter(s => isPrevMonth(s.date_logged)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const calcPct = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const revPct = calcPct(revCurrent, revPrev);
  const expPct = calcPct(expCurrent, expPrev);

  // Group multiple expenses of the same category together for the UI breakdown (Current Month)
  const groupedExpenses = currExpenses.reduce((acc: any, curr: any) => {
    const existing = acc.find((e: any) => e.category === curr.category);
    if (existing) {
      existing.amount += Number(curr.amount || 0);
    } else {
      acc.push({ category: curr.category, amount: Number(curr.amount || 0) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financials (P&L)</h1>
        <p className="text-slate-500 mt-1">Deep-dive into facility revenue and operational expenses (Current Month).</p>
      </div>

      {/* Top Row: Metric Summary */}
      <FinancialSummary
        grossRevenue={revCurrent}
        totalExpenses={expCurrent}
        revPct={revPct}
        expPct={expPct}
      />

      {/* Middle Row: The Data Entry Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddRevenueForm />
      </div>

      {/* Bottom Row: The Breakdown Data */}
      <ExpenseBreakdown
        grossRevenue={revCurrent}
        expenses={groupedExpenses}
        departmentalSupplies={currSupplies}
      />
    </div>
  );
}