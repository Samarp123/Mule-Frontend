import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    BadgeCheck,
    BrainCircuit,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';

const navItems = [
    { label: 'Products', to: '/features' },
    { label: 'Solutions', to: '/features' },
    { label: 'Industries', to: '/about' },
    { label: 'Resources', to: '/about' },
    { label: 'Company', to: '/about' },
];

const featureCards = [
    {
        title: 'Fraud',
        accent: 'from-orange-500 to-red-500',
        text: 'Reduce fraud losses, improve pass rates, and make confident risk decisions at every step with real-time unified intelligence.',
        items: ['Account Takeover', 'Bot Detection', 'Promo Abuse', 'Location Spoofing'],
    },
    {
        title: 'Transactions',
        accent: 'from-sky-500 to-indigo-500',
        text: 'Get a complete 360° view of every transaction and monitor anomalies before they become losses.',
        items: ['Real-time Monitoring', 'Sanctions Screening', 'Behavioral Alerts', 'Merchant Risk'],
    },
    {
        title: 'Credit',
        accent: 'from-violet-500 to-purple-500',
        text: 'Accelerate credit decisions with explainable scoring and stronger portfolio visibility.',
        items: ['Portfolio Insights', 'Exposure Monitoring', 'Underwriting AI', 'Signal Fusion'],
    },
];

const trustLogos = ['KYC', 'RiskOps', 'FinPulse', 'CipherBank', 'SecureLedger'];

const platformStats = [
    { value: '99.98%', label: 'model uptime' },
    { value: '4.2x', label: 'faster investigations' },
    { value: '40%', label: 'reduction in false positives' },
    { value: '24/7', label: 'watchlist monitoring' },
];

