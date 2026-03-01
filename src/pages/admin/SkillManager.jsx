import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { skills as fallbackSkills } from '../../data/skills'
import toast from 'react-hot-toast'

const emptySkill = { name: '', category: 'Frontend', icon_url: '', proficiency: 3, years_exp: 1, order_index: 0 }

export default function SkillManager() {
    const [skills, setSkills] = useState([])
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadSkills() }, [])

    const loadSkills = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase.from('skills').select('*').order('order_index')
                setSkills(data || [])
            } else {
                setSkills(fallbackSkills)
            }
        } catch { setSkills(fallbackSkills) }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editing) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                if (editing.id && !editing._isNew) {
                    const { error } = await supabase.from('skills').update(editing).eq('id', editing.id)
                    if (error) throw error
                } else {
                    const { id, _isNew, ...data } = editing
                    const { error } = await supabase.from('skills').insert([data])
                    if (error) throw error
                }
            }
            toast.success('Skill saved!')
            setEditing(null)
            loadSkills()
        } catch (err) { toast.error('Error: ' + err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this skill?')) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('skills').delete().eq('id', id)
            }
            toast.success('Deleted')
            loadSkills()
        } catch (err) { toast.error('Error: ' + err.message) }
    }

    const inputClass = "w-full px-3 py-2 bg-space-deep border border-glass-border rounded-lg font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50 transition-colors"
    const categoryColors = { Frontend: 'violet', Backend: 'cyan', Tools: 'gold' }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Skills</h1>
                <button
                    onClick={() => setEditing({ ...emptySkill, _isNew: true })}
                    className="flex items-center gap-2 px-4 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {/* Skill Groups */}
            {['Frontend', 'Backend', 'Tools'].map((category) => {
                const categorySkills = skills.filter(s => s.category === category)
                if (categorySkills.length === 0) return null
                return (
                    <div key={category} className="mb-8">
                        <h2 className={`font-syne font-bold text-lg mb-4 text-${categoryColors[category]}`}>{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categorySkills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-space-card border border-glass-border hover:border-violet/30 transition-all"
                                    layout
                                >
                                    <img src={skill.icon_url} alt={skill.name} className="w-8 h-8 object-contain" />
                                    <div className="flex-1 min-w-0">
                                        <span className="block font-mono text-sm text-nebula-white truncate">{skill.name}</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className={`w-4 h-1 rounded-full ${i < skill.proficiency ? `bg-${categoryColors[category]}` : 'bg-space-deep'}`} />
                                            ))}
                                            <span className="font-mono text-xs text-lavender ml-1">{skill.years_exp}y</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setEditing({ ...skill })} className="p-1.5 rounded-lg hover:bg-violet/10 text-lavender hover:text-violet transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-coral/10 text-lavender hover:text-coral transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )
            })}

            {skills.length === 0 && !loading && (
                <p className="text-center py-12 font-mono text-lavender/50">No skills yet. Add your first skill!</p>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="fixed inset-0 bg-space-black/80" onClick={() => setEditing(null)} />
                        <motion.div className="relative w-full max-w-md rounded-2xl bg-space-card border border-glass-border p-6" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-syne font-bold text-xl text-nebula-white">{editing._isNew ? 'Add Skill' : 'Edit Skill'}</h2>
                                <button onClick={() => setEditing(null)} className="text-lavender hover:text-nebula-white"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Name</label>
                                    <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="React" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Category</label>
                                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
                                        <option>Frontend</option><option>Backend</option><option>Tools</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-mono text-xs text-lavender mb-1">Icon URL</label>
                                    <input value={editing.icon_url} onChange={(e) => setEditing({ ...editing, icon_url: e.target.value })} placeholder="https://cdn.jsdelivr.net/..." className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Proficiency (1-5)</label>
                                        <input type="number" min={1} max={5} value={editing.proficiency} onChange={(e) => setEditing({ ...editing, proficiency: parseInt(e.target.value) || 1 })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-lavender mb-1">Years Exp</label>
                                        <input type="number" min={0} value={editing.years_exp} onChange={(e) => setEditing({ ...editing, years_exp: parseInt(e.target.value) || 0 })} className={inputClass} />
                                    </div>
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
