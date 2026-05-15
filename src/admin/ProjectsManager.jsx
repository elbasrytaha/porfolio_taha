import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import ImageUpload from './ImageUpload'

const EMPTY = { title: '', category: 'AI / AUTOMATION', description: '', tags: '', color: '#00D4FF', icon: '🚀', github: '', metric1Label: 'Stars', metric1Value: '—', metric2Label: 'Status', metric2Value: 'Active', image: '' }
const CATEGORIES = ['AI / AUTOMATION', 'AI / SYSTEMS', 'HARDWARE / SECURITY', 'CYBERSECURITY / AI', 'NETWORK / INFRA', 'WEB / FULLSTACK', 'OTHER']
const COLORS = ['#00D4FF', '#8B5CF6', '#00FF88', '#FF6B6B', '#FCC624', '#FF9500', '#FF2D55']

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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl holo-border"
        style={{ background: 'rgba(8,8,20,0.98)', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <h2 className="text-lg font-bold font-space" style={{ color: '#F0F4FF' }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

const inputCls = { background: 'rgba(5,5,15,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', color: '#F0F4FF', outline: 'none', width: '100%', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.3s' }
const labelCls = 'block text-xs font-mono mb-1.5'
const labelStyle = { color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }

export default function ProjectsManager() {
  const { projects, setProjects } = useData()
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [toast, setToast] = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, tags: p.tags.join(', '), metric1Label: p.metrics[0]?.label || '', metric1Value: p.metrics[0]?.value || '', metric2Label: p.metrics[1]?.label || '', metric2Value: p.metrics[1]?.value || '', image: p.image || '' })
    setModal('edit')
  }

  const save = () => {
    if (!form.title.trim()) return showToast('Title is required', 'error')
    const entry = {
      id: modal === 'add' ? Date.now() : editing,
      title: form.title, category: form.category, description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      color: form.color, icon: form.icon, github: form.github,
      bgGrad: `linear-gradient(135deg, ${form.color}12, rgba(5,5,15,0.9))`,
      metrics: [{ label: form.metric1Label, value: form.metric1Value }, { label: form.metric2Label, value: form.metric2Value }],
      image: form.image || '',
    }
    if (modal === 'add') setProjects([...projects, entry])
    else setProjects(projects.map(p => p.id === editing ? entry : p))
    setModal(null)
    showToast(modal === 'add' ? 'Project added!' : 'Project updated!')
  }

  const remove = (id) => { setProjects(projects.filter(p => p.id !== id)); setDelConfirm(null); showToast('Project deleted.') }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const onFocus = e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)' }
  const onBlur = e => { e.target.style.borderColor = 'rgba(0,212,255,0.15)' }

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CONTENT MANAGER</p>
          <h1 className="text-3xl font-bold font-space" style={{ color: '#F0F4FF' }}>Projects <span className="gradient-text-cyan">({projects.length})</span></h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-space font-bold text-sm transition-all duration-300"
          style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.35)', color: '#00D4FF', boxShadow: '0 0 20px rgba(0,212,255,0.1)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.1)'}>
          ➕ ADD PROJECT
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid px-5 py-3 text-xs font-mono border-b" style={{ gridTemplateColumns: '1fr 160px 160px 90px', borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(150,165,195,0.5)', letterSpacing: '0.1em' }}>
          <span>PROJECT</span><span>CATEGORY</span><span>GITHUB</span><span className="text-right">ACTIONS</span>
        </div>
        {projects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="grid px-5 py-4 items-center border-b transition-colors"
            style={{ gridTemplateColumns: '1fr 160px 160px 90px', borderColor: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
                style={{ background: `${p.color}12`, border: `1px solid ${p.color}25` }}>{p.icon}</div>
              <div className="min-w-0">
                <div className="text-sm font-space font-medium truncate" style={{ color: '#F0F4FF' }}>{p.title}</div>
                <div className="text-xs truncate" style={{ color: 'rgba(150,165,195,0.5)', maxWidth: '280px' }}>{p.description.substring(0, 60)}…</div>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full w-fit" style={{ background: `${p.color}10`, color: p.color, fontSize: '0.6rem', letterSpacing: '0.05em' }}>{p.category}</span>
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs font-mono truncate hover:underline"
              style={{ color: 'rgba(0,212,255,0.5)', maxWidth: '150px' }}>
              {p.github.replace('https://github.com/', '') || '—'}
            </a>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}>✏️</button>
              <button onClick={() => setDelConfirm(p.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}>🗑️</button>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-16" style={{ color: 'rgba(150,165,195,0.4)' }}>No projects yet. Click ADD PROJECT to start.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? '➕ Add New Project' : '✏️ Edit Project'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls} style={labelStyle}>TITLE *</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} style={inputCls} placeholder="Project name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>CATEGORY</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputCls, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a0a1f' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>ICON (emoji)</label>
                  <input value={form.icon} onChange={e => set('icon', e.target.value)} style={inputCls} placeholder="🚀" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls} style={labelStyle}>GITHUB URL</label>
                  <input value={form.github} onChange={e => set('github', e.target.value)} style={inputCls} placeholder="https://github.com/elbasrytaha/..." onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls} style={labelStyle}>DESCRIPTION</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputCls, resize: 'vertical' }} placeholder="Project description..." onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls} style={labelStyle}>TAGS (comma separated)</label>
                  <input value={form.tags} onChange={e => set('tags', e.target.value)} style={inputCls} placeholder="Python, AI, ESP32, ..." onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>METRIC 1 LABEL</label>
                  <input value={form.metric1Label} onChange={e => set('metric1Label', e.target.value)} style={inputCls} placeholder="Detection Rate" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>METRIC 1 VALUE</label>
                  <input value={form.metric1Value} onChange={e => set('metric1Value', e.target.value)} style={inputCls} placeholder="98%" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>METRIC 2 LABEL</label>
                  <input value={form.metric2Label} onChange={e => set('metric2Label', e.target.value)} style={inputCls} placeholder="Response Time" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>METRIC 2 VALUE</label>
                  <input value={form.metric2Value} onChange={e => set('metric2Value', e.target.value)} style={inputCls} placeholder="<2s" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>COLOR</label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => set('color', c)}
                        className="w-8 h-8 rounded-lg transition-all"
                        style={{ background: c, border: form.color === c ? `3px solid white` : '2px solid transparent', boxShadow: form.color === c ? `0 0 12px ${c}` : 'none' }} />
                    ))}
                    <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2px', background: 'transparent' }} />
                  </div>
                </div>
                <div className="col-span-2">
                  <ImageUpload
                    value={form.image || ''}
                    onChange={v => set('image', v)}
                    label="PROJECT IMAGE"
                    hint="screenshot or thumbnail (optional)"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-space font-semibold text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>
                  CANCEL
                </button>
                <button onClick={save} className="flex-1 py-3 rounded-xl font-space font-bold text-sm transition-all"
                  style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF', boxShadow: '0 0 20px rgba(0,212,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.1)'}>
                  {modal === 'add' ? '➕ ADD PROJECT' : '✅ SAVE CHANGES'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {delConfirm && (
          <Modal title="🗑️ Delete Project?" onClose={() => setDelConfirm(null)}>
            <p className="mb-6" style={{ color: 'rgba(180,190,210,0.8)' }}>
              This will permanently remove <strong style={{ color: '#FF6B6B' }}>"{projects.find(p => p.id === delConfirm)?.title}"</strong> from your portfolio.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)} className="flex-1 py-3 rounded-xl font-space font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>
                CANCEL
              </button>
              <button onClick={() => remove(delConfirm)} className="flex-1 py-3 rounded-xl font-space font-bold text-sm"
                style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.4)', color: '#FF6B6B' }}>
                🗑️ DELETE
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
