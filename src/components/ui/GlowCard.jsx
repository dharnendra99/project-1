import { motion } from 'framer-motion'

export default function GlowCard({ children, className = '', glowColor = 'violet' }) {
    const colors = {
        violet: 'hover:shadow-[0_0_30px_rgba(108,99,255,0.3)]',
        cyan: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]',
        coral: 'hover:shadow-[0_0_30px_rgba(255,107,107,0.3)]',
        gold: 'hover:shadow-[0_0_30px_rgba(255,209,102,0.3)]',
    }

    const borderColors = {
        violet: 'hover:border-violet/40',
        cyan: 'hover:border-cyan/40',
        coral: 'hover:border-coral/40',
        gold: 'hover:border-gold/40',
    }

    return (
        <motion.div
            className={`rounded-2xl bg-space-card border border-glass-border transition-all duration-500 ${colors[glowColor]} ${borderColors[glowColor]} ${className}`}
            whileHover={{ y: -5 }}
        >
            {children}
        </motion.div>
    )
}
