import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'

function Toast({ msg, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-space font-semibold"
      style={{ background: type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.4)' : 'rgba(255,107,107,0.4)'}`, color: type === 'success' ? '#00FF88' : '#FF6B6B', backdropFilter: 'blur(12px)' }}>
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </motion.div>
  )
}

const inputCls = { background: 'rgba(5,5,15,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', color: '#F0F4FF', outline: 'none', padding: '8px 12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.3s' }

export default function SkillsManager() {
  const { skills, setSkills } = useData()
  const [toast, setToast] = useState(null)
  const [activeCategory, setActiveCategory] = useState(Object.keys(skills)[0])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('#00D4FF')
  const [newCatIcon, setNewCatIcon] = useState('⚡')

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const updateLevel = (cat, idx, val) => {
    const updated = { ...skills, [cat]: { ...skills[cat], skills: skills[cat].skills.map((s, i) => i === idx ? { ...s, level: Number(val) } : s) } }
    setSkills(updated); showToast('Skill level updated!')
  }

  const removeSkill = (cat, idx) => {
    const updated = { ...skills, [cat]: { ...skills[cat], skills: skills[cat].skills.filter((_, i) => i !== idx) } }
    setSkills(updated); showToast('Skill removed.')
  }

  const addSkill = (cat) => {
    if (!newSkillName.trim()) return showToast('Enter a skill name', 'error')
    const updated = { ...skills, [cat]: { ...skills[cat], skills: [...skills[cat].skills, { name: newSkillName.trim(), level: Number(newSkillLevel) }] } }
    setSkills(updated); setNewSkillName(''); setNewSkillLevel(80); showToast('Skill added!')
  }

  const removeCategory = (cat) => {
    const updated = { ...skills }; delete updated[cat]
    setSkills(updated); setActiveCategory(Object.keys(updated)[0] || ''); showToast('Category removed.')
  }

  const addCategory = () => {
    if (!newCatName.trim()) return showToast('Enter a category name', 'error')
    if (skills[newCatName]) return showToast('Category already exists', 'error')
    const updated = { ...skills, [newCatName.trim()]: { color: newCatColor, icon: newCatIcon, skills: [] } }
    setSkills(updated); setActiveCategory(newCatName.trim()); setNewCatName(''); showToast('Category added!')
  }

  const cats = Object.keys(skills)

  return (
    <div>
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="mb-8">
        <p className="section-label mb-1">CONTENT MANAGER</p>
        <h1 className="text-3xl font-bold font-space" style={{ color: '#F0F4FF' }}>
          Skills <span className="gradient-text-cyan">({Object.values(skills).reduce((a, c) => a + c.skills.length, 0)} skills)</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left — category list */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-mono mb-3" style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em' }}>CATEGORIES</h3>
          <div className="space-y-2 mb-4">
            {cats.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                style={{ background: activeCategory === cat ? `${skills[cat].color}12` : 'rgba(255,255,255,0.03)', border: `1px solid ${activeCategory === cat ? skills[cat].color + '40' : 'rgba(255,255,255,0.07)'}`, color: activeCategory === cat ? skills[cat].color : 'rgba(180,190,210,0.6)' }}>
                <span className="text-lg shrink-0">{skills[cat].icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-space font-medium truncate">{cat}</div>
                  <div className="text-xs" style={{ color: 'rgba(150,165,195,0.4)', fontSize: '0.65rem' }}>{skills[cat].skills.length} skills</div>
                </div>
              </button>
            ))}
          </div>

          {/* Add category */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(8,8,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="text-xs font-mono mb-3" style={{ color: 'rgba(0,212,255,0.5)', letterSpacing: '0.1em' }}>NEW CATEGORY</h4>
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Category name"
              style={{ ...inputCls, width: '100%', marginBottom: '8px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
            <div className="flex gap-2 mb-3">
              <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="🔧"
                style={{ ...inputCls, width: '64px', textAlign: 'center' }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
              <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)}
                style={{ width: '42px', height: '38px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '3px', background: 'transparent', cursor: 'pointer' }} />
            </div>
            <button onClick={addCategory} className="w-full py-2 rounded-lg text-xs font-space font-bold transition-all"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}>
              ➕ ADD CATEGORY
            </button>
          </div>
        </div>

        {/* Right — skills list */}
        <div className="lg:col-span-3">
          {activeCategory && skills[activeCategory] ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skills[activeCategory].icon}</span>
                  <h3 className="text-xl font-bold font-space" style={{ color: skills[activeCategory].color }}>{activeCategory}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ background: `${skills[activeCategory].color}12`, color: skills[activeCategory].color, border: `1px solid ${skills[activeCategory].color}25` }}>
                    {skills[activeCategory].skills.length} SKILLS
                  </span>
                </div>
                <button onClick={() => removeCategory(activeCategory)}
                  className="px-3 py-1.5 rounded-lg text-xs font-space font-semibold transition-all"
                  style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
                  🗑️ Delete Category
                </button>
              </div>

              {/* Skills */}
              <div className="space-y-3 mb-6">
                {skills[activeCategory].skills.map((skill, idx) => (
                  <motion.div key={`${skill.name}-${idx}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-4 p-3 rounded-xl group"
                    style={{ background: 'rgba(8,8,20,0.7)', border: `1px solid ${skills[activeCategory].color}15` }}>
                    <span className="text-sm font-space font-medium w-36 shrink-0 truncate" style={{ color: '#F0F4FF' }}>{skill.name}</span>
                    <div className="flex-1">
                      <input type="range" min="0" max="100" value={skill.level}
                        onChange={e => updateLevel(activeCategory, idx, e.target.value)}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: skills[activeCategory].color }} />
                      <div className="flex justify-between mt-1">
                        <div className="h-px flex-1 rounded" style={{ background: `linear-gradient(90deg, ${skills[activeCategory].color}, ${skills[activeCategory].color}30)`, maxWidth: `${skill.level}%`, marginTop: '-4px' }} />
                      </div>
                    </div>
                    <span className="w-10 text-center text-sm font-bold font-mono shrink-0" style={{ color: skills[activeCategory].color }}>{skill.level}%</span>
                    <button onClick={() => removeSkill(activeCategory, idx)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all shrink-0"
                      style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add skill */}
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(8,8,20,0.8)', border: `1px solid ${skills[activeCategory].color}18` }}>
                <h4 className="text-xs font-mono mb-3" style={{ color: `${skills[activeCategory].color}80`, letterSpacing: '0.15em' }}>
                  ADD SKILL TO {activeCategory}
                </h4>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-mono mb-1" style={{ color: 'rgba(150,165,195,0.5)', letterSpacing: '0.08em', fontSize: '0.65rem' }}>SKILL NAME</label>
                    <input value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                      placeholder="e.g. Kubernetes"
                      style={{ ...inputCls, width: '100%' }}
                      onKeyDown={e => e.key === 'Enter' && addSkill(activeCategory)}
                      onFocus={e => e.target.style.borderColor = skills[activeCategory].color + '60'}
                      onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'} />
                  </div>
                  <div style={{ width: '120px' }}>
                    <label className="block text-xs font-mono mb-1" style={{ color: 'rgba(150,165,195,0.5)', letterSpacing: '0.08em', fontSize: '0.65rem' }}>LEVEL: {newSkillLevel}%</label>
                    <input type="range" min="0" max="100" value={newSkillLevel}
                      onChange={e => setNewSkillLevel(e.target.value)}
                      className="w-full cursor-pointer" style={{ accentColor: skills[activeCategory].color, marginTop: '10px' }} />
                  </div>
                  <button onClick={() => addSkill(activeCategory)}
                    className="px-5 py-2 rounded-xl font-space font-bold text-sm shrink-0 transition-all"
                    style={{ background: `${skills[activeCategory].color}15`, border: `1px solid ${skills[activeCategory].color}40`, color: skills[activeCategory].color, height: '38px' }}>
                    ➕ ADD
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40" style={{ color: 'rgba(150,165,195,0.4)' }}>
              Select a category from the left to manage skills.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
