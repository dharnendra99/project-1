import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import { projects as projectsData } from '../data/projects'

export default function ProjectDetail() {
    const { slug } = useParams()
    const project = projectsData.find(p => p.slug === slug)
    const currentIndex = projectsData.findIndex(p => p.slug === slug)
    const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null
    const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null

    if (!project) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-syne font-extrabold text-4xl text-nebula-white mb-4">Project Not Found</h1>
                    <Link to="/projects" className="font-mono text-violet hover:text-cyan transition-colors">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        )
    }

    // Parse markdown-like long_desc into sections
    const sections = project.long_desc.split('\n\n').filter(Boolean)

    return (
        <div className="pt-24 pb-16">
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                            <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-xs text-cyan mb-4 hover:text-violet transition-colors">
                                <ArrowLeft size={14} /> Back to Projects
                            </Link>
                            <h1 className="font-syne font-extrabold text-4xl md:text-6xl text-nebula-white mb-4">
                                {project.title}
                            </h1>
                            <p className="font-mono text-lavender text-lg max-w-2xl">{project.short_desc}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                {/* Meta */}
                <motion.div
                    className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-glass-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="flex items-center gap-2 text-sm font-mono text-lavender">
                        <Calendar size={14} className="text-violet" />
                        {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-mono text-lavender">
                        <Tag size={14} className="text-cyan" />
                        {project.category}
                    </span>
                    <div className="flex items-center gap-3 ml-auto">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 font-mono text-xs bg-space-card border border-glass-border rounded-lg text-lavender hover:text-violet hover:border-violet/30 transition-all"
                            >
                                <Github size={16} /> Source Code
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 font-mono text-xs bg-violet text-white rounded-lg hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
                            >
                                <ExternalLink size={16} /> Live Demo
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-syne font-bold text-xl text-nebula-white mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-3">
                        {project.tech_tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 font-mono text-sm bg-space-card border border-glass-border rounded-xl text-cyan hover:border-cyan/40 transition-all"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    className="space-y-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {sections.map((section, i) => {
                        if (section.startsWith('## ')) {
                            return (
                                <h2 key={i} className="font-syne font-bold text-2xl text-nebula-white mt-8">
                                    {section.replace('## ', '')}
                                </h2>
                            )
                        }
                        if (section.startsWith('- ')) {
                            const items = section.split('\n').filter(l => l.startsWith('- '))
                            return (
                                <ul key={i} className="space-y-2 pl-4">
                                    {items.map((item, j) => (
                                        <li key={j} className="text-lavender font-mono text-sm flex items-start gap-2">
                                            <span className="text-violet mt-1">▸</span>
                                            {item.replace('- ', '')}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                        return <p key={i} className="text-lavender leading-relaxed">{section}</p>
                    })}
                </motion.div>

                {/* Image Gallery */}
                {project.images.length > 0 && (
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="font-syne font-bold text-xl text-nebula-white mb-4">Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.images.map((img, i) => (
                                <div key={i} className="rounded-xl overflow-hidden border border-glass-border">
                                    <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-auto" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-glass-border">
                    {prevProject ? (
                        <Link
                            to={`/projects/${prevProject.slug}`}
                            className="flex items-center gap-2 font-mono text-sm text-lavender hover:text-violet transition-colors"
                        >
                            <ArrowLeft size={16} /> {prevProject.title}
                        </Link>
                    ) : <div />}
                    {nextProject ? (
                        <Link
                            to={`/projects/${nextProject.slug}`}
                            className="flex items-center gap-2 font-mono text-sm text-lavender hover:text-cyan transition-colors"
                        >
                            {nextProject.title} <ArrowRight size={16} />
                        </Link>
                    ) : <div />}
                </div>
            </section>
        </div>
    )
}
