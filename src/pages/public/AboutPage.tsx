import React from 'react';
import { ArrowRight, Building2, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AboutPage: React.FC = () => {
    return (
        <div className="public-page-shell min-h-screen">
            <div className="about-shell">
                <header className="page-header relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-lg font-black text-blue-300 shadow-lg shadow-blue-500/20">
                                M
                            </div>
                            <span>Mule Detector</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/login" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="relative overflow-hidden px-6 py-16 lg:px-10">
                    <div className="floating-orb orb-one" />
                    <div className="floating-orb orb-two" />

                    <div className="mx-auto max-w-7xl">
                        <div className="mb-14 max-w-4xl">
                            <p className="text-xs uppercase tracking-[0.28em] text-blue-300">About us</p>
                            <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-6xl lg:text-7xl">
                                Modern risk infrastructure for the next generation of financial operations.
                            </h1>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                {
                                    icon: Building2,
                                    title: 'Built for financial institutions',
                                    text: 'We help high-risk, high-volume institutions unify fraud prevention, transaction monitoring, and customer decisioning in one operating layer.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Governed by trust',
                                    text: 'Every signal, decision, and review is explainable, auditable, and aligned with enterprise risk controls.',
                                },
                                {
                                    icon: Users,
                                    title: 'Designed for teams',
                                    text: 'From AML analysts to compliance leaders and model owners, the platform is made for collaborative decision-making.',
                                },
                            ].map(({ icon: Icon, title, text }) => (
                                <div key={title} className="feature-card rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-8 shadow-2xl shadow-indigo-950/20">
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Our mission</p>
                                    <h2 className="mt-3 text-2xl font-bold text-white md:text-4xl">Bring clarity to complex risk decisions.</h2>
                                </div>
                                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-600/30">
                                    Talk to our team
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
