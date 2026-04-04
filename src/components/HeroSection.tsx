import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-gym.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Gym interior" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>

    <div className="relative z-10 container mx-auto px-4 text-center pt-16">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-primary font-semibold tracking-widest uppercase text-sm mb-4"
      >
        Welcome to IronForge
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-none mb-6"
      >
        FORGE YOUR
        <br />
        <span className="text-gradient">STRENGTH</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8 font-body"
      >
        Premium training, world-class coaches, and a community that pushes you beyond your limits.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/membership">
          <Button variant="hero" size="lg" className="text-lg px-10">
            Start Your Journey
          </Button>
        </Link>
        <Link to="/classes">
          <Button variant="heroOutline" size="lg" className="text-lg px-10">
            View Classes
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16"
      >
        {[
          { val: "500+", label: "Members" },
          { val: "20+", label: "Trainers" },
          { val: "50+", label: "Classes" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl md:text-4xl text-gradient">{s.val}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
