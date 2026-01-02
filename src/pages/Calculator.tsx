import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info, BookOpen, ExternalLink, GraduationCap, Gavel, HelpCircle, Lock, ArrowRight, ClipboardCheck, Download, Search, Globe, UserCheck, ShieldCheck, Zap, Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, ShieldAlert } from "lucide-react";
import { useCalculatorForm, INDUSTRIES, ROLES, LEAD_SOURCES, AFTER_HOURS_OPTIONS, CLOSERS } from "@/hooks/useCalculatorForm";
import { calculateCockpitResult, formatCurrency, formatCurrencyCompact } from "@/utils/calculations";
import { ExposureExplanation } from "@/components/ExposureExplanation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OBJECTIONS = [
  { trigger: "“We already call back”", prompt: "“Got it — what typically happens in the 30–90 minutes before someone calls back a competitor?”" },
  { trigger: "“We don’t miss that many”", prompt: "“Fair — would you say at least 1 out of 10 goes unanswered live?”" },
  { trigger: "“What is this about?”", prompt: "“This is a diagnostic — it helps estimate what slips through before anyone pitches solutions.”" }
];

export default function Calculator() {
  const { formData, setFormData, resetForm } = useCalculatorForm();
  const [showPrompts, setShowPrompts] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [exposureMode, setExposureMode] = useState<"floor" | "full">("floor");

  const result = useMemo(() => {
    return calculateCockpitResult({
      inquiresPerWeek: formData.inquiresPerWeek,
      avgTicket: formData.avgTicket,
      percentageRatio: formData.percentageRatio,
      dmConfirmed: formData.dmConfirmed,
      ownerAttending: formData.ownerAttending,
      isBooked: formData.isBooked,
      exposureMode,
      closeRate: formData.closeRate,
      businessName: formData.businessName,
    });
  }, [formData, exposureMode]);

  const getCurrentScript = () => {
    if (!formData.businessName) return { text: "“What’s the business name so I don’t mix you up with someone else?”", action: "Input Name" };
    if (!formData.inquiresPerWeek) return { text: "“Roughly how many new inbound calls do you get in a normal week? Just ballpark — this isn’t exact.”", action: "Est. New Inquiries" };
    if (formData.percentageRatio === 0 && !formData.avgTicket) return { text: "“Out of 10 new calls, how many would you say don’t get answered live? Not blaming anyone — this is just reality.”", action: "Click Missed Ratio" };
    if (!formData.avgTicket) return { text: "“When one of those calls turns into a new client, what’s the low-end value of that client?”", action: "Input Ticket Value" };
    if (formData.closeRate === 25 && !formData.afterHoursHandling) return { text: "“If you got a decent qualified person on the phone, how many out of 10 do you typically close?”", action: "Set Close Rate" };
    if (!formData.afterHoursHandling) return { text: "“After hours, what happens to new callers? Voicemail, answering service, staff, something else?”", action: "Select Handling" };
    if (!formData.industry) return { text: "“And just to benchmark correctly — what industry should I tag this under?”", action: "Select Industry" };

    // Result Shown
    if (result.status === "QUALIFIED" && !formData.dmConfirmed) {
      if (exposureMode === 'floor') return { text: "“Okay — I’m using conservative assumptions here. This isn’t upside. This is the floor.”", action: "Anchor Floor" };
      return { text: "“This is not a promise. This is simply what leaks compound into when nothing changes.”", action: "Explain Compounding" };
    }

    if (!formData.dmConfirmed) return { text: "“Just to be clear — are you the one who makes decisions around front desk systems and follow-up?”", action: "Confirm Authority" };
    if (!formData.ownerAttending) return { text: "“For this to be useful, the owner needs to be on the call. Otherwise we don’t do it.”", action: "Mandate Attendance" };
    if (formData.phone.length < 5) return { text: "“What’s the best direct number in case we need to reach you?”", action: "Get Direct Line" };
    if (!formData.demoDate || !formData.demoTime) return { text: "“Does [Day] at [Time] work for a 15-minute verification?”", action: "Set Verification" };

    // Phase 3: Intelligence (Post-Booking)
    if (formData.isBooked) {
      if (!formData.contactName) return { text: "“I just need to update the file — who should we list as the primary contact?”", action: "Get Name" };
      if (!formData.mainPain) return { text: "“What’s the biggest thing breaking right now? I’ll write it exactly how you say it.”", action: "Dig Pain" };
      if (!formData.consequence) return { text: "“If nothing changes over the next 6–12 months, what does that cost you?”", action: "Find Consequence" };
      if (!formData.urgency) return { text: "“On a scale from 1 to 10 — how urgent does this feel right now?”", action: "Check Pulse" };
      return { text: "“I’m sending this to the specialist so they’re prepared. Nothing else you need to do.”", action: "Export & Close" };
    }

    return { text: "“We don’t sell on this call — we just verify whether the leak is real.”", action: "Maintain Frame" };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${minutes} ${ampm}`;
  };

  const handleCopyRow = () => {
    const escape = (val: any) => {
      const str = String(val || "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const getExportStatus = (status: string) => {
      if (status === "BOOKED") return "BOOKED";
      if (status === "QUALIFIED") return "VERIFIED";
      if (status === "DISQUALIFIED") return "DISQUALIFIED";
      return "FOLLOW UP";
    };

    const row = [
      escape(formData.businessName),      // 1. Business Name
      escape(formData.website),           // 2. Website
      escape(formData.email),             // 3. Email
      escape(formData.industry),          // 4. Industry
      escape(formData.location),          // 5. City/State
      escape(formData.contactName),       // 6. Decision Maker Name
      escape(formData.phone),             // 7. Phone
      formData.urgency,                   // 8. Urgency (1–10)
      escape(formData.primaryLeadSource), // 9. Primary Lead Source
      escape(formData.contactRole),       // 10. Role
      escape(formData.mainPain),          // 11. Main Pain
      escape(formData.consequence),       // 12. Consequence
      formData.inquiresPerWeek,           // 13. Inbound Calls / Week
      result.missedCalls,                 // 14. Missed Calls / Week
      formData.avgTicket,                 // 15. Avg Ticket
      escape(formData.afterHoursHandling),// 16. After Hours Handling
      result.monthlyExposure,             // 17. Base Revenue Leak
      formData.dmConfirmed ? "TRUE" : "FALSE",    // 18. DM Confirmed
      formData.ownerAttending ? "TRUE" : "FALSE", // 19. Owner Attending
      formatDate(formData.demoDate),      // 20. Demo Date
      formatTime(formData.demoTime),      // 21. Demo Time
      escape(formData.assignedCloser),    // 22. Assigned Closer
      escape(formData.closerFeedback),    // 23. Closer Feedback
      getExportStatus(result.status)      // 24. Status
    ];

    navigator.clipboard.writeText(row.join(","));
    toast.success("24-Column CSV Row Copied");
  };

  const handleDownloadCSV = () => {
    const escape = (val: any) => {
      const str = String(val || "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const getExportStatus = (status: string) => {
      if (status === "BOOKED") return "BOOKED";
      if (status === "QUALIFIED") return "VERIFIED";
      if (status === "DISQUALIFIED") return "DISQUALIFIED";
      return "FOLLOW UP";
    };

    // Single row, strict order per "Setter Briefcase" spec
    const columns = [
      formData.businessName,      // 1
      formData.website,           // 2
      formData.email,             // 3
      formData.industry,          // 4
      formData.location,          // 5
      formData.contactName,       // 6
      formData.phone,             // 7
      formData.urgency,           // 8
      formData.primaryLeadSource, // 9
      formData.contactRole,       // 10
      formData.mainPain,          // 11
      formData.consequence,       // 12
      formData.inquiresPerWeek,   // 13
      result.missedCalls,         // 14
      formData.avgTicket,         // 15
      formData.afterHoursHandling,// 16
      result.monthlyExposure,     // 17
      formData.dmConfirmed ? "TRUE" : "FALSE",    // 18
      formData.ownerAttending ? "TRUE" : "FALSE", // 19
      formatDate(formData.demoDate),      // 20
      formatTime(formData.demoTime),      // 21
      formData.assignedCloser,    // 22
      formData.closerFeedback,    // 23
      getExportStatus(result.status) // 24
    ];

    // No headers, just the row content
    const csvContent = columns.map(escape).join(",");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    // Filename = Business_Name.csv (Sanitized)
    const safeName = formData.businessName ? formData.businessName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'call_log';
    const filename = `${safeName}.csv`;

    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Setter Briefcase Exported");
  };

  const isPhase1Complete = result.status !== "INCOMPLETE";
  const isPhase2Active = result.status === "QUALIFIED" || result.status === "BOOKED" || result.status === "DISQUALIFIED";
  const canBook = formData.dmConfirmed && formData.ownerAttending && formData.phone.length > 5 && formData.demoDate && formData.demoTime && formData.assignedCloser;

  const isDownloadReady = formData.isBooked &&
    formData.businessName &&
    formData.email &&
    formData.phone &&
    formData.industry &&
    formData.contactName &&
    formData.contactRole &&
    formData.mainPain &&
    formData.consequence &&
    formData.primaryLeadSource &&
    formData.dmConfirmed &&
    formData.ownerAttending;

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans selection:bg-emerald-500/30 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Progress Strip */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-full max-w-fit mx-auto">
          {[
            { id: 1, label: "Conviction" },
            { id: 2, label: "Booking Gate" },
            { id: 3, label: "Intelligence" }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${formData.currentPhase >= s.id ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${formData.currentPhase >= s.id ? 'text-white' : 'text-slate-700'}`}>{s.label}</span>
              {s.id < 3 && <div className="w-4 h-[1px] bg-white/5 mx-1" />}
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Revenue Leak System</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600 italic">Setter Booking Engine (v8.3.0) • High Velocity Mode</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowPrompts(!showPrompts)}
              className="h-9 px-4 bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase italic rounded-full text-slate-500 hover:text-emerald-500 transition-all gap-2"
            >
              <BookOpen className="w-3 h-3" />
              Objection Handler
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="h-9 px-4 bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase italic rounded-full text-slate-800 hover:text-red-500/50 transition-all gap-2">
                  <RotateCcw className="w-3 h-3" />
                  New Call
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-white/10 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Start New Call?</AlertDialogTitle>
                  <AlertDialogDescription>This will clear the current system state.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-white/10">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    resetForm();
                    setExposureMode("floor");
                    setShowPrompts(false);
                  }} className="bg-emerald-500 text-black font-black uppercase italic text-xs">Reset All</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Panel */}
          <div className="lg:col-span-7 space-y-8">

            {/* PHASE 1: CONVICTION CALCULATOR */}
            <section className="p-8 rounded-[2rem] border border-white/5 bg-black space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="h-1 w-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Phase 1: Conviction Calculator</h2>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Business Name */}
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                    Which business are we looking at today?
                  </Label>
                  <Input
                    placeholder="Legal Business Name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ businessName: e.target.value })}
                    className="bg-zinc-900/50 border-white/5 h-12 text-base font-medium focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all rounded-2xl"
                  />
                </div>

                {/* Inquiries */}
                <div className="space-y-3 pt-2">
                  <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                    Inbound inquiries per week
                  </Label>
                  <Input
                    type="number"
                    placeholder="New inquiries only"
                    value={formData.inquiresPerWeek || ""}
                    onChange={(e) => setFormData({ inquiresPerWeek: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="bg-zinc-900/50 border-white/5 h-12 text-base font-medium focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all rounded-2xl"
                  />
                </div>

                {/* Missed Ratio (Segmented Control) */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider block">
                    Missed calls per 10
                  </Label>
                  <div className="flex p-1 bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setFormData({ percentageRatio: val })}
                        className={`flex-1 h-10 text-xs font-black transition-all rounded-xl ${formData.percentageRatio === val
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {val}{val === 5 ? "+" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  {/* Avg Ticket */}
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                      Average revenue per new client
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.avgTicket || ""}
                        onChange={(e) => setFormData({ avgTicket: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="bg-zinc-900/50 border-white/5 h-12 pl-8 text-base font-medium focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Close Rate Control Card */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                        Close Rate on Missed Calls
                      </Label>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-black">{formData.closeRate}%</span>
                    </div>

                    <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-6">
                      <Slider
                        value={[formData.closeRate]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(vals) => setFormData({ closeRate: vals[0] })}
                        className="py-2"
                      />
                      <div className="flex gap-2 justify-between">
                        {[
                          { label: "Low", val: 20 },
                          { label: "Recommended", val: 35 },
                          { label: "High", val: 50 },
                        ].map(opt => (
                          <button
                            key={opt.label}
                            onClick={() => setFormData({ closeRate: opt.val })}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${formData.closeRate === opt.val
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'
                              }`}
                          >
                            {opt.label} ({opt.val}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                      After-hours handling
                    </Label>
                    <Select value={formData.afterHoursHandling} onValueChange={(v) => setFormData({ afterHoursHandling: v })}>
                      <SelectTrigger className="bg-zinc-900/50 border-white/5 h-12 text-slate-300 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl">
                        <SelectValue placeholder="Select Process" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0A] border-white/10 text-slate-300 font-sans">
                        {AFTER_HOURS_OPTIONS.map(a => <SelectItem key={a} value={a} className="focus:bg-zinc-800 focus:text-white cursor-pointer">{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
                      Industry
                    </Label>
                    <Select value={formData.industry} onValueChange={(v) => {
                      let defaultRate = 25;
                      if (v === "Dentist") defaultRate = 30;
                      if (v === "HVAC") defaultRate = 25;
                      if (v === "Med Spa") defaultRate = 20;
                      setFormData({ industry: v, closeRate: defaultRate });
                    }}>
                      <SelectTrigger className="bg-zinc-900/50 border-white/5 h-12 text-slate-300 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl">
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0A] border-white/10 text-slate-300 font-sans">
                        {INDUSTRIES.map(i => <SelectItem key={i} value={i} className="focus:bg-zinc-800 focus:text-white cursor-pointer">{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* PHASE 2: BOOKING GATE */}
            <AnimatePresence>
              {isPhase2Active && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] border border-white/5 bg-black space-y-8 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Phase 2: Booking Gate (Mandatory)</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${formData.dmConfirmed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/30 border-white/5'}`} onClick={() => setFormData({ dmConfirmed: !formData.dmConfirmed })}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pointer-events-none">Decision Maker Confirmed?</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Must be confirmed to book</p>
                          </div>
                          <Checkbox checked={formData.dmConfirmed} onCheckedChange={(v) => setFormData({ dmConfirmed: !!v })} className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none" />
                        </div>
                      </div>
                      <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${formData.ownerAttending ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/30 border-white/5'}`} onClick={() => setFormData({ ownerAttending: !formData.ownerAttending })}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pointer-events-none">Owner Attending Demo?</Label>
                            <p className="text-[10px] text-slate-500 font-medium">Hard gate for verification</p>
                          </div>
                          <Checkbox checked={formData.ownerAttending} onCheckedChange={(v) => setFormData({ ownerAttending: !!v })} className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none" />
                        </div>
                      </div>
                    </div>

                    {(!formData.dmConfirmed || !formData.ownerAttending) && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <p className="text-[10px] font-black uppercase italic text-red-500">Booking Blocked: DM and Owner Attendance Required.</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2"><Phone className="w-3 h-3" /> Direct Phone Number</Label>
                        <Input
                          placeholder="(555) 000-0000" value={formData.phone}
                          onChange={(e) => setFormData({ phone: e.target.value })}
                          className="bg-zinc-900/50 border-white/5 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2"><UserCheck className="w-3 h-3" /> Assigned Closer</Label>
                        <Select value={formData.assignedCloser} onValueChange={(v) => setFormData({ assignedCloser: v })}>
                          <SelectTrigger className="bg-zinc-900/50 border-white/5 h-12">
                            <SelectValue placeholder="Select closer" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white font-sans">
                            {CLOSERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2"><Calendar className="w-3 h-3" /> Demo Date</Label>
                        <Input type="date" value={formData.demoDate} onChange={(e) => setFormData({ demoDate: e.target.value })} className="bg-zinc-900/50 border-white/5 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2"><Clock className="w-3 h-3" /> Demo Time</Label>
                        <Input type="time" value={formData.demoTime} onChange={(e) => setFormData({ demoTime: e.target.value })} className="bg-zinc-900/50 border-white/5 h-12" />
                      </div>
                    </div>

                    <Button
                      disabled={!canBook}
                      onClick={() => {
                        setFormData({ isBooked: true, currentPhase: 3 });
                        toast.success("Booking Confirmed Locally");
                      }}
                      className={`w-full h-14 font-black uppercase italic text-xs rounded-xl gap-2 mt-4 transition-all ${canBook ? 'bg-white text-black hover:bg-slate-200 shadow-xl shadow-white/5' : 'bg-zinc-900 text-slate-700 cursor-not-allowed border border-white/5'
                        }`}
                    >
                      {formData.isBooked ? 'Booking Confirmed ✓' : 'Confirm Booking & Unlock Intelligence'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* PHASE 3: SALES INTELLIGENCE */}
            <AnimatePresence>
              {formData.isBooked && (
                <motion.section
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Phase 3: Sales Intelligence</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact Name</Label>
                        <Input
                          placeholder="Full Name"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ contactName: e.target.value })}
                          className="bg-zinc-900/50 border-white/5 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Decision Maker Role</Label>
                        <Select value={formData.contactRole} onValueChange={(v) => setFormData({ contactRole: v })}>
                          <SelectTrigger className="bg-zinc-900/50 border-white/5 h-12">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white font-sans">
                            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Email Address</Label>
                        <Input
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ email: e.target.value })}
                          className="bg-zinc-900/50 border-white/5 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Website</Label>
                        <Input
                          placeholder="https://..."
                          value={formData.website}
                          onChange={(e) => setFormData({ website: e.target.value })}
                          className="bg-zinc-900/50 border-white/5 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Location / Territory</Label>
                      <Input
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => setFormData({ location: e.target.value })}
                        className="bg-zinc-900/50 border-white/5 h-12"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Primary Lead Source</Label>
                        <Select value={formData.primaryLeadSource} onValueChange={(v) => setFormData({ primaryLeadSource: v })}>
                          <SelectTrigger className="bg-zinc-900/50 border-white/5 h-12">
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white font-sans">
                            {LEAD_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black text-white/90 leading-tight italic">
                          “What’s the main issue you’re dealing with right now?” (Verbatim)
                        </Label>
                        <textarea
                          placeholder="Owner's exact words..."
                          value={formData.mainPain}
                          onChange={(e) => setFormData({ mainPain: e.target.value })}
                          className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl text-sm min-h-[80px] focus:border-emerald-500/30 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black text-white/90 leading-tight italic">
                          “What happens if this stays broken for another 6–12 months?”
                        </Label>
                        <textarea
                          placeholder="The cost of inaction..."
                          value={formData.consequence}
                          onChange={(e) => setFormData({ consequence: e.target.value })}
                          className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl text-sm min-h-[80px] focus:border-emerald-500/30 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Urgency level (1-10)</Label>
                        <span className="text-emerald-500 font-black italic">{formData.urgency}/10</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(u => (
                          <button
                            key={u}
                            onClick={() => setFormData({ urgency: u })}
                            className={`flex-1 h-9 rounded-md text-[10px] font-black transition-all ${formData.urgency === u ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/[0.03] border border-white/5 text-slate-600 hover:border-white/10'}`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <section className={`rounded-[2.5rem] border transition-all flex flex-col items-center justify-center text-center space-y-8 min-h-[600px] shadow-2xl relative overflow-hidden bg-black group ${result.status === 'BOOKED' ? 'border-emerald-500 border-2 shadow-emerald-500/20' :
              result.status === 'QUALIFIED' ? 'border-emerald-500/50 shadow-emerald-500/10' :
                result.status === 'DISQUALIFIED' ? 'border-red-500/30' : 'border-white/5'
              }`}>
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

              <div className="space-y-8 w-full relative z-10 p-10 flex flex-col h-full">

                {/* SETTER SCRIPT CARD (Compact) */}
                <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-left relative group/script hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Setter Script
                      </p>
                      <p className="text-sm font-medium text-slate-200 italic leading-snug">"{getCurrentScript().text}"</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getCurrentScript().text);
                        toast.success("Script Copied");
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-8">

                  {/* CONSERVATIVE EXPOSURE LABEL */}
                  <div className="bg-zinc-900/50 px-4 py-2 rounded-xl inline-flex border border-white/10">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        Conservative Exposure
                      </span>
                    </div>
                  </div>

                  {/* MAIN NUMBER DISPLAY */}
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                      <span>Monthly Loss</span>
                      <button onClick={() => setShowExplanation(true)} className="text-slate-600 hover:text-emerald-500">
                        <Info className="w-3 h-3" />
                      </button>
                    </div>

                    <div className={`text-7xl md:text-8xl font-black tracking-tighter tabular-nums leading-none transition-all ${result.status === 'INCOMPLETE' ? 'text-zinc-800' : 'text-white drop-shadow-2xl'
                      }`}>
                      {result.status === 'INCOMPLETE' ? "$0" : formatCurrencyCompact(result.monthlyExposure)}
                    </div>

                    {/* Helper text */}
                    <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                      Confirmed Floor (Min)
                    </p>
                  </div>

                  {/* DAILY / YEARLY COLUMNS */}
                  {result.monthlyExposure > 0 && (
                    <div className="grid grid-cols-2 gap-8 w-full max-w-xs pt-4 border-t border-white/5">
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Daily Loss</p>
                        <p className="text-lg font-bold text-slate-400 tabular-nums">{formatCurrencyCompact(result.dailyExposure)}</p>
                      </div>
                      <div className="text-center space-y-1 border-l border-white/5 pl-8">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Yearly Loss</p>
                        <p className="text-lg font-bold text-slate-400 tabular-nums">{formatCurrencyCompact(result.yearlyExposure)}</p>
                      </div>
                    </div>
                  )}

                  {/* OPERATIONAL DIRECTIVE */}
                  <div className="bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Worth verifying against call logs
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="w-full space-y-3 pt-4">
                  <Button
                    onClick={() => window.open('https://calendly.com/stone-qualai/30min', '_blank')}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wide text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02]"
                  >
                    Book 15-Min Verification Call
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleCopyRow}
                      variant="outline"
                      className="h-12 bg-white/[0.02] border-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      <ClipboardCheck className="w-3 h-3 mr-2" />
                      Copy Row
                    </Button>

                    <Button
                      disabled={!isDownloadReady}
                      onClick={handleDownloadCSV}
                      variant="ghost"
                      className={`h-12 font-black uppercase tracking-widest text-[9px] rounded-xl border transition-all ${isDownloadReady
                        ? 'bg-white/[0.05] border-white/10 text-white hover:bg-white/10'
                        : 'bg-transparent border-transparent text-slate-700 cursor-not-allowed'
                        }`}
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Save CSV
                    </Button>
                  </div>
                </div>

                {!isDownloadReady && formData.isBooked && (
                  <div className="space-y-2">
                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Awaiting 16+ Mandatory Fields:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {[
                        { label: "BIZ", met: !!formData.businessName },
                        { label: "EMAIL", met: !!formData.email },
                        { label: "NAME", met: !!formData.contactName },
                        { label: "ROLE", met: !!formData.contactRole },
                        { label: "PAIN", met: !!formData.mainPain },
                        { label: "DM", met: formData.dmConfirmed },
                        { label: "OWNER", met: formData.ownerAttending }
                      ].map(f => (
                        <span key={f.label} className={`px-2 py-0.5 rounded-sm text-[7px] font-black ${f.met ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/10 text-red-500/40'}`}>
                          {f.label}{f.met ? " ✓" : ""}
                        </span>
                      ))}
                    </div>
                    {(!formData.dmConfirmed || !formData.ownerAttending) && (
                      <p className="text-[7px] text-red-500 font-black uppercase italic animate-pulse">
                        Blocked: Authority Gates must be TRUE
                      </p>
                    )}
                  </div>
                )}

              </div>
            </section>

            {/* EXPLANATION MODAL */}
            <AnimatePresence>
              {showExplanation && (
                <ExposureExplanation
                  isOpen={showExplanation}
                  onClose={() => setShowExplanation(false)}
                  inputs={{
                    inquiries: formData.inquiresPerWeek || 0,
                    ratio: formData.percentageRatio,
                    ticket: formData.avgTicket || 0,
                    closeRate: formData.closeRate || 25
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Objection Handler Box */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed bottom-8 left-8 z-50 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase italic tracking-widest text-emerald-500">Call Objections</h3>
                <button onClick={() => setShowPrompts(false)} className="text-[9px] font-black uppercase text-slate-700">[ Hide ]</button>
              </div>
              <div className="space-y-6 text-left">
                {OBJECTIONS.map((o, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-black text-slate-700 uppercase italic">If: "{o.trigger}"</p>
                    <p className="text-[12px] text-white/90 font-medium italic leading-relaxed">"{o.prompt}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="pt-12 opacity-30 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic text-slate-800">
            Internal Decision Engine • v8.3.0 Production Node
          </p>
        </footer>
      </div>
    </div >
  );
}
