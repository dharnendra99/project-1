import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function MagneticButton({ children, className = '', onClick, href, ...props }) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { damping: 15, stiffness: 150 })
    const springY = useSpring(y, { damping: 15, stiffness: 150 })

    const handleMouseMove = (e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * 0.3)
        y.set((e.clientY - centerY) * 0.3)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const Component = href ? motion.a : motion.button

    return (
        <Component
            ref={ref}
            href={href}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center justify-center px-8 py-3 font-syne font-bold text-sm uppercase tracking-wider rounded-full transition-shadow duration-300 ${className}`}
            data-magnetic
            {...props}
        >
            {children}
        </Component>
    )
}
