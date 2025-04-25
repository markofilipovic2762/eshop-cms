"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

type SidebarContextType = {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
