import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flame, Zap, Wind, Waves, Swords, Heart } from "lucide-react";

const classes = [
  { name: "HIIT Blast", icon: Flame, time: "Mon/Wed/Fri 6:00 AM", slots: 5, intensity: "High" },
  { name: "Power Lifting", icon: Zap, time: "Tue/Thu 7:00 AM", slots: 8, intensity: "Extreme" },
  { name: "Yoga Flow", icon: Wind, time: "Daily 8:00 AM", slots: 12, intensity: "Low" },
  { name: "Aqua Fitness", icon: Waves, time: "Mon/Wed 5:00 PM", slots: 10, intensity: "Medium" },
  { name: "Boxing", icon: Swords, time: "Tue/Thu/Sat 6:00 PM", slots: 6, intensity: "High" },
  { name: "Cardio Dance", icon: Heart, time: "Fri/Sat 10:00 AM", slots: 15, intensity: "Medium" },
];

const ClassesPreview = () => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Our Programs</p>
        <h2 className="font-display text-5xl md:text-6xl text-foreground">CLASSES</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, i) => (
          <motion.div
            key={cls.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary/50 rounded-lg p-6 border border-border hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <cls.icon className="h-6 w-6 text-primary" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                cls.intensity === "High" || cls.intensity === "Extreme"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {cls.intensity}
              </span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-1">{cls.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{cls.time}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{cls.slots} slots left</span>
              <Link to="/classes">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                  Book →
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/classes">
          <Button variant="heroOutline" size="lg">View All Classes</Button>
        </Link>
      </div>
    </div>
  </section>
);

export default ClassesPreview;
