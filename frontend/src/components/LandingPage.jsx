import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Sparkles, BarChart3, Target, Zap,
    ArrowRight, Play, BrainCircuit, Layers,
    CheckCircle2, ChevronRight, Moon, Sun
} from 'lucide-react';

const features = [
    {
        icon: TrendingUp,
        title: 'Real-Time Trend Tracking',
        desc: 'Monitor trending topics across niches with live Google Trends data. Get instant alerts when new opportunities emerge.',
        color: 'from-blue-500 to-cyan-500',
        shadow: 'shadow-blue-500/20'
    },
    {
        icon: Target,
        title: 'Competitor Gap Analysis',
        desc: "Track competitor channels and discover untapped content opportunities they're missing. Find your edge.",
        color: 'from-emerald-500 to-green-500',
        shadow: 'shadow-emerald-500/20'
    },
    {
        icon: BrainCircuit,
        title: 'AI Content Generation',
        desc: 'Generate YouTube scripts, titles, and thumbnails powered by Gemini AI — trained on your unique writing style.',
        color: 'from-purple-500 to-pink-500',
        shadow: 'shadow-purple-500/20'
    }
];

const competitorData = [
    { name: 'Your Channel', followers: '1,438K', growth: '+2.7%', positive: true, bar: 85 },
    { name: 'Competitor A', followers: '1,196K', growth: '-0.3%', positive: false, bar: 70 },
    { name: 'Competitor B', followers: '465K', growth: '+2.1%', positive: true, bar: 40 },
    { name: 'Competitor C', followers: '240K', growth: '-1.1%', positive: false, bar: 22 }
];

const roles = [
    {
        id: 'creator',
        label: 'Content Creator',
        heading: 'Create viral content with data-backed insights.',
        body: 'Stop guessing what to post. Use real-time trend intelligence to create content that resonates with your audience. Our AI learns your style and generates scripts that sound like you.',
        bullets: ['AI-powered script generation', 'Trend-based content calendar', 'Personal style training']
    },
    {
        id: 'marketer',
        label: 'Digital Marketer',
        heading: 'Drive engagement with competitive intelligence.',
        body: 'Analyze competitor strategies, find content gaps, and capitalize on emerging trends before your competition. Make data-driven decisions for your content pipeline.',
        bullets: ['Competitor gap analysis', 'Predictive trend forecasting', 'Virality scoring']
    },
    {
        id: 'strategist',
        label: 'Brand Strategist',
        heading: 'Build a winning content strategy with AI.',
        body: 'Combine trend data, competitor insights, and AI predictions to craft a content strategy that positions your brand ahead of the curve. Optimize every piece of content.',
        bullets: ['Multi-niche trend monitoring', 'Historical data visualization', 'Content opportunity reports']
    }
];

