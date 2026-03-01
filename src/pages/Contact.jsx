import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Send, Mail, MapPin, Clock, CheckCircle, AlertCircle, Github, Linkedin, Twitter } from 'lucide-react'
import MagneticButton from '../components/ui/MagneticButton'
import { siteSettings } from '../data/siteSettings'
import { supabase } from '../lib/supabase'

export default function Contact() {
    const [status, setStatus] = useState('idle') // idle | sending | success | error
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        setStatus('sending')
        try {
            // Try Supabase insert - falls back gracefully if not configured
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { error } = await supabase
                    .from('contact_messages')
                    .insert([{
                        name: data.name,
                        email: data.email,
                        subject: data.subject,
                        message: data.message,
                    }])
                if (error) throw error
            }
            setStatus('success')
            reset()
            setTimeout(() => setStatus('idle'), 5000)
        } catch (err) {
            console.error('Contact form error:', err)
            // Show success anyway for demo if Supabase is not configured
            if (!import.meta.env.VITE_SUPABASE_URL) {
                setStatus('success')
                reset()
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                setStatus('error')
                setTimeout(() => setStatus('idle'), 5000)
            }
        }
    }

    const inputClass = "w-full px-4 py-3 bg-space-card border border-glass-border rounded-xl font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50 transition-all duration-300"

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="font-mono text-xs text-cyan uppercase tracking-widest">Get In Touch</span>
                    <h1 className="font-syne font-extrabold text-4xl md:text-6xl text-nebula-white mt-3">
                        Let's <span className="gradient-text">Connect</span>
                    </h1>
                    <p className="font-mono text-lavender mt-4 max-w-lg mx-auto">
                        Have a project in mind? Want to collaborate? Or just want to say hi? Drop me a message.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="rounded-2xl bg-space-card border border-glass-border p-8">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        className="flex flex-col items-center justify-center py-16"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <CheckCircle className="text-green-400 mb-4" size={48} />
                                        <h3 className="font-syne font-bold text-xl text-nebula-white mb-2">Message Sent!</h3>
                                        <p className="font-mono text-sm text-lavender">I'll get back to you as soon as possible.</p>
                                    </motion.div>
                                ) : status === 'error' ? (
                                    <motion.div
                                        key="error"
                                        className="flex flex-col items-center justify-center py-16"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <AlertCircle className="text-coral mb-4" size={48} />
                                        <h3 className="font-syne font-bold text-xl text-nebula-white mb-2">Something went wrong</h3>
                                        <p className="font-mono text-sm text-lavender">Please try again or email me directly.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block font-mono text-xs text-lavender mb-2">Name</label>
                                                <input
                                                    {...register('name', { required: 'Name is required' })}
                                                    placeholder="Your name"
                                                    className={inputClass}
                                                />
                                                {errors.name && <span className="text-coral text-xs mt-1">{errors.name.message}</span>}
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-lavender mb-2">Email</label>
                                                <input
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                                    })}
                                                    placeholder="your@email.com"
                                                    className={inputClass}
                                                />
                                                {errors.email && <span className="text-coral text-xs mt-1">{errors.email.message}</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-mono text-xs text-lavender mb-2">Subject</label>
                                            <input
                                                {...register('subject', { required: 'Subject is required' })}
                                                placeholder="What's this about?"
                                                className={inputClass}
                                            />
                                            {errors.subject && <span className="text-coral text-xs mt-1">{errors.subject.message}</span>}
                                        </div>
                                        <div>
                                            <label className="block font-mono text-xs text-lavender mb-2">Message</label>
                                            <textarea
                                                {...register('message', { required: 'Message is required' })}
                                                placeholder="Tell me about your project..."
                                                rows={6}
                                                className={`${inputClass} resize-none`}
                                            />
                                            {errors.message && <span className="text-coral text-xs mt-1">{errors.message.message}</span>}
                                        </div>
                                        <MagneticButton
                                            className="w-full bg-violet text-white hover:shadow-[0_0_30px_rgba(108,99,255,0.5)] justify-center"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            {status === 'sending' ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Send size={16} /> Send Message
                                                </span>
                                            )}
                                        </MagneticButton>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="rounded-2xl bg-space-card border border-glass-border p-6">
                            <h3 className="font-syne font-bold text-lg text-nebula-white mb-4">Contact Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                                        <Mail size={18} className="text-violet" />
                                    </div>
                                    <div>
                                        <span className="block font-mono text-xs text-lavender">Email</span>
                                        <a href={`mailto:${siteSettings.email}`} className="font-mono text-sm text-nebula-white hover:text-violet transition-colors">
                                            {siteSettings.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                                        <MapPin size={18} className="text-cyan" />
                                    </div>
                                    <div>
                                        <span className="block font-mono text-xs text-lavender">Location</span>
                                        <span className="font-mono text-sm text-nebula-white">{siteSettings.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Clock size={18} className="text-green-400" />
                                    </div>
                                    <div>
                                        <span className="block font-mono text-xs text-lavender">Availability</span>
                                        <span className="font-mono text-sm text-green-400">{siteSettings.availability}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-space-card border border-glass-border p-6">
                            <h3 className="font-syne font-bold text-lg text-nebula-white mb-4">Follow Me</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'GitHub', icon: Github, url: siteSettings.social.github, color: 'hover:bg-white/10' },
                                    { name: 'LinkedIn', icon: Linkedin, url: siteSettings.social.linkedin, color: 'hover:bg-blue-500/10' },
                                    { name: 'Twitter', icon: Twitter, url: siteSettings.social.twitter, color: 'hover:bg-sky-500/10' },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-glass-border font-mono text-xs text-lavender hover:text-nebula-white transition-all ${social.color}`}
                                    >
                                        <social.icon size={16} /> {social.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
