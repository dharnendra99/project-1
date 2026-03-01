import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Eye, EyeOff, Calendar, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function MessageInbox() {
    const [messages, setMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [filter, setFilter] = useState('all') // all | unread | read
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadMessages() }, [])

    const loadMessages = async () => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
                setMessages(data || [])
            }
        } catch (err) { console.error(err) }
        setLoading(false)
    }

    const toggleRead = async (msg) => {
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id)
            }
            loadMessages()
        } catch (err) { toast.error('Error updating message') }
    }

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return
        try {
            if (import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('contact_messages').delete().eq('id', id)
            }
            toast.success('Deleted')
            if (selectedMessage?.id === id) setSelectedMessage(null)
            loadMessages()
        } catch (err) { toast.error('Error deleting message') }
    }

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread' && msg.is_read) return false
        if (filter === 'read' && !msg.is_read) return false
        if (search) {
            const q = search.toLowerCase()
            return msg.name.toLowerCase().includes(q) || msg.email.toLowerCase().includes(q) || msg.subject.toLowerCase().includes(q)
        }
        return true
    })

    return (
        <div>
            <h1 className="font-syne font-extrabold text-3xl text-nebula-white mb-8">Messages</h1>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 bg-space-card border border-glass-border rounded-lg font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none focus:border-violet/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 font-mono text-xs rounded-lg border transition-all ${filter === f ? 'bg-violet text-white border-violet' : 'text-lavender border-glass-border hover:border-violet/50'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Message List */}
                <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
                    {filteredMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            onClick={() => { setSelectedMessage(msg); if (!msg.is_read) toggleRead(msg) }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMessage?.id === msg.id
                                    ? 'bg-violet/10 border-violet/30'
                                    : 'bg-space-card border-glass-border hover:border-violet/20'
                                }`}
                            layout
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${msg.is_read ? 'bg-lavender/30' : 'bg-cyan'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className={`font-mono text-sm truncate ${msg.is_read ? 'text-lavender' : 'text-nebula-white font-bold'}`}>{msg.name}</span>
                                        <span className="font-mono text-xs text-lavender/50 ml-2 whitespace-nowrap">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="block font-mono text-xs text-violet truncate">{msg.subject}</span>
                                    <span className="block font-mono text-xs text-lavender/60 truncate mt-0.5">{msg.message}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredMessages.length === 0 && (
                        <p className="text-center py-12 font-mono text-lavender/50">No messages found</p>
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-3">
                    {selectedMessage ? (
                        <motion.div
                            className="rounded-xl bg-space-card border border-glass-border p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="font-syne font-bold text-xl text-nebula-white">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="font-mono text-sm text-violet">{selectedMessage.name}</span>
                                        <span className="font-mono text-xs text-lavender">{selectedMessage.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 font-mono text-xs text-lavender/50">
                                        <Calendar size={12} />
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleRead(selectedMessage)} className="p-2 rounded-lg hover:bg-space-deep text-lavender hover:text-violet transition-all" title={selectedMessage.is_read ? 'Mark unread' : 'Mark read'}>
                                        {selectedMessage.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <a href={`mailto:${selectedMessage.email}`} className="p-2 rounded-lg hover:bg-space-deep text-lavender hover:text-cyan transition-all" title="Reply">
                                        <Mail size={16} />
                                    </a>
                                    <button onClick={() => deleteMessage(selectedMessage.id)} className="p-2 rounded-lg hover:bg-coral/10 text-lavender hover:text-coral transition-all" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-glass-border">
                                <p className="font-mono text-sm text-lavender leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="rounded-xl bg-space-card border border-glass-border p-12 flex items-center justify-center">
                            <div className="text-center">
                                <Mail size={32} className="text-lavender/30 mx-auto mb-3" />
                                <p className="font-mono text-sm text-lavender/50">Select a message to read</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