function LandingPage() {
    const [activeRole, setActiveRole] = useState('creator');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const role = roles.find(r => r.id === activeRole);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">

            {/* ─── Top Bar ───────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Trendora
                    </span>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Log in
                        </Link>
                        <Link to="/login" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── Hero ──────────────────────────────────────── */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950"></div>
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-800/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-800/10 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
                        <Sparkles size={14} /> Powered by Google Trends + Gemini AI
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                        Trend Intelligence,{' '}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Simplified
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Track what's trending, analyze competitor gaps, and generate viral content — all in one AI-powered platform built for modern creators.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/login" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-1 flex items-center gap-2">
                            Try for Free <ArrowRight size={18} />
                        </Link>
                        <button className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-bold hover:border-purple-400 dark:hover:border-purple-500 transition-all flex items-center gap-2">
                            <Play size={18} /> Watch Demo
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ─── Feature Cards ─────────────────────────────── */}
            <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Everything you need to dominate trends</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Three powerful modules working together to give you an unfair advantage.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl ${f.shadow} hover:shadow-2xl hover:-translate-y-2 transition-all group`}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform`}>
                                    <f.icon size={26} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Competitor Tracker Preview ────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl font-black mb-6">Track and analyze any creator's strategy</h2>
                        <ul className="space-y-5">
                            {[
                                'Track all your competitors\' channels to uncover their best tactics',
                                'Get a 360-degree view of your niche by comparing key metrics',
                                'Monitor trending topics in your niche and jump on opportunities early'
                            ].map((t, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <CheckCircle2 size={22} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-lg">{t}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" className="mt-8 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5">
                            Analyze Competitors <ChevronRight size={18} />
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6">
                            <div className="flex gap-6 border-b border-gray-100 dark:border-gray-700 pb-4 mb-6 text-sm font-bold">
                                <span className="text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-4">Audience</span>
                                <span className="text-gray-400">Activity</span>
                                <span className="text-gray-400">Engagement</span>
                            </div>
                            <div className="space-y-5">
                                {competitorData.map((c, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-32 text-sm font-semibold truncate">{c.name}</span>
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${c.bar}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-red-400 to-pink-400'}`}
                                            />
                                        </div>
                                        <span className="text-sm font-bold w-16 text-right">{c.followers}</span>
                                        <span className={`text-xs font-bold w-12 text-right ${c.positive ? 'text-emerald-500' : 'text-red-500'}`}>{c.growth}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── AI Content Generation ─────────────────────── */}
            <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6">
                            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">Generate with AI</div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                                "Unlock the future of AI-powered content creation. In this video, we'll explore how trending topics like <span className="text-purple-600 dark:text-purple-400 font-bold">quantum computing</span> are reshaping technology..."
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Rephrase', 'Shorten', 'Expand', 'Tone of voice', 'Style match'].map(btn => (
                                    <span key={btn} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 cursor-pointer transition-colors">
                                        {btn}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
                        <h2 className="text-4xl font-black mb-6">Full-cycle content production — powered by AI</h2>
                        <ul className="space-y-5">
                            {[
                                'Generate trending content ideas tailored to your niche — refreshed daily',
                                'Create scripts, titles, and descriptions customized to your unique voice',
                                'Train the AI on your writing style for authentic, on-brand content'
                            ].map((t, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <Zap size={22} className="text-purple-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-lg">{t}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" className="mt-8 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5">
                            Start Creating <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ─── Role Tabs ─────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">Built for every content professional</h2>
                    </motion.div>

                    <div className="flex justify-center gap-2 mb-12 border-b border-gray-200 dark:border-gray-700">
                        {roles.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setActiveRole(r.id)}
                                className={`px-6 py-3 text-sm font-bold transition-all relative ${activeRole === r.id
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                {r.label}
                                {activeRole === r.id && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    <motion.div key={activeRole} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-black mb-4">{role.heading}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 leading-relaxed">{role.body}</p>
                            <ul className="space-y-3">
                                {role.bullets.map((b, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-purple-500" />
                                        <span className="font-medium">{b}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login" className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5">
                                Get Started <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center shadow-xl border border-purple-200/50 dark:border-purple-700/30">
                                {activeRole === 'creator' && <Sparkles size={80} className="text-purple-400" />}
                                {activeRole === 'marketer' && <BarChart3 size={80} className="text-emerald-400" />}
                                {activeRole === 'strategist' && <Layers size={80} className="text-pink-400" />}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── CTA Footer ────────────────────────────────── */}
            <section className="py-24 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBWMjBNMCAxMGgyMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to ride the next big trend?</h2>
                    <p className="text-purple-100 text-xl mb-10">Join Trendora today and turn data into viral content.</p>
                    <Link to="/login" className="bg-white text-purple-700 px-10 py-4 rounded-xl text-lg font-black hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                        Start Free <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>

            {/* ─── Footer ────────────────────────────────────── */}
            <footer className="py-8 px-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-400">© 2026 Trendora. Built with ❤️ for content creators.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
