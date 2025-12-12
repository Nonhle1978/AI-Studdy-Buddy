"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ClipboardCheck,
  FileQuestion,
  Home,
  Layers,
  PanelLeft,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/assistant",
    icon: Bot,
    label: "AI Assistant",
  },
  {
    href: "/flashcards",
    icon: Layers,
    label: "Flashcards",
  },
  {
    href: "/quizzes",
    icon: FileQuestion,
    label: "Quizzes",
  },
  {
    href: "/exams",
    icon: ClipboardCheck,
    label: "Mock Exams",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border"
      >
        <SidebarHeader className="p-4">
          <div className="flex w-full items-center justify-between">
            <div
              className={cn(
                "duration-200 flex items-center gap-2 overflow-hidden transition-[width] group-data-[collapsible=icon]:w-0"
              )}
            >
              <Logo />
            </div>
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft />
              </Button>
            </SidebarTrigger>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{
                      children: item.label,
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 items-center flex">
          <div className="duration-200 flex w-full items-center justify-end overflow-hidden transition-[width] group-data-[collapsible=icon]:justify-center">
            <UserNav />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
