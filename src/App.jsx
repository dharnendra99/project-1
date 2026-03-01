import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CustomCursor from './components/cursor/CustomCursor'
import ParticleField from './components/three/ParticleField'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Skills from './pages/Skills'
import Contact from './pages/Contact'

// Admin Pages
import Login from './pages/admin/Login'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProjectManager from './pages/admin/ProjectManager'
import MessageInbox from './pages/admin/MessageInbox'
import SkillManager from './pages/admin/SkillManager'
import ExperienceManager from './pages/admin/ExperienceManager'
import AdminSettings from './pages/admin/Settings'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-black">
        <div className="animate-spin w-8 h-8 border-2 border-violet/30 border-t-violet rounded-full" />
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/admin/login" replace />
}

function PublicLayout() {
  return (
    <>
      <CustomCursor />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111520',
              color: '#E8EAF0',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.875rem',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/projects" element={<ProjectManager />} />
              <Route path="/admin/messages" element={<MessageInbox />} />
              <Route path="/admin/experience" element={<ExperienceManager />} />
              <Route path="/admin/skills" element={<SkillManager />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
