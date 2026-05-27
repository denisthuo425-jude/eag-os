import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Clock, CalendarDays } from "lucide-react";

const REMINDERS = [
  { id: 1, title: "WiFi & Comms", dueDate: "30th", amount: "5,000", status: "Upcoming", type: "Monthly" },
  { id: 2, title: "Garbage Collection", dueDate: "30th", amount: "2,500", status: "Upcoming", type: "Monthly" },
  { id: 3, title: "KPLC (Electricity)", dueDate: "5th", amount: "Varies", status: "Due Soon", type: "Monthly" },
  { id: 4, title: "Facility Rent", dueDate: "1st", amount: "120,000", status: "Paid", type: "Monthly" },
];

export function PaymentReminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <span>Payment Reminders</span>
        </CardTitle>
        <CardDescription>Track recurring facility bills and operational dues.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {REMINDERS.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {reminder.status === "Paid" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {reminder.status === "Upcoming" && <Clock className="w-5 h-5 text-blue-500" />}
                  {reminder.status === "Due Soon" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{reminder.title}</p>
                  <p className="text-xs text-slate-500">Due on the {reminder.dueDate} • {reminder.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">
                  {reminder.amount !== "Varies" ? `KES ${reminder.amount}` : "Varies"}
                </p>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                  reminder.status === "Paid" ? "bg-green-100 text-green-700" :
                  reminder.status === "Due Soon" ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {reminder.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
