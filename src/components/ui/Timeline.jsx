import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react'

export default function Timeline({ items }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Present'
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    return (
        <div className="relative">
            <div className="space-y-8">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${item.type === 'work'
                                    ? 'border-violet bg-violet/10'
                                    : 'border-cyan bg-cyan/10'
                                }`}>
                                {item.type === 'work' ? (
                                    <Briefcase size={14} className="text-violet" />
                                ) : (
                                    <GraduationCap size={14} className="text-cyan" />
                                )}
                            </div>
                            {i < items.length - 1 && (
                                <div className="w-px flex-1 bg-gradient-to-b from-violet/40 to-cyan/20 mt-2" />
                            )}
                        </div>

                        {/* Card */}
                        <div className="flex-1 pb-2 rounded-xl bg-space-card border border-glass-border p-5 hover:border-violet/30 transition-all duration-300">
                            <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                                <h3 className="font-syne font-bold text-nebula-white">{item.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-mono rounded-full ${item.type === 'work'
                                    ? 'bg-violet/10 text-violet border border-violet/20'
                                    : 'bg-cyan/10 text-cyan border border-cyan/20'
                                    }`}>
                                    {item.type === 'work' ? 'Work' : 'Education'}
                                </span>
                            </div>
                            <p className="text-violet font-mono text-sm mb-1">{item.company}</p>
                            <div className="flex items-center gap-4 text-xs text-lavender font-mono mb-3">
                                <span className="flex items-center gap-1">
                                    <MapPin size={12} /> {item.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {formatDate(item.start_date)} — {formatDate(item.end_date)}
                                </span>
                            </div>
                            <p className="text-lavender text-sm leading-relaxed">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
