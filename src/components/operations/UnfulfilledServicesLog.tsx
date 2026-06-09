"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Plus, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ServiceRequested = "Dental" | "Optical" | "Specialist" | "Other";
type Reason = "No Insurance" | "Service Unavailable" | "Other";

interface UnfulfilledService {
  id: string;
  date_logged: string;
  service_requested: ServiceRequested;
  reason: Reason;
  notes: string;
}

export function UnfulfilledServicesLog() {
  const [logs, setLogs] = useState<UnfulfilledService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [formService, setFormService] = useState<ServiceRequested>("Dental");
  const [formReason, setFormReason] = useState<Reason>("Service Unavailable");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('unfulfilled_services')
      .select('*')
      .order('date_logged', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching unfulfilled services:", error);
    } else if (data) {
      setLogs(data as UnfulfilledService[]);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDate || !formService || !formReason) return;
    setIsSubmitting(true);

    const payload = {
      date_logged: formDate,
      service_requested: formService,
      reason: formReason,
      notes: formNotes
    };

    const { data, error } = await supabase
      .from('unfulfilled_services')
      .insert([payload])
      .select();

    if (error) {
      console.error("Error adding log:", error);
      alert("Error saving log: " + error.message);
    } else if (data) {
      setLogs([data[0] as UnfulfilledService, ...logs]);
      setFormDate("");
      setFormService("Dental");
      setFormReason("Service Unavailable");
      setFormNotes("");
      setIsAdding(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="h-full flex flex-col border-red-100">
      <CardHeader className="flex flex-row items-start justify-between pb-2 bg-red-50/50 rounded-t-lg">
        <div>
          <CardTitle className="flex items-center space-x-2 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Missed Revenue & Alerts</span>
          </CardTitle>
          <CardDescription className="text-red-700/80">Track unfulfilled patient services and missed revenue.</CardDescription>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-white text-red-600 rounded shadow-sm hover:bg-red-50 border border-red-100 transition-colors"
          title="Log Manually"
        >
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4">
        {isAdding && (
          <form onSubmit={handleAdd} className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-800 border-b pb-1">Log Unfulfilled Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full text-sm p-2 border rounded focus:border-red-500 focus:ring-red-500" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Requested</label>
                <select value={formService} onChange={e => setFormService(e.target.value as ServiceRequested)} className="w-full text-sm p-2 border rounded bg-white focus:border-red-500 focus:ring-red-500">
                  <option value="Dental">Dental</option>
                  <option value="Optical">Optical</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason</label>
                <select value={formReason} onChange={e => setFormReason(e.target.value as Reason)} className="w-full text-sm p-2 border rounded bg-white focus:border-red-500 focus:ring-red-500">
                  <option value="No Insurance">No Insurance</option>
                  <option value="Service Unavailable">Service Unavailable</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes (Demographics, Details)</label>
                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} className="w-full text-sm p-2 border rounded focus:border-red-500 focus:ring-red-500" rows={2} placeholder="Optional notes..."></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded transition-colors disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save Log
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: '300px' }}>
          {isLoading ? (
            <p className="text-sm text-slate-500 animate-pulse text-center py-4">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No unfulfilled services logged yet.</p>
          ) : (
            logs.map((log) => {
              // Parse notes string: "Name: Joseph | Phone: ... | Notes: text"
              const parsed: Record<string, string> = {};
              let rawNotes = log.notes;
              if (log.notes && log.notes.includes('|')) {
                const parts = log.notes.split('|').map(s => s.trim());
                parts.forEach(p => {
                  const splitIdx = p.indexOf(':');
                  if (splitIdx > -1) {
                    const key = p.substring(0, splitIdx).trim();
                    const value = p.substring(splitIdx + 1).trim();
                    parsed[key] = value;
                  } else {
                    parsed['Raw'] = p;
                  }
                });
              } else if (log.notes) {
                parsed['Raw'] = log.notes;
              }

              return (
              <div key={log.id} className="flex flex-col p-3 bg-white border border-red-100 rounded-lg shadow-sm hover:border-red-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      {log.service_requested}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">{log.date_logged}</p>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                    {log.reason}
                  </span>
                </div>
                
                {Object.keys(parsed).length > 0 && (
                  <div className="mt-1 pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-1">
                    {Object.entries(parsed).map(([k, v]) => {
                       if (!v || v.toLowerCase() === 'n/a' || v.trim() === '') return null;
                       if (k === 'Raw') {
                         return <div key={k} className="col-span-2 text-xs text-slate-600">{v}</div>;
                       }
                       return (
                         <div key={k} className="text-xs truncate" title={v}>
                           <span className="font-semibold text-slate-500">{k}:</span> <span className="text-slate-700">{v}</span>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            )})
          )}
        </div>
      </CardContent>
    </Card>
  );
}
