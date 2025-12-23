import { motion } from "framer-motion";
import { MapPin, Globe, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditWizardData } from "@/hooks/useAuditWizard";

interface BusinessBasicsStepProps {
  data: AuditWizardData;
  updateData: (updates: Partial<AuditWizardData>) => void;
}

const SERVICE_CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Roofing",
  "Electrical",
  "Landscaping",
  "General Contractor",
  "Pest Control",
  "Cleaning Services",
  "Auto Repair",
  "Dental",
  "Chiropractic",
  "Legal Services",
  "Real Estate",
  "Insurance",
  "Financial Services",
  "Other",
];

export function BusinessBasicsStep({ data, updateData }: BusinessBasicsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Business Basics</h2>
        <p className="text-muted-foreground">Tell us about the business you want to audit</p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Business Name *
          </Label>
          <Input
            id="business_name"
            placeholder="Smith Plumbing Co"
            value={data.business_name}
            onChange={(e) => updateData({ business_name: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        {/* Google Maps URL */}
        <div className="space-y-2">
          <Label htmlFor="maps_url" className="text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Google Maps URL
          </Label>
          <Input
            id="maps_url"
            placeholder="https://www.google.com/maps/place/..."
            value={data.maps_url}
            onChange={(e) => updateData({ maps_url: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Paste the full Google Maps link for the business
          </p>
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Website URL
          </Label>
          <Input
            id="website"
            placeholder="https://www.smithplumbingco.com"
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        {/* Service Category */}
        <div className="space-y-2">
          <Label className="text-foreground">Service Category</Label>
          <Select
            value={data.category}
            onValueChange={(value) => updateData({ category: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
