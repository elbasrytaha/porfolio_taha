import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'

const NAV = [
  {
    to: '/admin/dashboard', label: 'Overview',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
  },
  {
    to: '/admin/projects', label: 'Projects',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M3 7h18M3 12h18M3 17h12"/><circle cx="20" cy="17" r="2"/></svg>
  },
  {
    to: '/admin/certificates', label: 'Certificates',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="9" r="4"/><path d="M9 21l3-3 3 3M9 16.5V21M15 16.5V21"/><path d="M4 21v-1a8 8 0 0116 0v1" strokeDasharray="1 0"/></svg>
  },
  {
    to: '/admin/skills', label: 'Skills',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  },
  {
    to: '/admin/about', label: 'About',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  },
  {
    to: '/admin/messages', label: 'Messages',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    badge: true,
  },
  {
    to: '/admin/settings', label: 'Settings',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { about } = useData()
  const [collapsed, setCollapsed] = useState(false)

  const logout = () => {
    sessionStorage.removeItem('admin_token')
    navigate('/admin')
  }

  const photoSrc = about.profilePhoto || null
  const initials = (about.name || 'TE').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [unread, setUnread] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portfolio_messages') || '[]').filter(m => !m.read).length } catch { return 0 }
  })

  useEffect(() => {
    const refresh = () => {
      try { setUnread(JSON.parse(localStorage.getItem('portfolio_messages') || '[]').filter(m => !m.read).length) } catch {}
    }
    window.addEventListener('focus', refresh)
    const id = setInterval(refresh, 5000)
    return () => { window.removeEventListener('focus', refresh); clearInterval(id) }
  }, [])

  return (
    <div className="flex min-h-screen" style={{ background: '#06060f', fontFamily: 'Space Grotesk, Inter, sans-serif', cursor: 'auto' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-hidden"
        style={{
          background: 'rgba(6,6,18,0.98)',
          borderRight: '1px solid rgba(0,212,255,0.08)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* ── Brand / Profile ── */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.07)', minHeight: 80 }}>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div
                className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-bold text-sm"
                style={{
                  background: photoSrc ? 'transparent' : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
                  border: '1.5px solid rgba(0,212,255,0.3)',
                  color: '#00D4FF',
                  boxShadow: '0 0 16px rgba(0,212,255,0.15)',
                }}
              >
                {photoSrc
                  ? <img src={photoSrc} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  : initials
                }
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ background: '#00FF88', borderColor: '#06060f', boxShadow: '0 0 6px #00FF88' }} />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-sm font-bold truncate" style={{ color: '#F0F4FF' }}>
                    {about.name || 'Taha Elbasry'}
                  </div>
                  <div className="text-xs truncate font-mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                    {about.role ? about.role.split(' ').slice(0, 3).join(' ') : 'Admin'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(c => !c)}
              className="ml-auto p-1.5 rounded-lg transition-all duration-200 shrink-0"
              style={{ color: 'rgba(0,212,255,0.4)', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.color = '#00D4FF' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,212,255,0.4)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Nav Label ── */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-5 pt-5 pb-2">
              <span className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.3)', letterSpacing: '0.15em', fontSize: '0.6rem' }}>NAVIGATION</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Nav Items ── */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px' : '10px 12px',
                borderRadius: '10px',
                color: isActive ? '#00D4FF' : 'rgba(160,175,200,0.55)',
                background: isActive ? 'rgba(0,212,255,0.09)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(0,212,255,0.22)' : 'transparent'}`,
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes('0.09'))
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.border.includes('0.22'))
                  e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="shrink-0 relative">
                {item.icon}
                {item.badge && unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#00D4FF', color: '#050505', fontSize: '0.55rem', lineHeight: 1 }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm font-medium whitespace-nowrap flex-1 flex items-center justify-between"
                  >
                    {item.label}
                    {item.badge && unread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold ml-auto"
                        style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF', fontSize: '0.6rem', border: '1px solid rgba(0,212,255,0.3)' }}>
                        {unread}
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom ── */}
        <div className="px-3 pb-4 pt-3 border-t space-y-1.5" style={{ borderColor: 'rgba(0,212,255,0.07)' }}>
          {/* Portfolio link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'View Portfolio' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
            style={{
              color: 'rgba(0,212,255,0.6)',
              background: 'rgba(0,212,255,0.04)',
              border: '1px solid rgba(0,212,255,0.1)',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; e.currentTarget.style.color = '#00D4FF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; e.currentTarget.style.color = 'rgba(0,212,255,0.6)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
            </svg>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs font-mono whitespace-nowrap">View Portfolio</motion.span>
              )}
            </AnimatePresence>
          </a>

          {/* Logout */}
          <button
            onClick={logout}
            title={collapsed ? 'Logout' : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200"
            style={{
              color: 'rgba(255,107,107,0.65)',
              background: 'rgba(255,107,107,0.04)',
              border: '1px solid rgba(255,107,107,0.1)',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; e.currentTarget.style.color = '#FF6B6B' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.04)'; e.currentTarget.style.color = 'rgba(255,107,107,0.65)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17" className="shrink-0">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs font-mono whitespace-nowrap">Logout</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: collapsed ? 68 : 248, transition: 'margin 0.35s cubic-bezier(0.23,1,0.32,1)' }}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(6,6,18,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,212,255,0.07)',
          }}
        >
          {/* Left: status */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88', animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-xs font-mono hidden sm:block" style={{ color: 'rgba(0,212,255,0.45)', letterSpacing: '0.12em' }}>
              CMS ACTIVE
            </span>
          </div>

          {/* Right: date + avatar */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono hidden md:block" style={{ color: 'rgba(150,165,195,0.4)' }}>
              {new Date().toLocaleDateString('fr-MA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>

            {/* Profile avatar */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-default"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: photoSrc ? 'transparent' : 'rgba(0,212,255,0.15)',
                  border: '1px solid rgba(0,212,255,0.25)',
                  color: '#00D4FF',
                }}>
                {photoSrc
                  ? <img src={photoSrc} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                  : initials
                }
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold leading-none mb-0.5" style={{ color: '#F0F4FF' }}>
                  {(about.name || 'Taha Elbasry').split(' ')[0]}
                </div>
                <div className="text-xs leading-none font-mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.6rem' }}>Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
