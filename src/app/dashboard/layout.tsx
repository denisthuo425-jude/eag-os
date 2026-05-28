import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:overflow-visible">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 print:p-0 print:m-0 print:ml-0 print:w-full print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
