import React, { useState } from 'react';
import {
    ML_RUN_DATA,
    STAGE2_CONFIG,
    GRAPH_STORE_METRICS
} from '../../data/mlRunData';
import {
    Cpu,
    CheckCircle2,
    Binary,
    FileCode,
    Hash
} from 'lucide-react';

export const MLDashboard: React.FC = () => {
    const run = ML_RUN_DATA.runs[0];
    const aggregate = ML_RUN_DATA.aggregate;
    const [selectedThresholdView, setSelectedThresholdView] = useState<'validation' | 'at_0_5'>('validation');

    const activeMetrics = selectedThresholdView === 'validation'
        ? run.test.at_validation_threshold
        : run.test.at_0_5;

    const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;
    const formatNumber = (val: number) => val.toLocaleString();

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <Cpu className="w-3 h-3" /> MODEL EVALUATION & EXPERIMENT BENCHMARK
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Seed: {run.seed} · Best Epoch: {run.best_epoch}</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        ML Engineering Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                        Best Val AP: <strong className="text-indigo-400">{run.best_val_ap.toFixed(6)}</strong>
                    </span>
                </div>
            </div>

            {/* Run Identity & Dataset Fingerprint */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Hash className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Dataset Fingerprint (SHA-256)</span>
                        <span className="font-mono text-slate-200 select-all font-semibold break-all text-[11px]">
                            {run.dataset_fingerprint}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 shrink-0">
                    <div>Epochs: <strong className="text-slate-200">{run.best_epoch}</strong></div>
                    <div>Evaluated Samples: <strong className="text-slate-200">{formatNumber(GRAPH_STORE_METRICS.total_evaluated_test_samples)}</strong></div>
                </div>
            </div>

            {/* Top 4 Performance Cards (Derived from Aggregate & Validation Threshold) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Precision */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg shadow-black/20 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Precision (Mean)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Std: {aggregate.precision.std.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-100 mt-2">
                        {formatPercent(aggregate.precision.mean)}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                        Raw: {aggregate.precision.mean.toFixed(6)}
                    </span>
                </div>

                {/* Recall */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg shadow-black/20 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Recall (Mean)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Std: {aggregate.recall.std.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-100 mt-2">
                        {formatPercent(aggregate.recall.mean)}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                        Raw: {aggregate.recall.mean.toFixed(6)}
                    </span>
                </div>

                {/* F1-Score */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg shadow-black/20 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">F1-Score (Mean)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Std: {aggregate.f1.std.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-100 mt-2">
                        {formatPercent(aggregate.f1.mean)}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                        Raw: {aggregate.f1.mean.toFixed(6)}
                    </span>
                </div>

                {/* AUPRC */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg shadow-black/20 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">AUPRC (Mean)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Std: {aggregate.auprc.std.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-100 mt-2">
                        {formatPercent(aggregate.auprc.mean)}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                        Raw: {aggregate.auprc.mean.toFixed(6)}
                    </span>
                </div>
            </div>

            {/* Operating Point Comparison & Confusion Matrix */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                                Test Evaluation Operating Points
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-100 mt-0.5">
                            Threshold Sensitivity: Validation Threshold vs 0.50 Baseline
                        </h2>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-xs">
                        <button
                            onClick={() => setSelectedThresholdView('validation')}
                            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
                                selectedThresholdView === 'validation'
                                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Validation Threshold ({run.test.at_validation_threshold.threshold.toFixed(4)})
                        </button>
                        <button
                            onClick={() => setSelectedThresholdView('at_0_5')}
                            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
                                selectedThresholdView === 'at_0_5'
                                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Standard Threshold (0.50)
                        </button>
                    </div>
                </div>

                {/* Operating Point Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">Threshold</span>
                        <div className="text-slate-100 font-bold mt-1 text-sm">
                            {activeMetrics.threshold.toFixed(6)}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">Precision</span>
                        <div className="text-emerald-400 font-bold mt-1 text-sm">
                            {formatPercent(activeMetrics.precision)}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">Recall</span>
                        <div className="text-blue-400 font-bold mt-1 text-sm">
                            {formatPercent(activeMetrics.recall)}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">F1-Score</span>
                        <div className="text-amber-400 font-bold mt-1 text-sm">
                            {formatPercent(activeMetrics.f1)}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">Positive Rate</span>
                        <div className="text-slate-200 font-bold mt-1 text-sm">
                            {formatPercent(activeMetrics.positive_rate)}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 text-[10px] block">Predicted Positive</span>
                        <div className="text-purple-400 font-bold mt-1 text-sm">
                            {formatPercent(activeMetrics.predicted_positive_rate)}
                        </div>
                    </div>
                </div>

                {/* Confusion Matrix (2x2 Grid) */}
                <div>
                    <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                        <Binary className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Exact Confusion Matrix (Total: {formatNumber(GRAPH_STORE_METRICS.total_evaluated_test_samples)} Test Accounts)</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Matrix Table */}
                        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                {/* TP */}
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                    <span className="text-[10px] text-emerald-400 block font-semibold">True Positives (TP)</span>
                                    <div className="text-xl font-bold text-slate-100 mt-1">
                                        {formatNumber(activeMetrics.tp)}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Correctly detected mules</span>
                                </div>

                                {/* FP */}
                                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                                    <span className="text-[10px] text-rose-400 block font-semibold">False Positives (FP)</span>
                                    <div className="text-xl font-bold text-slate-100 mt-1">
                                        {formatNumber(activeMetrics.fp)}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Normal flagged as mule</span>
                                </div>

                                {/* FN */}
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                    <span className="text-[10px] text-amber-400 block font-semibold">False Negatives (FN)</span>
                                    <div className="text-xl font-bold text-slate-100 mt-1">
                                        {formatNumber(activeMetrics.fn)}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Missed mule accounts</span>
                                </div>

                                {/* TN */}
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block font-semibold">True Negatives (TN)</span>
                                    <div className="text-xl font-bold text-slate-100 mt-1">
                                        {formatNumber(activeMetrics.tn)}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Correctly identified normal</span>
                                </div>
                            </div>
                        </div>

                        {/* Score Means and Quantile Distributions */}
                        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-4 text-xs font-mono">
                            <div>
                                <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-2">Score Means</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                                        <span className="text-slate-400 text-[10px]">Positive Score Mean</span>
                                        <div className="text-indigo-400 font-bold text-sm mt-0.5">
                                            {activeMetrics.positive_score_mean.toFixed(6)}
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                                        <span className="text-slate-400 text-[10px]">Negative Score Mean</span>
                                        <div className="text-slate-300 font-bold text-sm mt-0.5">
                                            {activeMetrics.negative_score_mean.toFixed(6)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-1">Score Quantiles (0% - 100%)</span>
                                <div className="space-y-1">
                                    {activeMetrics.score_quantiles.map((q, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-1 rounded bg-slate-900/50 text-[11px]">
                                            <span className="text-slate-500">Quantile [{idx * 20}%]:</span>
                                            <span className="text-slate-200">{q.toFixed(8)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stage 2 Chronological Post-Processing Graph Configurations */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-slate-100">
                            Stage 2 Chrono Graph Pipeline Configuration & Artifact Manifest
                        </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Status: Processed
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Artifact File Paths</span>
                        <div className="text-[11px] text-slate-300 space-y-1">
                            <div>Account Scores: <strong className="text-indigo-400">{STAGE2_CONFIG.account_scores}</strong></div>
                            <div>Event Stream: <strong className="text-indigo-400">{STAGE2_CONFIG.events}</strong></div>
                        </div>
                        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                            <div>Selected Context Accounts: <strong className="text-slate-200">{formatNumber(STAGE2_CONFIG.selected_accounts)}</strong></div>
                            <div>Candidate Events: <strong className="text-slate-200">{formatNumber(STAGE2_CONFIG.candidate_events)}</strong></div>
                            <div>Identified Network Clusters: <strong className="text-slate-200">{formatNumber(STAGE2_CONFIG.network_count)}</strong></div>
                            <div>Traced Flow Paths: <strong className="text-slate-200">{formatNumber(STAGE2_CONFIG.flow_path_count)}</strong></div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Classification & Flow Rule Parameters</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                            <div>Red Alert Threshold: <strong className="text-rose-400">{STAGE2_CONFIG.config.red_threshold}</strong></div>
                            <div>Yellow Alert Threshold: <strong className="text-amber-400">{STAGE2_CONFIG.config.yellow_threshold}</strong></div>
                            <div>Context Min Score: <strong className="text-slate-200">{STAGE2_CONFIG.config.context_min_score}</strong></div>
                            <div>Max Flow Gap: <strong className="text-slate-200">{STAGE2_CONFIG.config.max_flow_gap_hours} hrs</strong></div>
                            <div>Amount Ratio Low: <strong className="text-slate-200">{STAGE2_CONFIG.config.amount_ratio_low}</strong></div>
                            <div>Amount Ratio High: <strong className="text-slate-200">{STAGE2_CONFIG.config.amount_ratio_high}</strong></div>
                            <div>Max Paths / Intermediary: <strong className="text-slate-200">{STAGE2_CONFIG.config.max_paths_per_intermediary}</strong></div>
                            <div>Max Candidate Events: <strong className="text-slate-200">{formatNumber(STAGE2_CONFIG.config.max_candidate_events)}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};