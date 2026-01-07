"use client"

import { motion } from "framer-motion"
import { Package, DollarSign, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  Package,
  DollarSign,
  AlertTriangle,
}

type IconName = keyof typeof iconMap

interface StatsCardProps {
  title: string
  value: string
  iconName: IconName
  gradient: string
  bgColor: string
  iconColor: string
  description: string
  trend?: string
  trendUp?: boolean
  delay?: number
}

export function StatsCard({
  title,
  value,
  iconName,
  gradient,
  bgColor,
  iconColor,
  description,
  trend,
  trendUp = true,
  delay = 0
}: StatsCardProps) {
  const Icon = iconMap[iconName]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
        gradient
      )} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-600 text-sm font-semibold uppercase tracking-wide">{title}</h3>
          <div className={cn(
            "p-3 rounded-xl shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300",
            bgColor
          )}>
            <Icon className={cn("h-6 w-6", iconColor)} strokeWidth={2.5} />
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <p className="text-4xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        {/* Description and Trend */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">{description}</p>
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              trendUp ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            )}>
              {trend}
            </span>
          )}
        </div>

        {/* Decorative line */}
        <div className={cn(
          "mt-4 h-1 w-0 bg-gradient-to-r rounded-full group-hover:w-full transition-all duration-500",
          gradient
        )} />
      </div>
    </motion.div>
  )
}
