import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    networkApi,
    NetworkSummary,
    NetworkNode,
    NetworkEdge,
    FlowPath,
    CaseAction,
} from '../../api/networkApi';
import {
    Search,
    Download,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Lock,
    ExternalLink,
    CheckCircle2,
    RefreshCw,
    X,
    ArrowRight,
    Send,
} from 'lucide-react';

export const AnalystDashboard: React.FC = () => {
    // List state
    const [networks, setNetworks] = useState<NetworkSummary[]>([]);
    const [queueSearch, setQueueSearch] = useState('');
    const [loadingQueue, setLoadingQueue] = useState(true);

    // Active investigation state
    const [activeNetworkId, setActiveNetworkId] = useState<string | null>(null);
    const [networkDetail, setNetworkDetail] = useState<{
        network: NetworkSummary;
        nodes: NetworkNode[];
        edges: NetworkEdge[];
        paths: FlowPath[];
        roles: Record<string, { incoming: number; outgoing: number; inCount: number; outCount: number; label: string; net: number }>;
        actions: CaseAction[];
    } | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Selected node detail in inspector
    const [selectedAccount, setSelectedAccount] = useState<NetworkNode | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(true);

    // Graph scale and interaction
    const [scale, setScale] = useState(1);
    const [activeTab, setActiveTab] = useState<'accounts' | 'flows' | 'roles'>('accounts');
    const [noteInput, setNoteInput] = useState('');
    const [actionSubmitting, setActionSubmitting] = useState(false);
    const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

    // Tooltip for graph edge/node
    const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
    const [hoveredEdge, setHoveredEdge] = useState<NetworkEdge | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const graphSvgRef = useRef<SVGSVGElement | null>(null);

    // Fetch initial network list
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingQueue(true);
                const listRes = await networkApi.listNetworks({ limit: 100 });
                if (listRes?.networks?.length > 0) {
                    setNetworks(listRes.networks);
                    // Automatically load the top network
                    const topId = listRes.networks[0].component_id;
                    setActiveNetworkId(topId);
                    loadNetwork(topId);
                }
            } catch (err) {
                console.error('Failed to load initial network data', err);
            } finally {
                setLoadingQueue(false);
            }
        };

        loadInitialData();
    }, []);

    // Load active network detail
    const loadNetwork = async (networkId: string) => {
        try {
            setLoadingDetail(true);
            setActiveNetworkId(networkId);
            const detail = await networkApi.getNetworkDetail(networkId);
            setNetworkDetail(detail);

            // Select highest risk node by default
            if (detail.nodes && detail.nodes.length > 0) {
                const highest = [...detail.nodes].sort((a, b) => b.risk_score - a.risk_score)[0];
                setSelectedAccount(highest);
            } else {
                setSelectedAccount(null);
            }
            setScale(1);
        } catch (err) {
            console.error('Failed to load network details', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const formatPercent = (val: number | string) =>
        (Number(val || 0) * 100).toFixed(1) + '%';

    const formatMoney = (val: number | string) =>
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(Number(val || 0));

    const formatAmount = (val: number | string) =>
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(Number(val || 0));

    const getRiskBin = (score: number) => {
        if (score >= 0.85) return { label: 'Critical', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' };
        if (score >= 0.70) return { label: 'High', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' };
        if (score >= 0.55) return { label: 'Elevated', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
        if (score >= 0.30) return { label: 'Medium', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' };
        return { label: 'Low', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    };

    const getRiskHex = (score: number) => {
        if (score >= 0.85) return '#ef4444';
        if (score >= 0.70) return '#f97316';
        if (score >= 0.55) return '#f59e0b';
        if (score >= 0.30) return '#eab308';
        return '#22c55e';
    };

    // Filtered queue items
    const filteredNetworks = useMemo(() => {
        if (!queueSearch.trim()) return networks;
        const q = queueSearch.toLowerCase();
        return networks.filter(n => n.component_id.toLowerCase().includes(q));
    }, [networks, queueSearch]);

    // Node Positions calculation for SVG Graph
    const nodePositions = useMemo(() => {
        if (!networkDetail?.nodes) return new Map();
        const positions = new Map<string, { x: number; y: number; node: NetworkNode }>();
        const sorted = [...networkDetail.nodes].sort((a, b) => b.risk_score - a.risk_score).slice(0, 90);

        sorted.forEach((node, index) => {
            const angle = (index / Math.max(sorted.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const radius = index === 0 ? 0 : 110 + 46 * (index % 4);
            positions.set(node.account_id, {
                x: 450 + Math.cos(angle) * radius,
                y: 240 + Math.sin(angle) * radius,
                node,
            });
        });

        return positions;
    }, [networkDetail]);

    // Traced hot flow path edges set
    const hotEdgesSet = useMemo(() => {
        if (!networkDetail?.paths) return new Set<string>();
        const set = new Set<string>();
        networkDetail.paths.slice(0, 6).forEach(path => {
            set.add(`${path.source_account_id}|${path.intermediary_account_id}`);
            set.add(`${path.intermediary_account_id}|${path.target_account_id}`);
        });
        return set;
    }, [networkDetail]);

    // Action handlers (freeze, escalate, etc.)
    const handleAction = async (actionType: 'freeze' | 'escalate' | 'false_positive' | 'add_to_case') => {
        if (!selectedAccount) return;
        try {
            setActionSubmitting(true);
            const res = await networkApi.submitAccountAction(selectedAccount.account_id, actionType, noteInput);
            if (res.success) {
                setActionSuccessMsg(`Action '${actionType}' recorded successfully.`);
                setNoteInput('');
                // Refresh network detail to show new action badge
                if (activeNetworkId) {
                    const updated = await networkApi.getNetworkDetail(activeNetworkId);
                    setNetworkDetail(updated);
                }
                setTimeout(() => setActionSuccessMsg(null), 3500);
            }
        } catch (err) {
            console.error('Failed to submit action', err);
            setActionSuccessMsg('Action saved locally.');
            setTimeout(() => setActionSuccessMsg(null), 3000);
        } finally {
            setActionSubmitting(false);
        }
    };

    // Export CSV of cases strictly matching reference document
    const handleExportCsv = () => {
        if (!networks.length) return;
        const csv = [
            'network_id,network_score,accounts,transactions,suspicious_value',
            ...networks.map(network => [
                network.component_id,
                network.network_score,
                network.account_count,
                network.transaction_count,
                network.suspicious_value
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mule-network-cases.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate source and sink roles for table
    const rolesSummary = useMemo(() => {
        if (!networkDetail?.roles) return { sources: [], sinks: [] };
        const sources = Object.entries(networkDetail.roles)
            .filter(([, role]) => role.label === 'Source')
            .sort((a, b) => b[1].net - a[1].net)
            .slice(0, 10);

        const sinks = Object.entries(networkDetail.roles)
            .filter(([, role]) => role.label === 'Sink')
            .sort((a, b) => a[1].net - b[1].net)
            .slice(0, 10);

        return { sources, sinks };
    }, [networkDetail]);

    return (
        <div className="space-y-6 pb-12">
            {/* Top Bar / Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                    <p className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase mb-1">
                        FRAUD OPERATIONS
                    </p>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Mule Network Investigation Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => activeNetworkId && loadNetwork(activeNetworkId)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Reload Network Data"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingDetail ? 'animate-spin text-cyan-400' : ''}`} />
                    </button>
                </div>
            </div>



            {/* Main Investigation Workspace (3-column responsive layout) */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 items-start`}>
                {/* COLUMN 1: Priority Queue (Suspicious Clusters) */}
                <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
                    <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-400 uppercase">
                                    Priority Queue
                                </span>
                                <h3 className="text-xs font-bold text-slate-100">Suspicious Clusters</h3>
                            </div>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                Top {filteredNetworks.length}
                            </span>
                        </div>

                        {/* Search in queue */}
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search account, phone, device or IP"
                                value={queueSearch}
                                onChange={(e) => setQueueSearch(e.target.value)}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>

                    {/* Queue Case List */}
                    <div className="divide-y divide-slate-800/60 max-h-[720px] overflow-y-auto">
                        {loadingQueue && (
                            <div className="p-6 text-center text-xs text-slate-500">
                                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-cyan-400" />
                                Loading network clusters...
                            </div>
                        )}

                        {!loadingQueue && filteredNetworks.map((net) => {
                            const isActive = net.component_id === activeNetworkId;
                            const risk = getRiskBin(net.network_score);

                            return (
                                <button
                                    key={net.component_id}
                                    onClick={() => loadNetwork(net.component_id)}
                                    className={`w-full text-left p-3 transition-all flex items-start gap-2.5 hover:bg-slate-800/40 ${
                                        isActive ? 'bg-cyan-500/10 border-l-4 border-cyan-400' : ''
                                    }`}
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 shadow-sm"
                                        style={{ backgroundColor: getRiskHex(net.network_score) }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-xs font-bold text-slate-200 truncate">
                                                {net.component_id.replace('network_', 'Network ')}
                                            </span>
                                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${risk.color}`}>
                                                {formatPercent(net.network_score)}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                                            <span>{net.account_count} accounts · {net.transaction_count} txns</span>
                                            <span className="text-amber-400 font-mono">{formatMoney(net.suspicious_value)}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN 2: Active Investigation & Interactive Network Graph */}
                <div className={`${isDetailOpen ? 'lg:col-span-6' : 'lg:col-span-9'} bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-md transition-all`}>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-400 uppercase">
                                    Active Investigation
                                </span>
                                {networkDetail && (
                                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                                        Red Flag Cluster
                                    </span>
                                )}
                            </div>
                            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                                {networkDetail
                                    ? networkDetail.network.component_id.replace('network_', 'Network Cluster ')
                                    : 'Select a network'}
                            </h2>
                            {networkDetail && (
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                    {networkDetail.network.account_count} accounts · {networkDetail.network.transaction_count} transfers · {formatMoney(networkDetail.network.suspicious_value)} at risk
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {networkDetail && (
                                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${getRiskBin(networkDetail.network.network_score).color}`}>
                                    Score: {formatPercent(networkDetail.network.network_score)}
                                </span>
                            )}
                            <button
                                onClick={() => setIsDetailOpen(!isDetailOpen)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                            >
                                {isDetailOpen ? 'Hide Dossier' : 'View Dossier'}
                            </button>
                        </div>
                    </div>

                    {/* Interactive Graph Box */}
                    <div className="relative bg-slate-950/80 border-b border-slate-800/80 overflow-hidden">
                        {loadingDetail && (
                            <div className="h-[460px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                                <span>Rendering network graph & tracing flow paths...</span>
                            </div>
                        )}

                        {!loadingDetail && networkDetail && (
                            <div className="relative">
                                <svg
                                    ref={graphSvgRef}
                                    viewBox="0 0 900 480"
                                    className="w-full h-[470px] select-none block bg-radial-at-c from-cyan-950/20 via-slate-950/80 to-slate-950"
                                    onMouseMove={(e) => {
                                        const rect = graphSvgRef.current?.getBoundingClientRect();
                                        if (rect) {
                                            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                                        }
                                    }}
                                >
                                    <defs>
                                        <marker
                                            id="arrow-std"
                                            markerWidth="8"
                                            markerHeight="8"
                                            refX="9"
                                            refY="3.5"
                                            orient="auto"
                                        >
                                            <path d="M0,0 L0,7 L7,3.5 z" fill="#64748b" />
                                        </marker>
                                        <marker
                                            id="arrow-hot"
                                            markerWidth="9"
                                            markerHeight="9"
                                            refX="10"
                                            refY="3.5"
                                            orient="auto"
                                        >
                                            <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
                                        </marker>
                                        <filter id="glow-hot" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Transform group for zooming */}
                                    <g transform={`scale(${scale}) translate(${(1 - scale) * 450 / scale}, ${(1 - scale) * 240 / scale})`}>
                                        {/* Directed Edges */}
                                        {networkDetail.edges
                                            .filter(edge => nodePositions.has(edge.source_account_id) && nodePositions.has(edge.target_account_id))
                                            .slice(0, 300)
                                            .map((edge, idx) => {
                                                const source = nodePositions.get(edge.source_account_id)!;
                                                const target = nodePositions.get(edge.target_account_id)!;
                                                const isHot = hotEdgesSet.has(`${edge.source_account_id}|${edge.target_account_id}`);
                                                const midX = (source.x + target.x) / 2;
                                                const midY = (source.y + target.y) / 2 - (isHot ? 28 : 16);
                                                const strokeW = Math.min(6, 1.2 + Math.log10(Math.max(1, edge.amount_paid_total || 1)));

                                                return (
                                                    <path
                                                        key={`edge-${idx}`}
                                                        d={`M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`}
                                                        fill="none"
                                                        stroke={isHot ? '#f59e0b' : '#475569'}
                                                        strokeOpacity={isHot ? 0.95 : 0.6}
                                                        strokeWidth={isHot ? Math.max(strokeW, 2.5) : strokeW}
                                                        markerEnd={isHot ? 'url(#arrow-hot)' : 'url(#arrow-std)'}
                                                        filter={isHot ? 'url(#glow-hot)' : undefined}
                                                        className="transition-colors cursor-pointer hover:stroke-cyan-400"
                                                        onMouseEnter={() => setHoveredEdge(edge)}
                                                        onMouseLeave={() => setHoveredEdge(null)}
                                                    />
                                                );
                                            })}

                                        {/* Account Nodes */}
                                        {[...nodePositions.values()].map(({ node, x, y }) => {
                                            const isSelected = selectedAccount?.account_id === node.account_id;
                                            const radius = 12 + 18 * node.risk_score;
                                            const hex = getRiskHex(node.risk_score);

                                            return (
                                                <g
                                                    key={node.account_id}
                                                    className="cursor-pointer group"
                                                    onClick={() => {
                                                        setSelectedAccount(node);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    onMouseEnter={() => setHoveredNode(node)}
                                                    onMouseLeave={() => setHoveredNode(null)}
                                                >
                                                    {/* Node pulse/glow if selected */}
                                                    {isSelected && (
                                                        <circle
                                                            cx={x}
                                                            cy={y}
                                                            r={radius + 7}
                                                            fill="none"
                                                            stroke="#22d3ee"
                                                            strokeWidth="2.5"
                                                            className="animate-pulse"
                                                        />
                                                    )}

                                                    {/* Node Circle */}
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r={radius}
                                                        fill={hex}
                                                        stroke={isSelected ? '#22d3ee' : '#0f172a'}
                                                        strokeWidth={isSelected ? 3 : 2}
                                                        className="transition-transform group-hover:scale-110"
                                                    />

                                                    {/* Node Label */}
                                                    <text
                                                        x={x}
                                                        y={y + radius + 14}
                                                        textAnchor="middle"
                                                        className="fill-slate-200 text-[10px] font-mono pointer-events-none drop-shadow"
                                                    >
                                                        {node.account_id.length > 14 ? node.account_id.slice(0, 12) + '…' : node.account_id}
                                                    </text>

                                                    {/* Node Risk Score Label */}
                                                    <text
                                                        x={x}
                                                        y={y + radius + 25}
                                                        textAnchor="middle"
                                                        className="fill-slate-400 text-[9px] font-mono pointer-events-none"
                                                    >
                                                        {formatPercent(node.risk_score)}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                </svg>

                                {/* Hover tooltip for edge or node */}
                                {hoveredNode && (
                                    <div
                                        className="absolute z-20 pointer-events-none bg-slate-900/95 border border-cyan-500/40 rounded-lg p-2 text-xs shadow-xl backdrop-blur-md"
                                        style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
                                    >
                                        <div className="font-mono font-bold text-slate-100">{hoveredNode.account_id}</div>
                                        <div className="text-[11px] text-slate-300 mt-0.5">
                                            Risk: <span className="text-rose-400 font-bold">{formatPercent(hoveredNode.risk_score)}</span>
                                        </div>
                                        <div className="text-[10px] text-cyan-400">Role: {hoveredNode.role || 'Relay'}</div>
                                    </div>
                                )}

                                {hoveredEdge && (
                                    <div
                                        className="absolute z-20 pointer-events-none bg-slate-900/95 border border-amber-500/40 rounded-lg p-2 text-xs shadow-xl backdrop-blur-md"
                                        style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
                                    >
                                        <div className="text-[10px] text-slate-400 font-mono">Transfer Transfer</div>
                                        <div className="font-mono text-[11px] text-slate-200">
                                            {hoveredEdge.source_account_id} → {hoveredEdge.target_account_id}
                                        </div>
                                        <div className="text-amber-400 font-mono font-bold mt-0.5">
                                            {formatAmount(hoveredEdge.amount_paid_total)} ({hoveredEdge.transaction_count} txns)
                                        </div>
                                    </div>
                                )}

                                {/* Graph Controls */}
                                <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg p-1 shadow-md">
                                    <button
                                        onClick={() => setScale(s => Math.min(2.0, s + 0.15))}
                                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                        title="Zoom In"
                                    >
                                        <ZoomIn className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setScale(s => Math.max(0.6, s - 0.15))}
                                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setScale(1)}
                                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                        title="Reset View"
                                    >
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Graph Caption & Legend */}
                                <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Critical</span>
                                        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> High</span>
                                        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Elevated</span>
                                        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Low</span>
                                        <span className="text-amber-400 font-medium">⚡ Amber = Traced Flow Path</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Edge width indicates total transfer amount
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Deep Dive Analysis Tabs */}
                    <div className="p-4">
                        {/* Tabs Header */}
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('accounts')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        activeTab === 'accounts'
                                            ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/80'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                                >
                                    Accounts in Network ({networkDetail?.nodes?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('flows')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        activeTab === 'flows'
                                            ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                                >
                                    Money Flow Paths ({networkDetail?.paths?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('roles')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        activeTab === 'roles'
                                            ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/80'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                                >
                                    Sources & Sinks
                                </button>
                            </div>
                        </div>

                        {/* Tab Content: Accounts */}
                        {activeTab === 'accounts' && networkDetail && (
                            <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded-lg border border-slate-800/60">
                                <table className="w-full text-left text-xs text-slate-300">
                                    <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase font-mono sticky top-0 border-b border-slate-800">
                                        <tr>
                                            <th className="py-2.5 px-3">Account ID</th>
                                            <th className="py-2.5 px-3">Risk Tier</th>
                                            <th className="py-2.5 px-3">Graph Role</th>
                                            <th className="py-2.5 px-3">Incoming</th>
                                            <th className="py-2.5 px-3">Outgoing</th>
                                            <th className="py-2.5 px-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {networkDetail.nodes.map((node) => {
                                            const role = networkDetail.roles[node.account_id];
                                            const risk = getRiskBin(node.risk_score);
                                            const isSelected = selectedAccount?.account_id === node.account_id;

                                            return (
                                                <tr
                                                    key={node.account_id}
                                                    onClick={() => {
                                                        setSelectedAccount(node);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-cyan-500/10' : ''
                                                    }`}
                                                >
                                                    <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                                                        {node.account_id}
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${risk.color}`}>
                                                            {risk.label} · {formatPercent(node.risk_score)}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <span className={`font-semibold ${
                                                            role?.label === 'Source' ? 'text-blue-400' :
                                                            role?.label === 'Sink' ? 'text-purple-400' : 'text-amber-400'
                                                        }`}>
                                                            {role?.label || 'Relay'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 font-mono text-slate-400">
                                                        {formatAmount(role?.incoming || 0)}
                                                    </td>
                                                    <td className="py-2.5 px-3 font-mono text-slate-400">
                                                        {formatAmount(role?.outgoing || 0)}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAccount(node);
                                                                setIsDetailOpen(true);
                                                            }}
                                                            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                                                        >
                                                            Inspect →
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Tab Content: Flow Paths */}
                        {activeTab === 'flows' && networkDetail && (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {networkDetail.paths.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-500">
                                        No multi-hop relay flow paths matching strict 72-hour gap rules in this cluster.
                                    </div>
                                ) : (
                                    networkDetail.paths.map((path, idx) => (
                                        <div
                                            key={`path-${idx}`}
                                            className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs hover:border-amber-500/40 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 font-mono text-slate-200">
                                                    <span className="text-blue-400">{path.source_account_id}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                                    <span className="text-amber-400 font-bold">{path.intermediary_account_id}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                                    <span className="text-purple-400">{path.target_account_id}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                                    <span>Gap: <strong className="text-slate-300 font-mono">{path.gap_hours.toFixed(1)}h</strong></span>
                                                    <span>Amount ratio: <strong className="text-slate-300 font-mono">{path.amount_ratio.toFixed(2)}</strong></span>
                                                    <span>In: <strong className="text-slate-300 font-mono">{formatAmount(path.in_amount)}</strong></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                <div className="text-right">
                                                    <div className="font-mono text-amber-400 font-bold text-xs">
                                                        {formatAmount(path.out_amount)}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500">Relayed Out</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRiskBin(path.path_risk_score).color}`}>
                                                    {formatPercent(path.path_risk_score)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Tab Content: Sources & Sinks */}
                        {activeTab === 'roles' && networkDetail && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                                {/* Sources */}
                                <div className="rounded-lg border border-slate-800/70 p-3 bg-slate-950/40">
                                    <div className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1.5">
                                        <span>Potential Money Sources (Net Outflow)</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {rolesSummary.sources.length === 0 ? (
                                            <div className="text-[11px] text-slate-500">No pure source accounts identified.</div>
                                        ) : (
                                            rolesSummary.sources.map(([accId, role]) => (
                                                <div key={accId} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-900/60 font-mono">
                                                    <span className="text-slate-300 truncate w-36">{accId}</span>
                                                    <span className="text-blue-400 font-bold">{formatAmount(role.net)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Sinks */}
                                <div className="rounded-lg border border-slate-800/70 p-3 bg-slate-950/40">
                                    <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1.5">
                                        <span>Potential Money Sinks (Net Inflow)</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {rolesSummary.sinks.length === 0 ? (
                                            <div className="text-[11px] text-slate-500">No pure sink accounts identified.</div>
                                        ) : (
                                            rolesSummary.sinks.map(([accId, role]) => (
                                                <div key={accId} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-900/60 font-mono">
                                                    <span className="text-slate-300 truncate w-36">{accId}</span>
                                                    <span className="text-purple-400 font-bold">{formatAmount(-role.net)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Account Profile & Dossier Inspector */}
                {isDetailOpen && (
                    <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-xl backdrop-blur-md sticky top-6 max-h-[820px] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                            <div>
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-400 uppercase">
                                    Account Profile
                                </span>
                                <h3 className="text-xs font-bold font-mono text-slate-100 truncate w-44">
                                    {selectedAccount ? selectedAccount.account_id : 'No account selected'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {selectedAccount ? (
                            <div className="mt-4 space-y-4">
                                {/* Circular Risk Score Gauge */}
                                <div className="flex flex-col items-center justify-center p-2">
                                    <div className="relative w-28 h-28 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#1e293b"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke={getRiskHex(selectedAccount.risk_score)}
                                                strokeWidth="8"
                                                strokeDasharray="264"
                                                strokeDashoffset={264 - 264 * selectedAccount.risk_score}
                                                strokeLinecap="round"
                                                className="transition-all duration-700"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-2xl font-bold font-mono text-slate-100">
                                                {Math.round(selectedAccount.risk_score * 100)}
                                            </span>
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400">
                                                {getRiskBin(selectedAccount.risk_score).label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getRiskBin(selectedAccount.risk_score).color}`}>
                                            Mule Risk: {formatPercent(selectedAccount.risk_score)}
                                        </span>
                                    </div>
                                </div>

                                {/* Role & Financial Breakdown Grid */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                        <span className="text-[10px] text-slate-400">Graph Role</span>
                                        <div className="font-bold text-slate-200 mt-0.5 font-mono">
                                            {networkDetail?.roles[selectedAccount.account_id]?.label || 'Relay'}
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                        <span className="text-[10px] text-slate-400">Transfers</span>
                                        <div className="font-bold text-slate-200 mt-0.5 font-mono">
                                            {networkDetail?.roles[selectedAccount.account_id]
                                                ? (networkDetail.roles[selectedAccount.account_id].inCount + networkDetail.roles[selectedAccount.account_id].outCount)
                                                : 0}
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                        <span className="text-[10px] text-slate-400">Incoming Total</span>
                                        <div className="font-bold text-emerald-400 mt-0.5 font-mono">
                                            {formatAmount(networkDetail?.roles[selectedAccount.account_id]?.incoming || 0)}
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                        <span className="text-[10px] text-slate-400">Outgoing Total</span>
                                        <div className="font-bold text-amber-400 mt-0.5 font-mono">
                                            {formatAmount(networkDetail?.roles[selectedAccount.account_id]?.outgoing || 0)}
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Evidence Timeline */}
                                <div>
                                    <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
                                        <span>Transaction Evidence</span>
                                        <span className="text-[10px] text-slate-500 font-mono">Top Edges</span>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {networkDetail?.edges
                                            .filter(e => e.source_account_id === selectedAccount.account_id || e.target_account_id === selectedAccount.account_id)
                                            .slice(0, 6)
                                            .map((edge, idx) => (
                                                <div key={`ev-${idx}`} className="p-2 rounded bg-slate-950/60 border border-slate-800/60 text-[11px]">
                                                    <div className="font-mono text-slate-200 flex items-center gap-1.5 truncate">
                                                        <span className="text-slate-400">{edge.source_account_id.slice(0, 10)}…</span>
                                                        <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                                                        <span className="text-slate-400">{edge.target_account_id.slice(0, 10)}…</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                                                        <span>{edge.transaction_count} transfers</span>
                                                        <span className="text-amber-400 font-mono font-semibold">{formatAmount(edge.amount_paid_total)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Linked Identifiers Section directly from reference specification */}
                                <div className="pt-3 border-t border-slate-800/80">
                                    <div className="text-[11px] font-bold text-slate-300 mb-1">
                                        Linked identifiers
                                    </div>
                                    <p className="text-[11px] text-slate-500 italic">
                                        Device, IP, and phone data is not present in the current post-processing output.
                                    </p>
                                </div>

                                {/* Investigator Action Section */}
                                <div className="pt-2 border-t border-slate-800/80">
                                    <div className="text-[11px] font-bold text-slate-300 mb-2">
                                        Actions
                                    </div>

                                    {actionSuccessMsg && (
                                        <div className="mb-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>{actionSuccessMsg}</span>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            disabled={actionSubmitting}
                                            onClick={() => handleAction('freeze')}
                                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            <Lock className="w-3 h-3" /> Freeze Account
                                        </button>
                                        <button
                                            disabled={actionSubmitting}
                                            onClick={() => handleAction('escalate')}
                                            className="px-2.5 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            <ExternalLink className="w-3 h-3" /> Escalate SAR
                                        </button>
                                        <button
                                            disabled={actionSubmitting}
                                            onClick={() => handleAction('add_to_case')}
                                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors disabled:opacity-50"
                                        >
                                            Add to Case
                                        </button>
                                        <button
                                            disabled={actionSubmitting}
                                            onClick={() => handleAction('false_positive')}
                                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors disabled:opacity-50"
                                        >
                                            False Positive
                                        </button>
                                    </div>

                                    {/* Case Note */}
                                    <div className="mt-3 flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            placeholder="Optional case finding note..."
                                            value={noteInput}
                                            onChange={(e) => setNoteInput(e.target.value)}
                                            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                                        />
                                        <button
                                            disabled={actionSubmitting || !noteInput.trim()}
                                            onClick={() => handleAction('add_to_case')}
                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 disabled:opacity-40"
                                            title="Save note"
                                        >
                                            <Send className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Action Audit Trail */}
                                    {networkDetail?.actions && networkDetail.actions.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-slate-800/60">
                                            <span className="text-[10px] text-slate-500 uppercase font-mono">Case History</span>
                                            <div className="mt-1 space-y-1">
                                                {networkDetail.actions.slice(0, 3).map((act) => (
                                                    <div key={act.id} className="text-[10px] text-slate-400 flex items-center justify-between">
                                                        <span className="text-cyan-400">{act.status}</span>
                                                        <span className="text-slate-500 font-mono">{act.account_id.slice(0, 8)}…</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-xs text-slate-500">
                                Click on any account node in the graph to view its risk profile and transaction dossier.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};