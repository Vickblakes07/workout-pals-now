import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const trainers = [
  { name: "Adaeze Okoro", specialty: "Strength & Conditioning", rating: 4.9, image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop" },
  { name: "Tunde Bakare", specialty: "Boxing & MMA", rating: 4.8, image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop" },
  { name: "Chinelo Nwankwo", specialty: "Yoga & Flexibility", rating: 5.0, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop" },
];

const TrainersPreview = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Expert Coaches</p>
        <h2 className="font-display text-5xl md:text-6xl text-foreground">MEET THE TEAM</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trainers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="group relative rounded-xl overflow-hidden shadow-card"
          >
            <img src={t.image} alt={t.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm text-primary font-medium">{t.rating}</span>
              </div>
              <h3 className="font-display text-2xl text-foreground">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.specialty}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/trainers">
          <Button variant="heroOutline" size="lg">All Trainers</Button>
        </Link>
      </div>
    </div>
  </section>
);

export default TrainersPreview;
