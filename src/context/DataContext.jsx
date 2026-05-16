import { createContext, useContext, useState, useEffect } from 'react'

// ─── DEFAULT DATA ────────────────────────────────────────────────
const DEFAULT_PROJECTS = [
  { id: 1, title: 'Smart Anti-Cheating Detection System', category: 'HARDWARE / SECURITY', description: 'ESP32-based intelligent Wi-Fi/Bluetooth scanning system that detects unauthorized devices during examinations. Uses real-time signal analysis to flag suspicious activity with live alerts.', tags: ['ESP32', 'Arduino', 'Wi-Fi 802.11', 'Bluetooth', 'IoT Security', 'C++'], color: '#00D4FF', icon: '🛡️', github: 'https://github.com/elbasrytaha/smart-anti-cheating', metrics: [{ label: 'Detection Rate', value: '98%' }, { label: 'Response Time', value: '<2s' }], image: '' },
  { id: 2, title: 'AI Video Automation Platform', category: 'AI / AUTOMATION', description: 'End-to-end automated AI content creation pipeline. Integrates Gemini API for scripting, Stable Diffusion for visuals, and n8n for workflow orchestration.', tags: ['Gemini API', 'Stable Diffusion', 'n8n', 'Python', 'FFmpeg'], color: '#8B5CF6', icon: '🎬', github: 'https://github.com/elbasrytaha/ai-video-automation', metrics: [{ label: 'Automation', value: '100%' }, { label: 'Time Saved', value: '95%' }], image: '' },
  { id: 3, title: 'Local AI Assistant', category: 'AI / SYSTEMS', description: 'Privacy-first AI assistant powered by Ollama and LLaMA running entirely offline. Capable of computer control, file management, and complex task execution.', tags: ['Ollama', 'LLaMA', 'Python', 'AI Agents', 'Automation'], color: '#00FF88', icon: '🤖', github: 'https://github.com/elbasrytaha/local-ai-assistant', metrics: [{ label: 'Privacy', value: '100%' }, { label: 'Local AI', value: 'Offline' }], image: '' },
  { id: 4, title: 'Digital Forensics Platform', category: 'CYBERSECURITY / AI', description: 'AI-enhanced digital investigation platform for evidence collection, analysis, and chain-of-custody management with automated report generation.', tags: ['Digital Forensics', 'AI Analysis', 'Python', 'OSINT'], color: '#FF6B6B', icon: '🔍', github: 'https://github.com/elbasrytaha/digital-forensics-platform', metrics: [{ label: 'Accuracy', value: '96%' }, { label: 'AI-Powered', value: 'Yes' }], image: '' },
]

