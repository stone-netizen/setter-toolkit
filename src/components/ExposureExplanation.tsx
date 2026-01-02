import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
    const [copied, setCopied] = useState<string | null>(null);

    if (!isOpen) return null;

    // Calculate live numbers
    const missedCalls = Math.round(inputs.inquiries * (inputs.ratio / 10));

    // Pure exposure calculation (no multiplier)
    const potentialClients = missedCalls * (inputs.closeRate / 100);
    const weeklyRevenue = potentialClients * inputs.ticket;
    const monthlyExposure = weeklyRevenue * 4;

    const dailyExposure = monthlyExposure / 20; // Approx business days
    const yearlyExposure = monthlyExposure * 12;

    // Prevent body scroll when modal is open
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] !bg-black" onClick={onClose}>
            {/* Scroll container */}
            <div className="h-full w-full overflow-y-auto" onClick={onClose}>
                {/* Center container */}
                <div className="min-h-full w-full flex items-start justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-3xl !bg-black border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        style={{ opacity: 1, backdropFilter: "none", filter: "none" }}
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 !bg-black">
                            <div className="flex items-center justify-between">
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
                        </div>

                        {/* Content - THIS is the scroll area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 !bg-black">

                            {/* INPUTS ROW (EQUAL CARDS) */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Wkly Inquiries", val: inputs.inquiries, unit: "" },
                                    { label: "Missed Ratio", val: inputs.ratio, unit: "/10" },
                                    { label: "Avg Ticket Value", val: formatCurrency(inputs.ticket), unit: "" }
                                ].map((item, i) => (
                                    <div key={i} className="!bg-zinc-900 border border-white/5 p-4 rounded-xl space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                                        <p className="text-lg font-bold text-white tabular-nums">
                                            {item.val}<span className="text-xs text-slate-500 ml-0.5">{item.unit}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* TITLE BAR */}
                            <div className="bg-black p-4 rounded-xl border border-white/10 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Revenue Exposure Calculation</span>
                                </div>
                            </div>

                            {/* MATH BLOCK */}
                            <div className="!bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden">
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

                                    {/* STEP 3 — Weekly Revenue */}
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5 border-dashed">
                                        <span className="text-slate-500">STEP 3 — Weekly Revenue</span>
                                        <div className="text-right">
                                            <span className="text-slate-400">
                                                {(missedCalls * inputs.closeRate / 100).toFixed(1)} × {formatCurrency(inputs.ticket)} ={" "}
                                            </span>
                                            <span className="text-white font-bold">
                                                {formatCurrency((missedCalls * inputs.closeRate / 100) * inputs.ticket)}/wk
                                            </span>
                                        </div>
                                    </div>

                                    {/* STEP 4 — Monthly Exposure */}
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-emerald-500 font-bold uppercase">
                                            STEP 4 — Monthly Exposure
                                        </span>
                                        <div className="text-right">
                                            <span className="text-slate-400">
                                                {formatCurrency((missedCalls * inputs.closeRate / 100) * inputs.ticket)} × 4wks ={" "}
                                            </span>
                                            <span className="text-white font-bold text-3xl">
                                                {formatCurrency(monthlyExposure)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/10 p-6 !bg-black grid grid-cols-3 gap-8">
                            <div className="text-center space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Daily</p>
                                <p className="text-sm font-bold text-slate-300">{formatCurrency(dailyExposure)}</p>
                            </div>
                            <div className="text-center space-y-1 relative">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-b-full shadow-[0_4px_12px_rgba(16,185,129,0.5)]" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Monthly Exposure</p>
                                <p className="text-2xl font-black text-white">{formatCurrency(monthlyExposure)}</p>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Yearly</p>
                                <p className="text-sm font-bold text-slate-300">{formatCurrency(yearlyExposure)}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>,
        document.body
    );
}
