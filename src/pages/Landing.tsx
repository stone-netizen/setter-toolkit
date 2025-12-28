import { useNavigate } from "react-router-dom";
import { HeroSectionV2 } from "@/components/landing/HeroSectionV2";

/**
 * PRODUCTION LANDING PAGE
 * IA Stage 0: Initial Discovery
 */

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Subtle Glow */}
      <div className="fixed inset-x-0 top-0 flex justify-center pointer-events-none z-0">
        <div className="relative w-[100vw] h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl opacity-30" />
        </div>
      </div>

      <main className="relative z-10">
        <HeroSectionV2 onStart={(data) => navigate("/calculator", { state: data })} />

        {/* Simple Footer Copy-Locked */}
        <footer className="py-8 border-t border-white/5 px-6 bg-black text-center opacity-40">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] italic">Maverick Operational Diagnostic</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              © 2025 • High-Resolution Revenue Operations
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
