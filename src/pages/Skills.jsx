import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import SkillOrbit from '../components/three/SkillOrbit'
import SkillBar from '../components/ui/SkillBar'
import { useSiteData } from '../hooks/useSiteData'

export default function Skills() {
    const { skills, loading } = useSiteData()
    const [activeCategory, setActiveCategory] = useState('All')
    const categories = ['All', 'Frontend', 'Backend', 'Tools']

    const filteredSkills = activeCategory === 'All'
        ? skills
        : skills.filter(s => s.category === activeCategory)

    const categoryColors = { Frontend: 'violet', Backend: 'cyan', Tools: 'coral' }

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="font-mono text-xs text-cyan uppercase tracking-widest">What I Know</span>
                    <h1 className="font-syne font-extrabold text-4xl md:text-6xl text-nebula-white mt-3">
                        Skills & <span className="gradient-text">Technologies</span>
                    </h1>
                </motion.div>

                {/* 3D Orbit Visualization */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <Suspense fallback={
                        <div className="w-full h-[400px] flex items-center justify-center">
                            <span className="font-mono text-lavender animate-pulse">Loading 3D scene...</span>
                        </div>
                    }>
                        {!loading && skills.length > 0 && <SkillOrbit skills={skills} />}
                    </Suspense>
                    <p className="text-center font-mono text-xs text-lavender/50 mt-4">
                        Drag to rotate • Hover nodes for details
                    </p>
                </motion.div>

                {/* Category Filters */}
                <div className="flex justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 font-mono text-xs rounded-full border transition-all duration-300 ${activeCategory === cat
                                ? 'bg-violet text-white border-violet'
                                : 'text-lavender border-glass-border hover:border-violet/50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skill Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill, i) => (
                        <motion.div
                            key={skill.id}
                            className="p-5 rounded-xl bg-space-card border border-glass-border hover:border-violet/30 transition-all duration-300 group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-space-deep flex items-center justify-center p-2 group-hover:shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-shadow">
                                    <img src={skill.icon_url} alt={skill.name} className="w-full h-full object-contain mix-blend-normal" />
                                </div>
                                <div>
                                    <h3 className="font-syne font-bold text-nebula-white">{skill.name}</h3>
                                    <span className="font-mono text-xs text-lavender">
                                        {skill.years_exp} {skill.years_exp === 1 ? 'year' : 'years'} experience
                                    </span>
                                </div>
                                <span className={`ml-auto px-2 py-0.5 text-xs font-mono rounded-full border ${skill.category === 'Frontend' ? 'text-violet bg-violet/10 border-violet/20' :
                                    skill.category === 'Backend' ? 'text-cyan bg-cyan/10 border-cyan/20' :
                                        'text-gold bg-gold/10 border-gold/20'
                                    }`}>
                                    {skill.category}
                                </span>
                            </div>
                            <SkillBar
                                name=""
                                proficiency={skill.proficiency}
                                color={categoryColors[skill.category] || 'violet'}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
