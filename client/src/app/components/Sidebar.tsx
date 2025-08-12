import { ReactNode } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SidebarComponentProps {
  children: ReactNode;
}

export function SidebarComponent({ children }: SidebarComponentProps) {
  return (
    <SidebarProvider>
      {/* เอา min-h-screen ออก เพื่อให้ความสูงตามเนื้อหา */}
      <div className="flex w-full h-full">
        <Sidebar className="h-full">
          <SidebarHeader className="text-center">
            <Link href="/dashboard" className="block py-2 hover:underline">
              <p className="text-3xl font-semibold">Buri Thai Team</p>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <div className="flex flex-col gap-2 p-3">
              <Link href="/dashboard" >
                <Button variant="secondary"  className="w-full cursor-auto hover:cursor-pointer">
                  Dashboard
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="secondary"  className="w-full cursor-auto hover:cursor-pointer">
                  Account
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="secondary"  className="w-full cursor-auto hover:cursor-pointer">
                  Settings
                </Button>
              </Link>
            </div>
          </SidebarContent>

          <SidebarFooter>
            <p className="p-3">Footer</p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-3 ml-6 flex flex-col">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
