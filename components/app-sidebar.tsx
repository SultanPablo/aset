"use client"

import { Home, Layers, Box, Building2, LayoutGrid, Package, Car, ScrollText, Map, LogOut, ArrowRightLeft, Wrench, Trash2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      router.push('/login');
      router.refresh();
    }).catch(() => {
        // Fallback clear
        document.cookie = 'token=; Max-Age=-99999999; path=/';
        router.push('/login');
    });
  }

  const items = [
    { title: "Kategori Aset", url: "/dashboard/kategori", icon: Layers },
    { title: "Golongan Aset", url: "/dashboard/golongan", icon: Box },
    { title: "Properti", url: "/dashboard/properti", icon: Building2 },
    { title: "Lantai", url: "/dashboard/lantai", icon: Layers },
    { title: "Ruangan", url: "/dashboard/ruangan", icon: LayoutGrid },
    { title: "Inventaris", url: "/dashboard/inventaris", icon: Package },
    { title: "Kendaraan", url: "/dashboard/kendaraan", icon: Car },
    { title: "Sertifikat Tanah", url: "/dashboard/sertifikat", icon: ScrollText },
    { title: "Peta Geolocation", url: "/dashboard/peta", icon: Map },
    { title: "Riwayat Mutasi", url: "/dashboard/mutasi", icon: ArrowRightLeft },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Penghapusan", url: "/dashboard/penghapusan", icon: Trash2 },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="bg-sidebar-primary text-sidebar-primary-foreground border-b border-sidebar-border">
        <div className="flex h-14 w-full items-center px-4">
          <h2 className="text-xl font-extrabold tracking-tight">Manajemen Aset</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
