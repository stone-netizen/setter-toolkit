import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Copy, Check, X, ShieldAlert, Zap, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";
import { Button } from "@/components/ui/button";

interface ExposureExplanationProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: {
        inquiries: number;
        ratio: number;
        ticket: number;
        closeRate: number;
    };
}

export function ExposureExplanation({ isOpen, onClose, inputs }: ExposureExplanationProps) {
    const [activeTab, setActiveTab] = useState<"floor" | "full">("floor");
    const [copied, setCopied] = useState<string | null>(null);

    if (!isOpen) return null;

    // Calculate live numbers for examples
    const missedCalls = Math.round(inputs.inquiries * (inputs.ratio / 10));

    // Floor Math
    const floorClients = missedCalls * (inputs.closeRate / 100);
    const floorWeekly = floorClients * inputs.ticket;
    const floorMonthly = floorWeekly * 4 * 0.65; // 0.65 multiplier

    // Full Math
    const fullClients = missedCalls * (inputs.closeRate / 100);
    const fullWeekly = fullClients * inputs.ticket;
    const fullMonthly = fullWeekly * 4 * 1.0; // 1.0 multiplier

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                <Info className="w-4 h-4 text-emerald-500" />
                                Revenue Exposure Logic
                            </h2>
                            <span className="px-1.5 py-0.5 rounded-sm bg-slate-800 text-[9px] font-mono text-slate-400">REF: UND-X7</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-black">INTERNAL UNDERWRITING DOCUMENTATION · DO NOT SHOW CLIENT</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* SECTION 1: HIGH LEVEL */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">This is an estimate, not a promise</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            “This number is a directional estimate based on the inputs provided during the call.
                            It shows potential revenue exposure — <span className="text-white font-medium">not guaranteed revenue, not projections, and not marketing performance.</span>”
                        </p>
                    </section>

                    {/* TOGGLE */}
                    <div className="flex p-1 bg-black border border-white/10 rounded-xl">
                        <button
                            onClick={() => setActiveTab("floor")}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "floor" ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <ShieldAlert className="w-3 h-3" />
                            Conservative Exposure (Floor)
                        </button>
                        <button
                            onClick={() => setActiveTab("full")}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "full" ? "bg-emerald-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <Zap className="w-3 h-3" />
                            Full Exposure (Uncapped)
                        </button>
                    </div>

                    {/* SECTION 2 & 3: FORMULAS */}
                    <AnimatePresence mode="wait">
                        {activeTab === "floor" ? (
                            <motion.div
                                key="floor"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Purpose</p>
                                    <p className="text-sm text-slate-300">Explain the minimum plausible loss assuming best-case operations.</p>
                                </div>

                                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-4">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Formula Display</p>
                                    <div className="font-mono text-xs text-emerald-400 space-y-1">
                                        <p>Inbound opportunities</p>
                                        <p>× Missed live calls only</p>
                                        <p>× Conservative close rate</p>
                                        <p>× Average ticket value</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Explanation</p>
                                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                                            <li>Uses only <span className="text-emerald-500">missed live calls</span> (Input 3)</li>
                                            <li>Assumes <span className="text-emerald-500">conservative close rate</span> (Input 5)</li>
                                            <li>Ignores slow follow-up & after-hours</li>
                                            <li>Ignores lead decay & lifetime value</li>
                                            <li className="text-white font-medium">Designed to understate exposure</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Calculation Ledger</p>
                                        <div className="p-4 bg-black rounded-lg border border-white/10 font-mono text-xs text-slate-300 space-y-3">
                                            <div className="flex justify-between">
                                                <span>Inquiries:</span>
                                                <span className="text-white">{inputs.inquiries}/wk</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Missed Ratio:</span>
                                                <span className="text-white">{inputs.ratio}/10</span>
                                            </div>
                                            <div className="flex justify-between opacity-50">
                                                <span>Est. Missed:</span>
                                                <span>{missedCalls}/wk</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Avg Ticket:</span>
                                                <span className="text-white">{formatCurrency(inputs.ticket)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Close Rate (Floor):</span>
                                                <span className="text-emerald-500">{inputs.closeRate}%</span>
                                            </div>
                                            <div className="h-px bg-white/20 my-2" />
                                            <div className="flex justify-between font-bold text-emerald-400">
                                                <span>FLOOR EXPOSURE:</span>
                                                <span>{formatCurrency(floorMonthly)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">Setter Script</p>
                                        <p className="text-sm italic text-emerald-100">“This is the minimum loss assuming everything else works perfectly.”</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => copyToClipboard("This is the minimum loss assuming everything else works perfectly.")}
                                        className="h-8 w-8 p-0 text-emerald-500 hover:text-white"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="full"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Purpose</p>
                                    <p className="text-sm text-slate-300">Explain the realistic upper bound if all leakage points are considered.</p>
                                </div>

                                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-4">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Formula Display</p>
                                    <div className="font-mono text-xs text-emerald-400 space-y-1">
                                        <p>Inbound opportunities</p>
                                        <p>× Missed calls</p>
                                        <p className="pl-4 text-slate-500">+ After-hours calls</p>
                                        <p className="pl-4 text-slate-500">+ Follow-up drop-off</p>
                                        <p>× Realistic close rate</p>
                                        <p>× Average ticket value</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Explanation</p>
                                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                                            <li>Includes missed live + <span className="text-emerald-500">after-hours</span></li>
                                            <li>Includes leads never re-contacted</li>
                                            <li>Uses realistic close rate (100% of baseline)</li>
                                            <li className="text-white font-medium">Shows realistic upper bound</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Calculation Ledger</p>
                                        <div className="p-4 bg-black rounded-lg border border-white/10 font-mono text-xs text-slate-300 space-y-3">
                                            <div className="flex justify-between">
                                                <span>Missed Live:</span>
                                                <span className="text-white">Included</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>After-Hours:</span>
                                                <span className="text-white">Included</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Follow-up Gap:</span>
                                                <span className="text-white">Included</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Close Rate (Full):</span>
                                                <span className="text-emerald-500">{inputs.closeRate}%</span>
                                            </div>
                                            <div className="h-px bg-white/20 my-2" />
                                            <div className="flex justify-between font-bold text-white">
                                                <span>FULL EXPOSURE:</span>
                                                <span>{formatCurrency(fullMonthly)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">Setter Script</p>
                                        <p className="text-sm italic text-emerald-100">“This is what happens when we remove the artificial guardrails.”</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => copyToClipboard("This is what happens when we remove the artificial guardrails.")}
                                        className="h-8 w-8 p-0 text-emerald-500 hover:text-white"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SECTION 4: OBJECTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                        {[
                            { q: "“That number seems high.”", a: "“That’s why we show the conservative version first. The floor assumes best-case operations — not worst-case.”" },
                            { q: "“Our business is different.”", a: "“That may be true. This isn’t a claim — it’s a starting point to verify whether this applies to you.”" },
                            { q: "“This feels like a projection.”", a: "“It’s not a projection. It’s multiplication of existing demand that never converts.”" },
                            { q: "“What if your assumptions are wrong?”", a: "“That’s exactly why the call exists — to confirm or disprove the number.”" }
                        ].map((obj, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Objection: {obj.q}</p>
                                <p className="text-xs text-slate-300 italic">"{obj.a}"</p>
                            </div>
                        ))}
                    </div>

                    {/* SECTION 5: WHAT THIS IS NOT */}
                    <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">What This Number Is Not</p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {["Guaranteed Revenue", "Future Growth", "Marketing Performance", "AI Predictions"].map(item => (
                                    <span key={item} className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-1 line-through decoration-slate-600/50">
                                        <X className="w-3 h-3" /> {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic text-center md:text-right">
                            “This is an operational exposure estimate — nothing more.”
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
