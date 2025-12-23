import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animated-gradient">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Header */}
          <header className="h-16 border-b border-border glass-strong flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search business or URL..."
                  className="w-80 pl-10 bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="glow-primary gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Run New Audit</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
