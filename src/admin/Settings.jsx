import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES, DEFAULT_SKILLS, DEFAULT_ABOUT } from '../context/DataContext'

function Toast({ msg, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-space font-semibold"
      style={{ background: type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.4)' : 'rgba(255,107,107,0.4)'}`, color: type === 'success' ? '#00FF88' : '#FF6B6B', backdropFilter: 'blur(12px)' }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </motion.div>
  )
}

const ADMIN_USER_KEY = 'admin_user'
const ADMIN_PASS_KEY = 'admin_pass'
const getUser = () => localStorage.getItem(ADMIN_USER_KEY) || 'admin'
const getPass = () => localStorage.getItem(ADMIN_PASS_KEY) || 'Taha@2024!'

export default function Settings() {
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState(getUser())
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [resetConfirm, setResetConfirm] = useState(false)

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const inputCls = { background: 'rgba(5,5,15,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', color: '#F0F4FF', outline: 'none', width: '100%', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.3s' }

  const saveCredentials = () => {
    if (!user.trim()) return showToast('Username cannot be empty', 'error')
    if (newPass) {
      if (oldPass !== getPass()) return showToast('Current password is incorrect', 'error')
      if (newPass.length < 6) return showToast('New password too short (min 6)', 'error')
      if (newPass !== confirm) return showToast('Passwords do not match', 'error')
      localStorage.setItem(ADMIN_PASS_KEY, newPass)
      sessionStorage.setItem('admin_token', btoa(user + newPass))
    }
    localStorage.setItem(ADMIN_USER_KEY, user.trim())
    setOldPass(''); setNewPass(''); setConfirm('')
    showToast('Credentials updated!')
  }

  const resetData = () => {
    localStorage.setItem('portfolio_data', JSON.stringify({
      projects: DEFAULT_PROJECTS, certificates: DEFAULT_CERTIFICATES,
      skills: DEFAULT_SKILLS, about: DEFAULT_ABOUT, lastUpdated: Date.now()
    }))
    setResetConfirm(false)
    showToast('Data reset to defaults. Refresh the page.')
  }

  const exportData = () => {
    const data = localStorage.getItem('portfolio_data') || '{}'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'portfolio-backup.json'; a.click()
    URL.revokeObjectURL(url)
    showToast('Backup exported!')
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        JSON.parse(ev.target.result)
        localStorage.setItem('portfolio_data', ev.target.result)
        showToast('Data imported! Refresh to see changes.')
      } catch {
        showToast('Invalid JSON file', 'error')
      }
    }
    reader.readAsText(file)
  }

  const Section = ({ title, color = '#00D4FF', children }) => (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(8,8,20,0.8)', border: `1px solid ${color}12` }}>
      <h3 className="text-sm font-mono mb-5" style={{ color: `${color}80`, letterSpacing: '0.15em' }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <div className="mb-8">
        <p className="section-label mb-1">ADMIN PANEL</p>
        <h1 className="text-3xl font-bold font-space" style={{ color: '#F0F4FF' }}>Settings <span className="gradient-text-cyan">⚙️</span></h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Change credentials */}
        <Section title="SECURITY — CHANGE CREDENTIALS" color="#00D4FF">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>USERNAME</label>
              <input value={user} onChange={e => setUser(e.target.value)} style={inputCls}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>CURRENT PASSWORD</label>
              <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Required to change password" style={inputCls}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>NEW PASSWORD</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Leave empty to keep current" style={inputCls}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputCls}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
            </div>
            <button onClick={saveCredentials} className="w-full py-3 rounded-xl font-space font-bold text-sm transition-all"
              style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF' }}>
              🔐 SAVE CREDENTIALS
            </button>
          </div>
        </Section>

        <div className="space-y-6">
          {/* Backup */}
          <Section title="DATA — BACKUP & RESTORE" color="#8B5CF6">
            <div className="space-y-3">
              <button onClick={exportData} className="w-full py-3 rounded-xl font-space font-semibold text-sm transition-all flex items-center justify-center gap-2"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
                📤 EXPORT BACKUP (JSON)
              </button>
              <label className="w-full py-3 rounded-xl font-space font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', color: '#00FF88' }}>
                📥 IMPORT FROM BACKUP
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </Section>

          {/* Reset */}
          <Section title="DANGER ZONE" color="#FF6B6B">
            {!resetConfirm ? (
              <button onClick={() => setResetConfirm(true)} className="w-full py-3 rounded-xl font-space font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', color: '#FF6B6B' }}>
                🔄 RESET ALL DATA TO DEFAULTS
              </button>
            ) : (
              <div>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,107,107,0.85)' }}>
                  ⚠️ This will reset ALL projects, certificates, skills and about data to default values. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setResetConfirm(false)} className="flex-1 py-3 rounded-xl font-space font-semibold text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>CANCEL</button>
                  <button onClick={resetData} className="flex-1 py-3 rounded-xl font-space font-bold text-sm"
                    style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.5)', color: '#FF6B6B' }}>RESET NOW</button>
                </div>
              </div>
            )}
          </Section>

          {/* Info */}
          <Section title="SYSTEM INFO" color="#FCC624">
            <div className="space-y-2 text-xs font-mono" style={{ color: 'rgba(150,165,195,0.6)' }}>
              {[['Portfolio URL', window.location.origin], ['Admin URL', window.location.origin + '/admin'], ['Storage', 'localStorage (browser)'], ['Session', 'sessionStorage'], ['Version', 'v1.0.0']].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span style={{ color: 'rgba(252,198,36,0.6)' }}>{k}</span>
                  <span style={{ color: 'rgba(240,244,255,0.6)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
