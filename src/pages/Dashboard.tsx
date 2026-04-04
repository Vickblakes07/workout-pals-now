import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, Dumbbell, CreditCard, Trophy } from "lucide-react";

const stats = [
  { label: "Workouts This Month", value: "0", icon: Dumbbell, color: "text-primary" },
  { label: "Classes Booked", value: "0", icon: Calendar, color: "text-emerald-400" },
  { label: "Membership", value: "Free", icon: CreditCard, color: "text-amber-400" },
  { label: "Goals Completed", value: "0", icon: Trophy, color: "text-violet-400" },
];

const Dashboard = () => {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Member";

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

          <div className="glass rounded-xl p-8 text-center">
            <h3 className="font-display text-2xl text-foreground mb-2">YOUR JOURNEY BEGINS</h3>
            <p className="text-muted-foreground">
              Book your first class, explore membership plans, or connect with a trainer to get started!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
