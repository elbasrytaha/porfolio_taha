import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false })
    let particles = []
    let width, height
    let frameCount = 0

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initParticles()
    }

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 22000), 50)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.35 + 0.15,
        color: Math.random() > 0.65 ? '#8B5CF6' : '#00D4FF',
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })

    // Pause when tab is hidden
    const handleVisibility = () => {
      pausedRef.current = document.hidden
      if (!document.hidden && !animRef.current) draw()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Pause when hero section leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = !entry.isIntersecting
        if (entry.isIntersecting && !animRef.current) draw()
      },
      { threshold: 0 }
    )
    if (canvas.parentElement) observer.observe(canvas.parentElement)

    const CONNECT_DIST_SQ = 8100   // 90px²
    const MOUSE_DIST_SQ  = 18000   // ~134px²

    const draw = () => {
      if (pausedRef.current) {
        animRef.current = null
        return
      }
      frameCount++
      ctx.clearRect(0, 0, width, height)

      const n = particles.length
      for (let i = 0; i < n; i++) {
        const p = particles[i]
        p.pulse += 0.014
        const op = p.opacity + Math.sin(p.pulse) * 0.07

        const mdx = p.x - mouse.current.x
        const mdy = p.y - mouse.current.y
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < MOUSE_DIST_SQ && md2 > 0) {
          const f = (MOUSE_DIST_SQ - md2) / MOUSE_DIST_SQ * 0.018
          p.vx += mdx * f * 0.1
          p.vy += mdy * f * 0.1
        }

        p.vx *= 0.994
        p.vy *= 0.994
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = op
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Draw connections every 3 frames
      if (frameCount % 3 === 0) {
        ctx.lineWidth = 0.4
        for (let i = 0; i < n - 1; i++) {
          for (let j = i + 1; j < n; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < CONNECT_DIST_SQ) {
              const alpha = (1 - d2 / CONNECT_DIST_SQ) * 0.15
              ctx.strokeStyle = `rgba(0,212,255,${alpha.toFixed(2)})`
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('visibilitychange', handleVisibility)
      observer.disconnect()
      ro.disconnect()
      if (animRef.current) cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{ display: 'block' }}
    />
  )
}
