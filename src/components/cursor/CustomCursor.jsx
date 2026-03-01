import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function CustomCursor() {
    const { x, y } = useMousePosition()
    const [hovered, setHovered] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)
    const dotX = useMotionValue(0)
    const dotY = useMotionValue(0)

    const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 150 })
    const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 150 })
    const dotXSpring = useSpring(dotX, { damping: 35, stiffness: 300 })
    const dotYSpring = useSpring(dotY, { damping: 35, stiffness: 300 })

    useEffect(() => {
        cursorX.set(x - 16)
        cursorY.set(y - 16)
        dotX.set(x - 4)
        dotY.set(y - 4)
    }, [x, y])

    const handleEnter = useCallback(() => setHovered(true), [])
    const handleLeave = useCallback(() => setHovered(false), [])

    useEffect(() => {
        const addListeners = () => {
            const els = document.querySelectorAll('a, button, [data-magnetic], input, textarea, select')
            els.forEach(el => {
                el.addEventListener('mouseenter', handleEnter)
                el.addEventListener('mouseleave', handleLeave)
            })
            return els
        }

        const els = addListeners()

        // Debounced MutationObserver — only fires after DOM settles
        let timeout
        const observer = new MutationObserver(() => {
            clearTimeout(timeout)
            timeout = setTimeout(addListeners, 300)
        })
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            clearTimeout(timeout)
            observer.disconnect()
            els.forEach(el => {
                el.removeEventListener('mouseenter', handleEnter)
                el.removeEventListener('mouseleave', handleLeave)
            })
        }
    }, [handleEnter, handleLeave])

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border mix-blend-difference will-change-transform"
                style={{ x: cursorXSpring, y: cursorYSpring }}
                animate={{
                    width: hovered ? 48 : 32,
                    height: hovered ? 48 : 32,
                    borderColor: hovered ? '#00D4FF' : 'rgba(108, 99, 255, 0.5)',
                }}
                transition={{ duration: 0.15 }}
            />
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full will-change-transform"
                style={{ x: dotXSpring, y: dotYSpring, width: 8, height: 8 }}
                animate={{
                    scale: hovered ? 1.5 : 1,
                    backgroundColor: hovered ? '#00D4FF' : '#6C63FF',
                }}
            />
        </>
    )
}
