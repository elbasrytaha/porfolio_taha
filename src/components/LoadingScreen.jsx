import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BOOT_MESSAGES = [
  { text: '> INITIALIZING NEURAL NETWORK MODULES...', delay: 0 },
  { text: '> LOADING CYBERSECURITY PROTOCOLS...', delay: 380 },
  { text: '> ESTABLISHING ENCRYPTED CONNECTION...', delay: 720 },
  { text: '> DEPLOYING AI AGENT SYSTEMS...', delay: 1060 },
  { text: '> CALIBRATING THREAT DETECTION ENGINE...', delay: 1380 },
  { text: '> MOUNTING INTELLIGENCE DATABASE...', delay: 1700 },
  { text: '> ALL SYSTEMS OPERATIONAL.', delay: 2020 },
  { text: '> WELCOME, COMMANDER.', delay: 2280 },
]

export default function LoadingScreen({ onComplete }) {
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const containerRef = useRef(null)
  const hexRef = useRef(null)

  useEffect(() => {
    gsap.to(hexRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none',
    })

    const timers = BOOT_MESSAGES.map((msg, i) =>
      setTimeout(() => {
        setLines(prev => [...prev, msg.text])
        setProgress(Math.round(((i + 1) / BOOT_MESSAGES.length) * 100))
        if (i === BOOT_MESSAGES.length - 1) {
          setTimeout(() => {
            setDone(true)
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete,
            })
          }, 600)
        }
      }, msg.delay)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="w-full max-w-xl px-8">
        {/* Hex logo */}
        <div className="flex justify-center mb-10">
          <div ref={hexRef} className="relative w-20 h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 absolute" fill="none">
              <polygon
                points="50,4 93,27 93,73 50,96 7,73 7,27"
                stroke="rgba(0,212,255,0.8)"
                strokeWidth="2"
                fill="rgba(0,212,255,0.05)"
              />
            </svg>
            <span className="text-2xl font-bold text-glow-cyan" style={{ color: '#00D4FF' }}>TE</span>
          </div>
        </div>

        {/* Terminal window */}
        <div className="glass rounded-lg overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cyan-neon/10">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs font-mono text-cyan-neon/50">TAHA_OS v2.0 — SECURE BOOT</span>
          </div>
          <div className="p-4 font-mono text-sm min-h-[220px]">
            {lines.map((line, i) => (
              <div
                key={i}
                className="mb-1 flex items-start gap-2"
                style={{
                  color: i === lines.length - 1 && line.includes('WELCOME')
                    ? '#00FF88'
                    : i === lines.length - 1
                    ? '#00D4FF'
                    : 'rgba(0,212,255,0.6)',
                  animation: 'hero-rise 0.3s ease forwards',
                  textShadow: i === lines.length - 1 ? '0 0 10px currentColor' : 'none',
                }}
              >
                {line}
              </div>
            ))}
            {!done && (
              <span
                className="inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle"
                style={{ animation: 'pulse 0.8s step-end infinite' }}
              />
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span style={{ color: 'rgba(0,212,255,0.5)' }}>SYSTEM INITIALIZATION</span>
            <span style={{ color: '#00D4FF' }}>{progress}%</span>
          </div>
          <div className="h-px w-full bg-white/5 rounded overflow-hidden">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
