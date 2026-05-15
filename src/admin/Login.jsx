import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'Taha@2024!'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(5,5,15,0.9)',
    border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px',
    color: '#F0F4FF', outline: 'none', fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '0.9rem', transition: 'border-color 0.3s, box-shadow 0.3s',
  }

  useEffect(() => {
    if (sessionStorage.getItem('admin_token') === btoa(ADMIN_USER + ADMIN_PASS)) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_token', btoa(ADMIN_USER + ADMIN_PASS))
      navigate('/admin/dashboard')
    } else {
      setError('ACCESS DENIED — Invalid credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#020208', cursor: 'auto' }}>
      {/* Grid BG */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      {/* Corner deco */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 opacity-30`}>
          <svg viewBox="0 0 32 32" fill="none" stroke="#00D4FF" strokeWidth="1.5">
            {i === 0 && <path d="M0 12L0 0L12 0" />}
            {i === 1 && <path d="M32 12L32 0L20 0" />}
            {i === 2 && <path d="M0 20L0 32L12 32" />}
            {i === 3 && <path d="M32 20L32 32L20 32" />}
          </svg>
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 30px rgba(0,212,255,0.1)' }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" stroke="#00D4FF" strokeWidth="4" fill="rgba(0,212,255,0.08)" />
              <text x="50%" y="56%" textAnchor="middle" fill="#00D4FF" fontSize="32" fontWeight="bold" fontFamily="Space Grotesk">TE</text>
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-space" style={{ color: '#F0F4FF' }}>ADMIN PANEL</h1>
          <p className="text-xs font-mono mt-1" style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.2em' }}>
            TAHA ELBASRY — SECURE ACCESS
          </p>
        </div>

        {/* Card */}
        <div className="glass-bright rounded-2xl p-8 holo-border relative overflow-hidden">
          <div className="scan-line" style={{ animationDuration: '5s' }} />

          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em' }}>SECURE CHANNEL ACTIVE</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>USERNAME</label>
              <input
                type="text" value={user} onChange={e => setUser(e.target.value)}
                placeholder="admin" autoComplete="username" required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(0,212,255,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.15)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(0,212,255,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.15)'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-40 hover:opacity-70 transition-opacity">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', color: '#FF6B6B', letterSpacing: '0.05em' }}>
                ⚠ {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-space font-bold text-sm tracking-widest transition-all duration-300"
              style={{
                background: loading ? 'rgba(0,212,255,0.08)' : 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,102,255,0.12))',
                border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF',
                boxShadow: loading ? 'none' : '0 0 25px rgba(0,212,255,0.15)', letterSpacing: '0.2em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
                  </svg>
                  AUTHENTICATING...
                </span>
              ) : 'ACCESS DASHBOARD →'}
            </button>
          </form>

          <p className="text-center text-xs font-mono mt-6" style={{ color: 'rgba(150,165,195,0.3)', letterSpacing: '0.1em' }}>
            DEFAULT: admin / Taha@2024!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
