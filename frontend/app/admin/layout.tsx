"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  House, 
  DeviceMobile, 
  Users, 
  Gear, 
  SignOut,
  List,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", icon: House, label: "Dashboard" },
  { href: "/admin/catalog", icon: DeviceMobile, label: "Catálogo" },
  { href: "/admin/users", icon: Users, label: "Usuarios" },
  { href: "/admin/settings", icon: Gear, label: "Configuración" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-background border-r border-border flex-col fixed h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded flex items-center justify-center">
              <List className="size-5 text-primary-foreground" weight="bold" />
            </div>
            <h1 className="text-lg font-semibold">Admin</h1>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-5" weight="bold" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <SignOut className="size-5" weight="bold" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="size-7 bg-primary rounded flex items-center justify-center">
            <List className="size-4 text-primary-foreground" weight="bold" />
          </div>
          <h1 className="text-base font-semibold">Admin</h1>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}