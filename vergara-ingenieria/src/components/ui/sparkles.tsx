"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

// Generate sparkles once to avoid hydration mismatch
const generateInitialSparkles = (): Sparkle[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (i * 13.7) % 100, // Pseudo-random but deterministic
    y: (i * 7.3) % 100,
    size: (i % 3) + 1.5,
    delay: (i * 0.04) % 2,
  }))
}

export function Sparkles() {
  const [sparkles] = useState<Sparkle[]>(generateInitialSparkles)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-blue-400/40"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
