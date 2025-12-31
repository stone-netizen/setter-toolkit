import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Copy, Check, X, ShieldAlert, Zap, Calculator, ArrowRight } from "lucide-react";
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

    // Calculate live numbers
    const missedCalls = Math.round(inputs.inquiries * (inputs.ratio / 10));

    // Floor Math
    const floorClients = missedCalls * (inputs.closeRate / 100);
    const floorWeekly = floorClients * inputs.ticket;
    const floorMonthly = floorWeekly * 4 * 0.65; // 0.65 multiplier

    // Full Math
    const fullClients = missedCalls * (inputs.closeRate / 100);
    const fullWeekly = fullClients * inputs.ticket;
    const fullMonthly = fullWeekly * 4 * 1.0; // 1.0 multiplier

    const currentMonthly = activeTab === "floor" ? floorMonthly : fullMonthly;
    const currentDaily = currentMonthly / 20; // Approx business days
    const currentYearly = currentMonthly * 12;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-3xl bg-zinc-950 relative border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg border border-white/5">
                                <Calculator className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-wide text-white">
                                    Revenue Logic
                                </h2>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                    Setter Underwriting Worksheet
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* INPUTS ROW (EQUAL CARDS) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Wkly Inquiries", val: inputs.inquiries, unit: "" },
                            { label: "Missed Ratio", val: inputs.ratio, unit: "/10" },
                            { label: "Avg Ticket Value", val: formatCurrency(inputs.ticket), unit: "" },
                            { label: "Multiplier", val: activeTab === "floor" ? "0.65x" : "1.0x", unit: activeTab === "floor" ? "Floor" : "Uncapped" }
                        ].map((item, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                                <p className="text-lg font-bold text-white tabular-nums">
                                    {item.val}<span className="text-xs text-slate-500 ml-0.5">{item.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* TOGGLE */}
                    <div className="bg-black p-1 rounded-xl border border-white/10 flex">
                        <button
                            onClick={() => setActiveTab("floor")}
                            className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "floor" ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Conservative Floor
                        </button>
                        <button
                            onClick={() => setActiveTab("full")}
                            className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "full" ? "bg-emerald-500 text-black shadow-lg" : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Full Exposure
                        </button>
                    </div>

                    {/* MATH BLOCK */}
                    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4 font-mono text-sm">
                            {/* STEP 1 */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/5 border-dashed">
                                <span className="text-slate-500">STEP 1 — Missed Volume</span>
                                <div className="text-right">
                                    <span className="text-slate-400">{inputs.inquiries} calls × {inputs.ratio / 10} ratio = </span>
                                    <span className="text-white font-bold">{missedCalls} missed/wk</span>
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/5 border-dashed">
                                <span className="text-slate-500">STEP 2 — Potential Clients</span>
                                <div className="text-right">
                                    <span className="text-slate-400">{missedCalls} × {inputs.closeRate}% close rate = </span>
                                    <span className="text-white font-bold">{(missedCalls * inputs.closeRate / 100).toFixed(1)} clients/wk</span>
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/5 border-dashed">
                                <span className="text-slate-500">STEP 3 — Monthly Revenue</span>
                                <div className="text-right">
                                    <span className="text-slate-400">{(missedCalls * inputs.closeRate / 100).toFixed(1)} × {formatCurrency(inputs.ticket)} × 4wks = </span>
                                    <span className="text-white font-bold">{formatCurrency((missedCalls * inputs.closeRate / 100) * inputs.ticket * 4)}/mo</span>
                                </div>
                            </div>

                            {/* STEP 4 */}
                            <div className="flex items-center justify-between pt-2">
                                <span className={`${activeTab === "floor" ? "text-emerald-500" : "text-white"} font-bold uppercase`}>
                                    STEP 4 — Applied Multiplier ({activeTab === "floor" ? "65%" : "100%"})
                                </span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">{formatCurrency(currentMonthly)}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* FOOTER OUTPUT BAR */}
                <div className="bg-black border-t border-white/10 p-6 grid grid-cols-3 gap-8">
                    <div className="text-center space-y-1 opacity-50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Daily</p>
                        <p className="text-sm font-bold text-slate-300">{formatCurrency(currentDaily)}</p>
                    </div>
                    <div className="text-center space-y-1 relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-b-full shadow-[0_4px_12px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Monthly Exposure</p>
                        <p className="text-2xl font-black text-white">{formatCurrency(currentMonthly)}</p>
                    </div>
                    <div className="text-center space-y-1 opacity-50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Yearly</p>
                        <p className="text-sm font-bold text-slate-300">{formatCurrency(currentYearly)}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

