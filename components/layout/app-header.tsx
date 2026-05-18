"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { Bell, ChevronDown, Search, ShieldAlert } from "lucide-react";

type SupportedLocale = "fr" | "ar";

export function AppHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const userName = "Admin Cabinet";
  const normalizedPathname = pathname.replace(/^\/(fr|ar)(?=\/)/, '');
  const pathParts = normalizedPathname.split('/').filter(Boolean);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as SupportedLocale });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger />
      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Cabinet</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathParts.length > 1 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {pathParts[pathParts.length - 1].replaceAll('-', ' ')}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="hidden h-9 w-72 justify-start gap-2 text-muted-foreground lg:flex">
          <Search />
          <span className="truncate text-sm">Rechercher facture, client, société...</span>
        </Button>
        <Button variant="outline" size="sm" className="hidden gap-2 border-destructive/30 text-destructive md:inline-flex">
          <ShieldAlert />
          <span>19 risques</span>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <Select value={locale} onValueChange={handleLocaleChange}>
          <SelectTrigger className="h-9 w-[112px]">
            <SelectValue placeholder="Langue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium leading-4">{userName}</div>
                <div className="text-xs text-muted-foreground">CabinetAdmin</div>
              </div>
              <ChevronDown className="hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">admin@cabinet.ma</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/cabinet/settings">Paramètres cabinet</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
