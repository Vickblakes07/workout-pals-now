import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, Dumbbell, CreditCard, Trophy, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Booking {
  id: string;
  status: string;
  booked_at: string;
  gym_classes: {
    name: string;
    category: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    trainers: { full_name: string } | null;
  };
}

interface Membership {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  membership_plans: { name: string; price: number };
}

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    const [bookingsRes, membershipRes] = await Promise.all([
      supabase
        .from("class_bookings")
        .select("*, gym_classes(name, category, day_of_week, start_time, end_time, trainers(full_name))")
        .eq("user_id", user!.id)
        .eq("status", "booked")
        .order("booked_at", { ascending: false }),
      supabase
        .from("user_memberships")
        .select("*, membership_plans(name, price)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle(),
    ]);
    setBookings((bookingsRes.data as unknown as Booking[]) || []);
    setMembership((membershipRes.data as unknown as Membership) || null);
    setLoading(false);
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("class_bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);
    if (error) {
      toast.error("Failed to cancel");
    } else {
      toast.success("Booking cancelled");
      fetchData();
    }
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Member";

  const stats = [
    { label: "Active Bookings", value: bookings.length.toString(), icon: Calendar, color: "text-emerald-400" },
    { label: "Membership", value: membership?.membership_plans?.name || "None", icon: CreditCard, color: "text-amber-400" },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Dashboard</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-2">
              WELCOME, {displayName.toUpperCase()}
            </h1>
            <p className="text-muted-foreground mb-8">Track your fitness journey and manage your bookings.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="font-display text-3xl text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl text-foreground mb-4">YOUR BOOKINGS</h2>
            {bookings.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-muted-foreground mb-4">No active bookings yet.</p>
                <Button variant="hero" onClick={() => navigate("/classes")}>
                  Browse Classes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-xl p-5 border border-border flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-display text-xl text-foreground">{b.gym_classes.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {dayNames[b.gym_classes.day_of_week]} · {b.gym_classes.start_time.slice(0, 5)} – {b.gym_classes.end_time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        with {(b.gym_classes.trainers as { full_name: string } | null)?.full_name || "TBD"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => cancelBooking(b.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
