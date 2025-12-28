import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useRef, useState } from "react";
import { INDUSTRIES } from "@/hooks/useCalculatorForm";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface HeroSectionV2Props {
  onStart: (data?: { industry: string; inbound: number }) => void;
}

export function HeroSectionV2({ onStart }: HeroSectionV2Props) {
  const ref = useRef<HTMLElement>(null);
  const [industry, setIndustry] = useState("");
  const [inbound, setInbound] = useState(150);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black text-white min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/2 via-transparent to-transparent opacity-60 pointer-events-none" />

      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-5xl mx-auto px-6 py-12 text-center z-20"
      >
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.0] tracking-tight uppercase italic">
              Your Business Is Leaking Revenue <br />
              <span className="text-emerald-500">(And You Probably Can&apos;t See It)</span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-snug">
              This is a short operational diagnostic that estimates where inbound revenue is being lost due to missed calls, delayed responses, and coverage gaps.
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold max-w-xl mx-auto opacity-70">
              This diagnostic does not evaluate marketing performance. It estimates revenue loss after a lead already reaches your business.
            </p>
          </div>

          <div className="max-w-lg mx-auto p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl space-y-8 shadow-xl">
            <div className="grid grid-cols-1 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-600">I operate in the:</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="h-12 bg-black border-white/10 rounded-xl focus:ring-emerald-500/10 text-white text-sm">
                    <SelectValue placeholder="Select Industry..." />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {INDUSTRIES.map(i => (
                      <SelectItem key={i} value={i} className="text-white hover:bg-emerald-500/5 text-sm">
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-600">Monthly inbound inquiries:</label>
                  <span className="text-xl font-black text-emerald-500 tabular-nums">{inbound}</span>
                </div>
                <div className="px-2">
                  <Slider
                    value={[inbound]}
                    min={10}
                    max={500}
                    step={10}
                    onValueChange={(v) => setInbound(v[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-800 uppercase tracking-widest">
                    <span>10</span>
                    <span>Calls, forms, and texts combined</span>
                    <span>500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <MagneticButton
                size="lg"
                onClick={() => onStart({ industry, inbound })}
                strength={0.1}
                className="w-full h-14 md:h-16 text-lg font-black uppercase italic rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg transition-all active:scale-95 disabled:opacity-20"
                disabled={!industry}
              >
                Run My Revenue Diagnostic →
              </MagneticButton>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
                Directional estimate only · No pitch
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
