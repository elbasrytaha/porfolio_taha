import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = {
  'AI & AUTOMATION': {
    color: '#00D4FF',
    icon: '🤖',
    skills: [
      { name: 'Ollama', level: 90 },
      { name: 'LLaMA', level: 85 },
      { name: 'Gemini API', level: 88 },
      { name: 'Stable Diffusion', level: 82 },
      { name: 'AI Agents', level: 87 },
      { name: 'Python AI', level: 92 },
      { name: 'n8n Automation', level: 85 },
    ],
  },
  'NETWORK & INFRASTRUCTURE': {
    color: '#8B5CF6',
    icon: '🌐',
    skills: [
      { name: 'Active Directory', level: 90 },
      { name: 'Linux Server', level: 92 },
      { name: 'Windows Server', level: 88 },
      { name: 'VMware', level: 85 },
      { name: 'Proxmox', level: 83 },
      { name: 'VLAN Design', level: 88 },
      { name: 'Routing & Switching', level: 87 },
    ],
  },
  'CYBERSECURITY': {
    color: '#FF6B6B',
    icon: '🛡️',
    skills: [
      { name: 'Digital Forensics', level: 85 },
      { name: 'SIEM', level: 80 },
      { name: 'OSINT', level: 88 },
      { name: 'Wireshark', level: 87 },
      { name: 'Kali Linux', level: 90 },
      { name: 'Threat Analysis', level: 82 },
    ],
  },
  'HARDWARE & IoT': {
    color: '#00FF88',
    icon: '📡',
    skills: [
      { name: 'ESP32', level: 85 },
      { name: 'Arduino', level: 82 },
      { name: 'CCTV / NVR', level: 90 },
      { name: 'ONVIF', level: 85 },
      { name: 'Smart Systems', level: 80 },
    ],
  },
}

const CAT_KEYS = Object.keys(CATEGORIES)

export default function Skills() {
  const { T } = useTheme()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(CAT_KEYS[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cat = CATEGORIES[activeTab]

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.section }}>
      {/* Grid BG */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Ambient */}
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">02 / SKILLS</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-5xl font-bold font-space mb-4" style={{ color: T.text }}>
            Command <span className="gradient-text-cyan">Center</span>
          </h2>
          <p style={{ color: T.muted, fontSize: '1rem' }}>
            A full-stack technology arsenal — from silicon to intelligence.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {CAT_KEYS.map(key => {
            const isActive = key === activeTab
            const catColor = CATEGORIES[key].color
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs transition-all duration-300"
                style={{
                  background: isActive ? `${catColor}18` : T.cardBg,
                  border: `1px solid ${isActive ? catColor + '60' : T.border}`,
                  color: isActive ? catColor : T.muted,
                  boxShadow: isActive ? `0 0 20px ${catColor}25` : 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {CATEGORIES[key].icon} {key}
              </button>
            )
          })}
        </motion.div>

        {/* Skill grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {cat.skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass rounded-xl p-5 skill-card group cursor-default"
                style={{ '--cat-color': cat.color }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${cat.color}40`
                  e.currentTarget.style.boxShadow = `0 8px 40px ${cat.color}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = `1px solid ${T.border}`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Icon area */}
                <div
                  className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center text-lg"
                  style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}
                >
                  {cat.icon}
                </div>

                <div className="font-space font-semibold text-sm mb-3" style={{ color: T.text }}>
                  {skill.name}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs font-mono" style={{ color: T.dim, fontSize: '0.65rem' }}>PROFICIENCY</span>
                    <span className="text-xs font-mono" style={{ color: cat.color, fontSize: '0.65rem' }}>{skill.level}%</span>
                  </div>
                  <div className="h-px w-full rounded overflow-hidden" style={{ background: T.border }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: `${skill.level}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded"
                      style={{
                        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}80)`,
                        boxShadow: `0 0 8px ${cat.color}60`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
