import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, User, DollarSign, Building2 } from "lucide-react";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending: isUpdatingSettings } = useUpdateSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [avgProjectValue, setAvgProjectValue] = useState("");
  const [missedCalls, setMissedCalls] = useState("");
  const [agencyName, setAgencyName] = useState("");

  useEffect(() => {
    if (settings) {
      setAvgProjectValue(settings.avg_project_value.toString());
      setMissedCalls(settings.missed_calls_per_month.toString());
    }
  }, [settings]);

  // Fetch profile for agency name
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("agency_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.agency_name) {
            setAgencyName(data.agency_name);
          }
        });
    }
  }, [user]);

  const handleSaveDefaults = () => {
    const projectVal = parseInt(avgProjectValue) || 5000;
    const callsVal = parseInt(missedCalls) || 10;

    updateSettings({
      avg_project_value: Math.max(1000, Math.min(100000, projectVal)),
      missed_calls_per_month: Math.max(1, Math.min(50, callsVal)),
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ agency_name: agencyName })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your agency name has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and default values</p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-secondary/30 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyName" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Agency Name
                </Label>
                <Input
                  id="agencyName"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Your Agency Name"
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <Button onClick={handleSaveProfile} variant="outline">
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Default Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                Default Values
              </CardTitle>
              <CardDescription>
                These defaults are used in the Revenue Leak Simulator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avgProjectValue">Average Project Value ($)</Label>
                <Input
                  id="avgProjectValue"
                  type="number"
                  value={avgProjectValue}
                  onChange={(e) => setAvgProjectValue(e.target.value)}
                  min={1000}
                  max={100000}
                  step={1000}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  The average value of a project for your clients ($1,000 - $100,000)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="missedCalls">Missed Calls Per Month</Label>
                <Input
                  id="missedCalls"
                  type="number"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(e.target.value)}
                  min={1}
                  max={50}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Default estimate of missed calls per month (1 - 50)
                </p>
              </div>
              <Button
                onClick={handleSaveDefaults}
                disabled={isUpdatingSettings}
                className="glow-primary"
              >
                {isUpdatingSettings ? "Saving..." : "Save Defaults"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
