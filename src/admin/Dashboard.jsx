import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

function loadMessages() {
  try { return JSON.parse(localStorage.getItem('portfolio_messages') || '[]') } catch { return [] }
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'À l\'instant'
  if (m < 60) return `${m}m`
  if (h < 24) return `${h}h`
  return `${d}j`
}

// ── Mini chart bar ──────────────────────────────────────────────────────────
function Bar({ pct, color }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  )
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub, to, delay }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => navigate(to)}
      className="rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
      style={{ background: 'rgba(10,10,22,0.9)', border: `1px solid ${color}18` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 8px 32px ${color}10` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}18`; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at top right, ${color}06, transparent 70%)` }} />
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12`, border: `1px solid ${color}22`, color }}>
          {icon}
        </div>
        <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
          style={{ color, fontSize: '0.6rem', letterSpacing: '0.1em' }}>
          MANAGE →
        </span>
      </div>
      <div className="text-3xl font-bold font-space mb-0.5" style={{ color }}>{value}</div>
      <div className="text-xs font-mono mb-2" style={{ color: 'rgba(150,165,195,0.55)', letterSpacing: '0.04em' }}>{label}</div>
      {sub && <div className="text-xs" style={{ color: 'rgba(150,165,195,0.35)' }}>{sub}</div>}
    </motion.div>
  )
}

