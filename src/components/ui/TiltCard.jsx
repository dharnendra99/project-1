import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Github } from 'lucide-react'

export default function TiltCard({ project, index = 0 }) {
    const cardRef = useRef(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setRotateX(-y * 20)
        setRotateY(x * 20)
    }

    const handleMouseLeave = () => {
        setRotateX(0)
        setRotateY(0)
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={cardRef}
            className="group relative"
            style={{ perspective: '1000px' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <motion.div
                className="relative rounded-2xl overflow-hidden bg-space-card border border-glass-border transition-all duration-300"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                animate={{
                    y: isHovered ? -10 : 0,
                    boxShadow: isHovered
                        ? '0 0 30px rgba(108, 99, 255, 0.3), 0 0 60px rgba(108, 99, 255, 0.1)'
                        : '0 0 0px transparent',
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-card to-transparent" />
                    {project.featured && (
                        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-mono bg-gold/20 text-gold rounded-full border border-gold/30">
                            Featured
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <Link to={`/projects/${project.slug}`}>
                        <h3 className="font-syne font-bold text-lg text-nebula-white mb-2 hover:text-violet transition-colors">
                            {project.title}
                        </h3>
                    </Link>
                    <p className="text-lavender text-sm mb-4 line-clamp-2">
                        {project.short_desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-xs font-mono text-cyan bg-cyan/10 rounded-full border border-cyan/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tech_tags.length > 4 && (
                            <span className="px-2 py-0.5 text-xs font-mono text-lavender">
                                +{project.tech_tags.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lavender hover:text-violet transition-colors"
                            >
                                <Github size={18} />
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lavender hover:text-cyan transition-colors"
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                        <Link
                            to={`/projects/${project.slug}`}
                            className="ml-auto text-xs font-mono text-violet hover:text-cyan transition-colors"
                        >
                            View Details →
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
