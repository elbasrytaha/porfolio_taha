import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CERTS', href: '#certificates' },
  { label: 'CONTACT', href: '#contact' },
]

function ThemeToggle({ mode, toggle }) {
  return (
    <button
      onClick={toggle}
      title={mode === 'dark' ? 'Mode jour' : 'Mode nuit'}
      className="relative w-10 h-6 rounded-full transition-all duration-400 flex items-center"
      style={{
        background: mode === 'dark'
          ? 'rgba(0,212,255,0.12)'
          : 'rgba(255,180,0,0.18)',
        border: mode === 'dark'
          ? '1px solid rgba(0,212,255,0.35)'
          : '1px solid rgba(255,160,0,0.45)',
      }}
    >
      <motion.div
        animate={{ x: mode === 'dark' ? 2 : 18 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute w-4 h-4 rounded-full flex items-center justify-center text-xs"
        style={{
          background: mode === 'dark' ? '#00D4FF' : '#FFB300',
          boxShadow: mode === 'dark'
            ? '0 0 8px rgba(0,212,255,0.7)'
            : '0 0 10px rgba(255,180,0,0.8)',
        }}
      >
        {mode === 'dark' ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}

export default function Navigation() {
  const { mode, toggle, T } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(s => {
        const top = s.offsetTop - 120
        const bottom = top + s.offsetHeight
        if (window.scrollY >= top && window.scrollY < bottom) setActive('#' + s.id)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? T.nav : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
        borderBottom: scrolled ? `1px solid ${T.border}` : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo('#hero')} className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <polygon
                points="50,4 93,27 93,73 50,96 7,73 7,27"
                stroke="#00D4FF"
                strokeWidth="3"
                fill="rgba(0,212,255,0.08)"
                className="transition-all duration-300 group-hover:fill-[rgba(0,212,255,0.15)]"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#00D4FF' }}>TE</span>
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest" style={{ color: T.text }}>TAHA ELBASRY</div>
            <div className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.6)', fontSize: '0.6rem', letterSpacing: '0.15em' }}>AI · CYBER · INFRA</div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative px-4 py-2 text-xs font-mono tracking-widest transition-colors duration-200 rounded"
              style={{
                color: active === link.href ? '#00D4FF' : T.muted,
                background: active === link.href ? 'rgba(0,212,255,0.07)' : 'transparent',
                letterSpacing: '0.15em',
              }}
            >
              {link.label}
              {active === link.href && (
                <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: '#00D4FF', boxShadow: '0 0 8px #00D4FF' }} />
              )}
            </button>
          ))}

          {/* Theme toggle */}
          <div className="ml-2 mr-1">
            <ThemeToggle mode={mode} toggle={toggle} />
          </div>

          <a
            href="/cv.pdf"
            download
            className="ml-2 px-4 py-2 text-xs font-mono tracking-widest rounded border transition-all duration-300 btn-neon"
            style={{ borderColor: 'rgba(0,212,255,0.4)', color: '#00D4FF', letterSpacing: '0.15em' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            DOWNLOAD CV
          </a>
        </div>

        {/* Mobile row */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle mode={mode} toggle={toggle} />
          <button className="flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={menuOpen
                  ? { rotate: i === 1 ? 0 : i === 0 ? 45 : -45, y: i === 1 ? 0 : i === 0 ? 7 : -7, opacity: i === 1 ? 0 : 1 }
                  : {}}
                className="w-6 h-0.5 rounded"
                style={{ background: '#00D4FF' }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: T.nav, borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(14px)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <button key={link.href} onClick={() => scrollTo(link.href)}
                  className="text-left text-sm font-mono tracking-widest"
                  style={{ color: active === link.href ? '#00D4FF' : T.muted, letterSpacing: '0.15em' }}>
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
