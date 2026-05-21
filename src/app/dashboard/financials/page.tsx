import { FinancialSummary } from "@/components/financials/FinancialSummary";
import { ExpenseBreakdown } from "@/components/financials/ExpenseBreakdown";
import { AddExpenseForm } from "@/components/financials/AddExpenseForm";
import { AddRevenueForm } from "@/components/financials/AddRevenueForm";
import { LogSuppliesForm } from "@/components/financials/LogSuppliesForm";
import { supabase } from "@/lib/supabase";

// This forces Next.js to fetch fresh data every time you load the page
export const revalidate = 0;

export default async function FinancialsPage() {
  // 1. Fetch Expenses from Supabase
  const { data: expensesData } = await supabase.from('expenses').select('*');
  const expenses = expensesData || [];

  // 2. Fetch Departmental Supplies from Supabase
  const { data: suppliesData } = await supabase.from('departmental_supplies').select('*');
  const departmentalSupplies = suppliesData || [];

  // 3. Fetch Revenue from Supabase
  const { data: revenueData } = await supabase.from('revenue').select('*');
  const revenue = revenueData || [];

  // Calculate Totals
  const GROSS_REVENUE = revenue.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalOpEx = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalSupplies = departmentalSupplies.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = totalOpEx + totalSupplies;

  // Group multiple expenses of the same category together for the UI breakdown
  const groupedExpenses = expenses.reduce((acc: any, curr: any) => {
    const existing = acc.find((e: any) => e.category === curr.category);
    if (existing) {
      existing.amount += Number(curr.amount);
    } else {
      acc.push({ category: curr.category, amount: Number(curr.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financials (P&L)</h1>
        <p className="text-slate-500 mt-1">Deep-dive into facility revenue and operational expenses.</p>
      </div>

      {/* Top Row: Metric Summary */}
      <FinancialSummary
        grossRevenue={GROSS_REVENUE}
        totalExpenses={totalExpenses}
      />

      {/* Middle Row: The Data Entry Forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddRevenueForm />
        <LogSuppliesForm />
        <AddExpenseForm />
      </div>

      {/* Bottom Row: The Breakdown Data */}
      <ExpenseBreakdown
        grossRevenue={GROSS_REVENUE}
        expenses={groupedExpenses}
        departmentalSupplies={departmentalSupplies}
      />
    </div>
  );
}