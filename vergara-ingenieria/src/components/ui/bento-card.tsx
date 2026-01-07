"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BentoCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient?: string
  delay?: number
}

export function BentoCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient = "from-blue-500 to-cyan-500",
  delay = 0 
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
        gradient
      )} />
      
      <div className="relative z-10">
        <div className={cn(
          "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300",
          gradient
        )}>
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* Decorative line */}
        <div className={cn(
          "mt-4 h-1 w-0 bg-gradient-to-r rounded-full group-hover:w-full transition-all duration-500",
          gradient
        )} />
      </div>
    </motion.div>
  )
}
