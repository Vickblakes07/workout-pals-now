import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Zap, Wind, Waves, Swords, Heart, Clock, Users } from "lucide-react";
import { useState } from "react";

const allClasses = [
  { name: "HIIT Blast", icon: Flame, time: "Mon/Wed/Fri 6:00 AM", slots: 5, intensity: "High", duration: "45 min", trainer: "Tunde Bakare", description: "High-intensity interval training to torch calories and build endurance." },
  { name: "Power Lifting", icon: Zap, time: "Tue/Thu 7:00 AM", slots: 8, intensity: "Extreme", duration: "60 min", trainer: "Adaeze Okoro", description: "Master the deadlift, squat, and bench press with expert coaching." },
  { name: "Yoga Flow", icon: Wind, time: "Daily 8:00 AM", slots: 12, intensity: "Low", duration: "60 min", trainer: "Chinelo Nwankwo", description: "Find your inner peace with flowing sequences and deep stretches." },
  { name: "Aqua Fitness", icon: Waves, time: "Mon/Wed 5:00 PM", slots: 10, intensity: "Medium", duration: "45 min", trainer: "Emeka Agu", description: "Low-impact water-based exercises for full-body conditioning." },
  { name: "Boxing", icon: Swords, time: "Tue/Thu/Sat 6:00 PM", slots: 6, intensity: "High", duration: "60 min", trainer: "Tunde Bakare", description: "Learn boxing fundamentals while getting an incredible workout." },
  { name: "Cardio Dance", icon: Heart, time: "Fri/Sat 10:00 AM", slots: 15, intensity: "Medium", duration: "50 min", trainer: "Chinelo Nwankwo", description: "Dance your way to fitness with high-energy choreography." },
];

const Classes = () => {
  const [filter, setFilter] = useState("All");
  const levels = ["All", "Low", "Medium", "High", "Extreme"];
  const filtered = filter === "All" ? allClasses : allClasses.filter((c) => c.intensity === filter);

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
            {levels.map((l) => (
              <Button key={l} variant={filter === l ? "hero" : "secondary"} size="sm" onClick={() => setFilter(l)}>
                {l}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filtered.map((cls, i) => (
              <motion.div
                key={cls.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cls.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-foreground">{cls.name}</h3>
                    <span className="text-xs text-muted-foreground">with {cls.trainer}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{cls.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cls.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls.slots} slots</span>
                  <span className={`px-2 py-0.5 rounded-full ${cls.intensity === "High" || cls.intensity === "Extreme" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {cls.intensity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{cls.time}</span>
                  <Button variant="hero" size="sm">Book Now</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Classes;
