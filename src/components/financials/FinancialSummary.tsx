import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  grossRevenue: number;
  totalExpenses: number;
}

export function FinancialSummary({ grossRevenue, totalExpenses }: FinancialSummaryProps) {
  const netProfit = grossRevenue - totalExpenses;
  const isProfitable = netProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Gross Revenue</CardTitle>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800">{formatCurrency(grossRevenue)}</div>
          <p className="text-xs text-slate-400 mt-1">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-400">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-slate-400 mt-1">+4% from last month</p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${isProfitable ? 'border-l-success' : 'border-l-danger'}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Net Profit</CardTitle>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isProfitable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(netProfit)}
          </div>
          <p className="text-xs text-slate-400 mt-1">{isProfitable ? 'On track' : 'Needs attention'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
