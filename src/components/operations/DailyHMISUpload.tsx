"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { FileUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export interface DailyHMISLogPayload {
  log_date: string;
  file_url: string;
}

export function DailyHMISUpload() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file to upload.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `HMIS_${logDate}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hmis_diagnostics')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('hmis_diagnostics')
        .getPublicUrl(fileName);
        
      const fileUrl = publicUrlData.publicUrl;

      const payload: DailyHMISLogPayload = {
        log_date: logDate,
        file_url: fileUrl
      };

      const { error } = await supabase
        .from('daily_hmis_logs')
        .insert([payload]);

      if (error) throw error;

      setFile(null);
      const fileInput = document.getElementById("hmis-bulk-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      
      toast.success("Daily HMIS register uploaded successfully!");

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("UPLOAD REJECTED: " + err.message);
      } else {
        toast.error("UPLOAD REJECTED: Unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileUp className="w-5 h-5 text-primary" />
          <span>End-of-Day HMIS Upload</span>
        </CardTitle>
        <CardDescription>Upload the master daily register PDF.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Log Date</label>
              <input
                type="date"
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Master PDF File</label>
              <input
                type="file"
                id="hmis-bulk-file"
                accept="application/pdf"
                required
                onChange={handleFileChange}
                className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-primary focus:border-primary bg-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center p-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 transition-colors">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Upload Register
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
