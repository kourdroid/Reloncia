"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
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
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/(fr|ar)(?=\/)/, '');
  const pathParts = normalizedPathname.split('/');
  const isDashboard = pathParts[1] === 'dashboard';
  const potentialId = pathParts[2];
  
  const reservedWords = ['companies', 'settings', 'cabinet'];
  const isCompanyContext = isDashboard && potentialId && !reservedWords.includes(potentialId);
  const companyId = isCompanyContext ? potentialId : null;

  const navItems = companyId ? [
    { title: "Vue société", url: `/dashboard/${companyId}`, icon: LayoutDashboard },
    { title: "Factures", url: `/dashboard/${companyId}/invoices`, icon: Receipt },
    { title: "Clients", url: `/dashboard/${companyId}/clients`, icon: Users },
    { title: "Relances", url: `/dashboard/${companyId}/reminders`, icon: BellRing },
    { title: "Imports", url: `/dashboard/${companyId}/imports`, icon: FileUp },
    { title: "Rapports", url: `/dashboard/${companyId}/reports`, icon: BarChart3 },
  ] : [
    { title: "Pilotage cabinet", url: `/dashboard`, icon: LayoutDashboard },
    { title: "Sociétés clientes", url: `/dashboard/companies`, icon: Building2 },
  ];

  const locale = useLocale();

  return (
    <Sidebar collapsible="icon" variant="inset" side={locale === 'ar' ? 'right' : 'left'}>
      <SidebarHeader className="min-h-16 px-3 py-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Receipt />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold leading-5">eFacturation</div>
            <div className="truncate text-xs text-muted-foreground">AR Control Center</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{companyId ? 'Société' : 'Cabinet'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={normalizedPathname === item.url || normalizedPathname.startsWith(item.url + '/')}
                  >
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
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Suivi aujourd’hui</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mx-2 rounded-md border bg-sidebar-accent/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-sidebar-foreground">Risque 69-21</span>
                <Badge variant="destructive">19</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Factures à traiter avant le seuil légal.
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Paramètres"
              isActive={
                normalizedPathname.startsWith('/dashboard/settings') ||
                normalizedPathname.startsWith('/dashboard/cabinet/settings')
              }
            >
              <Link href="/dashboard/settings">
                <Settings />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
