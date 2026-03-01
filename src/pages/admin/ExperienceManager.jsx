import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Briefcase, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { experience as fallbackExperience } from '../../data/experience'
import toast from 'react-hot-toast'

const emptyEntry = { type: 'work', title: '', company: '', location: '', start_date: '', end_date: '', description: '', order_index: 0 }

export default function ExperienceManager() {
    const [entries, setEntries] = useState([])
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadEntries() }, [])

    const loadEntries = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase.from('experience').select('*').order('order_index')
                setEntries(data || [])
            } else {
                setEntries(fallbackExperience)
            }
        } catch { setEntries(fallbackExperience) }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editing) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                if (editing.id && !editing._isNew) {
                    const { error } = await supabase.from('experience').update(editing).eq('id', editing.id)
                    if (error) throw error
                } else {
                    const { id, _isNew, ...data } = editing
                    // format empty dates to null for postgres
                    if (!data.start_date) data.start_date = null
                    if (!data.end_date) data.end_date = null
                    const { error } = await supabase.from('experience').insert([data])
                    if (error) throw error
                }
            }
            toast.success('Entry saved!')
            setEditing(null)
            loadEntries()
        } catch (err) { toast.error('Error: ' + err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this entry?')) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('experience').delete().eq('id', id)
            }
            toast.success('Deleted')
            loadEntries()
        } catch (err) { toast.error('Error: ' + err.message) }
    }

    const inputClass = "w-full px-3 py-2 bg-space-deep border border-glass-border rounded-lg font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50 transition-colors"

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Experience</h1>
                <button
                    onClick={() => setEditing({ ...emptyEntry, _isNew: true })}
                    className="flex items-center gap-2 px-4 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
                >
                    <Plus size={16} /> Add Entry
                </button>
            </div>

            <div className="space-y-4">
                {entries.map((entry) => (
                    <motion.div
                        key={entry.id}
                        className="flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-space-card border border-glass-border hover:border-violet/30 transition-all"
                        layout
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-space-deep flex items-center justify-center border border-glass-border text-lavender">
                            {entry.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-syne font-bold text-lg text-nebula-white">{entry.title}</h3>
                            <div className="font-mono text-sm text-violet mb-2">{entry.company}</div>
                            <div className="flex flex-wrap gap-4 text-xs font-mono text-lavender mb-3">
                                <span>{entry.start_date || 'Unknown'} - {entry.end_date || 'Present'}</span>
                                {entry.location && <span>• {entry.location}</span>}
                            </div>
                            <p className="text-sm text-lavender/70 line-clamp-2">{entry.description}</p>
                        </div>
                        <div className="flex gap-2 items-start justify-end">
                            <button onClick={() => setEditing({ ...entry })} className="p-2 rounded-lg hover:bg-violet/10 text-lavender hover:text-violet transition-all">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg hover:bg-coral/10 text-lavender hover:text-coral transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {entries.length === 0 && !loading && (
                <p className="text-center py-12 font-mono text-lavender/50">No experience added yet.</p>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="fixed inset-0 bg-space-black/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
                        <motion.div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-space-card border border-glass-border p-6" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-syne font-bold text-xl text-nebula-white">{editing._isNew ? 'Add Entry' : 'Edit Entry'}</h2>
                                <button onClick={() => setEditing(null)} className="text-lavender hover:text-nebula-white"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Type</label>
                                        <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className={inputClass}>
                                            <option value="work">Work Experience</option>
                                            <option value="education">Education</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Order Index (Lowest first)</label>
                                        <input type="number" value={editing.order_index} onChange={(e) => setEditing({ ...editing, order_index: parseInt(e.target.value) || 0 })} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Title / Degree</label>
                                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Software Engineer" className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Company / Institution</label>
                                        <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} placeholder="Google" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Location</label>
                                        <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Remote" className={inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Start Date</label>
                                        <input type="date" value={editing.start_date || ''} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">End Date (Leave blank for Present)</label>
                                        <input type="date" value={editing.end_date || ''} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Description</label>
                                    <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} placeholder="Describe your role or studies..." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-glass-border">
                                <button onClick={() => setEditing(null)} className="px-4 py-2 font-mono text-xs text-lavender hover:text-nebula-white">Cancel</button>
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
