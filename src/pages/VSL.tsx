import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Play, ShieldEllipsis, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendlyModal } from "@/components/CalendlyModal";
import { toast } from "sonner";

export default function VSL() {
    const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

    const handleBookingSuccess = () => {
        setIsCalendlyOpen(false);
        toast.success("Review Scheduled!", { description: "We've received your request and are preparing your technical audit." });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            {/* 1. Above-the-fold */}
            <section className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic pb-2">Analysis Phase: Complete</div>
                        <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-black italic uppercase leading-[1.0] tracking-tight">
                            The Technical Review <br />
                            <span className="text-emerald-500">& Verification Process</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                            This breakdown explains the logic behind your directional estimate and how to verify these numbers against your actual CRM and phone records.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Orientation Section */}
            <section className="pb-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative aspect-video rounded-[3rem] bg-black border border-white/5 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.05)] group cursor-pointer"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                            <div className="w-20 h-20 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 fill-current translate-x-0.5" />
                            </div>
                            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">Click to View Verification Logic (No Sales Pitch)</p>
                        </div>
                    </motion.div>

                    <div className="mt-16 flex flex-col items-center space-y-6">
                        <Button
                            onClick={() => setIsCalendlyOpen(true)}
                            className="h-20 px-16 bg-emerald-500 hover:bg-emerald-400 text-black text-xl md:text-2xl font-black uppercase italic rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Schedule Technical Review →
                        </Button>
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                            <span>15 Minutes</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span>No Sales Pitch</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span>Verification Only</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Call Framing */}
            <section className="py-24 px-6 border-t border-white/5 bg-black">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase text-center mb-16 italic">
                        What this review <span className="text-emerald-500">IS</span> — and what it <span className="text-slate-700">is not</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-[3rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-8">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <CheckCircle2 className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase italic tracking-wider">This IS:</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Technical verification of your report data",
                                    "Analysis of uncaptured inquiry records",
                                    "An honest 'worth fixing?' feasibility check"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-slate-400 font-medium text-sm leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/10 space-y-8">
                            <div className="flex items-center gap-4 text-slate-600">
                                <XCircle className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase italic tracking-wider">This IS NOT:</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "A masked sales pitch or software demo",
                                    "A theoretical marketing discussion",
                                    "A high-pressure commitment to buy anything"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-slate-600 font-medium text-sm leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Verification Flowchart */}
            <section className="py-24 px-6 bg-black border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[11px] font-black italic uppercase tracking-[0.5em] text-center mb-20 text-slate-700">
                        The 15-Minute Technical Process
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {[
                            { step: 1, label: "Input Verification", sub: "Ensuring entry data matches operational reality", icon: HelpCircle },
                            { step: 2, label: "Bottleneck Audit", sub: "Confirming the primary technical failure point", icon: Clock },
                            { step: 3, label: "Economic Reality", sub: "Determining if recovery ROI justifies the fix", icon: ShieldEllipsis }
                        ].map((s, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-emerald-500 shadow-2xl">
                                    <s.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/40">Stage 0{s.step}</span>
                                    <h4 className="text-lg font-black uppercase italic text-white tracking-tight">{s.label}</h4>
                                    <p className="text-xs text-slate-600 font-medium max-w-[200px] leading-relaxed">{s.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Final Booking CTA */}
            <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tight">
                            Run a Quick <span className="text-emerald-500">Sanity Check</span> <br /> on Your Math
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                            If the diagnostic model doesn&apos;t apply to your operation, we&apos;ll explain exactly why. No pitch, no pressure.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-8">
                        <Button
                            onClick={() => setIsCalendlyOpen(true)}
                            className="h-20 px-16 bg-emerald-500 hover:bg-emerald-400 text-black text-xl md:text-2xl font-black uppercase italic rounded-2xl shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] transition-all"
                        >
                            Schedule Diagnostic Review →
                        </Button>

                        <div className="p-8 rounded-[3rem] bg-black border border-white/5 max-w-2xl shadow-2xl">
                            <p className="text-xs text-slate-600 leading-relaxed font-bold uppercase tracking-widest italic">
                                <strong>The Verification Guarantee:</strong> If we can&apos;t confirm at least one meaningful operational gap in your workflow during the review, we&apos;ll explain exactly why the diagnostic model doesn&apos;t apply to your specific business.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-24 border-t border-white/5 px-6 opacity-40 text-center space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] italic">Maverick Operational Assessment</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    © 2025 • High-Resolution Revenue Operations
                </p>
            </footer>

            <CalendlyModal
                isOpen={isCalendlyOpen}
                onClose={() => setIsCalendlyOpen(false)}
                onSuccess={handleBookingSuccess}
            />
        </div>
    );
}
