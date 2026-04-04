import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="font-display text-3xl tracking-wider text-foreground">IRONFORGE</span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-3xl text-foreground text-center mb-2">RESET PASSWORD</h2>
          {sent ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Check your email for a password reset link.</p>
              <Link to="/auth">
                <Button variant="hero" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-muted-foreground text-center text-sm mb-4">
                Enter your email and we'll send you a reset link.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-secondary border-border" required />
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Link to="/auth" className="text-sm text-primary hover:underline block text-center mt-4">
                <ArrowLeft className="h-3 w-3 inline mr-1" />Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
