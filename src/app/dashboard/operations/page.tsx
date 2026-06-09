import { AddExpenseForm } from "@/components/financials/AddExpenseForm";
import { LogSuppliesForm } from "@/components/financials/LogSuppliesForm";
import { PaymentReminders } from "@/components/operations/PaymentReminders";
import { VendorDirectory } from "@/components/operations/VendorDirectory";
import { UnfulfilledServicesLog } from "@/components/operations/UnfulfilledServicesLog";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Facility Operations</h1>
        <p className="text-slate-500 mt-1">Manage operational expenses, supplies, vendors, and reminders.</p>
      </div>

      {/* Top Row: Data Entry Forms for Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddExpenseForm />
        <LogSuppliesForm />
      </div>

      {/* Middle Row: Operational Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
        <PaymentReminders />
        <VendorDirectory />
      </div>

      {/* Bottom Row: Alerts and Missed Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UnfulfilledServicesLog />
      </div>
    </div>
  );
}
