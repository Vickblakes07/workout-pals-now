import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Crown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const PAYSTACK_PUBLIC_KEY = "pk_test_da8921fc77480012e89f6888e582a616ddf1bab3";

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
  const [paying, setPaying] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Handle Paystack callback - verify payment when redirected back
  const verifyPayment = useCallback(async (reference: string) => {
    try {
      toast.loading("Verifying your payment...", { id: "verify" });

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ reference }),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Membership activated! 🎉 Welcome aboard!", { id: "verify" });
        // Clear URL params
        setSearchParams({});
        // Redirect to dashboard after short delay
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(result.error || "Payment verification failed", { id: "verify" });
      }
    } catch {
      toast.error("Could not verify payment. Please contact support.", { id: "verify" });
    }
  }, [navigate, setSearchParams]);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const isCallback = searchParams.get("payment") === "callback";
    if (reference && isCallback && user) {
      verifyPayment(reference);
    }
  }, [searchParams, user, verifyPayment]);

  const handleSelect = async (planId: string) => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    setPaying(planId);

    try {
      // Generate a unique reference client-side
      const reference = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round(plan.price * 100), // Naira to kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          user_id: user.id,
          plan_id: plan.id,
          plan_name: plan.name,
          duration_months: plan.duration_months,
        },
        callback: (response: { reference: string }) => {
          verifyPayment(response.reference);
        },
        onClose: () => {
          setPaying(null);
          toast.info("Payment cancelled");
        },
      });
      handler.openIframe();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
      setPaying(null);
    }
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
                    disabled={paying !== null}
                  >
                    {paying === plan.id ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                    ) : (
                      "Get Started"
                    )}
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
