import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const handleEnter = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%, -50%) scale(2.5)'
      if (ringRef.current) {
        ringRef.current.style.width = '60px'
        ringRef.current.style.height = '60px'
        ringRef.current.style.borderColor = 'rgba(139,92,246,0.8)'
      }
    }

    const handleLeave = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
      if (ringRef.current) {
        ringRef.current.style.width = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.borderColor = 'rgba(0,212,255,0.6)'
      }
    }

    window.addEventListener('mousemove', handleMove)

    const interactables = document.querySelectorAll('a, button, [data-hover]')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    const animate = () => {
      const lerp = 0.12
      ring.current.x += (pos.current.x - ring.current.x) * lerp
      ring.current.y += (pos.current.y - ring.current.y) * lerp

      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px'
        dotRef.current.style.top = pos.current.y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      rafId.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00D4FF',
          boxShadow: '0 0 10px rgba(0,212,255,0.9), 0 0 20px rgba(0,212,255,0.5)',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.2s ease',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0,212,255,0.6)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  )
}
