'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink'

interface ThemeContextType {
  theme: Theme
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue')

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedAccentColor = localStorage.getItem('accentColor') as AccentColor
    
    if (savedTheme) setThemeState(savedTheme)
    if (savedAccentColor) setAccentColorState(savedAccentColor)
  }, [])

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  useEffect(() => {
    // Apply accent color class to document
    const root = document.documentElement
    root.classList.remove('accent-blue', 'accent-purple', 'accent-green', 'accent-orange', 'accent-pink')
    root.classList.add(`accent-${accentColor}`)
  }, [accentColor])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color)
    localStorage.setItem('accentColor', color)
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
