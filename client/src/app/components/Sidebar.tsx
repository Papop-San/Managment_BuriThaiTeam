import { ReactNode } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";



interface SidebarComponentProps {
  children: ReactNode;
}

export function SidebarComponent({ children }: SidebarComponentProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="text-center">
            <p className="text-3xl font-semibold">Buri Thai Team </p>
          </SidebarHeader>
          <SidebarContent>{/* เมนูหรือเนื้อหาอื่น */}</SidebarContent>
          <SidebarFooter>
            <p>Footer</p>
          </SidebarFooter>
        </Sidebar>

        {/* เนื้อหาหลัก */}
        <main className="flex-1 p-3 ml-6  flex flex-col">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
