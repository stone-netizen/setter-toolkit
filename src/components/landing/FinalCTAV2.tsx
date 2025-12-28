import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight } from "lucide-react";

interface FinalCTAV2Props {
  onStart: (data?: { industry: string; inbound: number }) => void;
}

export function FinalCTAV2({ onStart }: FinalCTAV2Props) {
  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight">
            Ready to See <span className="text-emerald-500">What’s Leaking</span> <br />
            From Your Business?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We only run 5 of these per week — they take time and attention. Book your free 15-minute walkthrough now and get your clarity map. No pitch. No BS.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <MagneticButton
            size="lg"
            onClick={() => onStart()}
            strength={0.3}
            className="px-10 sm:px-14 py-4 sm:py-5 h-auto text-lg sm:text-2xl font-black uppercase italic rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Book My Free Revenue Leak Audit</span>
            <ArrowRight className="w-6 h-6" />
          </MagneticButton>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Only 5 Slots Per Week Available
          </div>
        </div>
      </div>
    </section>
  );
}
