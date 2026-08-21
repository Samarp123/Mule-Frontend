import React, { useState } from 'react';
import { CheckSquare, AlertOctagon, Check, X, Shield, Cpu } from 'lucide-react';

interface PendingModel {
    id: string;
    name: string;
    version: string;
    submittedBy: string;
    date: string;
    aucRoc: number;
    f1Score: number;
    heteroRelations: string[];
    notes: string;
}

const INITIAL_PENDING: PendingModel[] = [
    {
        id: 'MOD-9902',
        name: 'R-GCN Multi-Relation Mule Detector',
        version: 'v2.5-rc1',
        submittedBy: 'Dr. Sarah Chen (ML Engineer)',
        date: '21-08-2026 18:30',
        aucRoc: 0.978,
        f1Score: 0.932,
        heteroRelations: ['transacts_with', 'shares_device', 'shares_ip', 'shares_phone'],
        notes: 'Enhanced edge-type relation weighting with L2 regularization penalty reduction.',
    },
    {
        id: 'MOD-9891',
        name: 'Graph Attention Network Baseline',
        version: 'v1.1-exp',
        submittedBy: 'Alex Rivera (ML Engineer)',
        date: '20-08-2026 14:15',
        aucRoc: 0.951,
        f1Score: 0.898,
        heteroRelations: ['transacts_with', 'shares_device'],
        notes: 'Experimental GAT model with 4 attention heads.',
    },
];

export const ModelApproval: React.FC = () => {
    const [pendingModels, setPendingModels] = useState<PendingModel[]>(INITIAL_PENDING);
    const [actionLog, setActionLog] = useState<string | null>(null);

    const handleApprove = (id: string, version: string) => {
        setPendingModels(pendingModels.filter(m => m.id !== id));
        setActionLog(`Model ${version} successfully approved and promoted to active inference pipeline.`);
    };

    const handleReject = (id: string, version: string) => {
        setPendingModels(pendingModels.filter(m => m.id !== id));
        setActionLog(`Model ${version} rejected and sent back to ML team for re-calibration.`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-100">Model Deployment Governance</h1>
                <p className="text-xs text-slate-400 font-mono">Review candidate GNN models before promoting them to active production inference.</p>
            </div>

            {actionLog && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between">
                    <span>{actionLog}</span>
                    <button onClick={() => setActionLog(null)} className="text-emerald-400 hover:text-emerald-200">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {pendingModels.length === 0 ? (
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500 text-xs font-mono">
                        No pending candidate models awaiting deployment sign-off.
                    </div>
                ) : (
                    pendingModels.map((model) => (
                        <div key={model.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-semibold text-slate-100">{model.name}</span>
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
                                            {model.version}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Submitted by: <span className="text-slate-300">{model.submittedBy}</span> on <span className="font-mono text-slate-400">{model.date}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleReject(model.id, model.version)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(model.id, model.version)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-emerald-600/20"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Approve & Deploy
                                    </button>
                                </div>
                            </div>

                            {/* Model Performance Comparison Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                                <div>
                                    <span className="text-slate-500 text-[10px] block">AUC-ROC METRIC</span>
                                    <span className="text-emerald-400 font-bold text-sm">{(model.aucRoc * 100).toFixed(1)}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[10px] block">F1 SCORE</span>
                                    <span className="text-blue-400 font-bold text-sm">{(model.f1Score * 100).toFixed(1)}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[10px] block">GRAPH RELATIONS</span>
                                    <span className="text-slate-300 text-[11px]">{model.heteroRelations.length} Hetero Edge Types</span>
                                </div>
                            </div>

                            <div className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                                <span className="text-slate-300 font-medium">Submission Note: </span>
                                {model.notes}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};