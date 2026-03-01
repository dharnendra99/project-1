import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/admin/dashboard')
        } catch (err) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-space-black">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet/10 flex items-center justify-center border border-violet/20">
                        <Lock className="text-violet" size={28} />
                    </div>
                    <h1 className="font-syne font-extrabold text-3xl text-nebula-white">Admin Login</h1>
                    <p className="font-mono text-sm text-lavender mt-2">Enter your credentials to continue</p>
                </div>

                <div className="rounded-2xl bg-space-card border border-glass-border p-8">
                    {error && (
                        <motion.div
                            className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-coral/10 border border-coral/20 text-coral text-sm font-mono"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle size={16} className="flex-shrink-0" /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-2">Email</label>
                            <div className="flex items-center gap-3 bg-space-deep border border-glass-border rounded-xl px-4 py-3 focus-within:border-violet/50 transition-colors">
                                <Mail size={16} className="text-lavender flex-shrink-0" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="flex-1 bg-transparent font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-lavender mb-2">Password</label>
                            <div className="flex items-center gap-3 bg-space-deep border border-glass-border rounded-xl px-4 py-3 focus-within:border-violet/50 transition-colors">
                                <Lock size={16} className="text-lavender flex-shrink-0" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="flex-1 bg-transparent font-mono text-sm text-nebula-white placeholder:text-lavender/40 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-lavender hover:text-nebula-white transition-colors flex-shrink-0"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-violet text-white font-syne font-bold rounded-xl hover:shadow-[0_0_30px_rgba(108,99,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
