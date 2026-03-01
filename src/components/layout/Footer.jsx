import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Dribbble, Heart } from 'lucide-react'
import { siteSettings } from '../../data/siteSettings'

export default function Footer() {
    const socialIcons = {
        github: Github,
        linkedin: Linkedin,
        twitter: Twitter,
        dribbble: Dribbble,
    }

    return (
        <footer className="relative border-t border-glass-border bg-space-deep/50">
            {/* Top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <Link to="/" className="font-syne font-extrabold text-lg">
                        Port<span className="gradient-text">folio</span>
                    </Link>

                    {/* Quick Links */}
                    <div className="flex items-center gap-6">
                        {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="text-xs font-mono text-lavender hover:text-cyan transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {Object.entries(siteSettings.social).map(([name, url]) => {
                            const Icon = socialIcons[name]
                            if (!Icon) return null
                            return (
                                <a
                                    key={name}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lavender hover:text-violet transition-colors duration-300 hover:scale-110 transform"
                                >
                                    <Icon size={18} />
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-glass-border text-center">
                    <p className="text-xs font-mono text-lavender flex items-center justify-center gap-1">
                        © {new Date().getFullYear()} {siteSettings.name}. Built with <Heart size={12} className="text-coral" /> and lots of caffeine.
                    </p>
                </div>
            </div>
        </footer>
    )
}
