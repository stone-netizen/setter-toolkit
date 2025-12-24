import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ClipboardCheck } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function MethodologyDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group mx-auto">
            <ClipboardCheck className="w-4 h-4" />
            <span className="text-sm">Diagnostic methodology</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 p-6 rounded-xl bg-card border border-border"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Methodology & Assumptions
                  </h4>
                  
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      This diagnostic uses <span className="font-semibold text-foreground">industry benchmarks</span> from service businesses 
                      generating $50k–$5M/month.
                    </p>
                    <p>
                      Estimates are based on published response-time conversion studies, appointment 
                      show-up data from service businesses, and observed close-rate ranges across 500+ audits.
                    </p>
                    <p>
                      All figures represent <span className="font-semibold text-foreground">recoverable revenue</span>, not guaranteed outcomes.
                    </p>
                    <p>
                      Actual recovery depends on execution speed, offer strength, and follow-up consistency.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
