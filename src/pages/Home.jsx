import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Twitter, Dribbble } from 'lucide-react'
import FloatingHeroScene from '../components/three/FloatingHeroScene'
import KineticText from '../components/ui/KineticText'
import MagneticButton from '../components/ui/MagneticButton'
import ScrollIndicator from '../components/ui/ScrollIndicator'
import TiltCard from '../components/ui/TiltCard'
import { projects as projectsData } from '../data/projects'
import { useSiteData } from '../hooks/useSiteData'

export default function Home() {
    const { settings, skills } = useSiteData()
    const featuredProjects = projectsData.filter(p => p.featured).slice(0, 3)
    const socialIcons = { github: Github, linkedin: Linkedin, twitter: Twitter, dribbble: Dribbble }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <Suspense fallback={<div className="absolute inset-0 bg-space-black" />}>
                    <FloatingHeroScene />
                </Suspense>

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4"
                    >
                        <span className="inline-block px-4 py-1.5 font-mono text-xs text-cyan border border-cyan/30 rounded-full bg-cyan/5">
                            {settings.availability}
                        </span>
                    </motion.div>

                    <KineticText
                        text={settings.name}
                        className="justify-center font-syne font-extrabold text-5xl md:text-7xl lg:text-8xl text-nebula-white mb-4"
                        delay={0.2}
                    />

                    <motion.p
                        className="font-mono text-lg md:text-xl text-lavender mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        {settings.tagline}
                    </motion.p>

                    <motion.p
                        className="font-serif italic text-xl md:text-2xl text-lavender/70 mb-10 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        "{settings.bio}"
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                    >
                        <Link to="/projects">
                            <MagneticButton className="bg-violet text-white hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]">
                                View My Work <ArrowRight size={16} className="ml-2" />
                            </MagneticButton>
                        </Link>
                        <Link to="/contact">
                            <MagneticButton className="border border-cyan/30 text-cyan hover:bg-cyan/10">
                                Contact Me
                            </MagneticButton>
                        </Link>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="flex items-center justify-center gap-5 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                    >
                        {Object.entries(settings.social).map(([name, url]) => {
                            const Icon = socialIcons[name]
                            if (!Icon) return null
                            return (
                                <a
                                    key={name}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lavender hover:text-violet transition-all duration-300 hover:scale-125 hover:-translate-y-1"
                                >
                                    <Icon size={20} />
                                </a>
                            )
                        })}
                    </motion.div>
                </div>

                <ScrollIndicator />
            </section>

            {/* Featured Projects */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="font-mono text-xs text-cyan uppercase tracking-widest">Selected Work</span>
                        <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-nebula-white mt-3">
                            Featured <span className="gradient-text">Projects</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProjects.map((project, i) => (
                            <TiltCard key={project.id} project={project} index={i} />
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/projects">
                            <MagneticButton className="border border-violet/30 text-violet hover:bg-violet/10">
                                View All Projects <ArrowRight size={16} className="ml-2" />
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Skills Marquee */}
            <section className="py-12 border-y border-glass-border overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...skills, ...skills].map((skill, i) => (
                        <div key={i} className="flex items-center gap-3 mx-8">
                            <img src={skill.icon_url} alt={skill.name} className="w-6 h-6" />
                            <span className="font-mono text-sm text-lavender">{skill.name}</span>
                            <span className="text-violet/30">•</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
