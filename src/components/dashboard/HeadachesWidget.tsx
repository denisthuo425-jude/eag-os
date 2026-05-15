import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertOctagon, Clock, FileWarning } from "lucide-react";

export function HeadachesWidget() {
  const alerts = [
    {
      id: 1,
      title: "Insurance Onboarding Pending",
      description: "NHIF & SHA accreditation documents are still under review. Follow up required.",
      icon: FileWarning,
      severity: "high",
    },
    {
      id: 2,
      title: "Fundi Delays",
      description: "Plumbing fixes in the main lab are delayed by 2 days.",
      icon: Clock,
      severity: "medium",
    },
    {
      id: 3,
      title: "Unfulfilled Service Log Pending Requests",
      description: "5 outstanding items in the Google Sheet service log need attention.",
      icon: AlertOctagon,
      severity: "high",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-danger flex items-center">
          <AlertOctagon className="w-5 h-5 mr-2" />
          Operations & Blockers ("Headaches")
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <div className="mt-0.5">
              <alert.icon className={`w-5 h-5 ${alert.severity === 'high' ? 'text-danger' : 'text-orange-500'}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{alert.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
