import React from 'react';
import { ML_RUN_DATA } from '../../data/mlRunData';
import {
    BarChart3
} from 'lucide-react';

export const ModelPerformance: React.FC = () => {
    const run = ML_RUN_DATA.runs[0];
    const valMetrics = run.test.at_validation_threshold;
    const stdMetrics = run.test.at_0_5;

    const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;
    const formatNumber = (val: number) => val.toLocaleString();

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <BarChart3 className="w-3 h-3" /> MODEL PERFORMANCE & METRICS
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Dataset Fingerprint: {run.dataset_fingerprint.slice(0, 16)}…</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Evaluation Operating Points & Confusion Matrices
                    </h1>
                </div>
            </div>

            {/* Operating Points Side-by-Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Operating Point 1: Validation Threshold */}
                <div className="p-6 rounded-xl bg-slate-900/80 border border-indigo-500/30 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div>
                            <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">Primary Operating Point</span>
                            <h2 className="text-base font-bold text-slate-100 mt-0.5">
                                At Validation Threshold ({valMetrics.threshold.toFixed(4)})
                            </h2>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                            High Precision Triage
                        </span>
                    </div>

                    {/* Metrics 4-Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Precision</span>
                            <div className="text-emerald-400 font-bold text-base mt-0.5">{formatPercent(valMetrics.precision)}</div>
                            <span className="text-[9px] text-slate-500">{valMetrics.precision.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Recall</span>
                            <div className="text-blue-400 font-bold text-base mt-0.5">{formatPercent(valMetrics.recall)}</div>
                            <span className="text-[9px] text-slate-500">{valMetrics.recall.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">F1-Score</span>
                            <div className="text-amber-400 font-bold text-base mt-0.5">{formatPercent(valMetrics.f1)}</div>
                            <span className="text-[9px] text-slate-500">{valMetrics.f1.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">AUPRC</span>
                            <div className="text-purple-400 font-bold text-base mt-0.5">{formatPercent(valMetrics.auprc)}</div>
                            <span className="text-[9px] text-slate-500">{valMetrics.auprc.toFixed(6)}</span>
                        </div>
                    </div>

                    {/* Confusion Matrix Table */}
                    <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-300 block mb-2 font-mono">Confusion Matrix (Threshold: {valMetrics.threshold.toFixed(6)})</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                <span className="text-[10px] text-emerald-400 block font-semibold">True Positives (TP)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(valMetrics.tp)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                                <span className="text-[10px] text-rose-400 block font-semibold">False Positives (FP)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(valMetrics.fp)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                <span className="text-[10px] text-amber-400 block font-semibold">False Negatives (FN)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(valMetrics.fn)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold">True Negatives (TN)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(valMetrics.tn)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span>Predicted Positive Rate: <strong className="text-slate-200">{formatPercent(valMetrics.predicted_positive_rate)}</strong></span>
                        <span>Ground Truth Rate: <strong className="text-slate-200">{formatPercent(valMetrics.positive_rate)}</strong></span>
                    </div>
                </div>

                {/* Operating Point 2: Standard 0.50 Threshold */}
                <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Baseline Operating Point</span>
                            <h2 className="text-base font-bold text-slate-100 mt-0.5">
                                At Standard Threshold (0.5000)
                            </h2>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 border border-blue-500/30 text-blue-400 font-semibold">
                            High Recall Sweep
                        </span>
                    </div>

                    {/* Metrics 4-Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Precision</span>
                            <div className="text-emerald-400 font-bold text-base mt-0.5">{formatPercent(stdMetrics.precision)}</div>
                            <span className="text-[9px] text-slate-500">{stdMetrics.precision.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Recall</span>
                            <div className="text-blue-400 font-bold text-base mt-0.5">{formatPercent(stdMetrics.recall)}</div>
                            <span className="text-[9px] text-slate-500">{stdMetrics.recall.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">F1-Score</span>
                            <div className="text-amber-400 font-bold text-base mt-0.5">{formatPercent(stdMetrics.f1)}</div>
                            <span className="text-[9px] text-slate-500">{stdMetrics.f1.toFixed(6)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">AUPRC</span>
                            <div className="text-purple-400 font-bold text-base mt-0.5">{formatPercent(stdMetrics.auprc)}</div>
                            <span className="text-[9px] text-slate-500">{stdMetrics.auprc.toFixed(6)}</span>
                        </div>
                    </div>

                    {/* Confusion Matrix Table */}
                    <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-300 block mb-2 font-mono">Confusion Matrix (Threshold: 0.5000)</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                <span className="text-[10px] text-emerald-400 block font-semibold">True Positives (TP)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(stdMetrics.tp)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                                <span className="text-[10px] text-rose-400 block font-semibold">False Positives (FP)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(stdMetrics.fp)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                <span className="text-[10px] text-amber-400 block font-semibold">False Negatives (FN)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(stdMetrics.fn)}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold">True Negatives (TN)</span>
                                <div className="text-lg font-bold text-slate-100">{formatNumber(stdMetrics.tn)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span>Predicted Positive Rate: <strong className="text-slate-200">{formatPercent(stdMetrics.predicted_positive_rate)}</strong></span>
                        <span>Ground Truth Rate: <strong className="text-slate-200">{formatPercent(stdMetrics.positive_rate)}</strong></span>
                    </div>
                </div>
            </div>

            {/* Score Distributions & Quantiles Table */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4 font-mono text-xs">
                <h3 className="text-sm font-bold text-slate-100">
                    Score Means & Score Quantiles Distribution
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">Separation of Score Means</span>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Positive Score Mean:</span>
                            <span className="text-indigo-400 font-bold">{valMetrics.positive_score_mean.toFixed(8)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Negative Score Mean:</span>
                            <span className="text-slate-300 font-bold">{valMetrics.negative_score_mean.toFixed(8)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 text-[11px] text-slate-400">
                            <span>Score Mean Delta:</span>
                            <span className="text-emerald-400 font-semibold">
                                +{(valMetrics.positive_score_mean - valMetrics.negative_score_mean).toFixed(8)}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-1">Score Quantiles</span>
                        {valMetrics.score_quantiles.map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 text-[11px]">
                                <span className="text-slate-400">Quantile [{idx * 20}%]:</span>
                                <span className="text-slate-200 font-bold">{q.toFixed(8)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};