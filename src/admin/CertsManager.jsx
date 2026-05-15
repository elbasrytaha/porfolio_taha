import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'

const EMPTY = { title: '', issuer: '', issuerLogo: '🏅', date: '', credentialId: '', verifyUrl: '', category: 'CYBERSECURITY', color: '#8B5CF6', description: '' }
const CATEGORIES = ['NETWORKING', 'CYBERSECURITY', 'AI / ML', 'AI / DEV', 'INFRASTRUCTURE', 'CLOUD', 'OTHER']
const COLORS = ['#00D4FF', '#8B5CF6', '#00FF88', '#FF6B6B', '#FCC624', '#1BA0D7', '#4285F4', '#3776AB']

function Toast({ msg, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-space font-semibold"
      style={{ background: type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.4)' : 'rgba(255,107,107,0.4)'}`, color: type === 'success' ? '#00FF88' : '#FF6B6B', backdropFilter: 'blur(12px)' }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </motion.div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,2,8,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: 'rgba(8,8,20,0.98)', border: '1px solid rgba(139,92,246,0.25)' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(139,92,246,0.12)' }}>
          <h2 className="text-lg font-bold font-space" style={{ color: '#F0F4FF' }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

const inputCls = { background: 'rgba(5,5,15,0.9)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', color: '#F0F4FF', outline: 'none', width: '100%', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.3s' }
const labelCls = 'block text-xs font-mono mb-1.5'
const labelStyle = { color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em' }

export default function CertsManager() {
  const { certificates, setCertificates } = useData()
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [toast, setToast] = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }
  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c }); setModal('edit') }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const onFocus = e => { e.target.style.borderColor = 'rgba(139,92,246,0.55)' }
  const onBlur = e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)' }

  const save = () => {
    if (!form.title.trim()) return showToast('Title is required', 'error')
    const entry = { ...form, id: modal === 'add' ? Date.now() : editing }
    if (modal === 'add') setCertificates([...certificates, entry])
    else setCertificates(certificates.map(c => c.id === editing ? entry : c))
    setModal(null)
    showToast(modal === 'add' ? 'Certificate added!' : 'Certificate updated!')
  }

  const remove = (id) => { setCertificates(certificates.filter(c => c.id !== id)); setDelConfirm(null); showToast('Certificate deleted.') }

  const cats = ['ALL', ...Array.from(new Set(certificates.map(c => c.category)))]
  const filtered = filter === 'ALL' ? certificates : certificates.filter(c => c.category === filter)

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label mb-1">CONTENT MANAGER</p>
          <h1 className="text-3xl font-bold font-space" style={{ color: '#F0F4FF' }}>Certificates <span className="gradient-text-purple">({certificates.length})</span></h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-space font-bold text-sm transition-all duration-300"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6', boxShadow: '0 0 20px rgba(139,92,246,0.1)' }}>
          ➕ ADD CERTIFICATE
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200"
            style={{ background: filter === cat ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === cat ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, color: filter === cat ? '#8B5CF6' : 'rgba(180,190,210,0.55)', letterSpacing: '0.08em' }}>
            {cat} ({cat === 'ALL' ? certificates.length : certificates.filter(c => c.category === cat).length})
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cert, i) => (
          <motion.div key={cert.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl overflow-hidden group"
            style={{ background: 'rgba(8,8,20,0.8)', border: `1px solid ${cert.color}20` }}>
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.color}50)` }} />
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${cert.color}12`, border: `1px solid ${cert.color}25` }}>{cert.issuerLogo}</div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ background: `${cert.color}10`, color: cert.color, letterSpacing: '0.06em', fontSize: '0.6rem' }}>{cert.category}</span>
              </div>
              <h3 className="text-sm font-bold font-space mb-1 leading-snug" style={{ color: '#F0F4FF' }}>{cert.title}</h3>
              <p className="text-xs mb-2" style={{ color: cert.color }}>{cert.issuer}</p>
              <p className="text-xs mb-3" style={{ color: 'rgba(150,165,195,0.6)' }}>{cert.date} · {cert.credentialId}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cert)}
                  className="flex-1 py-2 rounded-lg text-xs font-space font-semibold transition-all"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => setDelConfirm(cert.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-space font-semibold transition-all"
                  style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16" style={{ color: 'rgba(150,165,195,0.4)' }}>No certificates in this category.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? '➕ Add Certificate' : '✏️ Edit Certificate'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={labelStyle}>TITLE *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} style={inputCls} placeholder="Cisco CCNA..." onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>ISSUER</label>
                  <input value={form.issuer} onChange={e => set('issuer', e.target.value)} style={inputCls} placeholder="Cisco, Google..." onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>LOGO (emoji)</label>
                  <input value={form.issuerLogo} onChange={e => set('issuerLogo', e.target.value)} style={inputCls} placeholder="🌐" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>DATE</label>
                  <input value={form.date} onChange={e => set('date', e.target.value)} style={inputCls} placeholder="2024" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>CATEGORY</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputCls, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a0a1f' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>CREDENTIAL ID</label>
                  <input value={form.credentialId} onChange={e => set('credentialId', e.target.value)} style={inputCls} placeholder="CISCO-XXXX" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>VERIFY URL</label>
                  <input value={form.verifyUrl} onChange={e => set('verifyUrl', e.target.value)} style={inputCls} placeholder="https://credly.com/..." onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>DESCRIPTION</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} style={{ ...inputCls, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>COLOR</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => set('color', c)} className="w-8 h-8 rounded-lg transition-all"
                      style={{ background: c, border: form.color === c ? '3px solid white' : '2px solid transparent', boxShadow: form.color === c ? `0 0 12px ${c}` : 'none' }} />
                  ))}
                  <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2px', background: 'transparent' }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-space font-semibold text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>CANCEL</button>
                <button onClick={save} className="flex-1 py-3 rounded-xl font-space font-bold text-sm"
                  style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6', boxShadow: '0 0 20px rgba(139,92,246,0.1)' }}>
                  {modal === 'add' ? '➕ ADD' : '✅ SAVE'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {delConfirm && (
          <Modal title="🗑️ Delete Certificate?" onClose={() => setDelConfirm(null)}>
            <p className="mb-6" style={{ color: 'rgba(180,190,210,0.8)' }}>
              Delete <strong style={{ color: '#FF6B6B' }}>"{certificates.find(c => c.id === delConfirm)?.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)} className="flex-1 py-3 rounded-xl font-space font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>CANCEL</button>
              <button onClick={() => remove(delConfirm)} className="flex-1 py-3 rounded-xl font-space font-bold text-sm"
                style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.4)', color: '#FF6B6B' }}>🗑️ DELETE</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
