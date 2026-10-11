import React, { useState, useEffect, useMemo, useRef } from 'react';
import { networkApi, NetworkSummary, NetworkNode, NetworkEdge, FlowPath } from '../../api/networkApi';
import {
    Share2,
    ZoomIn,
    ZoomOut,
    Maximize2,
    RefreshCw
} from 'lucide-react';

export const NetworkVisualization: React.FC = () => {
    const [networks, setNetworks] = useState<NetworkSummary[]>([]);
    const [selectedNetId, setSelectedNetId] = useState<string>('network_016110');
    const [networkDetail, setNetworkDetail] = useState<{
        network: NetworkSummary;
        nodes: NetworkNode[];
        edges: NetworkEdge[];
        paths: FlowPath[];
        roles: Record<string, any>;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [highlightFlowsOnly, setHighlightFlowsOnly] = useState(false);
    const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const fetchNetworks = async () => {
            try {
                const res = await networkApi.listNetworks({ limit: 100 });
                if (res.networks?.length > 0) {
                    setNetworks(res.networks);
                    setSelectedNetId(res.networks[0].component_id);
                    loadDetail(res.networks[0].component_id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchNetworks();
    }, []);

    const loadDetail = async (id: string) => {
        try {
            setLoading(true);
            setSelectedNetId(id);
            const detail = await networkApi.getNetworkDetail(id);
            setNetworkDetail(detail);
            if (detail.nodes?.length > 0) {
                setSelectedNode(detail.nodes[0]);
            }
            setScale(1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const nodePositions = useMemo(() => {
        if (!networkDetail?.nodes) return new Map();
        const positions = new Map<string, { x: number; y: number; node: NetworkNode }>();
        const sorted = [...networkDetail.nodes].sort((a, b) => b.risk_score - a.risk_score).slice(0, 100);

        sorted.forEach((node, idx) => {
            const angle = (idx / Math.max(sorted.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const radius = idx === 0 ? 0 : 130 + 50 * (idx % 4);
            positions.set(node.account_id, {
                x: 480 + Math.cos(angle) * radius,
                y: 280 + Math.sin(angle) * radius,
                node,
            });
        });
        return positions;
    }, [networkDetail]);

    const hotEdges = useMemo(() => {
        if (!networkDetail?.paths) return new Set<string>();
        const set = new Set<string>();
        networkDetail.paths.forEach(p => {
            set.add(`${p.source_account_id}|${p.intermediary_account_id}`);
            set.add(`${p.intermediary_account_id}|${p.target_account_id}`);
        });
        return set;
    }, [networkDetail]);

    return (
        <div className="space-y-5 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Share2 className="w-3 h-3" /> GRAPH VISUALIZATION WORKSTATION
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Curved Directed Edges & Flow Tracing</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Interactive Mule Cluster Topology
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Select Network Dropdown */}
                    <select
                        value={selectedNetId}
                        onChange={(e) => loadDetail(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                        {networks.map(n => (
                            <option key={n.component_id} value={n.component_id}>
                                {n.component_id} ({n.account_count} accounts - {(n.network_score * 100).toFixed(0)}%)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Canvas Toolbar & Canvas */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
                {/* Canvas Controls Bar */}
                <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono font-semibold">
                            {selectedNetId.replace('network_', 'Network ')}:
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px]">
                            {networkDetail?.nodes?.length || 0} nodes
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[11px]">
                            {networkDetail?.edges?.length || 0} transfer edges
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-mono text-[11px]">
                            {networkDetail?.paths?.length || 0} traced flows
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={highlightFlowsOnly}
                                onChange={(e) => setHighlightFlowsOnly(e.target.checked)}
                                className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                            />
                            <span className="text-[11px]">Highlight Money Flows Only</span>
                        </label>

                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button
                                onClick={() => setScale(s => Math.min(2.2, s + 0.15))}
                                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setScale(s => Math.max(0.5, s - 0.15))}
                                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setScale(1)}
                                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Reset"
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SVG Visualizer */}
                <div className="relative bg-slate-950 min-h-[560px]">
                    {loading ? (
                        <div className="h-[560px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                            <span>Computing graph physics and layout...</span>
                        </div>
                    ) : (
                        <svg
                            ref={svgRef}
                            viewBox="0 0 960 560"
                            className="w-full h-[560px] select-none block bg-radial-at-c from-cyan-950/15 via-slate-950 to-slate-950"
                        >
                            <defs>
                                <marker id="viz-arrow" markerWidth="8" markerHeight="8" refX="9" refY="3.5" orient="auto">
                                    <path d="M0,0 L0,7 L7,3.5 z" fill="#64748b" />
                                </marker>
                                <marker id="viz-arrow-hot" markerWidth="10" markerHeight="10" refX="10" refY="3.5" orient="auto">
                                    <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
                                </marker>
                            </defs>

                            <g transform={`scale(${scale}) translate(${(1 - scale) * 480 / scale}, ${(1 - scale) * 280 / scale})`}>
                                {/* Edges */}
                                {networkDetail?.edges
                                    .filter(e => nodePositions.has(e.source_account_id) && nodePositions.has(e.target_account_id))
                                    .map((edge, idx) => {
                                        const s = nodePositions.get(edge.source_account_id)!;
                                        const t = nodePositions.get(edge.target_account_id)!;
                                        const isHot = hotEdges.has(`${edge.source_account_id}|${edge.target_account_id}`);
                                        if (highlightFlowsOnly && !isHot) return null;

                                        const midX = (s.x + t.x) / 2;
                                        const midY = (s.y + t.y) / 2 - (isHot ? 30 : 15);
                                        const w = Math.min(6, 1.2 + Math.log10(Math.max(1, edge.amount_paid_total || 1)));

                                        return (
                                            <path
                                                key={`viz-e-${idx}`}
                                                d={`M ${s.x} ${s.y} Q ${midX} ${midY} ${t.x} ${t.y}`}
                                                fill="none"
                                                stroke={isHot ? '#f59e0b' : '#334155'}
                                                strokeWidth={isHot ? Math.max(w, 2.5) : w}
                                                strokeOpacity={isHot ? 1 : 0.4}
                                                markerEnd={isHot ? 'url(#viz-arrow-hot)' : 'url(#viz-arrow)'}
                                            />
                                        );
                                    })}

                                {/* Nodes */}
                                {[...nodePositions.values()].map(({ node, x, y }) => {
                                    const isSel = selectedNode?.account_id === node.account_id;
                                    const r = 14 + 16 * node.risk_score;
                                    const color = node.risk_score >= 0.85 ? '#ef4444' :
                                                  node.risk_score >= 0.70 ? '#f97316' :
                                                  node.risk_score >= 0.55 ? '#f59e0b' : '#22c55e';

                                    return (
                                        <g
                                            key={`viz-n-${node.account_id}`}
                                            className="cursor-pointer group"
                                            onClick={() => setSelectedNode(node)}
                                        >
                                            {isSel && (
                                                <circle cx={x} cy={y} r={r + 8} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                                            )}
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={r}
                                                fill={color}
                                                stroke={isSel ? '#22d3ee' : '#0f172a'}
                                                strokeWidth={isSel ? 3 : 2}
                                            />
                                            <text x={x} y={y + r + 14} textAnchor="middle" className="fill-slate-200 text-[10px] font-mono pointer-events-none">
                                                {node.account_id.slice(0, 12)}…
                                            </text>
                                            <text x={x} y={y + r + 24} textAnchor="middle" className="fill-slate-400 text-[9px] font-mono pointer-events-none">
                                                {(node.risk_score * 100).toFixed(1)}%
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>
                    )}

                    {/* Node Mini-Inspector Card Overlay */}
                    {selectedNode && (
                        <div className="absolute left-4 bottom-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md w-72 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Selected Account</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    {(selectedNode.risk_score * 100).toFixed(1)}% Mule Score
                                </span>
                            </div>
                            <div className="font-mono text-slate-100 font-bold truncate">
                                {selectedNode.account_id}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                                <div>Role: <strong className="text-slate-200">{selectedNode.role || 'Relay'}</strong></div>
                                <div>Cluster: <strong className="text-cyan-400 font-mono">{selectedNode.component_id}</strong></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};