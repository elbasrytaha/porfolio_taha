import { createContext, useContext, useEffect, useState } from 'react'

export const themes = {
  dark: {
    section:     '#050505',
    sectionAlt:  '#070710',
    glass:       'rgba(8,8,20,0.88)',
    glassBright: 'rgba(10,10,25,0.92)',
    cardBg:      'rgba(8,8,20,0.7)',
    input:       'rgba(5,5,15,0.85)',
    nav:         'rgba(5,5,10,0.92)',
    text:        '#F0F4FF',
    muted:       'rgba(150,165,195,0.82)',
    dim:         'rgba(150,165,195,0.5)',
    faint:       'rgba(150,165,195,0.3)',
    border:      'rgba(0,212,255,0.1)',
    isDark:      true,
  },
  light: {
    section:     '#F2F5FF',
    sectionAlt:  '#E8EEFF',
    glass:       'rgba(255,255,255,0.88)',
    glassBright: 'rgba(255,255,255,0.96)',
    cardBg:      'rgba(255,255,255,0.78)',
    input:       'rgba(232,238,255,0.95)',
    nav:         'rgba(240,244,255,0.96)',
    text:        '#0C0C20',
    muted:       'rgba(50,65,110,0.82)',
    dim:         'rgba(50,65,110,0.55)',
    faint:       'rgba(50,65,110,0.35)',
    border:      'rgba(0,100,180,0.13)',
    isDark:      false,
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ mode, toggle, T: themes[mode] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
