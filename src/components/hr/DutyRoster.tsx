"use client";

import { useState } from "react";
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

const DAYS_IN_MONTH = 31;

export interface RosterRecord {
  staff_name: string;
  day: number;
  status: "D" | "OFF";
}

type RosterState = Record<string, Record<number, "D" | "OFF">>;

export function DutyRoster() {
  const [roster, setRoster] = useState<RosterState>(() => {
    const initialState: RosterState = {};
    STAFF_NAMES.forEach(name => {
      initialState[name] = {};
      for (let i = 1; i <= DAYS_IN_MONTH; i++) {
        initialState[name][i] = "D"; // Default all to Day Shift
      }
    });
    return initialState;
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleStatus = (name: string, day: number) => {
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
        for (let day = 1; day <= DAYS_IN_MONTH; day++) {
          payload.push({
            staff_name: name,
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

  const daysArray = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

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
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save Roster"}
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 min-w-[150px] sticky left-0 bg-slate-100 z-20 border-r border-slate-200">Staff Name</th>
                {daysArray.map(day => (
                  <th key={day} className="px-2 py-3 text-center min-w-[50px] border-r border-slate-200">{day}</th>
                ))}
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
                    return (
                      <td key={day} className="p-1 border-r border-slate-100 text-center">
                        <button
                          onClick={() => toggleStatus(name, day)}
                          className={`w-full h-full py-1.5 rounded font-bold text-xs transition-colors ${
                            status === "D" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"
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
        </div>
      </CardContent>
    </Card>
  );
}
