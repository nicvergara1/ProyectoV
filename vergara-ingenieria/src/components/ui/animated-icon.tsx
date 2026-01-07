"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  gradient: string
  delay?: number
}

export function AnimatedIcon({ icon: Icon, gradient, delay = 0 }: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay, 
        type: "spring",
        stiffness: 200,
        damping: 20 
      }}
      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
    >
      <Icon className="h-6 w-6 text-white" strokeWidth={2} />
    </motion.div>
  )
}
