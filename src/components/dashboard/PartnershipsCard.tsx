import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Link as LinkIcon, FlaskConical } from "lucide-react";

export function PartnershipsCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="w-5 h-5 mr-2 text-primary" />
          Partnerships & Integrations
        </CardTitle>
        <CardDescription>External services and integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800">External Lab Referrals</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            Integration pending. Once partner APIs are finalized, automated lab referral tracking will appear here.
          </p>
          <button className="mt-4 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 disabled:opacity-50" disabled>
            Configure Integration
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
