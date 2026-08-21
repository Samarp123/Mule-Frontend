import React, { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

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
                        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <p className="text-xs uppercase tracking-[0.28em] text-blue-300">Contact</p>
                                <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-5xl">Let’s talk risk operations.</h1>

                                <div className="mt-8 space-y-5 text-slate-300">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-blue-300" />
                                        <span>hello@mule-detector.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-blue-300" />
                                        <span>+1 (415) 555-0189</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-blue-300" />
                                        <span>San Francisco, CA</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/20">
                                {submitted ? (
                                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-300">
                                        Thanks! We’ll reach out shortly with the next steps.
                                    </div>
                                ) : (
                                    <form
                                        className="space-y-4"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            setSubmitted(true);
                                        }}
                                    >
                                        <div>
                                            <label className="mb-2 block text-sm text-slate-300">Name</label>
                                            <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-blue-500" placeholder="Your name" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm text-slate-300">Work email</label>
                                            <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-blue-500" placeholder="name@company.com" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm text-slate-300">How can we help?</label>
                                            <textarea className="min-h-[140px] w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-blue-500" placeholder="Tell us about your use case" />
                                        </div>
                                        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-600/30">
                                            Send message
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
