import { FinancialSummary } from "@/components/financials/FinancialSummary";
import { ExpenseBreakdown } from "@/components/financials/ExpenseBreakdown";
import { AddExpenseForm } from "@/components/financials/AddExpenseForm";
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

  // Calculate Totals
  const GROSS_REVENUE = 2500000;
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

      {/* Middle Row: The New Data Entry Form */}
      <AddExpenseForm />

      {/* Bottom Row: The Breakdown Data */}
      <ExpenseBreakdown
        grossRevenue={GROSS_REVENUE}
        expenses={groupedExpenses}
        departmentalSupplies={departmentalSupplies}
      />
    </div>
  );
}