import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FolderKanban, Mail, Settings, LogOut, Code2, Menu, X, Clock, ArrowLeft } from 'lucide-react'

const sidebarLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/admin/experience', icon: Clock, label: 'Experience' },
    { path: '/admin/skills', icon: Code2, label: 'Skills' },
    { path: '/admin/messages', icon: Mail, label: 'Messages' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
    const { signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen flex bg-space-black" style={{ cursor: 'auto' }}>
            {/* Sidebar */}
            <aside className="w-64 admin-sidebar border-r border-glass-border flex flex-col flex-shrink-0 hidden md:flex">
                <div className="p-6 border-b border-glass-border">
                    <span className="font-syne font-extrabold text-lg text-nebula-white">
                        Port<span className="gradient-text">folio</span>
                    </span>
                    <span className="block font-mono text-xs text-lavender mt-1">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl font-mono text-sm transition-all ${isActive
                                    ? 'bg-violet/10 text-violet border border-violet/20'
                                    : 'text-lavender hover:text-nebula-white hover:bg-space-surface'
                                }`
                            }
                        >
                            <link.icon size={18} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-glass-border space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-mono text-sm text-lavender hover:text-cyan hover:bg-space-surface transition-all"
                    >
                        <ArrowLeft size={18} /> View Site
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-mono text-sm text-lavender hover:text-coral hover:bg-coral/5 transition-all"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-space-deep/95 backdrop-blur-xl border-b border-glass-border p-4">
                <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-nebula-white">Admin</span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `p-2 rounded-lg transition-all ${isActive ? 'bg-violet/10 text-violet' : 'text-lavender'}`
                                }
                            >
                                <link.icon size={18} />
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto md:max-h-screen mt-14 md:mt-0">
                <Outlet />
            </main>
        </div>
    )
}
