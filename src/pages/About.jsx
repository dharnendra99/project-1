import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Download, MapPin, Calendar } from 'lucide-react'
import Timeline from '../components/ui/Timeline'
import MagneticButton from '../components/ui/MagneticButton'
import { useSiteData } from '../hooks/useSiteData'

function CountUp({ value, label }) {
    return (
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <motion.span
                className="block font-syne font-extrabold text-3xl md:text-4xl gradient-text leading-tight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {typeof value === 'number' ? value.toLocaleString() : value}+
            </motion.span>
            <span className="font-mono text-xs text-lavender mt-2 block">{label}</span>
        </motion.div>
    )
}

export default function About() {
    const { settings, experience } = useSiteData()
    const parallaxRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] })
    const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

    return (
        <div className="pt-24 pb-16">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-16" ref={parallaxRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Floating Photo */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="relative rounded-2xl overflow-hidden border border-glass-border"
                            style={{ y: imageY }}
                        >
                            <img
                                src={settings.profile_photo_url}
                                alt={settings.name}
                                className="w-full h-[450px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-space-black/60 to-transparent" />
                        </motion.div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 border border-violet/20 rounded-2xl -z-10" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-cyan/20 rounded-2xl -z-10" />
                        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-violet rounded-full animate-pulse-glow" />
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="font-mono text-xs text-cyan uppercase tracking-widest">About Me</span>
                        <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-nebula-white mt-3 mb-6">
                            Crafting Digital <span className="gradient-text">Experiences</span>
                        </h1>
                        <p className="text-lavender leading-relaxed mb-6">
                            {settings.bio}
                        </p>
                        <p className="text-lavender leading-relaxed mb-8">
                            When I'm not coding, you'll find me exploring new technologies, contributing to
                            open-source projects, or diving into the latest in AI and machine learning.
                            I believe in writing clean, maintainable code that makes a real impact.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="flex items-center gap-2 text-sm font-mono text-lavender">
                                <MapPin size={14} className="text-violet" /> {settings.location}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 text-xs font-mono bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                {settings.availability}
                            </span>
                        </div>

                        <a href={settings.resume_url} target="_blank" rel="noopener noreferrer">
                            <MagneticButton className="bg-violet text-white hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]">
                                <Download size={16} className="mr-2" /> Download Resume
                            </MagneticButton>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Fun Facts */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-space-card border border-glass-border overflow-visible">
                    {settings.funFacts?.map((fact, i) => (
                        <CountUp key={i} value={fact.value} label={fact.label} />
                    ))}
                </div>
            </section>

            {/* Timeline */}
            <section className="max-w-4xl mx-auto px-6 md:px-12 py-16">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="font-mono text-xs text-cyan uppercase tracking-widest">My Journey</span>
                    <h2 className="font-syne font-extrabold text-4xl text-nebula-white mt-3">
                        Experience & <span className="gradient-text">Education</span>
                    </h2>
                </motion.div>

                <Timeline items={experience} />
            </section>
        </div>
    )
}
