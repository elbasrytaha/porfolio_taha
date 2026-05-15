import { useEffect, useRef, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const TECH_ROW1 = [
  { name: 'Python', color: '#3776AB', emoji: '🐍' },
  { name: 'Linux', color: '#FCC624', emoji: '🐧' },
  { name: 'Cisco', color: '#1BA0D7', emoji: '🌐' },
  { name: 'VMware', color: '#607078', emoji: '☁️' },
  { name: 'Docker', color: '#2496ED', emoji: '🐳' },
  { name: 'Ollama', color: '#00D4FF', emoji: '🤖' },
  { name: 'LLaMA', color: '#8B5CF6', emoji: '🦙' },
  { name: 'n8n', color: '#E85D00', emoji: '⚡' },
  { name: 'Python', color: '#3776AB', emoji: '🐍' },
  { name: 'Linux', color: '#FCC624', emoji: '🐧' },
  { name: 'Cisco', color: '#1BA0D7', emoji: '🌐' },
  { name: 'VMware', color: '#607078', emoji: '☁️' },
  { name: 'Docker', color: '#2496ED', emoji: '🐳' },
  { name: 'Ollama', color: '#00D4FF', emoji: '🤖' },
  { name: 'LLaMA', color: '#8B5CF6', emoji: '🦙' },
  { name: 'n8n', color: '#E85D00', emoji: '⚡' },
]

const TECH_ROW2 = [
  { name: 'Wireshark', color: '#1679A7', emoji: '🦈' },
  { name: 'Kali Linux', color: '#268BEE', emoji: '💀' },
  { name: 'ESP32', color: '#E7352C', emoji: '📡' },
  { name: 'Proxmox', color: '#E57000', emoji: '🔧' },
  { name: 'Active Directory', color: '#0078D4', emoji: '🗂️' },
  { name: 'Stable Diffusion', color: '#FF6B6B', emoji: '🎨' },
  { name: 'Gemini', color: '#4285F4', emoji: '✨' },
  { name: 'Arduino', color: '#00979D', emoji: '🔌' },
  { name: 'Wireshark', color: '#1679A7', emoji: '🦈' },
  { name: 'Kali Linux', color: '#268BEE', emoji: '💀' },
  { name: 'ESP32', color: '#E7352C', emoji: '📡' },
  { name: 'Proxmox', color: '#E57000', emoji: '🔧' },
  { name: 'Active Directory', color: '#0078D4', emoji: '🗂️' },
  { name: 'Stable Diffusion', color: '#FF6B6B', emoji: '🎨' },
  { name: 'Gemini', color: '#4285F4', emoji: '✨' },
  { name: 'Arduino', color: '#00979D', emoji: '🔌' },
]

const TechBadge = memo(function TechBadge({ tech }) {
  const { T } = useTheme()
  const ref = useRef(null)
  const onEnter = () => {
    if (!ref.current) return
    ref.current.style.background = `${tech.color}15`
    ref.current.style.borderColor = tech.color + '50'
    ref.current.style.boxShadow = `0 0 20px ${tech.color}25`
    ref.current.querySelector('span:last-child').style.color = tech.color
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.background = T.cardBg
    ref.current.style.borderColor = T.border
    ref.current.style.boxShadow = 'none'
    ref.current.querySelector('span:last-child').style.color = T.muted
  }
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 px-5 py-3 rounded-xl mx-2 shrink-0 cursor-default transition-all duration-300"
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="text-lg">{tech.emoji}</span>
      <span
        className="text-sm font-space font-medium whitespace-nowrap"
        style={{ color: T.muted, transition: 'color 0.3s' }}
      >
        {tech.name}
      </span>
    </div>
  )
})

export default function TechWall() {
  const { T } = useTheme()
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

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden" style={{ background: T.sectionAlt }}>
      {/* Gradient masks */}
      <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${T.sectionAlt}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${T.sectionAlt}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">06 / TECH STACK</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold font-space"
          style={{ color: T.text }}
        >
          Technology <span className="gradient-text-cyan">Ecosystem</span>
        </motion.h2>
      </div>

      {/* Row 1 — left */}
      <div className="mb-4 overflow-hidden">
        <div className="marquee-track">
          {TECH_ROW1.map((tech, i) => (
            <TechBadge key={i} tech={tech} />
          ))}
        </div>
      </div>

      {/* Row 2 — right */}
      <div className="overflow-hidden">
        <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
          {TECH_ROW2.map((tech, i) => (
            <TechBadge key={i} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  )
}
