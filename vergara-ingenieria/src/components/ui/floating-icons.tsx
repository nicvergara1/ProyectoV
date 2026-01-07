"use client"

import { motion } from "framer-motion"
import { Zap, Lightbulb, Shield, Cpu } from "lucide-react"

const icons = [
  { 
    Icon: Zap, 
    color: "text-yellow-400",
    size: 48,
    initialX: -20,
    initialY: -30,
    animateX: -80,
    animateY: 60,
    duration: 20,
    left: "20%",
    top: "30%"
  },
  { 
    Icon: Lightbulb, 
    color: "text-blue-400",
    size: 52,
    initialX: 30,
    initialY: -40,
    animateX: 90,
    animateY: -70,
    duration: 22,
    left: "40%",
    top: "40%"
  },
  { 
    Icon: Shield, 
    color: "text-green-400",
    size: 55,
    initialX: -45,
    initialY: 20,
    animateX: -95,
    animateY: 85,
    duration: 18,
    left: "60%",
    top: "50%"
  },
  { 
    Icon: Cpu, 
    color: "text-purple-400",
    size: 50,
    initialX: 25,
    initialY: 35,
    animateX: 70,
    animateY: -60,
    duration: 24,
    left: "80%",
    top: "60%"
  },
]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, size, initialX, initialY, animateX, animateY, duration, left, top }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color}`}
          initial={{
            x: initialX,
            y: initialY,
            opacity: 0,
          }}
          animate={{
            x: animateX,
            y: animateY,
            opacity: [0, 0.3, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
          style={{
            left,
            top,
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  )
}
