import { motion } from 'framer-motion'

export default function SkillBar({ name, proficiency, color = 'violet' }) {
    const percentage = (proficiency / 5) * 100
    const barColors = {
        violet: 'from-violet to-cyan',
        cyan: 'from-cyan to-violet',
        coral: 'from-coral to-gold',
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1.5">
                <span className="text-sm font-mono text-nebula-white">{name}</span>
                <span className="text-xs font-mono text-lavender">{proficiency}/5</span>
            </div>
            <div className="h-2 bg-space-deep rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${barColors[color]}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
        </div>
    )
}
