"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CalendarDays, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

const STAFF_NAMES = [
  "Denis Thuo",
  "Elijah Kariuki",
  "Ann Mumbi",
  "Charles Wachira",
  "George Odok",
  "Caroline Anyango",
  "Antony Wabule",
  "Valentine Mwangi"
];

export interface RosterRecord {
  staff_name: string;
  year: number;
  month: number;
  day: number;
  status: "D" | "OFF";
}

type RosterState = Record<string, Record<number, "D" | "OFF">>;

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

export function DutyRoster() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number>(31);
  const [roster, setRoster] = useState<RosterState>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    setDaysInMonth(days);

    const initialState: RosterState = {};
    STAFF_NAMES.forEach(name => {
      initialState[name] = {};
      for (let day = 1; day <= days; day++) {
        const date = new Date(selectedYear, selectedMonth, day);
        const isSunday = date.getDay() === 0;
        initialState[name][day] = isSunday ? "OFF" : "D";
      }
    });
    setRoster(initialState);
  }, [selectedMonth, selectedYear]);

  const toggleStatus = (name: string, day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    if (date.getDay() === 0) return; // Locked on Sundays

    setRoster(prev => {
      const current = prev[name][day];
      const next = current === "D" ? "OFF" : "D";
      return {
        ...prev,
        [name]: {
          ...prev[name],
          [day]: next
        }
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: RosterRecord[] = [];
      STAFF_NAMES.forEach(name => {
        for (let day = 1; day <= daysInMonth; day++) {
          payload.push({
            staff_name: name,
            year: selectedYear,
            month: selectedMonth + 1,
            day: day,
            status: roster[name][day]
          });
        }
      });
      
      const { error } = await supabase.from('duty_roster').insert(payload);
      
      if (error) throw error;
      
      toast.success("Duty Roster saved securely!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to save roster: " + err.message);
      } else {
        toast.error("Failed to save roster: Unknown error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center bg-slate-50 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>Monthly Duty Roster</span>
          </CardTitle>
          <CardDescription>Plan and lock in staff shifts for the month</CardDescription>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="p-2 border border-slate-300 rounded text-sm bg-white"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border border-slate-300 rounded text-sm bg-white"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {Object.keys(roster).length > 0 && (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 min-w-[150px] sticky left-0 bg-slate-100 z-20 border-r border-slate-200">Staff Name</th>
                  {daysArray.map(day => {
                    const date = new Date(selectedYear, selectedMonth, day);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const isSunday = date.getDay() === 0;
                    return (
                      <th key={day} className={`px-2 py-3 text-center min-w-[50px] border-r border-slate-200 ${isSunday ? 'bg-slate-200' : ''}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-400">{dayName}</span>
                          <span>{day}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {STAFF_NAMES.map((name, idx) => (
                  <tr key={name} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className={`px-4 py-3 font-medium text-slate-800 sticky left-0 z-10 border-r border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      {name}
                    </td>
                    {daysArray.map(day => {
                      const status = roster[name][day];
                      const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;
                      return (
                        <td key={day} className={`p-1 border-r border-slate-100 text-center ${isSunday ? 'bg-slate-100' : ''}`}>
                          <button
                            onClick={() => toggleStatus(name, day)}
                            disabled={isSunday}
                            className={`w-full h-full py-1.5 rounded font-bold text-xs transition-colors ${
                              status === "D" 
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                                : isSunday 
                                  ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            }`}
                          >
                            {status}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
