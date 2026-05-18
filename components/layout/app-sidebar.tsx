"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { 
  Building2, 
  LayoutDashboard, 
  Receipt, 
  Users, 
  BellRing, 
  FileUp, 
  BarChart3, 
  Settings 
} from "lucide-react";

export function AppSidebar() {
  const t = useTranslations("Index"); // Replace with Sidebar specific later if needed
  const pathname = usePathname();

  // Determine current company context from pathname (e.g. /dashboard/comp-123/invoices)
  // For MVP, we'll extract it roughly.
  const pathParts = pathname.split('/');
  const isDashboard = pathParts[1] === 'dashboard';
  const potentialId = pathParts[2];
  
  const reservedWords = ['companies', 'settings', 'cabinet'];
  const isCompanyContext = isDashboard && potentialId && !reservedWords.includes(potentialId);
  const companyId = isCompanyContext ? potentialId : null;

  // If we are in a company workspace, links are company-specific
  const navItems = companyId ? [
    { title: "Overview", url: `/dashboard/${companyId}`, icon: LayoutDashboard },
    { title: "Invoices", url: `/dashboard/${companyId}/invoices`, icon: Receipt },
    { title: "Clients", url: `/dashboard/${companyId}/clients`, icon: Users },
    { title: "Reminders", url: `/dashboard/${companyId}/reminders`, icon: BellRing },
    { title: "Imports", url: `/dashboard/${companyId}/imports`, icon: FileUp },
    { title: "Reports", url: `/dashboard/${companyId}/reports`, icon: BarChart3 },
  ] : [
    { title: "Dashboard Cabinet", url: `/dashboard`, icon: LayoutDashboard },
    { title: "Companies", url: `/dashboard/companies`, icon: Building2 },
  ];

  const locale = useLocale();

  return (
    <Sidebar variant="inset" side={locale === 'ar' ? 'right' : 'left'}>
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="font-bold text-lg text-primary flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          <span>eFacturation</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{companyId ? 'Workspace' : 'Cabinet'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + '/')}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/cabinet/settings')}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
