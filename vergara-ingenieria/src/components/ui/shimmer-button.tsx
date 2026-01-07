"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ButtonHTMLAttributes } from "react"

interface ShimmerButtonProps {
  children: React.ReactNode
  className?: string
  shimmerColor?: string
  onClick?: () => void
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "#ffffff",
  onClick,
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative overflow-hidden rounded-lg px-8 py-3 font-semibold text-lg transition-all",
        "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
        "hover:shadow-lg hover:shadow-blue-500/50",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ["100%", "-100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}33, transparent)`,
        }}
      />
    </motion.button>
  )
}