export const LandingPage: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heroFloat = Math.min(scrollY * 0.32, 180);

    return (
        <div className="public-page-shell min-h-screen landing-root">
            <div className="landing-shell">
                <header className="page-header relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-lg font-black text-blue-300 shadow-lg shadow-blue-500/20">
                                M
                            </div>
                            <span>Mule Detector</span>
                        </Link>

                        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
                            {navItems.map((item) => (
                                <Link key={item.label} to={item.to} className="transition hover:text-white">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                to="/login"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/contact"
                                className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110"
                            >
                                Schedule a Demo
                            </Link>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="hero-section relative overflow-hidden">
                        <div className="floating-orb orb-one" />
                        <div className="floating-orb orb-two" />
                        <div className="floating-orb orb-three" />

                        <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-10 lg:pb-20 lg:pt-16">
                            <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        AI-powered AML intelligence
                                    </div>

                                    <h1
                                        className="hero-headline max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.07em] text-white md:text-6xl xl:text-8xl"
                                        style={{
                                            transform: `translate3d(0, -${heroFloat}px, 0)`,
                                            opacity: Math.max(1 - scrollY / 700, 0.2),
                                        }}
                                    >
                                        AI-Powered <span className="gradient-text">Unified</span>
                                        <br />
                                        Risk Decisioning
                                        <br />
                                        for the
                                        <br />
                                        Entire Customer
                                        <br />
                                        Life Cycle
                                    </h1>

                                    <p className="mt-6 max-w-xl text-lg text-slate-300">
                                        Unify fraud, compliance, credit, and transaction intelligence in one intelligent platform built for modern banks and financial institutions.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:brightness-110"
                                        >
                                            Book a Free Demo
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            to="/features"
                                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Explore Platform
                                        </Link>
                                    </div>

                                    <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
                                        {['Rapid deployment', 'Full explainability', 'Enterprise grade'].map((item) => (
                                            <div key={item} className="flex items-center gap-2">
                                                <BadgeCheck className="h-4 w-4 text-blue-400" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className="glass-panel p-5 hero-panel">
                                        <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-2xl shadow-indigo-950/50">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Threat Intelligence</p>
                                                    <h2 className="mt-2 text-3xl font-bold text-white">Operational View</h2>
                                                </div>
                                                <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                                    Live
                                                </div>
                                            </div>

                                            <div className="mt-5 space-y-4">
                                                <div className="grid grid-cols-3 gap-3">
                                                    {platformStats.map((stat) => (
                                                        <div key={stat.label} className="stat-card rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                                                            <div className="text-xl font-bold text-white">{stat.value}</div>
                                                            <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">{stat.label}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 p-4">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-slate-200">Risk scoring</span>
                                                        <span className="text-sm font-semibold text-blue-300">92 / 100</span>
                                                    </div>
                                                    <div className="h-2.5 rounded-full bg-slate-800">
                                                        <div className="h-2.5 w-[92%] rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400" />
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                                                            <Shield className="h-4 w-4 text-blue-400" />
                                                            Policy engine
                                                        </div>
                                                        <div className="space-y-2 text-sm text-slate-300">
                                                            <div className="flex items-center justify-between">
                                                                <span>Real-time checks</span>
                                                                <span className="text-emerald-300">On</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span>Review queue</span>
                                                                <span className="text-slate-200">18 cases</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                                                            <BrainCircuit className="h-4 w-4 text-violet-400" />
                                                            Intelligence
                                                        </div>
                                                        <div className="space-y-2 text-sm text-slate-300">
                                                            <div className="flex items-center justify-between">
                                                                <span>Graph insights</span>
                                                                <span className="text-violet-300">+28%</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span>Detection recall</span>
                                                                <span className="text-slate-200">96.4%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="ticker-wrap border-y border-white/10 bg-slate-900/80">
                        <div className="ticker-track">
                            {['Fraud', 'Compliance', 'Credit', 'Data Graphs', 'AML intelligence', 'Network analysis'].map((item) => (
                                <span key={item} className="ticker-item">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <section className="px-6 pb-20 pt-20 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-8 text-center">
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trusted by risk teams</p>
                            </div>
                            <div className="grid gap-4 rounded-[30px] border border-white/10 bg-white/5 p-6 sm:grid-cols-2 lg:grid-cols-5">
                                {trustLogos.map((logo) => (
                                    <div key={logo} className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 text-lg font-bold tracking-[0.12em] text-slate-300">
                                        {logo}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#f4f0f6] px-6 py-20 text-slate-900 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center">
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Unified Risk Platform</p>
                                <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-slate-900 md:text-5xl">
                                    One platform across the entire risk stack
                                </h2>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-3">
                                {featureCards.map((card) => (
                                    <div key={card.title} className="feature-card rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
                                        <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${card.accent} px-4 py-2 text-lg font-bold text-white`}>
                                            /{card.title.toLowerCase()}
                                        </div>
                                        <h3 className="text-4xl font-bold text-slate-900">{card.title}</h3>
                                        <p className="mt-5 text-base leading-7 text-slate-600">{card.text}</p>
                                        <div className="mt-6 space-y-3">
                                            {card.items.map((item) => (
                                                <div key={item} className="flex items-center gap-3 text-slate-700">
                                                    <span className="h-2 w-2 rounded-full bg-slate-900" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="px-6 py-20 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Why teams choose us</p>
                                    <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
                                        Built for modern financial risk operations
                                    </h2>
                                </div>
                                <Link to="/about" className="text-sm font-semibold text-blue-300 transition hover:text-blue-200">
                                    Learn more about our approach →
                                </Link>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        icon: Shield,
                                        title: 'Risk-first architecture',
                                        text: 'A single operating model for fraud, compliance, and credit decisions.',
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: 'Actionable intelligence',
                                        text: 'Turn data signals into guided operator workflows and outcomes.',
                                    },
                                    {
                                        icon: Users,
                                        title: 'Operational visibility',
                                        text: 'See every decision path, team action, and policy effect in one timeline.',
                                    },
                                    {
                                        icon: BrainCircuit,
                                        title: 'Human + AI control',
                                        text: 'Review the model rationale while keeping auditors and teams in control.',
                                    },
                                ].map(({ icon: Icon, title, text }) => (
                                    <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/10">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-8 lg:px-10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-sm font-black text-blue-300">
                                M
                            </div>
                            Mule Detector
                        </div>
                        <div className="flex flex-wrap items-center gap-5">
                            <Link to="/about" className="transition hover:text-white">About</Link>
                            <Link to="/features" className="transition hover:text-white">Features</Link>
                            <Link to="/contact" className="transition hover:text-white">Contact</Link>
                            <Link to="/login" className="transition hover:text-white">Login</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
