"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertOctagon, Clock, FileWarning, CheckCircle, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Headache {
  id: string;
  date_reported: string;
  reported_by_name: string;
  description: string;
  status: string;
  urgency: "High" | "Medium" | "Low";
  department: string;
}

const URGENCY_LEVELS = ["High", "Medium", "Low"] as const;
const DEPARTMENTS = ["Pharmacy", "Lab", "Nursing", "Clinical Doctor", "Housekeeper", "Admin", "Front Office"];

export function HeadachesWidget() {
  const [headaches, setHeadaches] = useState<Headache[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"High" | "Medium" | "Low">("Medium");
  const [department, setDepartment] = useState("Nursing");

  const fetchHeadaches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("headaches")
      .select("*")
      .neq("status", "Resolved"); // CRITICAL: Only fetch unresolved

    if (error) {
      console.error("Error fetching headaches:", error);
    } else if (data) {
      // Sort by urgency in JS since it's a string enum
      const sorted = (data as Headache[]).sort((a, b) => {
        const ranks = { High: 3, Medium: 2, Low: 1 };
        return ranks[b.urgency] - ranks[a.urgency];
      });
      setHeadaches(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHeadaches();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const { data, error } = await supabase
      .from("headaches")
      .insert([
        {
          date_reported: new Date().toISOString().split('T')[0],
          reported_by_name: "Active Session User", // Ideally dynamic, but using placeholder
          description,
          status: "Logged",
          urgency,
          department,
        }
      ])
      .select();

    if (error) {
      console.error("Error adding headache:", error);
    } else if (data) {
      // Re-fetch to ensure correct sorting
      fetchHeadaches();
      setDescription("");
      setUrgency("Medium");
      setDepartment("Nursing");
    }
  };

  const markResolved = async (id: string) => {
    const { error } = await supabase
      .from("headaches")
      .update({ status: "Resolved" })
      .eq("id", id);

    if (error) {
      console.error("Error resolving headache:", error);
    } else {
      // Remove from state instantly for snappy UI
      setHeadaches(headaches.filter(h => h.id !== id));
    }
  };

  const getIcon = (urg: string) => {
    if (urg === "High") return AlertOctagon;
    if (urg === "Medium") return Clock;
    return FileWarning;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-danger flex items-center">
          <AlertOctagon className="w-5 h-5 mr-2" />
          Operations & Blockers ("Headaches")
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        
        {/* Add Form */}
        <form onSubmit={handleAdd} className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2">
          <div className="flex flex-col space-y-2">
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Report a new blocker..." 
              className="w-full text-sm p-2 border rounded" 
              required 
            />
            <div className="flex space-x-2">
              <select 
                value={urgency} 
                onChange={e => setUrgency(e.target.value as any)} 
                className="w-1/3 text-sm p-2 border rounded bg-white"
              >
                {URGENCY_LEVELS.map(u => <option key={u} value={u}>{u} Urgency</option>)}
              </select>
              <select 
                value={department} 
                onChange={e => setDepartment(e.target.value)} 
                className="w-1/3 text-sm p-2 border rounded bg-white"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button type="submit" className="w-1/3 flex items-center justify-center p-2 bg-primary text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4 mr-1" /> Log
              </button>
            </div>
          </div>
        </form>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <p className="text-sm text-center text-slate-500 py-4">Loading active blockers...</p>
          ) : headaches.length === 0 ? (
            <p className="text-sm text-center text-slate-500 py-4">No active blockers. Great job!</p>
          ) : headaches.map((alert) => {
            const Icon = getIcon(alert.urgency);
            return (
              <div key={alert.id} className="flex items-start justify-between space-x-3 p-3 bg-red-50 border border-red-100 rounded-lg group">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <Icon className={`w-5 h-5 ${alert.urgency === 'High' ? 'text-danger' : 'text-orange-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-slate-800">{alert.department}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        alert.urgency === 'High' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                      }`}>
                        {alert.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Logged by: {alert.reported_by_name} on {alert.date_reported}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => markResolved(alert.id)}
                  title="Mark as Resolved"
                  className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
