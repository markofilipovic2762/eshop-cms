"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  BarChart3,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Truck,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tag,
  },
  {
    title: "Subcategories",
    href: "/dashboard/subcategories",
    icon: Layers,
  },
  {
    title: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Truck,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { expanded, setExpanded, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="h-6 w-6" />
                <span>E-commerce CMS</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-2 py-4">
              <div className="flex flex-col gap-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.title}</span>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-screen border-r bg-background transition-all duration-300 ease-in-out lg:block",
          expanded ? "w-64" : "w-16",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-2 font-semibold", expanded ? "justify-start" : "justify-center")}
          >
            <ShoppingBag className="h-6 w-6" />
            {expanded && <span>E-commerce CMS</span>}
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)] px-2 py-4">
          <div className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  !expanded && "justify-center px-0",
                )}
                title={!expanded ? link.title : undefined}
              >
                <link.icon className="h-5 w-5" />
                {expanded && <span>{link.title}</span>}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
