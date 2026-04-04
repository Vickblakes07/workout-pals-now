import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₦15,000",
    period: "/month",
    features: ["Access to gym floor", "2 group classes/week", "Locker access", "Basic fitness assessment"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₦30,000",
    period: "/month",
    features: ["Unlimited gym access", "All group classes", "1 PT session/month", "Nutrition guide", "Sauna & pool"],
    popular: true,
  },
  {
    name: "Elite",
    price: "₦250,000",
    period: "/year",
    features: ["Everything in Pro", "4 PT sessions/month", "Priority booking", "Guest passes", "Exclusive events"],
    popular: false,
  },
];

const MembershipPreview = () => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Pricing</p>
        <h2 className="font-display text-5xl md:text-6xl text-foreground">MEMBERSHIP PLANS</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-xl p-8 border ${
              plan.popular
                ? "border-primary shadow-glow bg-secondary/80 relative"
                : "border-border bg-secondary/30"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="font-display text-2xl text-foreground mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="font-display text-4xl text-gradient">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/membership">
              <Button variant={plan.popular ? "hero" : "heroOutline"} className="w-full">
                Choose Plan
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MembershipPreview;