const DEFAULT_CERTIFICATES = [
  { id: 1, title: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco', issuerLogo: '🌐', date: '2023', credentialId: 'CISCO-XXXX', verifyUrl: 'https://www.credly.com/', category: 'NETWORKING', color: '#1BA0D7', description: 'Enterprise networking, routing & switching, network security fundamentals.' },
  { id: 2, title: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy', issuerLogo: '🛡️', date: '2023', credentialId: 'CISCO-CYBER-XXXX', verifyUrl: 'https://www.netacad.com/', category: 'CYBERSECURITY', color: '#FF6B6B', description: 'Cybersecurity fundamentals, threat landscape, network security and risk management.' },
  { id: 3, title: 'Python for Everybody', issuer: 'Coursera / University of Michigan', issuerLogo: '🐍', date: '2022', credentialId: 'COURSERA-PY-XXXX', verifyUrl: 'https://www.coursera.org/verify/', category: 'AI / DEV', color: '#3776AB', description: 'Python programming fundamentals, data structures, databases and web APIs.' },
  { id: 4, title: 'Google AI Essentials', issuer: 'Google', issuerLogo: '✨', date: '2024', credentialId: 'GOOGLE-AI-XXXX', verifyUrl: 'https://www.coursera.org/verify/', category: 'AI / ML', color: '#4285F4', description: 'Generative AI, prompt engineering, responsible AI and practical AI integration.' },
  { id: 5, title: 'Linux Essentials', issuer: 'Linux Professional Institute', issuerLogo: '🐧', date: '2023', credentialId: 'LPI-LE-XXXX', verifyUrl: 'https://lpi.org/', category: 'INFRASTRUCTURE', color: '#FCC624', description: 'Linux command line, system administration, open source fundamentals.' },
  { id: 6, title: 'Digital Forensics Fundamentals', issuer: 'Infosec Institute', issuerLogo: '🔍', date: '2024', credentialId: 'INFOSEC-DF-XXXX', verifyUrl: 'https://www.infosecinstitute.com/', category: 'CYBERSECURITY', color: '#8B5CF6', description: 'Evidence acquisition, forensic analysis, incident response and legal procedures.' },
]

const DEFAULT_SKILLS = {
  'AI & AUTOMATION': { color: '#00D4FF', icon: '🤖', skills: [{ name: 'Ollama', level: 90 }, { name: 'LLaMA', level: 85 }, { name: 'Gemini API', level: 88 }, { name: 'Stable Diffusion', level: 82 }, { name: 'AI Agents', level: 87 }, { name: 'Python AI', level: 92 }, { name: 'n8n Automation', level: 85 }] },
  'NETWORK & INFRASTRUCTURE': { color: '#8B5CF6', icon: '🌐', skills: [{ name: 'Active Directory', level: 90 }, { name: 'Linux Server', level: 92 }, { name: 'Windows Server', level: 88 }, { name: 'VMware', level: 85 }, { name: 'Proxmox', level: 83 }, { name: 'VLAN Design', level: 88 }, { name: 'Routing & Switching', level: 87 }] },
  'CYBERSECURITY': { color: '#FF6B6B', icon: '🛡️', skills: [{ name: 'Digital Forensics', level: 85 }, { name: 'SIEM', level: 80 }, { name: 'OSINT', level: 88 }, { name: 'Wireshark', level: 87 }, { name: 'Kali Linux', level: 90 }, { name: 'Threat Analysis', level: 82 }] },
  'HARDWARE & IoT': { color: '#00FF88', icon: '📡', skills: [{ name: 'ESP32', level: 85 }, { name: 'Arduino', level: 82 }, { name: 'CCTV / NVR', level: 90 }, { name: 'ONVIF', level: 85 }, { name: 'Smart Systems', level: 80 }] },
}

const DEFAULT_ABOUT = {
  name: 'Taha Elbasry',
  title: 'AI Engineer & Cybersecurity Specialist',
  location: 'Casablanca, Morocco',
  bio: "My journey into AI and Cybersecurity started with a deep curiosity about how systems, networks, and digital infrastructures truly work behind the scenes. What began as an interest in computers quickly evolved into a passion for building secure, intelligent, and scalable technological solutions.",
  bio2: "I first specialized in Networking and Systems Administration, developing strong skills in network infrastructure, server management, Active Directory, and virtualization. I also worked as a TSM Plus Administrator, managing enterprise environments including IBM AIX systems — gaining hands-on experience with high-level enterprise architectures, backup management, and infrastructure security.",
  bio3: "As my expertise grew, I became increasingly interested in Cybersecurity and Artificial Intelligence. I realized that the future of digital security relies on intelligent systems capable of detecting, analyzing, and responding to threats automatically. Today, my objective is to create intelligent systems that transform cybersecurity, infrastructure management, and digital investigation through AI-driven innovation.",
  role: "Network & Systems Administrator",
  institution: "Faculty of Sciences Ben M'Sik",
  studies: "Licence d'Excellence — AI",
  profilePhoto: '',
  stats: { projects: 20, technologies: 35, infrastructure: 12, aiSolutions: 8 },
  social: { linkedin: 'https://linkedin.com/in/taha-elbasry', github: 'https://github.com/elbasrytaha', email: 'elbasrytaha10@gmail.com', whatsapp: 'https://wa.me/212000000000' },
  journeyProjects: [
    'Intelligent real-time network intrusion detection system using Deep Learning',
    'AI-powered digital forensics and cybersecurity solutions',
    'Smart anti-cheating systems for examinations using ESP32 & IoT',
    'Local AI assistants using LLaMA and Ollama (fully offline)',
    'Automated AI video generation systems',
    'Infrastructure and virtualization projects for AI environments',
    'Intelligent monitoring and surveillance systems',
    'Advanced network labs with Cisco Packet Tracer & EVE-NG',
  ],
  softSkills: [
    { label: 'Analytical Thinking', icon: '🧠', category: 'mindset' },
    { label: 'Critical Thinking', icon: '⚡', category: 'mindset' },
    { label: 'Fast Learner', icon: '🚀', category: 'mindset' },
    { label: 'Research Oriented', icon: '🔬', category: 'mindset' },
    { label: 'Innovation Mindset', icon: '💡', category: 'mindset' },
    { label: 'Problem Solving', icon: '🎯', category: 'mindset' },
    { label: 'Leadership', icon: '👑', category: 'leadership' },
    { label: 'Project Coordination', icon: '📋', category: 'leadership' },
    { label: 'Team Collaboration', icon: '🤝', category: 'leadership' },
    { label: 'Autonomous Working', icon: '🛠️', category: 'leadership' },
    { label: 'Decision Making', icon: '⚖️', category: 'leadership' },
    { label: 'Time Management', icon: '⏱️', category: 'professional' },
    { label: 'Attention to Detail', icon: '🔍', category: 'professional' },
    { label: 'Work Under Pressure', icon: '💪', category: 'professional' },
    { label: 'Professionalism', icon: '🎖️', category: 'professional' },
    { label: 'Clear Communication', icon: '🗣️', category: 'communication' },
    { label: 'Adaptability', icon: '🔄', category: 'communication' },
    { label: 'Technical Explanation', icon: '📡', category: 'communication' },
  ],
}

// ─── LOAD / SAVE ─────────────────────────────────────────────────
const STORAGE_KEY = 'portfolio_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastUpdated: Date.now() }))
  } catch {}
}

// ─── CONTEXT ─────────────────────────────────────────────────────
const DataContext = createContext(null)

export function DataProvider({ children }) {
  const stored = loadData()

  const [projects, setProjectsState] = useState(stored?.projects ?? DEFAULT_PROJECTS)
  const [certificates, setCertificatesState] = useState(stored?.certificates ?? DEFAULT_CERTIFICATES)
  const [skills, setSkillsState] = useState(stored?.skills ?? DEFAULT_SKILLS)
  const [about, setAboutState] = useState(stored?.about ?? DEFAULT_ABOUT)

  const persist = (updates) => saveData({ projects, certificates, skills, about, ...updates })

  const setProjects = (v) => { setProjectsState(v); persist({ projects: v }) }
  const setCertificates = (v) => { setCertificatesState(v); persist({ certificates: v }) }
  const setSkills = (v) => { setSkillsState(v); persist({ skills: v }) }
  const setAbout = (v) => { setAboutState(v); persist({ about: v }) }

  return (
    <DataContext.Provider value={{ projects, setProjects, certificates, setCertificates, skills, setSkills, about, setAbout }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
export { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES, DEFAULT_SKILLS, DEFAULT_ABOUT }
