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

const SKILL_CATEGORY_COLORS = {
  mindset:       { color: '#00D4FF', label: 'Mindset & Thinking' },
  leadership:    { color: '#8B5CF6', label: 'Leadership & Work Style' },
  professional:  { color: '#00FF88', label: 'Professional Qualities' },
  communication: { color: '#FF6B6B', label: 'Communication & Adaptability' },
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
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const softSkills = about.softSkills || []
  const journeyProjects = about.journeyProjects || []

  const grouped = Object.entries(SKILL_CATEGORY_COLORS).map(([key, meta]) => ({
    ...meta,
    key,
    skills: softSkills.filter(s => s.category === key),
  }))

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.sectionAlt }}>
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section label ── */}
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

        {/* ── Row 1: Profile card + Bio ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">

          {/* Left — Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative glass-bright rounded-2xl p-8 holo-border">
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="scan-line" style={{ animationDuration: '6s' }} />
              </div>

              {/* Profile image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-36 h-36 rounded-full overflow-hidden"
                    style={{ border: '2px solid rgba(0,212,255,0.4)', boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}>
                    <img
                      src={about.profilePhoto || `${import.meta.env.BASE_URL}profile.png`}
                      alt={about.name || 'Taha Elbasry'}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full items-center justify-center text-4xl font-bold hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))', color: '#00D4FF' }}>
                      TE
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                    style={{ background: '#00FF88', boxShadow: '0 0 10px #00FF88', borderColor: T.sectionAlt }} />
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
                {['AI Engineering', 'Cybersecurity', 'Network Admin', 'Digital Forensics', 'TSM Plus', 'IBM AIX'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(0,212,255,0.8)', letterSpacing: '0.05em' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                {[
                  { label: 'ROLE', value: about.role || 'Network & Systems Administrator' },
                  { label: 'ALSO', value: 'TSM Plus Administrator (IBM AIX)' },
                  { label: 'INSTITUTION', value: about.institution || "Faculty of Sciences Ben M'Sik" },
                  { label: 'STUDIES', value: about.studies || "Licence d'Excellence — AI" },
                  { label: 'STATUS', value: 'Available for opportunities' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-xs font-mono pt-0.5 shrink-0"
                      style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.1em', minWidth: '90px' }}>
                      {item.label}
                    </span>
                    <span className="text-xs" style={{ color: T.muted }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Bio + Stats + Social */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-4xl font-bold font-space mb-4 leading-tight" style={{ color: T.text }}>
                Building the future at the{' '}
                <span className="gradient-text-cyan">intersection of AI</span>{' '}
                and security.
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: T.muted }}>
                {about.bio}
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: T.muted }}>
                {about.bio2}
              </p>
              {about.bio3 && (
                <p className="text-base leading-relaxed" style={{ color: T.muted }}>
                  {about.bio3}
                </p>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="glass rounded-xl p-5 holo-border skill-card"
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
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300"
                  style={{ background: T.cardBg, border: `1px solid ${T.border}`, color: T.muted, letterSpacing: '0.05em' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = link.color + '50'; e.currentTarget.style.color = link.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Row 2: Journey + Projects ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="rounded-2xl p-8 mb-16 glass holo-border relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="scan-line" style={{ animationDuration: '10s', animationDelay: '3s' }} />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 8px #00D4FF' }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.25em' }}>
              MY JOURNEY & KEY PROJECTS
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Journey narrative */}
            <div>
              <h3 className="text-2xl font-bold font-space mb-4" style={{ color: T.text }}>
                From Networks to <span className="gradient-text-purple">Intelligent Systems</span>
              </h3>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                  My passion for technology pushed me beyond traditional IT administration into advanced fields —
                  AI, Cybersecurity, Digital Forensics, and Intelligent Infrastructure Engineering.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                  I gained deep experience with enterprise virtualization environments, IBM AIX systems administration,
                  TSM Plus administration, and network monitoring. I combine AI with Cybersecurity to build
                  intelligent defensive systems capable of detecting threats and automating security operations in real time.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                  I built advanced networking and cybersecurity labs using <span style={{ color: '#00D4FF' }}>Cisco Packet Tracer</span> for
                  enterprise topology simulations, and <span style={{ color: '#8B5CF6' }}>EVE-NG</span> for advanced network emulation,
                  firewall simulations, and penetration testing environments.
                </p>
              </div>
            </div>

            {/* Project highlights */}
            <div>
              <h4 className="text-xs font-mono mb-5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.2em' }}>
                AMBITIOUS PROJECTS COMPLETED
              </h4>
              <div className="space-y-3">
                {journeyProjects.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={visible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: ['#00D4FF','#8B5CF6','#00FF88','#FF6B6B','#00D4FF','#8B5CF6','#00FF88','#FF6B6B'][i % 8],
                        boxShadow: `0 0 6px ${['#00D4FF','#8B5CF6','#00FF88','#FF6B6B'][i % 4]}` }} />
                    <span className="text-sm" style={{ color: T.muted }}>{proj}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Row 3: Soft Skills ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
            <span className="section-label">SOFT SKILLS</span>
            <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grouped.map(({ key, color, label, skills }) => (
              <div key={key} className="glass rounded-2xl p-5" style={{ border: `1px solid ${color}18` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span className="text-xs font-mono" style={{ color, letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                    {label.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={visible ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + i * 0.05 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-300 cursor-default"
                      style={{ background: `${color}08`, border: `1px solid ${color}15`, letterSpacing: '0.03em' }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.borderColor = `${color}35` }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}15` }}
                    >
                      <span>{skill.icon}</span>
                      <span style={{ color: T.muted }}>{skill.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
