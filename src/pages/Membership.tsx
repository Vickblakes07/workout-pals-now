import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
  is_popular: boolean;
}

const Membership = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("price")
      .then(({ data }) => {
        setPlans((data as Plan[]) || []);
        setLoading(false);
      });
  }, []);

  const handleSelect = (planId: string) => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }
    // Stripe integration will go here
    toast.info("Payment integration coming soon! 🚧");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Choose Your Plan</p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground">MEMBERSHIP</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Join the IronForge family. Every plan includes access to our state-of-the-art facility and supportive community.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative bg-card rounded-xl p-8 border transition-all ${
                    plan.is_popular ? "border-primary shadow-[0_0_30px_rgba(255,107,0,0.15)]" : "border-border"
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" /> MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-3xl text-foreground mb-2">{plan.name.toUpperCase()}</h3>
                  <div className="mb-6">
                    <span className="font-display text-4xl text-foreground">₦{Number(plan.price).toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">/{plan.duration_months === 1 ? "mo" : `${plan.duration_months}mo`}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features?.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.is_popular ? "hero" : "secondary"}
                    className="w-full"
                    onClick={() => handleSelect(plan.id)}
                  >
                    Get Started
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Membership;
