import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

// GitHub SVG icon
const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

function ProjectCard({ project, index, visible }) {
  const { T } = useTheme()
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setTilt({
      x: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5,
      y: ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.12, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      <div
        className="glass rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300"
        style={{
          background: hovered ? (project.bgGrad || `linear-gradient(135deg, ${project.color}12, ${T.cardBg})`) : T.cardBg,
          border: `1px solid ${hovered ? project.color + '40' : T.border}`,
          boxShadow: hovered ? `0 20px 60px ${project.color}15, 0 0 0 1px ${project.color}20` : 'none',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
            : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Header */}
        <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${project.color}15` }}>
          {hovered && <div className="scan-line" />}
          {project.image ? (
            <div className="w-full h-44 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 50%, ${T.cardBg})` }} />
              <span className="absolute top-3 right-3 text-xs font-mono px-3 py-1 rounded-full"
                style={{ background: `${project.color}18`, border: `1px solid ${project.color}35`, color: project.color, letterSpacing: '0.08em', backdropFilter: 'blur(8px)' }}>
                {project.category}
              </span>
              <div className="absolute bottom-3 left-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${project.color}20`, border: `1px solid ${project.color}40`, backdropFilter: 'blur(8px)' }}>
                  {project.icon}
                </div>
                <h3 className="text-lg font-bold font-space" style={{ color: T.text, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{project.title}</h3>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300"
                  style={{ background: `${project.color}12`, border: `1px solid ${project.color}30`, transform: hovered ? 'scale(1.1)' : 'scale(1)', boxShadow: hovered ? `0 0 20px ${project.color}30` : 'none' }}>
                  {project.icon}
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full"
                  style={{ background: `${project.color}10`, border: `1px solid ${project.color}25`, color: project.color, letterSpacing: '0.08em' }}>
                  {project.category}
                </span>
              </div>
              <h3 className="text-xl font-bold font-space mb-2" style={{ color: T.text }}>{project.title}</h3>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: T.muted }}>
            {project.description}
          </p>

          {/* Metrics */}
          <div className="flex gap-6 mb-5">
            {project.metrics.map(m => (
              <div key={m.label}>
                <div className="text-xl font-bold font-space" style={{ color: project.color }}>
                  {m.value}
                </div>
                <div className="text-xs font-mono" style={{ color: T.dim, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded font-mono"
                style={{
                  background: T.cardBg,
                  border: `1px solid ${T.border}`,
                  color: T.muted,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {/* GitHub button */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-space font-semibold text-xs tracking-wider transition-all duration-300 flex-1 justify-center"
              style={{
                background: T.cardBg,
                border: `1px solid ${T.border}`,
                color: T.muted,
                letterSpacing: '0.08em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = T.glassBright
                e.currentTarget.style.borderColor = T.muted
                e.currentTarget.style.color = T.text
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = T.cardBg
                e.currentTarget.style.borderColor = T.border
                e.currentTarget.style.color = T.muted
              }}
            >
              <GithubIcon size={14} />
              SOURCE CODE
            </a>

            {/* Details button */}
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-space font-semibold text-xs tracking-wider transition-all duration-300 flex-1 justify-center"
              style={{
                background: hovered ? `${project.color}15` : 'transparent',
                border: `1px solid ${project.color}30`,
                color: project.color,
                boxShadow: hovered ? `0 0 15px ${project.color}15` : 'none',
                letterSpacing: '0.08em',
              }}
            >
              VIEW DETAILS →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const { projects } = useData()
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
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.section }}>
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">04 / PROJECTS</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold font-space mb-4" style={{ color: T.text }}>
            Intelligence <span className="gradient-text-cyan">Operations</span>
          </h2>
          <p style={{ color: T.muted, fontSize: '1rem' }}>
            Projects that push the boundaries of AI, security, and automation.{' '}
            <span style={{ color: 'rgba(0,212,255,0.6)', fontSize: '0.85rem' }}>
              Full source code available on GitHub.
            </span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
