import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ExpenseData {
  category: string;
  amount: number;
}

interface ExpenseBreakdownProps {
  grossRevenue: number;
  expenses: ExpenseData[];
  departmentalSupplies: { department: string; amount: number }[];
}

export function ExpenseBreakdown({ grossRevenue, expenses, departmentalSupplies }: ExpenseBreakdownProps) {
  const rentExpense = expenses.find(e => e.category === 'Facility Rent')?.amount || 0;
  const isRentHigh = rentExpense > (grossRevenue * 0.20);
  
  const totalSupplies = departmentalSupplies.reduce((sum, dep) => sum + dep.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Expenses</CardTitle>
          <CardDescription>Monthly breakdown of fixed and variable costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">{expense.category}</span>
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${expense.category === 'Facility Rent' && isRentHigh ? 'text-danger' : 'text-slate-900'}`}>
                    {formatCurrency(expense.amount)}
                  </span>
                  {expense.category === 'Facility Rent' && isRentHigh && (
                    <div className="flex items-center text-danger text-xs bg-red-50 px-2 py-1 rounded" title="Rent exceeds 20% of Gross Revenue">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      > 20% Rev
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Departmental Supplies</span>
              <span className="font-semibold text-slate-900">{formatCurrency(totalSupplies)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departmental Supplies Nested Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Departmental Supplies</CardTitle>
          <CardDescription>Allocation across medical departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentalSupplies.map((dept) => (
              <div key={dept.department} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{dept.department}</span>
                  <span>{formatCurrency(dept.amount)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(dept.amount / totalSupplies) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Cost Management Insight</h4>
            <p className="text-xs text-blue-700">
              Lab supplies account for the majority of the departmental spend this month. Ensure reorder points are strictly monitored to prevent overstocking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
