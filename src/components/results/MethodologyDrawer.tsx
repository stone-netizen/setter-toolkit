import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function MethodologyDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group mx-auto">
            <FileText className="w-4 h-4" />
            <span className="text-sm">How we calculate this</span>
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
                      This diagnostic uses industry benchmarks from service businesses 
                      generating $50k–$5M/month.
                    </p>
                    <p>
                      Estimates are based on response-time conversion studies, appointment 
                      show-up data, and historical close-rate ranges.
                    </p>
                    <p>
                      All figures represent recoverable revenue, not guaranteed outcomes.
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
