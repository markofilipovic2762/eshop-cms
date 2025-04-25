"use client"

import { useState, useEffect } from "react"

export function OverviewChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <svg
          className="h-40 w-full text-muted-foreground/30"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 4v20h25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M4 24 L10 14 L16 18 L22 10 L28 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          <circle cx="10" cy="14" r="1" fill="currentColor" className="text-primary" />
          <circle cx="16" cy="18" r="1" fill="currentColor" className="text-primary" />
          <circle cx="22" cy="10" r="1" fill="currentColor" className="text-primary" />
          <circle cx="28" cy="16" r="1" fill="currentColor" className="text-primary" />
        </svg>
        <p className="text-sm text-muted-foreground">Chart visualization would appear here in a real application</p>
      </div>
    </div>
  )
}
