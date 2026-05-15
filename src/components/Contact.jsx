import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    handle: 'taha-elbasry',
    href: 'https://linkedin.com/in/taha-elbasry',
    icon: '🔗',
    color: '#0077B5',
    desc: 'Professional network',
  },
  {
    name: 'GitHub',
    handle: 'taha-elbasry',
    href: 'https://github.com/taha-elbasry',
    icon: '⚡',
    color: '#8B5CF6',
    desc: 'Open source projects',
  },
  {
    name: 'Email',
    handle: 'elbasrytaha10@gmail.com',
    href: 'mailto:elbasrytaha10@gmail.com',
    icon: '✉️',
    color: '#00D4FF',
    desc: 'Direct communication',
  },
  {
    name: 'WhatsApp',
    handle: 'Chat on WhatsApp',
    href: 'https://wa.me/212000000000',
    icon: '💬',
    color: '#25D366',
    desc: 'Quick response',
  },
]

export default function Contact() {
  const { T } = useTheme()
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))

    // Save message to localStorage
    const msg = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      timestamp: Date.now(),
      read: false,
    }
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_messages') || '[]')
      localStorage.setItem('portfolio_messages', JSON.stringify([msg, ...existing]))
    } catch {}

    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const inputStyle = {
    background: T.input,
    border: `1px solid ${T.border}`,
    color: T.text,
    outline: 'none',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(0,212,255,0.5)'
    e.target.style.boxShadow = '0 0 20px rgba(0,212,255,0.1)'
  }
  const handleBlur = (e) => {
    e.target.style.borderColor = T.border
    e.target.style.boxShadow = 'none'
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: T.section }}>
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15), transparent)', filter: 'blur(80px)' }} />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-16" style={{ background: 'rgba(0,212,255,0.3)' }} />
          <span className="section-label">07 / CONTACT</span>
          <div className="h-px flex-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left — CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <h2 className="text-5xl font-bold font-space mb-6 leading-tight" style={{ color: T.text }}>
              Let's Build{' '}
              <span className="gradient-text-cyan">Something</span>{' '}
              Extraordinary.
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: T.muted }}>
              Whether you need AI infrastructure, cybersecurity solutions, or intelligent automation — let's connect and discuss how I can help achieve your goals.
            </p>

            {/* Social links */}
            <div className="space-y-3">
              {SOCIAL_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                  style={{
                    background: T.cardBg,
                    border: `1px solid ${T.border}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${link.color}08`
                    e.currentTarget.style.borderColor = `${link.color}30`
                    e.currentTarget.style.transform = 'translateX(6px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = T.cardBg
                    e.currentTarget.style.borderColor = T.border
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${link.color}15`, border: `1px solid ${link.color}25` }}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold font-space" style={{ color: T.text }}>
                      {link.name}
                    </div>
                    <div className="text-xs font-mono" style={{ color: T.dim }}>
                      {link.handle}
                    </div>
                  </div>
                  <div className="ml-auto text-xs" style={{ color: T.faint }}>
                    →
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="glass-bright rounded-2xl p-8 holo-border relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="scan-line" style={{ animationDuration: '7s' }} />
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }} />
                <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.2em' }}>
                  SECURE COMMUNICATION CHANNEL
                </span>
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold font-space mb-2" style={{ color: '#00FF88' }}>
                    Message Transmitted
                  </h3>
                  <p style={{ color: T.muted }}>
                    I'll get back to you within 24 hours, Commander.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>
                        NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        style={{ ...inputStyle, '::placeholder': { color: 'rgba(150,165,195,0.3)' } }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Project collaboration, consulting..."
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>
                      MESSAGE
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project, requirements, or just say hello..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-xl font-space font-bold text-sm tracking-widest transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: sending
                        ? 'rgba(0,212,255,0.1)'
                        : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.15))',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: '#00D4FF',
                      boxShadow: sending ? 'none' : '0 0 30px rgba(0,212,255,0.15)',
                      letterSpacing: '0.2em',
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => {
                      if (!sending) e.currentTarget.style.boxShadow = '0 0 60px rgba(0,212,255,0.35)'
                    }}
                    onMouseLeave={e => {
                      if (!sending) e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.15)'
                    }}
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
                        </svg>
                        TRANSMITTING...
                      </span>
                    ) : (
                      'SEND MESSAGE →'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 relative z-10"
        style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
              <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" stroke="#00D4FF" strokeWidth="2" fill="rgba(0,212,255,0.06)" />
            </svg>
            <span className="font-space font-bold text-sm" style={{ color: T.text }}>TAHA ELBASRY</span>
          </div>
          <div className="text-xs font-mono text-center" style={{ color: T.faint, letterSpacing: '0.1em' }}>
            © 2024 TAHA ELBASRY · AI ENGINEER & CYBERSECURITY SPECIALIST · CASABLANCA, MOROCCO
          </div>
          <div className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.4)' }}>
            BUILT WITH ⚡ REACT
          </div>
        </div>
      </div>
    </section>
  )
}
