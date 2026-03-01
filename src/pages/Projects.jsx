import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import TiltCard from '../components/ui/TiltCard'
import { projects as projectsData } from '../data/projects'

export default function Projects() {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [sortBy, setSortBy] = useState('newest')

    const categories = useMemo(() => {
        const cats = new Set(projectsData.map(p => p.category))
        return ['All', ...Array.from(cats)]
    }, [])

    const allTags = useMemo(() => {
        const tags = new Set()
        projectsData.forEach(p => p.tech_tags.forEach(t => tags.add(t)))
        return Array.from(tags)
    }, [])

    const [activeTags, setActiveTags] = useState([])

    const filteredProjects = useMemo(() => {
        let result = projectsData.filter(p => p.status === 'live')

        if (search) {
            const q = search.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.short_desc.toLowerCase().includes(q) ||
                p.tech_tags.some(t => t.toLowerCase().includes(q))
            )
        }

        if (activeCategory !== 'All') {
            result = result.filter(p => p.category === activeCategory)
        }

        if (activeTags.length > 0) {
            result = result.filter(p => activeTags.some(t => p.tech_tags.includes(t)))
        }

        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        } else if (sortBy === 'featured') {
            result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        }

        return result
    }, [search, activeCategory, activeTags, sortBy])

    const toggleTag = (tag) => {
        setActiveTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="font-mono text-xs text-cyan uppercase tracking-widest">My Work</span>
                    <h1 className="font-syne font-extrabold text-4xl md:text-6xl text-nebula-white mt-3">
                        All <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="font-mono text-lavender mt-4 max-w-lg mx-auto">
                        A collection of projects that showcase my skills, creativity, and problem-solving abilities.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    className="mb-10 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-space-card border border-glass-border rounded-xl font-mono text-sm text-nebula-white placeholder:text-lavender/50 focus:outline-none focus:border-violet/50 transition-colors"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 font-mono text-xs rounded-full border transition-all duration-300 ${activeCategory === cat
                                        ? 'bg-violet text-white border-violet'
                                        : 'bg-transparent text-lavender border-glass-border hover:border-violet/50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center justify-center gap-3">
                        <SlidersHorizontal size={14} className="text-lavender" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-space-card border border-glass-border rounded-lg px-3 py-1.5 font-mono text-xs text-nebula-white focus:outline-none focus:border-violet/50"
                        >
                            <option value="newest">Newest First</option>
                            <option value="featured">Featured First</option>
                        </select>
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {allTags.slice(0, 10).map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-2 py-0.5 text-xs font-mono rounded-full border transition-all duration-300 ${activeTags.includes(tag)
                                        ? 'bg-cyan/20 text-cyan border-cyan/50'
                                        : 'bg-transparent text-lavender/60 border-glass-border hover:border-cyan/30'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Project Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project, i) => (
                            <TiltCard key={project.id} project={project} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="font-mono text-lavender">No projects found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
