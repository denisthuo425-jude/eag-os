import { FinancialSummary } from "@/components/financials/FinancialSummary";
import { ExpenseBreakdown } from "@/components/financials/ExpenseBreakdown";

// Mock Data
const MOCK_FINANCIALS = {
  grossRevenue: 2500000,
  expenses: [
    { category: "Facility Rent", amount: 550000 }, // High: > 20% of 2.5m (which is 500k)
    { category: "KPLC (Electricity)", amount: 45000 },
    { category: "Water", amount: 12000 },
    { category: "WiFi & Comms", amount: 8000 },
    { category: "Fundis (Maintenance)", amount: 25000 },
    { category: "Petty Cash", amount: 30000 },
  ],
  departmentalSupplies: [
    { department: "Laboratory", amount: 210000 },
    { department: "Pharmacy", amount: 350000 },
    { department: "Nursing", amount: 85000 },
    { department: "Clinical", amount: 40000 },
  ]
};

export default function FinancialsPage() {
  const totalOpEx = MOCK_FINANCIALS.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSupplies = MOCK_FINANCIALS.departmentalSupplies.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = totalOpEx + totalSupplies;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financials (P&L)</h1>
        <p className="text-slate-500 mt-1">Deep-dive into facility revenue and operational expenses.</p>
      </div>

      <FinancialSummary 
        grossRevenue={MOCK_FINANCIALS.grossRevenue} 
        totalExpenses={totalExpenses} 
      />

      <ExpenseBreakdown 
        grossRevenue={MOCK_FINANCIALS.grossRevenue}
        expenses={MOCK_FINANCIALS.expenses}
        departmentalSupplies={MOCK_FINANCIALS.departmentalSupplies}
      />
    </div>
  );
}
