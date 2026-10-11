import React from 'react';
import { ML_RUN_DATA, STAGE2_CONFIG, GRAPH_STORE_METRICS } from '../../data/mlRunData';
import {
    History,
    CheckCircle2,
    Download
} from 'lucide-react';

export const ExperimentHistory: React.FC = () => {
    const run = ML_RUN_DATA.runs[0];
    const val = run.test.at_validation_threshold;

    const exportRunJson = () => {
        const blob = new Blob([JSON.stringify(ML_RUN_DATA, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment_run_seed_${run.seed}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <History className="w-3 h-3" /> EXPERIMENT RUN AUDIT
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Run Seed: {run.seed}</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Experiment History & Checkpoints
                    </h1>
                </div>

                <button
                    onClick={exportRunJson}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
                >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export Run Metrics JSON</span>
                </button>
            </div>

            {/* Run Log Table */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
                <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Logged Evaluation Run</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Best Epoch: {run.best_epoch}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 font-mono">
                        <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                            <tr>
                                <th className="py-3 px-4">Run Seed</th>
                                <th className="py-3 px-4">Best Epoch</th>
                                <th className="py-3 px-4">Val AP</th>
                                <th className="py-3 px-4">Test AUPRC</th>
                                <th className="py-3 px-4">Test Precision</th>
                                <th className="py-3 px-4">Test Recall</th>
                                <th className="py-3 px-4">Test F1</th>
                                <th className="py-3 px-4">Threshold</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-800/40">
                                <td className="py-3 px-4 font-bold text-slate-100">Seed {run.seed}</td>
                                <td className="py-3 px-4 text-indigo-400 font-bold">{run.best_epoch}</td>
                                <td className="py-3 px-4 text-indigo-400">{run.best_val_ap.toFixed(6)}</td>
                                <td className="py-3 px-4 text-purple-400">{val.auprc.toFixed(6)}</td>
                                <td className="py-3 px-4 text-emerald-400">{(val.precision * 100).toFixed(2)}%</td>
                                <td className="py-3 px-4 text-blue-400">{(val.recall * 100).toFixed(2)}%</td>
                                <td className="py-3 px-4 text-amber-400">{(val.f1 * 100).toFixed(2)}%</td>
                                <td className="py-3 px-4 text-slate-400">{val.threshold.toFixed(6)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <div>Dataset Fingerprint: <span className="text-slate-200 select-all">{run.dataset_fingerprint}</span></div>
                    <div>Evaluated Test Accounts: <span className="text-slate-200">{GRAPH_STORE_METRICS.total_evaluated_test_samples.toLocaleString()}</span></div>
                </div>
            </div>

            {/* Stage 2 Run Verification Manifest */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-3 text-xs font-mono">
                <h3 className="text-sm font-bold text-slate-100 font-sans">
                    Downstream Graph Processing Run Manifest (Stage 2 Chrono 5)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Selected Accounts</span>
                        <div className="text-base font-bold text-slate-100 mt-0.5">{STAGE2_CONFIG.selected_accounts.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Candidate Events</span>
                        <div className="text-base font-bold text-slate-100 mt-0.5">{STAGE2_CONFIG.candidate_events.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Network Count</span>
                        <div className="text-base font-bold text-indigo-400 mt-0.5">{STAGE2_CONFIG.network_count.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Flow Path Count</span>
                        <div className="text-base font-bold text-amber-400 mt-0.5">{STAGE2_CONFIG.flow_path_count.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};