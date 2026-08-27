"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertOctagon, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { headachesService, HeadacheResponse } from "@/lib/services/headachesService";

export function HeadachesWidget() {
  const [headaches, setHeadaches] = useState<HeadacheResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [department, setDepartment] = useState("General / Facility");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active headaches on load
  const fetchHeadaches = async () => {
    setIsLoading(true);
    try {
      const data = await headachesService.fetchActiveHeadaches();
      setHeadaches(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Fetch error: " + error.message);
      } else {
        toast.error("Fetch error: Unknown error");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHeadaches();
  }, []);

  // Handle Form Submission
  const handleLogHeadache = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing instantly
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        description,
        urgency,
        department,
        status: 'Logged',
        reported_by_name: 'Admin', // Hardcoded until user logins are linked
        date_reported: new Date().toISOString().split('T')[0],
      };

      await headachesService.logHeadache(payload);

      // Success! Clear the form and refresh the list
      setDescription("");
      setUrgency("Medium");
      setDepartment("General / Facility");
      await fetchHeadaches();

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("DATABASE REJECTED INSERT: " + error.message);
      } else {
        toast.error("DATABASE REJECTED INSERT: Unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Marking as Resolved
  const handleResolve = async (id: string) => {
    try {
      await headachesService.resolveHeadache(id);
      // Remove from UI immediately
      setHeadaches(headaches.filter(h => h.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to resolve: " + error.message);
      } else {
        toast.error("Failed to resolve: Unknown error");
      }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-danger flex items-center">
          <AlertOctagon className="w-5 h-5 mr-2" />
          Operations & Blockers ("Headaches")
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">

        {/* The Submission Form */}
        <form onSubmit={handleLogHeadache} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <input
            type="text"
            required
            placeholder="Report a new blocker (e.g. Plumbing delay)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-primary focus:border-primary"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="p-2 text-sm border border-slate-300 rounded bg-white min-w-[120px]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="p-2 text-sm border border-slate-300 rounded bg-white flex-1 min-w-[140px]"
            >
              <option value="General / Facility">General / Facility</option>
              <option value="Nursing">Nursing</option>
              <option value="Clinical">Clinical</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Laboratory">Laboratory</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 min-w-[80px]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "+ Log"}
            </button>
          </div>
        </form>

        {/* The Live List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="text-center text-sm text-slate-500 py-4">Loading active blockers...</div>
          ) : headaches.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-4">No active blockers. Great job!</div>
          ) : (
            headaches.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 bg-white border border-red-100 shadow-sm rounded-lg group">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <AlertOctagon className={`w-5 h-5 ${alert.urgency === 'Critical' || alert.urgency === 'High' ? 'text-danger' : 'text-orange-500'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{alert.description}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                      <span className="font-medium px-2 py-0.5 bg-slate-100 rounded-full">{alert.department}</span>
                      <span>•</span>
                      <span>{alert.urgency} Urgency</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(alert.id)}
                  title="Mark as Resolved"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-success p-1"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  );
}