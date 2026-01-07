"use client"

import { cn } from "@/lib/utils"

interface AnimatedGradientProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 animate-gradient-shift">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse-slow" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
