import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MembershipPreview from "@/components/MembershipPreview";
import { motion } from "framer-motion";

const Membership = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Choose Your Plan</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground">MEMBERSHIP</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Join the IronForge family. Every plan includes access to our state-of-the-art facility and supportive community.
          </p>
        </motion.div>
      </div>
      <MembershipPreview />
    </div>
    <Footer />
  </div>
);

export default Membership;
