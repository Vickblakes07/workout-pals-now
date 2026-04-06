import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const categories = ["All", "HIIT", "Yoga", "Boxing", "Strength", "CrossFit", "Cardio"];

interface GymClass {
  id: string;
  name: string;
  description: string | null;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_slots: number;
  trainers: { full_name: string } | null;
  booked_count: number;
}

const Classes = () => {
  const [filter, setFilter] = useState("All");
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
    if (user) fetchUserBookings();
  }, [user]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("gym_classes")
      .select("*, trainers(full_name)")
      .eq("is_active", true);

    if (error) {
      toast.error("Failed to load classes");
      setLoading(false);
      return;
    }

    // Get booking counts
    const { data: bookings } = await supabase
      .from("class_bookings")
      .select("class_id")
      .eq("status", "booked");

    const countMap: Record<string, number> = {};
    bookings?.forEach((b) => {
      countMap[b.class_id] = (countMap[b.class_id] || 0) + 1;
    });

    setClasses(
      (data || []).map((c) => ({
        ...c,
        trainers: c.trainers as { full_name: string } | null,
        booked_count: countMap[c.id] || 0,
      }))
    );
    setLoading(false);
  };

  const fetchUserBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("class_bookings")
      .select("class_id")
      .eq("user_id", user.id)
      .eq("status", "booked");
    setUserBookings(data?.map((b) => b.class_id) || []);
  };

  const handleBook = async (classId: string) => {
    if (!user) {
      toast.error("Please sign in to book a class");
      return;
    }
    setBookingId(classId);
    const { error } = await supabase.from("class_bookings").insert({
      class_id: classId,
      user_id: user.id,
    });
    if (error) {
      toast.error("Booking failed. You may already have a booking.");
    } else {
      toast.success("Class booked successfully! 🎉");
      fetchClasses();
      fetchUserBookings();
    }
    setBookingId(null);
  };

  const handleCancel = async (classId: string) => {
    if (!user) return;
    setBookingId(classId);
    const { error } = await supabase
      .from("class_bookings")
      .update({ status: "cancelled" })
      .eq("class_id", classId)
      .eq("user_id", user.id)
      .eq("status", "booked");
    if (error) {
      toast.error("Failed to cancel booking");
    } else {
      toast.success("Booking cancelled");
      fetchClasses();
      fetchUserBookings();
    }
    setBookingId(null);
  };

  const filtered = filter === "All" ? classes : classes.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Find Your Fit</p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground">ALL CLASSES</h1>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((l) => (
              <Button key={l} variant={filter === l ? "hero" : "secondary"} size="sm" onClick={() => setFilter(l)}>
                {l}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filtered.map((cls, i) => {
                const slotsLeft = cls.max_slots - cls.booked_count;
                const isBooked = userBookings.includes(cls.id);
                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="mb-4">
                      <h3 className="font-display text-2xl text-foreground">{cls.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        with {cls.trainers?.full_name || "TBD"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{cls.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cls.start_time.slice(0, 5)} – {cls.end_time.slice(0, 5)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {slotsLeft} / {cls.max_slots} slots
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {cls.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{dayNames[cls.day_of_week]}</span>
                      {isBooked ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={bookingId === cls.id}
                          onClick={() => handleCancel(cls.id)}
                        >
                          {bookingId === cls.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel Booking"}
                        </Button>
                      ) : (
                        <Button
                          variant="hero"
                          size="sm"
                          disabled={slotsLeft <= 0 || bookingId === cls.id}
                          onClick={() => handleBook(cls.id)}
                        >
                          {bookingId === cls.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : slotsLeft <= 0 ? (
                            "Full"
                          ) : (
                            "Book Now"
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Classes;
