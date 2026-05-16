import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Context
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'

// Portfolio
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import TechWall from './components/TechWall'
import Contact from './components/Contact'

// Admin
import Login from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ProjectsManager from './admin/ProjectsManager'
import CertsManager from './admin/CertsManager'
import SkillsManager from './admin/SkillsManager'
import AboutManager from './admin/AboutManager'
import Settings from './admin/Settings'
import Messages from './admin/Messages'

// Auth guard
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'Taha@2024!'
function RequireAuth({ children }) {
  const stored = localStorage.getItem('admin_pass') || ADMIN_PASS
  const storedUser = localStorage.getItem('admin_user') || ADMIN_USER
  const token = sessionStorage.getItem('admin_token')
  const valid = token === btoa(storedUser + stored)
  return valid ? children : <Navigate to="/admin" replace />
}

function Portfolio() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <TechWall />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <DataProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* ── Portfolio (public) ── */}
          <Route path="/" element={<Portfolio />} />

          {/* ── Admin section ── */}
          <Route path="/admin">
            {/* /admin  → Login page */}
            <Route index element={<Login />} />

            {/* /admin/*  → Protected layout with nested pages */}
            <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
              <Route path="dashboard"    element={<Dashboard />} />
              <Route path="projects"     element={<ProjectsManager />} />
              <Route path="certificates" element={<CertsManager />} />
              <Route path="skills"       element={<SkillsManager />} />
              <Route path="about"        element={<AboutManager />} />
              <Route path="messages"     element={<Messages />} />
              <Route path="settings"     element={<Settings />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
    </ThemeProvider>
  )
}