// ── Section health card ──────────────────────────────────────────────────────
function SectionCard({ label, icon, color, done, total, desc, to, delay }) {
  const navigate = useNavigate()
  const pct = total > 0 ? Math.round((done / total) * 100) : (done ? 100 : 0)
  const ok = pct >= 80
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => navigate(to)}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 group"
      style={{ background: 'rgba(10,10,22,0.85)', border: `1px solid ${ok ? color + '22' : 'rgba(255,107,107,0.15)'}` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}45`; e.currentTarget.style.background = 'rgba(12,12,26,0.95)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ok ? `${color}22` : 'rgba(255,107,107,0.15)'; e.currentTarget.style.background = 'rgba(10,10,22,0.85)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: `${color}12`, border: `1px solid ${color}20`, color }}>{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold font-space" style={{ color: '#F0F4FF' }}>{label}</span>
            <span className="text-xs font-mono" style={{ color: ok ? color : '#FF6B6B', fontSize: '0.65rem' }}>{pct}%</span>
          </div>
          <div className="text-xs" style={{ color: 'rgba(150,165,195,0.4)', fontSize: '0.65rem' }}>{desc}</div>
        </div>
      </div>
      <Bar pct={pct} color={ok ? color : '#FF6B6B'} />
    </motion.div>
  )
}

// ── Quick action ─────────────────────────────────────────────────────────────
function QuickAction({ icon, label, desc, color, onClick, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3.5 rounded-xl text-left group transition-all duration-200"
      style={{ background: 'rgba(10,10,22,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.background = `${color}07` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(10,10,22,0.7)' }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
        style={{ background: `${color}12`, border: `1px solid ${color}20`, color, fontSize: '1rem' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold font-space leading-none mb-1" style={{ color: '#F0F4FF' }}>{label}</div>
        <div className="text-xs truncate" style={{ color: 'rgba(150,165,195,0.45)' }}>{desc}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
        style={{ color }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { projects, certificates, skills, about } = useData()
  const navigate = useNavigate()

  const [messages, setMessages] = useState(loadMessages)
  useEffect(() => {
    const refresh = () => setMessages(loadMessages())
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])
  const unread = messages.filter(m => !m.read).length

  const skillCount = Object.values(skills).reduce((a, c) => a + c.skills.length, 0)
  const catCount = Object.keys(skills).length

  const stored = (() => { try { return JSON.parse(localStorage.getItem('portfolio_data')) } catch { return null } })()
  const lastUpdate = stored?.lastUpdated
    ? new Date(stored.lastUpdated).toLocaleString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Jamais'

  const photoSrc = about.profilePhoto || null
  const initials = (about.name || 'TE').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const firstName = (about.name || 'Taha').split(' ')[0]

  // Portfolio completion score
  const checks = [
    { key: 'Photo',      done: !!about.profilePhoto },
    { key: 'Nom',        done: !!about.name },
    { key: 'Bio',        done: !!about.bio },
    { key: 'Rôle',       done: !!about.role },
    { key: 'LinkedIn',   done: !!about.social?.linkedin },
    { key: 'GitHub',     done: !!about.social?.github },
    { key: 'Email',      done: !!about.social?.email },
    { key: 'Projets',    done: projects.length > 0 },
    { key: 'Certifs',    done: certificates.length > 0 },
    { key: 'Skills',     done: skillCount > 0 },
  ]
  const score = Math.round((checks.filter(c => c.done).length / checks.length) * 100)

  // Section health
  const sections = [
    {
      label: 'About', icon: '👤', color: '#00D4FF', to: '/admin/about',
      done: [!!about.profilePhoto, !!about.name, !!about.bio, !!about.bio2, !!about.role].filter(Boolean).length,
      total: 5, desc: 'Photo, nom, bio, rôle',
    },
    {
      label: 'Projects', icon: '📂', color: '#8B5CF6', to: '/admin/projects',
      done: projects.filter(p => p.title && p.description && p.github).length,
      total: Math.max(projects.length, 1), desc: `${projects.length} projet(s) ajouté(s)`,
    },
    {
      label: 'Certificates', icon: '🏆', color: '#FCC624', to: '/admin/certificates',
      done: certificates.filter(c => c.title && c.issuer).length,
      total: Math.max(certificates.length, 1), desc: `${certificates.length} certification(s)`,
    },
    {
      label: 'Skills', icon: '⚡', color: '#00FF88', to: '/admin/skills',
      done: skillCount, total: Math.max(skillCount, 8), desc: `${skillCount} skill(s), ${catCount} catégorie(s)`,
    },
    {
      label: 'Social Links', icon: '🔗', color: '#FF6B6B', to: '/admin/about',
      done: [about.social?.linkedin, about.social?.github, about.social?.email, about.social?.whatsapp].filter(Boolean).length,
      total: 4, desc: 'LinkedIn, GitHub, Email, WhatsApp',
    },
  ]

  const scoreColor = score >= 80 ? '#00FF88' : score >= 50 ? '#FCC624' : '#FF6B6B'

  return (
    <div className="max-w-6xl">

      {/* ── Welcome banner ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 mb-7 relative overflow-hidden"
        style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}
      >
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(0,212,255,0.06), transparent 60%)' }} />

        <div className="relative flex items-center gap-5 flex-wrap">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold"
              style={{
                background: photoSrc ? 'transparent' : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
                border: '2px solid rgba(0,212,255,0.3)',
                color: '#00D4FF',
                boxShadow: '0 0 24px rgba(0,212,255,0.15)',
              }}>
              {photoSrc
                ? <img src={photoSrc} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                : initials
              }
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{ background: '#00FF88', borderColor: '#06060f', boxShadow: '0 0 8px #00FF88' }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono mb-1" style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.15em' }}>CONTROL CENTER</div>
            <h1 className="text-2xl font-bold font-space mb-0.5" style={{ color: '#F0F4FF' }}>
              Bonjour, <span style={{ color: '#00D4FF' }}>{firstName}</span> 👋
            </h1>
            <p className="text-sm" style={{ color: 'rgba(150,165,195,0.55)' }}>
              Dernière mise à jour : <span style={{ color: 'rgba(0,212,255,0.6)' }}>{lastUpdate}</span>
            </p>
          </div>

          {/* Score ring */}
          <div className="shrink-0 text-center">
            <div className="relative w-20 h-20 mx-auto mb-1">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <motion.circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke={scoreColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                  style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-space leading-none" style={{ color: scoreColor }}>{score}%</span>
              </div>
            </div>
            <div className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.4)', letterSpacing: '0.08em', fontSize: '0.6rem' }}>COMPLÉTION</div>
          </div>
        </div>

        {/* Completion checklist */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {checks.map(c => (
              <div key={c.key} className="flex items-center gap-1.5">
                <span className="text-xs" style={{ color: c.done ? '#00FF88' : 'rgba(255,107,107,0.7)' }}>
                  {c.done ? '✓' : '○'}
                </span>
                <span className="text-xs font-mono" style={{ color: c.done ? 'rgba(0,255,136,0.7)' : 'rgba(150,165,195,0.4)', letterSpacing: '0.04em', fontSize: '0.65rem' }}>
                  {c.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Projets" value={projects.length}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M3 7h18M3 12h18M3 17h12"/><circle cx="20" cy="17" r="2"/></svg>}
          color="#00D4FF" to="/admin/projects"
          sub={`${projects.filter(p => p.image).length} avec image`} delay={0.1}
        />
        <StatCard
          label="Certifications" value={certificates.length}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><circle cx="12" cy="9" r="4"/><path d="M9 21l3-3 3 3M9 16.5V21M15 16.5V21"/></svg>}
          color="#8B5CF6" to="/admin/certificates"
          sub={`${[...new Set(certificates.map(c => c.category))].length} catégories`} delay={0.15}
        />
        <StatCard
          label="Skills" value={skillCount}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
          color="#00FF88" to="/admin/skills"
          sub={`${catCount} catégories`} delay={0.2}
        />
        <StatCard
          label="Profil" value={`${score}%`}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
          color="#FCC624" to="/admin/about"
          sub="complétion portfolio" delay={0.25}
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Section health + Quick actions ─── */}
        <div className="space-y-6">
          {/* Section health */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.55)', letterSpacing: '0.15em' }}>ÉTAT DES SECTIONS</h2>
            </div>
            <div className="space-y-2.5">
              {sections.map((s, i) => (
                <SectionCard key={s.label} {...s} delay={0.3 + i * 0.07} />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-xs font-mono mb-3" style={{ color: 'rgba(0,212,255,0.55)', letterSpacing: '0.15em' }}>ACTIONS RAPIDES</h2>
            <div className="space-y-2">
              <QuickAction icon="➕" label="Ajouter un projet" desc="Nouveau projet dans le portfolio" color="#00D4FF" onClick={() => navigate('/admin/projects')} delay={0.55} />
              <QuickAction icon="🏅" label="Ajouter un certificat" desc="Nouvelle certification" color="#8B5CF6" onClick={() => navigate('/admin/certificates')} delay={0.6} />
              <QuickAction icon="📸" label="Modifier ma photo" desc="Changer la photo de profil" color="#FCC624" onClick={() => navigate('/admin/about')} delay={0.65} />
              <QuickAction icon="🌐" label="Voir le portfolio" desc="Ouvrir la version publique" color="#00FF88" onClick={() => window.open('/', '_blank')} delay={0.7} />
            </div>
          </div>
        </div>

        {/* ── Projects + Certs ─────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Projects table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.55)', letterSpacing: '0.15em' }}>MES PROJETS</h2>
              <button onClick={() => navigate('/admin/projects')}
                className="text-xs font-mono transition-colors duration-200"
                style={{ color: 'rgba(0,212,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00D4FF'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.4)'}>
                voir tout →
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,22,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid px-4 py-2.5 border-b text-xs font-mono"
                style={{ gridTemplateColumns: '1fr 130px 80px', borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(150,165,195,0.35)', letterSpacing: '0.08em' }}>
                <span>PROJET</span><span>CATÉGORIE</span><span>IMAGE</span>
              </div>
              {projects.slice(0, 5).map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="grid px-4 py-3 items-center border-b transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: '1fr 130px 80px', borderColor: 'rgba(255,255,255,0.03)' }}
                  onClick={() => navigate('/admin/projects')}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ background: `${p.color}12`, border: `1px solid ${p.color}22` }}>{p.icon}</div>
                    <span className="text-sm font-space truncate" style={{ color: '#F0F4FF' }}>{p.title}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full w-fit"
                    style={{ background: `${p.color}10`, color: p.color, fontSize: '0.58rem', letterSpacing: '0.04em' }}>
                    {p.category}
                  </span>
                  <span className="text-xs font-mono" style={{ color: p.image ? '#00FF88' : 'rgba(150,165,195,0.25)', fontSize: '0.65rem' }}>
                    {p.image ? '✓ oui' : '— non'}
                  </span>
                </motion.div>
              ))}
              {projects.length === 0 && (
                <div className="py-10 text-center text-xs font-mono" style={{ color: 'rgba(150,165,195,0.3)' }}>
                  Aucun projet — <button onClick={() => navigate('/admin/projects')} className="underline" style={{ color: 'rgba(0,212,255,0.5)' }}>en ajouter un</button>
                </div>
              )}
            </div>
          </div>

          {/* Certs grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono" style={{ color: 'rgba(139,92,246,0.6)', letterSpacing: '0.15em' }}>DERNIÈRES CERTIFICATIONS</h2>
              <button onClick={() => navigate('/admin/certificates')}
                className="text-xs font-mono transition-colors duration-200"
                style={{ color: 'rgba(139,92,246,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#8B5CF6'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(139,92,246,0.4)'}>
                voir tout →
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {certificates.slice(0, 4).map((c, i) => (
                <motion.div key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200"
                  style={{ background: 'rgba(10,10,22,0.9)', border: `1px solid ${c.color}15` }}
                  onClick={() => navigate('/admin/certificates')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}35`; e.currentTarget.style.background = `${c.color}05` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.color}15`; e.currentTarget.style.background = 'rgba(10,10,22,0.9)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
                    {c.issuerLogo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-space font-semibold truncate" style={{ color: '#F0F4FF' }}>{c.title}</div>
                    <div className="text-xs font-mono" style={{ color: c.color, fontSize: '0.6rem', letterSpacing: '0.04em' }}>{c.issuer}</div>
                  </div>
                  <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(150,165,195,0.35)', fontSize: '0.6rem' }}>{c.date}</span>
                </motion.div>
              ))}
              {certificates.length === 0 && (
                <div className="sm:col-span-2 py-8 text-center text-xs font-mono" style={{ color: 'rgba(150,165,195,0.3)' }}>
                  Aucun certificat —{' '}
                  <button onClick={() => navigate('/admin/certificates')} className="underline" style={{ color: 'rgba(139,92,246,0.5)' }}>en ajouter un</button>
                </div>
              )}
            </div>
          </div>

          {/* Profile info preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono" style={{ color: 'rgba(252,198,36,0.6)', letterSpacing: '0.15em' }}>MON PROFIL PUBLIC</h2>
              <button onClick={() => navigate('/admin/about')}
                className="text-xs font-mono transition-colors"
                style={{ color: 'rgba(252,198,36,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FCC624'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(252,198,36,0.4)'}>
                modifier →
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(10,10,22,0.9)', border: '1px solid rgba(252,198,36,0.1)' }}
            >
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {[
                  ['Nom', about.name],
                  ['Titre', about.title],
                  ['Lieu', about.location],
                  ['Rôle', about.role],
                  ['Institution', about.institution],
                  ['Études', about.studies],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 min-w-0">
                    <span className="text-xs font-mono shrink-0 pt-0.5" style={{ color: 'rgba(252,198,36,0.45)', letterSpacing: '0.05em', minWidth: '68px' }}>{k}</span>
                    <span className="text-xs truncate" style={{ color: v ? 'rgba(240,244,255,0.75)' : 'rgba(255,107,107,0.4)' }}>
                      {v || '— non renseigné'}
                    </span>
                  </div>
                ))}
              </div>
              {/* Social */}
              <div className="mt-4 pt-4 border-t flex gap-3 flex-wrap" style={{ borderColor: 'rgba(252,198,36,0.08)' }}>
                {[
                  { label: 'LinkedIn', val: about.social?.linkedin, color: '#0077B5' },
                  { label: 'GitHub', val: about.social?.github, color: '#8B5CF6' },
                  { label: 'Email', val: about.social?.email, color: '#00D4FF' },
                  { label: 'WhatsApp', val: about.social?.whatsapp, color: '#00FF88' },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full"
                    style={{
                      background: s.val ? `${s.color}10` : 'rgba(255,107,107,0.06)',
                      border: `1px solid ${s.val ? s.color + '25' : 'rgba(255,107,107,0.15)'}`,
                      color: s.val ? s.color : 'rgba(255,107,107,0.5)',
                      fontSize: '0.65rem',
                    }}>
                    {s.val ? '✓' : '○'} {s.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── SECURE COMMUNICATION CHANNEL ────────────────────── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }} />
            <h2 className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.55)', letterSpacing: '0.15em' }}>
              SECURE COMMUNICATION CHANNEL
            </h2>
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00D4FF', fontSize: '0.6rem' }}>
                {unread} non lu{unread > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={() => navigate('/admin/messages')}
            className="text-xs font-mono transition-colors"
            style={{ color: 'rgba(0,212,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#00D4FF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.4)'}>
            voir tout →
          </button>
        </div>

        {messages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl py-12 flex flex-col items-center justify-center text-center"
            style={{ background: 'rgba(10,10,22,0.8)', border: '1px dashed rgba(0,212,255,0.1)' }}>
            <div className="text-3xl mb-3 opacity-30">📭</div>
            <div className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.4)', letterSpacing: '0.1em' }}>AUCUN MESSAGE REÇU</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(150,165,195,0.25)' }}>Les messages du formulaire de contact apparaîtront ici</div>
          </motion.div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,22,0.9)', border: '1px solid rgba(0,212,255,0.1)' }}>
            {/* Table header */}
            <div className="grid px-5 py-2.5 border-b text-xs font-mono"
              style={{ gridTemplateColumns: '16px 1fr 180px 120px 80px', gap: '12px', borderColor: 'rgba(0,212,255,0.07)', color: 'rgba(150,165,195,0.3)', letterSpacing: '0.08em' }}>
              <span />
              <span>EXPÉDITEUR / SUJET</span>
              <span>EMAIL</span>
              <span>DATE</span>
              <span className="text-right">STATUT</span>
            </div>

            {messages.slice(0, 6).map((msg, i) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate('/admin/messages')}
                className="grid px-5 py-3.5 items-center border-b cursor-pointer transition-colors"
                style={{ gridTemplateColumns: '16px 1fr 180px 120px 80px', gap: '12px', borderColor: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Unread indicator */}
                <div className="flex items-center justify-center">
                  {!msg.read
                    ? <span className="w-2 h-2 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} />
                    : <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  }
                </div>

                {/* Name + subject */}
                <div className="min-w-0">
                  <div className="text-sm font-semibold font-space truncate" style={{ color: msg.read ? 'rgba(240,244,255,0.6)' : '#F0F4FF' }}>
                    {msg.name}
                  </div>
                  <div className="text-xs truncate" style={{ color: msg.read ? 'rgba(0,212,255,0.35)' : 'rgba(0,212,255,0.65)', fontSize: '0.7rem' }}>
                    {msg.subject}
                  </div>
                </div>

                {/* Email */}
                <span className="text-xs font-mono truncate" style={{ color: 'rgba(150,165,195,0.4)', fontSize: '0.7rem' }}>
                  {msg.email}
                </span>

                {/* Time */}
                <span className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.35)', fontSize: '0.68rem' }}>
                  {timeAgo(msg.timestamp)}
                </span>

                {/* Status badge */}
                <div className="flex justify-end">
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono"
                    style={{
                      background: msg.read ? 'rgba(255,255,255,0.04)' : 'rgba(0,212,255,0.1)',
                      border: `1px solid ${msg.read ? 'rgba(255,255,255,0.08)' : 'rgba(0,212,255,0.25)'}`,
                      color: msg.read ? 'rgba(150,165,195,0.35)' : '#00D4FF',
                      fontSize: '0.6rem',
                      letterSpacing: '0.06em',
                    }}>
                    {msg.read ? 'lu' : 'nouveau'}
                  </span>
                </div>
              </motion.div>
            ))}

            {messages.length > 6 && (
              <div className="px-5 py-3 text-center">
                <button onClick={() => navigate('/admin/messages')}
                  className="text-xs font-mono transition-colors"
                  style={{ color: 'rgba(0,212,255,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00D4FF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.4)'}>
                  + {messages.length - 6} message{messages.length - 6 > 1 ? 's' : ''} supplémentaire{messages.length - 6 > 1 ? 's' : ''} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
