import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

function AnimatedCounter({ value, suffix, color, active }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = value / 50
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 28)
    return () => clearInterval(timer)
  }, [active, value])
  return (
    <span style={{ color, textShadow: `0 0 20px ${color}60` }}>
      {count}{suffix}
    </span>
  )
}

export default function About() {
  const { about } = useData()
  const { T } = useTheme()
  const stats = [
    { label: 'Projects Completed', value: about.stats?.projects ?? 20, suffix: '+', color: '#00D4FF' },
    { label: 'Technologies Mastered', value: about.stats?.technologies ?? 35, suffix: '+', color: '#8B5CF6' },
    { label: 'Infrastructure Systems', value: about.stats?.infrastructure ?? 12, suffix: '+', color: '#00FF88' },
    { label: 'AI Solutions Developed', value: about.stats?.aiSolutions ?? 8, suffix: '+', color: '#FF6B6B' },
  ]
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.sectionAlt }}>
      {/* BG accent */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">01 / ABOUT</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative glass-bright rounded-2xl p-8 holo-border">
              {/* Scan line inside card */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="scan-line" style={{ animationDuration: '6s' }} />
              </div>

              {/* Profile image placeholder */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className="w-36 h-36 rounded-full overflow-hidden"
                    style={{ border: '2px solid rgba(0,212,255,0.4)', boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}
                  >
                    <img
                      src={about.profilePhoto || `${import.meta.env.BASE_URL}profile.png`}
                      alt={about.name || 'Taha Elbasry'}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    <div
                      className="w-full h-full items-center justify-center text-4xl font-bold hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))', color: '#00D4FF' }}
                    >
                      TE
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-bg-primary"
                    style={{ background: '#00FF88', boxShadow: '0 0 10px #00FF88' }}
                  />
                </div>
              </div>

              {/* Identity */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-space mb-1" style={{ color: T.text }}>
                  {about.name || 'Taha Elbasry'}
                </h2>
                <p className="text-sm font-mono mb-3" style={{ color: '#00D4FF', letterSpacing: '0.1em' }}>
                  {about.title || 'AI Engineer & Cybersecurity Specialist'}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: T.dim }}>
                  <span>📍</span>
                  <span>{about.location || 'Casablanca, Morocco'}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['AI Engineering', 'Cybersecurity', 'Network Admin', 'Digital Forensics'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: 'rgba(0,212,255,0.8)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                {[
                  { label: 'ROLE', value: about.role || "Network & Systems Administrator" },
                  { label: 'INSTITUTION', value: about.institution || "Faculty of Sciences Ben M'Sik" },
                  { label: 'STUDIES', value: about.studies || "Licence d'Excellence — AI" },
                  { label: 'STATUS', value: 'Available for opportunities' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-xs font-mono pt-0.5 shrink-0" style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.1em', minWidth: '90px' }}>
                      {item.label}
                    </span>
                    <span className="text-xs" style={{ color: T.muted }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Bio + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3
                className="text-4xl font-bold font-space mb-4 leading-tight"
                style={{ color: T.text }}
              >
                Building the future at the{' '}
                <span className="gradient-text-cyan">intersection of AI</span>{' '}
                and security.
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: T.muted }}>
                {about.bio || "I am a Network & Systems Administrator and AI enthusiast currently managing complex IT infrastructure at the Faculty of Sciences Ben M'Sik, while pursuing a Licence d'Excellence in Artificial Intelligence."}
              </p>
              <p className="text-base leading-relaxed" style={{ color: T.muted }}>
                {about.bio2 || "My work lives at the intersection of AI automation, cybersecurity, and intelligent infrastructure — building systems that think, protect, and scale."}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="glass rounded-xl p-5 holo-border group skill-card"
                >
                  <div className="text-4xl font-bold font-space mb-1">
                    <AnimatedCounter {...stat} active={visible} />
                  </div>
                  <div className="text-xs font-mono" style={{ color: T.dim, letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'LinkedIn', href: about.social?.linkedin || 'https://linkedin.com/in/taha-elbasry', icon: '🔗', color: '#0077B5' },
                { label: 'GitHub', href: about.social?.github || 'https://github.com/elbasrytaha', icon: '⚡', color: '#8B5CF6' },
                { label: 'Email', href: `mailto:${about.social?.email || 'elbasrytaha10@gmail.com'}`, icon: '✉️', color: '#00D4FF' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300"
                  style={{
                    background: T.cardBg,
                    border: `1px solid ${T.border}`,
                    color: T.muted,
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = link.color + '50'; e.currentTarget.style.color = link.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
