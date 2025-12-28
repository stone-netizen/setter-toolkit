import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background animated-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If role is null after loading, it means the profile table/row is missing
  if (user && role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background animated-gradient p-4">
        <div className="max-w-md w-full text-center space-y-6 glass-strong p-8 rounded-3xl border border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase italic text-white">Account Not Authorized</h2>
            <p className="text-sm text-slate-400">
              Your account exists, but no setter profile was found.
              Please ensure the <span className="text-emerald-500 font-mono">profiles</span> table is created in Supabase.
            </p>
          </div>
          <Button onClick={() => window.location.href = "/auth"} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // If role is set but not allowed
  if (user && role !== 'setter' && role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
