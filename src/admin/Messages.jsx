import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'portfolio_messages'

function loadMsgs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveMsgs(msgs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)) } catch {}
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'À l\'instant'
  if (m < 60) return `Il y a ${m}m`
  if (h < 24) return `Il y a ${h}h`
  if (d < 7) return `Il y a ${d}j`
  return new Date(ts).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Toast({ msg, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-space font-semibold whitespace-nowrap"
      style={{ background: type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.4)' : 'rgba(255,107,107,0.4)'}`, color: type === 'success' ? '#00FF88' : '#FF6B6B', backdropFilter: 'blur(12px)' }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </motion.div>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState(loadMsgs)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all') // all | unread | read
  const [toast, setToast] = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const reload = useCallback(() => setMessages(loadMsgs()), [])

  useEffect(() => {
    window.addEventListener('focus', reload)
    return () => window.removeEventListener('focus', reload)
  }, [reload])

  const unreadCount = messages.filter(m => !m.read).length

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  const markRead = (id) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m)
    setMessages(updated); saveMsgs(updated)
  }

  const markAllRead = () => {
    const updated = messages.map(m => ({ ...m, read: true }))
    setMessages(updated); saveMsgs(updated)
    showToast('Tous les messages marqués comme lus')
  }

  const deleteMsg = (id) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated); saveMsgs(updated)
    if (selected?.id === id) setSelected(null)
    setDelConfirm(null)
    showToast('Message supprimé')
  }

  const deleteAll = () => {
    setMessages([]); saveMsgs([]); setSelected(null)
    setDelConfirm(null)
    showToast('Tous les messages supprimés')
  }

  const openMsg = (msg) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="section-label mb-1">SECURE COMMUNICATION CHANNEL</p>
          <h1 className="text-3xl font-bold font-space flex items-center gap-3" style={{ color: '#F0F4FF' }}>
            Messages
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center text-sm font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF', fontSize: '0.75rem' }}>
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}>
              ✓ Tout marquer lu
            </button>
          )}
          {messages.length > 0 && (
            <button onClick={() => setDelConfirm('all')}
              className="px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200"
              style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}>
              🗑️ Tout supprimer
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[['all', 'Tous', messages.length], ['unread', 'Non lus', unreadCount], ['read', 'Lus', messages.length - unreadCount]].map(([val, label, count]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200"
            style={{
              background: filter === val ? 'rgba(0,212,255,0.12)' : 'rgba(10,10,22,0.8)',
              border: `1px solid ${filter === val ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
              color: filter === val ? '#00D4FF' : 'rgba(150,165,195,0.5)',
              letterSpacing: '0.06em',
            }}>
            {label}
            <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '0.6rem' }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {messages.length === 0 ? (
        /* Empty state */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl py-24 flex flex-col items-center justify-center text-center"
          style={{ background: 'rgba(10,10,22,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-5xl mb-4 opacity-30">📭</div>
          <div className="text-sm font-mono mb-1" style={{ color: 'rgba(150,165,195,0.5)', letterSpacing: '0.1em' }}>AUCUN MESSAGE</div>
          <div className="text-xs" style={{ color: 'rgba(150,165,195,0.3)' }}>
            Les messages du formulaire de contact apparaîtront ici
          </div>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">

          {/* Message list */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono" style={{ color: 'rgba(150,165,195,0.35)' }}>
                Aucun message dans cette catégorie
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((msg, i) => (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => openMsg(msg)}
                    className="rounded-xl p-4 cursor-pointer transition-all duration-200 relative"
                    style={{
                      background: selected?.id === msg.id ? 'rgba(0,212,255,0.08)' : 'rgba(10,10,22,0.85)',
                      border: `1px solid ${selected?.id === msg.id ? 'rgba(0,212,255,0.3)' : msg.read ? 'rgba(255,255,255,0.05)' : 'rgba(0,212,255,0.18)'}`,
                    }}
                    onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'rgba(12,12,28,0.95)' }}
                    onMouseLeave={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'rgba(10,10,22,0.85)' }}
                  >
                    {/* Unread dot */}
                    {!msg.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full"
                        style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} />
                    )}

                    <div className="flex items-start gap-3 pr-4">
                      {/* Avatar initials */}
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
                          border: '1px solid rgba(0,212,255,0.2)',
                          color: '#00D4FF',
                        }}>
                        {msg.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <span className="text-sm font-semibold font-space truncate"
                            style={{ color: msg.read ? 'rgba(240,244,255,0.7)' : '#F0F4FF' }}>
                            {msg.name}
                          </span>
                          <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(150,165,195,0.35)', fontSize: '0.6rem' }}>
                            {timeAgo(msg.timestamp)}
                          </span>
                        </div>
                        <div className="text-xs font-medium mb-1 truncate"
                          style={{ color: msg.read ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.7)' }}>
                          {msg.subject}
                        </div>
                        <div className="text-xs truncate" style={{ color: 'rgba(150,165,195,0.4)' }}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl overflow-hidden sticky top-24"
                  style={{ background: 'rgba(10,10,22,0.95)', border: '1px solid rgba(0,212,255,0.15)' }}
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)', background: 'rgba(0,212,255,0.04)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: '#00FF88', boxShadow: '0 0 6px #00FF88' }} />
                          <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.12em' }}>MESSAGE REÇU</span>
                        </div>
                        <h2 className="text-lg font-bold font-space" style={{ color: '#F0F4FF' }}>{selected.subject}</h2>
                      </div>
                      <button onClick={() => setDelConfirm(selected.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                        style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B', fontSize: '0.85rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}>
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Sender info */}
                  <div className="px-6 py-4 border-b flex items-center gap-4 flex-wrap" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}>
                      {selected.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold font-space" style={{ color: '#F0F4FF' }}>{selected.name}</div>
                      <a href={`mailto:${selected.email}`}
                        className="text-sm font-mono transition-colors"
                        style={{ color: 'rgba(0,212,255,0.6)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#00D4FF'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.6)'}>
                        {selected.email}
                      </a>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.4)', fontSize: '0.65rem' }}>
                        {new Date(selected.timestamp).toLocaleString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {/* Reply button */}
                      <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF', textDecoration: 'none', letterSpacing: '0.06em' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}>
                        ↩ Répondre
                      </a>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="px-6 py-6">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(200,215,235,0.85)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {selected.message}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="flex-1 py-2.5 rounded-lg text-xs font-space font-semibold text-center transition-all"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF', textDecoration: 'none', letterSpacing: '0.1em' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                      ✉️ RÉPONDRE PAR EMAIL
                    </a>
                    <button onClick={() => setSelected(null)}
                      className="px-5 py-2.5 rounded-lg text-xs font-mono transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(150,165,195,0.6)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                      Fermer
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl h-64 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(10,10,22,0.5)', border: '1px dashed rgba(0,212,255,0.1)' }}>
                  <div className="text-3xl mb-3 opacity-30">✉️</div>
                  <div className="text-xs font-mono" style={{ color: 'rgba(150,165,195,0.3)', letterSpacing: '0.1em' }}>
                    SÉLECTIONNER UN MESSAGE
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {delConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,2,8,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setDelConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'rgba(10,10,22,0.98)', border: '1px solid rgba(255,107,107,0.2)' }}>
              <div className="text-lg font-bold font-space mb-2" style={{ color: '#F0F4FF' }}>🗑️ Supprimer ?</div>
              <p className="text-sm mb-6" style={{ color: 'rgba(150,165,195,0.7)' }}>
                {delConfirm === 'all'
                  ? `Cette action va supprimer définitivement tous les ${messages.length} messages.`
                  : 'Ce message sera supprimé définitivement.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDelConfirm(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-space font-semibold"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,190,210,0.7)' }}>
                  Annuler
                </button>
                <button onClick={() => delConfirm === 'all' ? deleteAll() : deleteMsg(delConfirm)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-space font-bold"
                  style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)', color: '#FF6B6B' }}>
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
