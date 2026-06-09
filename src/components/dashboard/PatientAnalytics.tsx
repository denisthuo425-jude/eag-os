"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Loader2 } from "lucide-react";

interface VisitData {
  date: string;
  count: number;
}

interface UnfulfilledData {
  name: string;
  value: number;
}

const PIE_COLORS = ["#7f1d1d", "#b91c1c", "#dc2626", "#f87171", "#fca5a5"];

export function PatientAnalytics() {
  const [visitsData, setVisitsData] = useState<VisitData[]>([]);
  const [unfulfilledData, setUnfulfilledData] = useState<UnfulfilledData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);

    try {
      // Fetch Patient Visits
      const { data: visits, error: visitsError } = await supabase
        .from("patient_visits")
        .select("visit_date");

      if (visitsError) throw visitsError;

      if (visits) {
        const groupedVisits = visits.reduce((acc, visit) => {
          const date = visit.visit_date;
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Sort by date and take last 7 days for a clean chart
        const formattedVisits = Object.entries(groupedVisits)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7);

        setVisitsData(formattedVisits);
      }

      // Fetch Unfulfilled Services
      const { data: unfulfilled, error: unfulfilledError } = await supabase
        .from("unfulfilled_services")
        .select("reason");

      if (unfulfilledError) throw unfulfilledError;

      if (unfulfilled) {
        const groupedUnfulfilled = unfulfilled.reduce((acc, item) => {
          const reason = item.reason;
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const formattedUnfulfilled = Object.entries(groupedUnfulfilled)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setUnfulfilledData(formattedUnfulfilled);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-80 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm font-medium">Loading Analytics Engine...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Patient Volume Trend (Deep Blue/Slate) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
          <CardTitle className="text-lg text-slate-800">Weekly Patient Footfall</CardTitle>
          <CardDescription>7-day rolling trend of successful visits.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-72">
          {visitsData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">No visit data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} name="Patients" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Missed Revenue / Turnaways (Charcoal/Crimson) */}
      <Card className="border-red-100 shadow-sm">
        <CardHeader className="pb-2 border-b border-red-50 bg-red-50/30 rounded-t-lg">
          <CardTitle className="text-lg text-red-900">Missed Revenue Distribution</CardTitle>
          <CardDescription className="text-red-700/80">Primary reasons for patient turnaways.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-72">
          {unfulfilledData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">No turnaway data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unfulfilledData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {unfulfilledData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #fee2e2', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#7f1d1d', fontWeight: 500 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-700 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
