import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, X, Save, Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { projects as fallbackProjects } from '../../data/projects'
import toast from 'react-hot-toast'

const emptyProject = {
    title: '', slug: '', short_desc: '', long_desc: '', thumbnail_url: '',
    images: [], tech_tags: [], category: 'Full Stack',
    github_url: '', live_url: '', featured: false, status: 'draft', order_index: 0,
}

export default function ProjectManager() {
    const [projects, setProjects] = useState([])
    const [editing, setEditing] = useState(null)
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadProjects() }, [])

    const loadProjects = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase.from('projects').select('*').order('order_index')
                setProjects(data || [])
            } else {
                setProjects(fallbackProjects)
            }
        } catch { setProjects(fallbackProjects) }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editing) return
        try {
            const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const project = { ...editing, slug }

            if (import.meta.env.VITE_SUPABASE_URL) {
                if (editing.id && !editing._isNew) {
                    const { error } = await supabase.from('projects').update(project).eq('id', editing.id)
                    if (error) throw error
                } else {
                    const { id, _isNew, ...insertData } = project
                    const { error } = await supabase.from('projects').insert([insertData])
                    if (error) throw error
                }
            }
            toast.success('Project saved!')
            setEditing(null)
            loadProjects()
        } catch (err) {
            toast.error('Error saving project: ' + err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('projects').delete().eq('id', id)
            }
            toast.success('Deleted')
            loadProjects()
        } catch (err) { toast.error('Error: ' + err.message) }
    }

    const addTag = () => {
        if (tagInput.trim() && editing) {
            setEditing({ ...editing, tech_tags: [...(editing.tech_tags || []), tagInput.trim()] })
            setTagInput('')
        }
    }

    const removeTag = (index) => {
        if (editing) {
            setEditing({ ...editing, tech_tags: editing.tech_tags.filter((_, i) => i !== index) })
        }
    }

    const inputClass = "w-full px-3 py-2 bg-space-deep border border-glass-border rounded-lg font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50 transition-colors"

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Projects</h1>
                <button
                    onClick={() => setEditing({ ...emptyProject, _isNew: true })}
                    className="flex items-center gap-2 px-4 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {/* Project List */}
            <div className="space-y-3">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-space-card border border-glass-border hover:border-violet/30 transition-all"
                        layout
                    >
                        <img src={project.thumbnail_url} alt="" className="w-16 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-syne font-bold text-nebula-white truncate">{project.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs font-mono rounded-full ${project.status === 'live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-lavender/10 text-lavender border border-glass-border'
                                    }`}>
                                    {project.status}
                                </span>
                                {project.featured && <Star size={12} className="text-gold" />}
                                <span className="text-xs font-mono text-lavender">{project.category}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setEditing({ ...project })} className="p-2 rounded-lg hover:bg-violet/10 text-lavender hover:text-violet transition-all">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg hover:bg-coral/10 text-lavender hover:text-coral transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {projects.length === 0 && !loading && (
                    <p className="text-center py-12 font-mono text-lavender/50">No projects yet. Add your first one!</p>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="fixed inset-0 bg-space-black/80" onClick={() => setEditing(null)} />
                        <motion.div
                            className="relative w-full max-w-2xl rounded-2xl bg-space-card border border-glass-border p-6 mb-10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-syne font-bold text-xl text-nebula-white">
                                    {editing._isNew ? 'New Project' : 'Edit Project'}
                                </h2>
                                <button onClick={() => setEditing(null)} className="text-lavender hover:text-nebula-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Title</label>
                                        <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Project title" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Category</label>
                                        <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
                                            <option>Full Stack</option><option>Frontend</option><option>Backend</option><option>Mobile</option><option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Short Description</label>
                                    <input value={editing.short_desc} onChange={(e) => setEditing({ ...editing, short_desc: e.target.value })} placeholder="Brief description" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Full Description (Markdown)</label>
                                    <textarea value={editing.long_desc} onChange={(e) => setEditing({ ...editing, long_desc: e.target.value })} rows={6} placeholder="## Overview&#10;Detailed description..." className={`${inputClass} resize-none`} />
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Thumbnail URL</label>
                                    <input value={editing.thumbnail_url} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} placeholder="https://..." className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">GitHub URL</label>
                                        <input value={editing.github_url} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} placeholder="https://github.com/..." className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Live URL</label>
                                        <input value={editing.live_url} onChange={(e) => setEditing({ ...editing, live_url: e.target.value })} placeholder="https://..." className={inputClass} />
                                    </div>
                                </div>
                                {/* Tags */}
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Tech Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {(editing.tech_tags || []).map((tag, i) => (
                                            <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-cyan/10 text-cyan rounded-full border border-cyan/20">
                                                {tag} <button onClick={() => removeTag(i)}><X size={10} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag" className={`${inputClass} flex-1`} />
                                        <button onClick={addTag} className="px-3 py-2 bg-cyan/10 text-cyan rounded-lg font-mono text-xs border border-cyan/20">Add</button>
                                    </div>
                                </div>
                                {/* Status & Featured */}
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 font-mono text-sm text-lavender cursor-pointer">
                                        <input type="checkbox" checked={editing.status === 'live'} onChange={(e) => setEditing({ ...editing, status: e.target.checked ? 'live' : 'draft' })} className="accent-violet" />
                                        Live
                                    </label>
                                    <label className="flex items-center gap-2 font-mono text-sm text-lavender cursor-pointer">
                                        <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-gold" />
                                        Featured
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-glass-border">
                                <button onClick={() => setEditing(null)} className="px-4 py-2 font-mono text-xs text-lavender hover:text-nebula-white transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all">
                                    <Save size={14} /> Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
