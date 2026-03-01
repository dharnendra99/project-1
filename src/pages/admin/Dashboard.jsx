import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, MessageSquare, Cpu, Settings, Mail, Eye, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { projects as fallbackProjects } from '../../data/projects'
import { skills as fallbackSkills } from '../../data/skills'

export default function Dashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        messages: 0,
        unreadMessages: 0,
        skills: 0,
    })
    const [recentMessages, setRecentMessages] = useState([])

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const [projectsRes, messagesRes, skillsRes, unreadRes] = await Promise.all([
                    supabase.from('projects').select('id', { count: 'exact', head: true }),
                    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
                    supabase.from('skills').select('id', { count: 'exact', head: true }),
                    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
                ])
                setStats({
                    projects: projectsRes.count || 0,
                    messages: messagesRes.data?.length || 0,
                    unreadMessages: unreadRes.count || 0,
                    skills: skillsRes.count || 0,
                })
                setRecentMessages(messagesRes.data || [])
            } else {
                setStats({ projects: fallbackProjects.length, messages: 0, unreadMessages: 0, skills: fallbackSkills.length })
            }
        } catch (err) {
            console.error('Load stats error:', err)
            setStats({ projects: fallbackProjects.length, messages: 0, unreadMessages: 0, skills: fallbackSkills.length })
        }
    }

    const statCards = [
        { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'violet', link: '/admin/projects' },
        { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'cyan', link: '/admin/messages', badge: stats.unreadMessages },
        { label: 'Skills', value: stats.skills, icon: Cpu, color: 'gold', link: '/admin/skills' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Dashboard</h1>
                    <p className="font-mono text-sm text-lavender mt-1">Welcome back. Here's an overview.</p>
                </div>
                <Link
                    to="/admin/projects"
                    className="flex items-center gap-2 px-4 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
                >
                    <Plus size={16} /> New Project
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link to={stat.link} className="block">
                            <div className="rounded-xl bg-space-card border border-glass-border p-6 hover:border-violet/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}/10`}>
                                        <stat.icon size={22} className={`text-${stat.color}`} />
                                    </div>
                                    {stat.badge > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-mono bg-coral/10 text-coral rounded-full border border-coral/20">
                                            {stat.badge} new
                                        </span>
                                    )}
                                </div>
                                <span className="block font-syne font-extrabold text-3xl text-nebula-white">{stat.value}</span>
                                <span className="block font-mono text-xs text-lavender mt-1">{stat.label}</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Add Project', icon: Plus, link: '/admin/projects', color: 'violet' },
                    { label: 'View Messages', icon: Mail, link: '/admin/messages', color: 'cyan' },
                    { label: 'Manage Skills', icon: Cpu, link: '/admin/skills', color: 'gold' },
                    { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'coral' },
                ].map((action) => (
                    <Link
                        key={action.label}
                        to={action.link}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-space-card border border-glass-border hover:border-violet/30 transition-all text-center group"
                    >
                        <action.icon size={20} className={`text-${action.color} group-hover:scale-110 transition-transform`} />
                        <span className="font-mono text-xs text-lavender">{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* Recent Messages */}
            <div className="rounded-xl bg-space-card border border-glass-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-syne font-bold text-lg text-nebula-white">Recent Messages</h2>
                    <Link to="/admin/messages" className="font-mono text-xs text-violet hover:text-cyan transition-colors">
                        View All →
                    </Link>
                </div>
                {recentMessages.length > 0 ? (
                    <div className="space-y-3">
                        {recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-space-deep transition-colors">
                                <div className={`w-2 h-2 rounded-full ${msg.is_read ? 'bg-lavender/30' : 'bg-cyan'}`} />
                                <div className="flex-1 min-w-0">
                                    <span className="block font-mono text-sm text-nebula-white truncate">{msg.name} — {msg.subject}</span>
                                    <span className="block font-mono text-xs text-lavender truncate">{msg.message}</span>
                                </div>
                                <span className="font-mono text-xs text-lavender/50 whitespace-nowrap">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="font-mono text-sm text-lavender/50 text-center py-8">
                        No messages yet. Messages from the contact form will appear here.
                    </p>
                )}
            </div>
        </div>
    )
}
