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

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account", label: "Account Management" },
  { href: "/role", label: "Role Management" },
  { href: "/stock", label: "Stock Management" },
];

export function SidebarComponent({ children }: SidebarComponentProps) {
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <Sidebar className="h-full">
          <SidebarHeader className="text-center">
            <Link href="/dashboard" className="block py-2 hover:underline">
              <p className="text-2xl font-semibold">Buri Thai Team</p>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <div className="flex flex-col gap-2 p-3">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="secondary"
                    className="w-full cursor-auto hover:cursor-pointer"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
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
