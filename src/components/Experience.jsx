import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const RESPONSIBILITIES = [
  'Administration and maintenance of complex IT infrastructure',
  'Server virtualization using VMware and Proxmox environments',
  'Active Directory management and security policy enforcement',
  'Deployment and monitoring of AI infrastructure systems',
  'Network architecture design with VLANs and advanced routing',
  'Implementation of CCTV and intelligent surveillance systems',
  'Automated workflow systems using n8n and Python AI tools',
]

const ACHIEVEMENTS = [
  {
    title: 'Smart Anti-Cheating Detection System',
    desc: 'Built an intelligent ESP32-based Wi-Fi/Bluetooth detection system to secure faculty examinations.',
    color: '#00D4FF',
  },
  {
    title: 'AI Factory Infrastructure',
    desc: 'Participated in AI Factory infrastructure projects deploying local LLM environments with Ollama.',
    color: '#8B5CF6',
  },
  {
    title: 'Intelligent Monitoring Platform',
    desc: 'Designed and deployed an intelligent network monitoring system with automated threat response.',
    color: '#00FF88',
  },
]

export default function Experience() {
  const { T } = useTheme()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.sectionAlt }}>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">03 / EXPERIENCE</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold font-space" style={{ color: T.text }}>
            Mission <span className="gradient-text-purple">Logs</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.8), rgba(139,92,246,0.4), transparent)' }}
          />

          {/* Main entry */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="lg:pl-24 mb-16 relative"
          >
            {/* Timeline node */}
            <div className="absolute left-5 top-2 w-7 h-7 rounded-full border-2 hidden lg:flex items-center justify-center"
              style={{ borderColor: '#00D4FF', background: T.section, boxShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse-slow" style={{ background: '#00D4FF' }} />
            </div>

            {/* Card */}
            <div className="glass-bright rounded-2xl p-8 holo-border relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="scan-line" style={{ animationDuration: '8s', animationDelay: '2s' }} />
              </div>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }} />
                    <span className="text-xs font-mono" style={{ color: '#00FF88', letterSpacing: '0.2em' }}>CURRENT POSITION</span>
                  </div>
                  <h3 className="text-2xl font-bold font-space mb-1" style={{ color: T.text }}>
                    Network & Systems Administrator
                  </h3>
                  <p className="text-base" style={{ color: '#00D4FF' }}>
                    Faculty of Sciences Ben M'Sik — Casablanca, Morocco
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="px-4 py-2 rounded-lg text-xs font-mono text-right"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(0,212,255,0.8)' }}>
                    <div>2022 — Present</div>
                    <div style={{ color: 'rgba(0,212,255,0.5)', marginTop: '2px' }}>IT Infrastructure</div>
                  </div>
                </div>
              </div>

              {/* Two columns: responsibilities + achievements */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Responsibilities */}
                <div>
                  <h4 className="text-xs font-mono mb-4" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.2em' }}>
                    RESPONSIBILITIES
                  </h4>
                  <ul className="space-y-3">
                    {RESPONSIBILITIES.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={visible ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.07 }}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: T.muted }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-xs font-mono mb-4" style={{ color: 'rgba(139,92,246,0.8)', letterSpacing: '0.2em' }}>
                    KEY ACHIEVEMENTS
                  </h4>
                  <div className="space-y-4">
                    {ACHIEVEMENTS.map((ach, i) => (
                      <motion.div
                        key={ach.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={visible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 + i * 0.12 }}
                        className="p-4 rounded-xl"
                        style={{
                          background: `${ach.color}08`,
                          border: `1px solid ${ach.color}20`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: ach.color }} />
                          <span className="text-sm font-semibold font-space" style={{ color: ach.color }}>
                            {ach.title}
                          </span>
                        </div>
                        <p className="text-xs pl-3.5" style={{ color: T.dim }}>
                          {ach.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education entry */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="lg:pl-24 relative"
          >
            <div className="absolute left-5 top-2 w-7 h-7 rounded-full border-2 hidden lg:flex items-center justify-center"
              style={{ borderColor: '#8B5CF6', background: T.section, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#8B5CF6' }} />
            </div>

            <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#8B5CF6' }} />
                    <span className="text-xs font-mono" style={{ color: '#8B5CF6', letterSpacing: '0.2em' }}>EDUCATION</span>
                  </div>
                  <h3 className="text-xl font-bold font-space mb-1" style={{ color: T.text }}>
                    Licence d'Excellence — Intelligence Artificielle
                  </h3>
                  <p style={{ color: T.muted }}>
                    Faculty of Sciences Ben M'Sik · Casablanca, Morocco
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg text-xs font-mono shrink-0"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(139,92,246,0.8)' }}>
                  In Progress
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
