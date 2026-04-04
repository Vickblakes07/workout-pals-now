import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Award, Calendar } from "lucide-react";

const trainers = [
  { name: "Adaeze Okoro", specialty: "Strength & Conditioning", rating: 4.9, bio: "10+ years of competitive powerlifting experience. Certified NSCA coach helping clients build raw strength.", image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop", certifications: ["NSCA-CSCS", "CrossFit L2"] },
  { name: "Tunde Bakare", specialty: "Boxing & MMA", rating: 4.8, bio: "Former national boxing champion turned coach. Specializes in combat fitness and self-defense training.", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop", certifications: ["NASM-CPT", "Boxing Coach"] },
  { name: "Chinelo Nwankwo", specialty: "Yoga & Flexibility", rating: 5.0, bio: "RYT-500 certified yoga instructor with deep knowledge of Vinyasa and Hatha traditions.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop", certifications: ["RYT-500", "Pilates"] },
  { name: "Emeka Agu", specialty: "Cardio & Endurance", rating: 4.7, bio: "Marathon runner and endurance coach. Passionate about pushing physical limits.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop", certifications: ["ACE-CPT", "HIIT Specialist"] },
];

const Trainers = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">World-Class Coaches</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground">OUR TRAINERS</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trainers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl overflow-hidden border border-border group"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-2xl text-foreground">{t.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm text-primary font-medium">{t.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-primary font-medium mb-3">{t.specialty}</p>
                <p className="text-sm text-muted-foreground mb-4">{t.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.certifications.map((c) => (
                    <span key={c} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground flex items-center gap-1">
                      <Award className="h-3 w-3" /> {c}
                    </span>
                  ))}
                </div>
                <Button variant="hero" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" /> Book Session
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Trainers;
