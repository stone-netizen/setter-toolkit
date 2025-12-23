import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  variant?: "default" | "critical" | "warning" | "healthy";
  delay?: number;
}

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  variant = "default",
  delay = 0,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const variantStyles = {
    default: "border-border hover:border-primary/50",
    critical: "border-leak-critical/30 hover:border-leak-critical/60 glow-critical",
    warning: "border-leak-warning/30 hover:border-leak-warning/60 glow-warning",
    healthy: "border-leak-healthy/30 hover:border-leak-healthy/60 glow-healthy",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    critical: "bg-leak-critical/10 text-leak-critical",
    warning: "bg-leak-warning/10 text-leak-warning",
    healthy: "bg-leak-healthy/10 text-leak-healthy",
  };

  const valueStyles = {
    default: "text-foreground",
    critical: "text-leak-critical",
    warning: "text-leak-warning",
    healthy: "text-leak-healthy",
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "glass rounded-xl p-6 border transition-all duration-300 cursor-default",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {variant === "critical" && (
          <span className="w-3 h-3 rounded-full bg-leak-critical pulse-critical" />
        )}
        {variant === "warning" && (
          <span className="w-3 h-3 rounded-full bg-leak-warning pulse-warning" />
        )}
        {variant === "healthy" && (
          <span className="w-3 h-3 rounded-full bg-leak-healthy pulse-healthy" />
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className={cn("text-3xl font-bold font-mono tracking-tight", valueStyles[variant])}>
        {prefix}
        {formatValue(displayValue)}
        {suffix}
      </p>
    </motion.div>
  );
}
