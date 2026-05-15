import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import ImageUpload from './ImageUpload'

function Toast({ msg, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-space font-semibold"
      style={{ background: type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.4)' : 'rgba(255,107,107,0.4)'}`, color: type === 'success' ? '#00FF88' : '#FF6B6B', backdropFilter: 'blur(12px)' }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </motion.div>
  )
}

const inputCls = { background: 'rgba(5,5,15,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', color: '#F0F4FF', outline: 'none', width: '100%', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.3s' }
const labelCls = 'block text-xs font-mono mb-1.5'
const labelStyle = { color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }
const onFocus = e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)' }
const onBlur = e => { e.target.style.borderColor = 'rgba(0,212,255,0.15)' }

export default function AboutManager() {
  const { about, setAbout } = useData()
  const [form, setForm] = useState({ ...about, ...about.stats, ...about.social })
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    setAbout({
      ...form,
      profilePhoto: form.profilePhoto || '',
      stats: { projects: Number(form.projects), technologies: Number(form.technologies), infrastructure: Number(form.infrastructure), aiSolutions: Number(form.aiSolutions) },
      social: { linkedin: form.linkedin, github: form.github, email: form.email, whatsapp: form.whatsapp },
    })
    showToast('About section updated!')
  }

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <div className="mb-8">
        <p className="section-label mb-1">CONTENT MANAGER</p>
        <h1 className="text-3xl font-bold font-space" style={{ color: '#F0F4FF' }}>About <span className="gradient-text-cyan">Section</span></h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Identity */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <h3 className="text-sm font-mono mb-5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em' }}>IDENTITY</h3>
          <div className="space-y-4">
            <ImageUpload
              value={form.profilePhoto || ''}
              onChange={v => set('profilePhoto', v)}
              label="PROFILE PHOTO"
              hint="shown in About section"
              circle={true}
            />
            {[['NAME', 'name', 'Taha Elbasry'], ['TITLE', 'title', 'AI Engineer & Cybersecurity Specialist'], ['LOCATION', 'location', 'Casablanca, Morocco'], ['ROLE', 'role', 'Network & Systems Administrator'], ['INSTITUTION', 'institution', "Faculty of Sciences Ben M'Sik"], ['STUDIES', 'studies', "Licence d'Excellence — AI"]].map(([label, key, ph]) => (
              <div key={key}>
                <label className={labelCls} style={labelStyle}>{label}</label>
                <input value={form[key] || ''} onChange={e => set(key, e.target.value)} style={inputCls} placeholder={ph} onFocus={onFocus} onBlur={onBlur} />
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}>
            <h3 className="text-sm font-mono mb-5" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em' }}>BIO</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={labelStyle}>PARAGRAPH 1</label>
                <textarea value={form.bio || ''} onChange={e => set('bio', e.target.value)} rows={3} style={{ ...inputCls, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>PARAGRAPH 2</label>
                <textarea value={form.bio2 || ''} onChange={e => set('bio2', e.target.value)} rows={3} style={{ ...inputCls, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(139,92,246,0.1)' }}>
            <h3 className="text-sm font-mono mb-5" style={{ color: 'rgba(139,92,246,0.6)', letterSpacing: '0.15em' }}>STATISTICS</h3>
            <div className="grid grid-cols-2 gap-4">
              {[['PROJECTS', 'projects'], ['TECHNOLOGIES', 'technologies'], ['INFRASTRUCTURE', 'infrastructure'], ['AI SOLUTIONS', 'aiSolutions']].map(([label, key]) => (
                <div key={key}>
                  <label className={labelCls} style={{ ...labelStyle, color: 'rgba(139,92,246,0.6)' }}>{label}</label>
                  <input type="number" min="0" value={form[key] || 0} onChange={e => set(key, e.target.value)}
                    style={{ ...inputCls, border: '1px solid rgba(139,92,246,0.2)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.2)'} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <h3 className="text-sm font-mono mb-5" style={{ color: 'rgba(0,255,136,0.6)', letterSpacing: '0.15em' }}>SOCIAL LINKS</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[['🔗 LINKEDIN', 'linkedin'], ['⚡ GITHUB', 'github'], ['✉️ EMAIL', 'email'], ['💬 WHATSAPP', 'whatsapp']].map(([label, key]) => (
              <div key={key}>
                <label className={labelCls} style={{ ...labelStyle, color: 'rgba(0,255,136,0.6)' }}>{label}</label>
                <input value={form[key] || ''} onChange={e => set(key, e.target.value)}
                  style={{ ...inputCls, border: '1px solid rgba(0,255,136,0.15)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,255,136,0.15)'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={save}
          className="px-8 py-3.5 rounded-xl font-space font-bold text-sm tracking-widest transition-all duration-300"
          style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF', boxShadow: '0 0 25px rgba(0,212,255,0.12)', letterSpacing: '0.15em' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(0,212,255,0.12)'}>
          ✅ SAVE ALL CHANGES
        </button>
      </div>
    </div>
  )
}
