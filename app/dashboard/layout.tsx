import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-slate-50 dark:bg-background min-h-screen">
        <div className="border-b bg-white dark:bg-sidebar px-4 py-3 shadow-sm flex items-center">
            <SidebarTrigger />
            <span className="font-semibold ml-4 text-sm tracking-wide">DASHBOARD PANEL</span>
        </div>
        <div className="p-6 md:p-10 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
        <Toaster position="bottom-right" richColors />
      </main>
    </SidebarProvider>
  )
}
