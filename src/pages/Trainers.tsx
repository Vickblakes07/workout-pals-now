import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Trainer {
  id: string;
  full_name: string;
  bio: string | null;
  specialties: string[];
  certifications: string[];
  rating: number;
  total_reviews: number;
  image_url: string | null;
  hourly_rate: number;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop",
];

const Trainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("trainers")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        setTrainers((data as Trainer[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">World-Class Coaches</p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground">OUR TRAINERS</h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {trainers.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-card rounded-xl overflow-hidden border border-border group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={t.image_url || fallbackImages[i % fallbackImages.length]}
                      alt={t.full_name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-2xl text-foreground">{t.full_name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm text-primary font-medium">{Number(t.rating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({t.total_reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-primary font-medium mb-3">
                      {t.specialties?.join(" · ") || "General Fitness"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{t.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {t.certifications?.map((c) => (
                        <span key={c} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3" /> {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">₦{Number(t.hourly_rate).toLocaleString()}/hr</span>
                      <Button variant="hero" size="sm">Book Session</Button>
                    </div>
                  </div>
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

export default Trainers;
