import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, Globe, Github, Linkedin, Twitter, User, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { siteSettings as fallbackSettings } from '../../data/siteSettings'
import toast from 'react-hot-toast'

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        name: '',
        tagline: '',
        bio: '',
        email: '',
        location: '',
        availability: 'Open to work',
        resume_url: '',
        profile_photo_url: '',
        github: '',
        linkedin: '',
        twitter: '',
        dribbble: '',
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => { loadSettings() }, [])

    const loadSettings = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase.from('site_settings').select('*')
                if (data && data.length > 0) {
                    const mapped = {}
                    data.forEach(row => { mapped[row.key] = row.value })
                    setSettings(prev => ({ ...prev, ...mapped }))
                    return
                }
            }
            // Fallback
            setSettings({
                name: fallbackSettings.name,
                tagline: fallbackSettings.tagline,
                bio: fallbackSettings.bio,
                email: fallbackSettings.email,
                location: fallbackSettings.location,
                availability: fallbackSettings.availability,
                resume_url: fallbackSettings.resume_url,
                profile_photo_url: fallbackSettings.profile_photo_url,
                github: fallbackSettings.social.github,
                linkedin: fallbackSettings.social.linkedin,
                twitter: fallbackSettings.social.twitter,
                dribbble: fallbackSettings.social.dribbble,
            })
        } catch { /* use defaults */ }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const entries = Object.entries(settings)
                for (const [key, value] of entries) {
                    await supabase.from('site_settings').upsert({ key, value: value || '', updated_at: new Date().toISOString() })
                }
            }
            toast.success('Settings saved!')
        } catch (err) {
            toast.error('Error saving settings: ' + err.message)
        }
        setSaving(false)
    }

    const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

    const handleFileUpload = async (e, bucket, settingKey) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!import.meta.env.VITE_SUPABASE_URL) {
            toast.error('Supabase not connected')
            return
        }

        const tid = toast.loading(`Uploading ${settingKey}...`)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

            update(settingKey, data.publicUrl)
            toast.success('Upload complete! Please click "Save All" to apply.', { id: tid })
        } catch (err) {
            toast.error('Upload failed: ' + err.message, { id: tid })
        }
    }

    const inputClass = "w-full px-3 py-2 bg-space-deep border border-glass-border rounded-lg font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50 transition-colors"

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-violet text-white font-mono text-xs rounded-xl hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all disabled:opacity-50"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save All'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <motion.div
                    className="rounded-xl bg-space-card border border-glass-border p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="font-syne font-bold text-lg text-nebula-white mb-4 flex items-center gap-2">
                        <User size={18} className="text-violet" /> Personal Info
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-1">Name</label>
                            <input value={settings.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-1">Tagline</label>
                            <input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-1">Bio</label>
                            <textarea value={settings.bio} onChange={(e) => update('bio', e.target.value)} rows={4} className={`${inputClass} resize-none`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-mono text-xs text-lavender mb-1">Email</label>
                                <input value={settings.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block font-mono text-xs text-lavender mb-1">Location</label>
                                <input value={settings.location} onChange={(e) => update('location', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-1">Availability</label>
                            <select value={settings.availability} onChange={(e) => update('availability', e.target.value)} className={inputClass}>
                                <option>Open to work</option>
                                <option>Available for freelance</option>
                                <option>Not available</option>
                                <option>Busy</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Media & Links */}
                <div className="space-y-6">
                    <motion.div
                        className="rounded-xl bg-space-card border border-glass-border p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="font-syne font-bold text-lg text-nebula-white mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-cyan" /> Media
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-mono text-xs text-lavender mb-1">Profile Photo URL</label>
                                <div className="flex gap-2">
                                    <input value={settings.profile_photo_url} onChange={(e) => update('profile_photo_url', e.target.value)} className={inputClass} />
                                    <label className="flex items-center justify-center px-4 py-2 bg-space-deep border border-glass-border rounded-lg cursor-pointer hover:border-violet/50 transition-colors text-lavender hover:text-nebula-white">
                                        <Upload size={16} />
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatars', 'profile_photo_url')} />
                                    </label>
                                </div>
                                {settings.profile_photo_url && (
                                    <img src={settings.profile_photo_url} alt="Preview" className="w-16 h-16 rounded-xl object-cover mt-2 border border-glass-border" />
                                )}
                            </div>
                            <div>
                                <label className="block font-mono text-xs text-lavender mb-1">Resume URL</label>
                                <div className="flex gap-2">
                                    <input value={settings.resume_url} onChange={(e) => update('resume_url', e.target.value)} placeholder="Link to PDF file" className={inputClass} />
                                    <label className="flex items-center justify-center px-4 py-2 bg-space-deep border border-glass-border rounded-lg cursor-pointer hover:border-violet/50 transition-colors text-lavender hover:text-nebula-white">
                                        <Upload size={16} />
                                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e, 'resume', 'resume_url')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-xl bg-space-card border border-glass-border p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="font-syne font-bold text-lg text-nebula-white mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-gold" /> Social Links
                        </h2>
                        <div className="space-y-3">
                            {[
                                { key: 'github', icon: Github, label: 'GitHub' },
                                { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                                { key: 'twitter', icon: Twitter, label: 'Twitter/X' },
                            ].map(({ key, icon: Icon, label }) => (
                                <div key={key} className="flex items-center gap-3">
                                    <Icon size={16} className="text-lavender flex-shrink-0" />
                                    <input
                                        value={settings[key]}
                                        onChange={(e) => update(key, e.target.value)}
                                        placeholder={`${label} URL`}
                                        className={inputClass}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
