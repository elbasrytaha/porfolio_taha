import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from './ParticleField'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

const TITLES = [
  'AI Engineer',
  'Cybersecurity Specialist',
  'Digital Forensics Expert',
  'Network & Systems Administrator',
  'AI Infrastructure Architect',
]

export default function Hero() {
  const { about } = useData()
  const { T } = useTheme()
  const [titleIndex, setTitleIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [imgError, setImgError] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex(i => (i + 1) % TITLES.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let rafId = null
    let pending = null
    const handleMove = (e) => {
      pending = e
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        if (!heroRef.current || !pending) { rafId = null; return }
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: ((pending.clientX - rect.left) / rect.width - 0.5) * 30,
          y: ((pending.clientY - rect.top) / rect.height - 0.5) * 30,
        })
        rafId = null
        pending = null
      })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => { window.removeEventListener('mousemove', handleMove); if (rafId) cancelAnimationFrame(rafId) }
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const photoSrc = about.profilePhoto || '/profile.png'

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: T.section }}
    >
      {/* Particle background */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/* Animated cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Mouse-reactive ambient light */}
      <div
        className="absolute pointer-events-none transition-transform duration-300"
        style={{
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
          filter: 'blur(40px)',
        }}
      />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Corner decorations */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-10 h-10 opacity-40`}>
          <svg viewBox="0 0 40 40" fill="none" stroke="#00D4FF" strokeWidth="1.5">
            {i === 0 && <path d="M0 15 L0 0 L15 0" />}
            {i === 1 && <path d="M40 15 L40 0 L25 0" />}
            {i === 2 && <path d="M0 25 L0 40 L15 40" />}
            {i === 3 && <path d="M40 25 L40 40 L25 40" />}
          </svg>
        </div>
      ))}

      {/* Main content — two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 lg:py-0">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── LEFT — Text ── */}
          <div className="flex-1 text-center lg:text-left">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-mono text-xs"
              style={{
                background: 'rgba(0,255,136,0.08)',
                border: '1px solid rgba(0,255,136,0.2)',
                color: '#00FF88',
                letterSpacing: '0.2em',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
              SYSTEMS ONLINE — AVAILABLE FOR COLLABORATION
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1
                className="font-space font-bold leading-none mb-2"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #00D4FF 40%, #8B5CF6 70%, #ffffff 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'holo-shift 6s linear infinite',
                }}
              >
                TAHA
              </h1>
              <h1
                className="font-space font-bold leading-none mb-6"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                  letterSpacing: '-0.02em',
                  color: T.text,
                  textShadow: '0 0 80px rgba(0,212,255,0.15)',
                }}
              >
                ELBASRY
              </h1>
            </motion.div>

            {/* Animated title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="h-10 flex items-center justify-center lg:justify-start mb-5 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={titleIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-mono" style={{ color: '#00D4FF', letterSpacing: '0.3em' }}>◆</span>
                  <span
                    className="font-space font-medium"
                    style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                      color: '#00D4FF',
                      textShadow: '0 0 20px rgba(0,212,255,0.6)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {TITLES[titleIndex]}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#00D4FF', letterSpacing: '0.3em' }}>◆</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="font-inter mb-10 max-w-lg mx-auto lg:mx-0"
              style={{
                fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
                color: T.muted,
                lineHeight: '1.7',
              }}
            >
              Designing intelligent systems for the future.{' '}
              <span style={{ color: 'rgba(0,212,255,0.7)' }}>
                AI infrastructure, cybersecurity, and automation
              </span>{' '}
              at the edge of what's possible.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="px-8 py-4 rounded font-space font-semibold text-sm tracking-widest transition-all duration-300 btn-neon"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.1))',
                  border: '1px solid rgba(0,212,255,0.5)',
                  color: '#00D4FF',
                  boxShadow: '0 0 30px rgba(0,212,255,0.15)',
                  letterSpacing: '0.15em',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.4), 0 0 100px rgba(0,212,255,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.15)' }}
              >
                EXPLORE PROJECTS
              </button>

              <a
                href="/cv.pdf"
                download
                className="px-8 py-4 rounded font-space font-semibold text-sm tracking-widest transition-all duration-300 btn-neon"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: '#8B5CF6',
                  letterSpacing: '0.15em',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.3)'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'transparent' }}
              >
                DOWNLOAD CV
              </a>

              <button
                onClick={() => scrollTo('#contact')}
                className="px-8 py-4 rounded font-space font-semibold text-sm tracking-widest transition-all duration-300"
                style={{
                  background: 'transparent',
                  border: `1px solid ${T.border}`,
                  color: T.dim,
                  letterSpacing: '0.15em',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.muted; e.currentTarget.style.color = T.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.dim }}
              >
                CONTACT ME
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT — Profile photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="shrink-0 flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-slow"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0,212,255,0.15)',
                  transform: 'scale(1.18)',
                  filter: 'blur(1px)',
                }}
              />
              {/* Middle ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(139,92,246,0.2)',
                  transform: 'scale(1.08)',
                }}
              />

              {/* Orbit dot top — CSS spin */}
              <div className="absolute inset-0 hero-orbit-1">
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: '#00D4FF',
                    boxShadow: '0 0 12px #00D4FF',
                    top: '-6px',
                    left: 'calc(50% - 6px)',
                  }}
                />
              </div>

              {/* Orbit dot bottom — CSS spin reverse */}
              <div className="absolute inset-0 hero-orbit-2">
                <div
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: '#8B5CF6',
                    boxShadow: '0 0 10px #8B5CF6',
                    bottom: '-4px',
                    left: 'calc(50% - 4px)',
                  }}
                />
              </div>

              {/* Photo */}
              <div
                className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden"
                style={{
                  border: '2px solid rgba(0,212,255,0.4)',
                  boxShadow: '0 0 60px rgba(0,212,255,0.2), 0 0 120px rgba(139,92,246,0.1), inset 0 0 40px rgba(0,212,255,0.05)',
                }}
              >
                {!imgError ? (
                  <img
                    src={photoSrc}
                    alt="Taha Elbasry"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-7xl font-bold font-space"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.15))',
                      color: '#00D4FF',
                    }}
                  >
                    TE
                  </div>
                )}

                {/* Scan line on photo */}
                <div className="scan-line" style={{ animationDuration: '4s' }} />
              </div>

              {/* Status badge on photo */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs whitespace-nowrap"
                style={{
                  background: T.input,
                  border: '1px solid rgba(0,255,136,0.3)',
                  color: '#00FF88',
                  letterSpacing: '0.12em',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 20px rgba(0,255,136,0.1)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00FF88' }} />
                ONLINE
              </div>

              {/* Floating tech tags — pure CSS (no JS overhead) */}
              <div
                className="hero-tag-1 absolute -left-16 top-8 px-3 py-1.5 rounded-lg font-mono text-xs"
                style={{
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.25)',
                  color: '#00D4FF',
                  letterSpacing: '0.08em',
                }}
              >
                AI / ML
              </div>

              <div
                className="hero-tag-2 absolute -right-16 top-12 px-3 py-1.5 rounded-lg font-mono text-xs"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#8B5CF6',
                  letterSpacing: '0.08em',
                }}
              >
                CYBER
              </div>

              <div
                className="hero-tag-3 absolute -right-20 bottom-16 px-3 py-1.5 rounded-lg font-mono text-xs"
                style={{
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.25)',
                  color: '#00FF88',
                  letterSpacing: '0.08em',
                }}
              >
                INFRA
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,212,255,0.4)', letterSpacing: '0.2em' }}>
          SCROLL
        </span>
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
      </motion.div>
    </section>
  )
}
