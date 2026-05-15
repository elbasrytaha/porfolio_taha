import { useRef, useState } from 'react'

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

export default function ImageUpload({ value, onChange, label = 'IMAGE', hint = '', circle = false }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')

  const process = async (file) => {
    setError('')
    if (!file.type.startsWith('image/')) return setError('File must be an image.')
    if (file.size > 2 * 1024 * 1024) return setError('Max size: 2MB. Please compress the image.')
    const b64 = await toBase64(file)
    onChange(b64)
  }

  const handleFile = (e) => { const f = e.target.files[0]; if (f) process(f) }
  const handleDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) process(f) }

  return (
    <div>
      <label className="block text-xs font-mono mb-2" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.1em' }}>
        {label}
        {hint && <span style={{ color: 'rgba(150,165,195,0.4)', marginLeft: '8px', letterSpacing: '0.05em', textTransform: 'none', fontFamily: 'Inter' }}>{hint}</span>}
      </label>

      <div className="flex gap-4 items-start">
        {/* Preview */}
        {value && (
          <div className="relative shrink-0">
            <div
              className={circle ? 'w-20 h-20 rounded-full overflow-hidden' : 'w-28 h-20 rounded-xl overflow-hidden'}
              style={{ border: '2px solid rgba(0,212,255,0.3)' }}
            >
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: '#FF6B6B', color: '#fff', border: '2px solid #050505' }}
            >✕</button>
          </div>
        )}

        {/* Drop zone */}
        <div
          className={`flex-1 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${drag ? 'border-2' : 'border'}`}
          style={{
            borderColor: drag ? 'rgba(0,212,255,0.7)' : 'rgba(0,212,255,0.2)',
            background: drag ? 'rgba(0,212,255,0.06)' : 'rgba(5,5,15,0.6)',
            borderStyle: 'dashed',
            padding: '20px',
            minHeight: '90px',
          }}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <span className="text-2xl">{value ? '🔄' : '📁'}</span>
          <span className="text-xs font-mono text-center" style={{ color: 'rgba(150,165,195,0.6)' }}>
            {value ? 'Click or drag to replace' : 'Click or drag image here'}
          </span>
          <span className="text-xs" style={{ color: 'rgba(150,165,195,0.35)', fontSize: '0.6rem' }}>
            PNG, JPG, WEBP — max 2MB
          </span>
        </div>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {/* URL fallback */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(150,165,195,0.4)', letterSpacing: '0.05em' }}>OR URL:</span>
        <input
          type="url"
          placeholder="https://..."
          value={value?.startsWith('http') ? value : ''}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, padding: '6px 12px', background: 'rgba(5,5,15,0.8)',
            border: '1px solid rgba(0,212,255,0.12)', borderRadius: '6px',
            color: '#F0F4FF', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '0.75rem',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.12)'}
        />
      </div>

      {error && (
        <p className="text-xs mt-1 font-mono" style={{ color: '#FF6B6B' }}>⚠ {error}</p>
      )}
    </div>
  )
}
