import { Dumbbell, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-display text-xl text-foreground">IRONFORGE</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Transform your body and mind. Premium fitness experiences crafted for champions.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Classes", "Trainers", "Membership"].map((l) => (
              <Link key={l} to={`/${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-foreground mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 123 Fitness Ave, Lagos</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +234 800 123 4567</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@ironforge.fit</span>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-foreground mb-4">Follow Us</h4>
          <div className="flex gap-4">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IronForge Gym. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
