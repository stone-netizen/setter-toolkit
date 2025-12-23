import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead } from "@/hooks/useLeads";
import { Plus, Building2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const leadSchema = z.object({
  business_name: z.string().trim().min(1, "Business name is required").max(200),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
});

const industries = [
  "Construction",
  "Remodeling",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Roofing",
  "Landscaping",
  "Painting",
  "Flooring",
  "General Contractor",
  "Other",
];

interface AddLeadDialogProps {
  trigger?: React.ReactNode;
}

export function AddLeadDialog({ trigger }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const { mutate: createLead, isPending } = useCreateLead();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = leadSchema.safeParse({
      business_name: businessName,
      website: website || undefined,
      industry: industry || undefined,
      phone: phone || undefined,
      address: address || undefined,
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    createLead(
      {
        business_name: businessName,
        website: website || undefined,
        industry: industry || undefined,
        phone: phone || undefined,
        address: address || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setBusinessName("");
          setWebsite("");
          setIndustry("");
          setPhone("");
          setAddress("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="glow-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-strong border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Add New Lead
          </DialogTitle>
          <DialogDescription>
            Enter the business details to add a new lead to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Smith Remodeling Co."
              required
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-border">
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="glow-primary">
              {isPending ? "Adding..." : "Add Lead"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
