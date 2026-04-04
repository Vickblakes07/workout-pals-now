import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClassesPreview from "@/components/ClassesPreview";
import TrainersPreview from "@/components/TrainersPreview";
import MembershipPreview from "@/components/MembershipPreview";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ClassesPreview />
    <TrainersPreview />
    <MembershipPreview />
    <Footer />
  </div>
);

export default Index;
