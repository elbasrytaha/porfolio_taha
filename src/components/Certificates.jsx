import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

// ─── REMPLACE LES DONNÉES AVEC TES VRAIS CERTIFICATS ───
const CERTIFICATES = [
  {
    id: 1,
    title: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco',
    issuerLogo: '🌐',
    date: '2023',
    credentialId: 'CISCO-XXXX-XXXX',
    verifyUrl: 'https://www.credly.com/',
    category: 'NETWORKING',
    color: '#1BA0D7',
    description: 'Enterprise networking, routing & switching, network security fundamentals.',
    image: null,
  },
  {
    id: 2,
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    issuerLogo: '🛡️',
    date: '2023',
    credentialId: 'CISCO-CYBER-XXXX',
    verifyUrl: 'https://www.netacad.com/',
    category: 'CYBERSECURITY',
    color: '#FF6B6B',
    description: 'Cybersecurity fundamentals, threat landscape, network security and risk management.',
    image: null,
  },
  {
    id: 3,
    title: 'Python for Everybody',
    issuer: 'Coursera / University of Michigan',
    issuerLogo: '🐍',
    date: '2022',
    credentialId: 'COURSERA-PY-XXXX',
    verifyUrl: 'https://www.coursera.org/verify/',
    category: 'AI / DEV',
    color: '#3776AB',
    description: 'Python programming fundamentals, data structures, databases and web APIs.',
    image: null,
  },
  {
    id: 4,
    title: 'Google AI Essentials',
    issuer: 'Google',
    issuerLogo: '✨',
    date: '2024',
    credentialId: 'GOOGLE-AI-XXXX',
    verifyUrl: 'https://www.coursera.org/verify/',
    category: 'AI / ML',
    color: '#4285F4',
    description: 'Generative AI, prompt engineering, responsible AI and practical AI integration.',
    image: null,
  },
  {
    id: 5,
    title: 'Linux Essentials',
    issuer: 'Linux Professional Institute (LPI)',
    issuerLogo: '🐧',
    date: '2023',
    credentialId: 'LPI-LE-XXXX',
    verifyUrl: 'https://lpi.org/',
    category: 'INFRASTRUCTURE',
    color: '#FCC624',
    description: 'Linux command line, system administration, open source fundamentals.',
    image: null,
  },
  {
    id: 6,
    title: 'Digital Forensics Fundamentals',
    issuer: 'Infosec Institute',
    issuerLogo: '🔍',
    date: '2024',
    credentialId: 'INFOSEC-DF-XXXX',
    verifyUrl: 'https://www.infosecinstitute.com/',
    category: 'CYBERSECURITY',
    color: '#8B5CF6',
    description: 'Evidence acquisition, forensic analysis, incident response and legal procedures.',
    image: null,
  },
]

const CATEGORIES = ['ALL', 'NETWORKING', 'CYBERSECURITY', 'AI / ML', 'AI / DEV', 'INFRASTRUCTURE']

const CATEGORY_COLORS = {
  'NETWORKING': '#1BA0D7',
  'CYBERSECURITY': '#FF6B6B',
  'AI / ML': '#4285F4',
  'AI / DEV': '#3776AB',
  'INFRASTRUCTURE': '#FCC624',
  'ALL': '#00D4FF',
}

// Verified badge SVG
const VerifiedBadge = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,255,136,0.1)"/>
    <path d="M9 12l2 2 4-4" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function CertCard({ cert, index, visible }) {
  const { T } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="relative cursor-default"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setFlipped(false) }}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-400"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${cert.color}12, ${T.cardBg})`
            : T.cardBg,
          border: `1px solid ${hovered ? cert.color + '45' : T.border}`,
          boxShadow: hovered ? `0 16px 48px ${cert.color}12` : 'none',
          transform: hovered ? 'translateY(-4px)' : 'none',
        }}
      >
        {/* Top color bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.color}50)` }}
        />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: `${cert.color}12`,
                border: `1px solid ${cert.color}25`,
                boxShadow: hovered ? `0 0 16px ${cert.color}25` : 'none',
                transition: 'box-shadow 0.3s',
              }}
            >
              {cert.issuerLogo}
            </div>
            <div className="text-right">
              <div
                className="text-xs font-mono px-2.5 py-1 rounded-full mb-1 inline-block"
                style={{
                  background: `${cert.color}10`,
                  border: `1px solid ${cert.color}25`,
                  color: cert.color,
                  letterSpacing: '0.08em',
                }}
              >
                {cert.category}
              </div>
              <div className="text-xs font-mono block" style={{ color: T.dim }}>
                {cert.date}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-space font-bold text-base mb-1 leading-snug"
            style={{ color: T.text }}
          >
            {cert.title}
          </h3>

          {/* Issuer */}
          <div className="flex items-center gap-1.5 mb-3">
            <VerifiedBadge />
            <span className="text-xs font-mono" style={{ color: '#00FF88', letterSpacing: '0.05em' }}>
              {cert.issuer}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed mb-4" style={{ color: T.dim }}>
            {cert.description}
          </p>

          {/* Credential ID */}
          <div
            className="font-mono text-xs p-2.5 rounded-lg mb-4 flex items-center justify-between"
            style={{
              background: T.glass,
              border: `1px solid ${T.border}`,
            }}
          >
            <span style={{ color: T.faint, letterSpacing: '0.06em', fontSize: '0.6rem' }}>
              CREDENTIAL ID
            </span>
            <span style={{ color: cert.color, letterSpacing: '0.08em', fontSize: '0.65rem' }}>
              {cert.credentialId}
            </span>
          </div>

          {/* Verify button */}
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-space font-semibold text-xs tracking-wider transition-all duration-300"
            style={{
              background: hovered ? `${cert.color}15` : 'transparent',
              border: `1px solid ${cert.color}30`,
              color: cert.color,
              letterSpacing: '0.1em',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${cert.color}20` }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            VERIFY CREDENTIAL
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Certificates() {
  const { T } = useTheme()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const filtered = activeFilter === 'ALL'
    ? CERTIFICATES
    : CERTIFICATES.filter(c => c.category === activeFilter)

  return (
    <section id="certificates" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.sectionAlt }}>
      {/* BG */}
      <div className="absolute inset-0 cyber-grid opacity-25" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">05 / CERTIFICATES</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="text-5xl font-bold font-space mb-4" style={{ color: T.text }}>
            Credentials &{' '}
            <span className="gradient-text-cyan">Certifications</span>
          </h2>
          <p style={{ color: T.muted, fontSize: '1rem' }}>
            Verified expertise across AI, cybersecurity, and infrastructure.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map(cat => {
            const isActive = cat === activeFilter
            const color = CATEGORY_COLORS[cat] || '#00D4FF'
            const count = cat === 'ALL' ? CERTIFICATES.length : CERTIFICATES.filter(c => c.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-300"
                style={{
                  background: isActive ? `${color}18` : T.cardBg,
                  border: `1px solid ${isActive ? color + '55' : T.border}`,
                  color: isActive ? color : T.muted,
                  boxShadow: isActive ? `0 0 18px ${color}20` : 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {cat}
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ background: isActive ? `${color}25` : T.border, fontSize: '0.6rem' }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} visible={visible} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Add certificate hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-3 py-6 rounded-2xl"
          style={{ border: '1px dashed rgba(0,212,255,0.15)', background: 'rgba(0,212,255,0.02)' }}
        >
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm font-space" style={{ color: T.dim }}>
              More certifications in progress...
            </p>
            <p className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.4)', letterSpacing: '0.1em' }}>
              UPDATE THE CERTIFICATES ARRAY IN Certificates.jsx TO ADD YOURS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
