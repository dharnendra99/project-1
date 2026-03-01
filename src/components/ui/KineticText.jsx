import { motion } from 'framer-motion'

export default function KineticText({ text, className = '', delay = 0, tag = 'h1' }) {
    const words = text.split(' ')
    const Tag = tag

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: delay,
            },
        },
    }

    const child = {
        hidden: { opacity: 0, y: 40, rotateX: -15 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            className={`flex flex-wrap gap-x-3 ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={child}
                    className="inline-block"
                    style={{ perspective: '500px' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}
