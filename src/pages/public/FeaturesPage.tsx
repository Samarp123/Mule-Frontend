import React from 'react';
import { Activity, ArrowRight, BellRing, Database, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';

const features = [
    {
        icon: Database,
        title: 'Unified data graph',
        text: 'Connect customer, device, transaction, and behavior signals in one graph-based view.',
    },
    {
        icon: Activity,
        title: 'Real-time anomaly detection',
        text: 'Monitor suspicious behaviors and model confidence in real time with smart alerting.',
    },
    {
        icon: BellRing,
        title: 'Operational workflows',
        text: 'Route investigations, approvals, and escalations into a single risk operations workflow.',
    },
    {
        icon: Sparkles,
        title: 'Explainable AI',
        text: 'Give case teams and regulators the reasons behind each score and decision.',
    },
];

export const FeaturesPage: React.FC = () => {
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
                        <div className="mb-12 max-w-4xl">
                            <p className="text-xs uppercase tracking-[0.28em] text-blue-300">Platform features</p>
                            <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-6xl lg:text-7xl">
                                Everything your risk operations team needs to act with confidence.
                            </h1>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {features.map(({ icon: Icon, title, text }) => (
                                <div key={title} className="feature-card rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">{title}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 rounded-[2rem] border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-8 shadow-xl shadow-blue-500/10">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Ready to see it live?</p>
                                    <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Get a tailored walkthrough for your team.</h2>
                                </div>
                                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-slate-900">
                                    Contact us
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
