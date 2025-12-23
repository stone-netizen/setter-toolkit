import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParsedLead {
  business_name: string;
  website?: string;
  industry?: string;
  phone?: string;
  address?: string;
}

export default function BulkUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "parsing" | "ready" | "uploading" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  
  const { mutateAsync: createLead } = useCreateLead();
  const { toast } = useToast();

  const parseCSV = (text: string): ParsedLead[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const leads: ParsedLead[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const lead: ParsedLead = { business_name: "" };

      headers.forEach((header, index) => {
        const value = values[index] || "";
        if (header.includes("name") || header.includes("business")) {
          lead.business_name = value;
        } else if (header.includes("website") || header.includes("url")) {
          lead.website = value;
        } else if (header.includes("industry") || header.includes("category")) {
          lead.industry = value;
        } else if (header.includes("phone")) {
          lead.phone = value;
        } else if (header.includes("address")) {
          lead.address = value;
        }
      });

      if (lead.business_name) {
        leads.push(lead);
      }
    }

    return leads;
  };

  const handleFile = useCallback((file: File) => {
    setUploadStatus("parsing");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const leads = parseCSV(text);
      setParsedLeads(leads);
      setUploadStatus(leads.length > 0 ? "ready" : "idle");
      
      if (leads.length === 0) {
        toast({
          title: "No valid leads found",
          description: "Make sure your CSV has a header row with 'business_name' or similar column.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${leads.length} leads`,
          description: "Ready to import. Click 'Import All' to continue.",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      handleFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  }, [handleFile, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImport = async () => {
    setUploadStatus("uploading");
    setProgress(0);

    for (let i = 0; i < parsedLeads.length; i++) {
      try {
        await createLead(parsedLeads[i]);
        setProgress(Math.round(((i + 1) / parsedLeads.length) * 100));
      } catch (error) {
        console.error(`Failed to import lead: ${parsedLeads[i].business_name}`);
      }
    }

    setUploadStatus("complete");
    toast({
      title: "Import Complete!",
      description: `Successfully imported ${parsedLeads.length} leads.`,
    });
  };

  const resetUpload = () => {
    setParsedLeads([]);
    setUploadStatus("idle");
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Bulk Upload</h1>
          <p className="text-muted-foreground">Import multiple leads from a CSV file</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "glass rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/5 glow-primary"
                : "border-border hover:border-primary/50",
              uploadStatus === "complete" && "border-success bg-success/5"
            )}
          >
            {uploadStatus === "idle" && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your CSV file here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse your files
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            )}

            {uploadStatus === "parsing" && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-foreground">Parsing file...</p>
              </div>
            )}

            {uploadStatus === "ready" && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {parsedLeads.length} leads ready to import
                </h3>
                <div className="flex justify-center gap-3 mt-4">
                  <Button variant="outline" onClick={resetUpload}>
                    Cancel
                  </Button>
                  <Button onClick={handleImport} className="glow-primary">
                    Import All
                  </Button>
                </div>
              </>
            )}

            {uploadStatus === "uploading" && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{progress}%</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Importing leads...
                </h3>
                <div className="w-full max-w-xs mx-auto h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </>
            )}

            {uploadStatus === "complete" && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Import Complete!
                </h3>
                <p className="text-muted-foreground mb-4">
                  {parsedLeads.length} leads have been added to your pipeline.
                </p>
                <Button onClick={resetUpload} variant="outline">
                  Upload More
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* CSV Format Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl border border-border p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            CSV Format Guide
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Your CSV file should include a header row with these columns:
          </p>
          <code className="block text-xs bg-secondary/50 p-3 rounded-lg text-primary font-mono">
            business_name,website,industry,phone,address
          </code>
          <p className="text-xs text-muted-foreground mt-3">
            Only <code className="text-primary">business_name</code> is required. Other columns are optional.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
