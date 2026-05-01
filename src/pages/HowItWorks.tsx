import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

const steps = [
  {
    n: 1,
    title: "Add your appliances",
    text: "Pick the appliances you'll actually use — fridge, lights, laptop, induction hob, heater, etc. Vanlectric uses realistic power figures so you don't have to guess.",
  },
  {
    n: 2,
    title: "Choose how each appliance is powered",
    text: "Mark every appliance as 12V, 230V via inverter or 230V shore-only. Shore-only loads (kettles, hairdryers) won't drain your battery off-grid.",
  },
  {
    n: 3,
    title: "Set your autonomy and component tier",
    text: "Tell us how many days off-grid you need and pick low-cost, balanced or premium components. The planner adjusts every recommendation accordingly.",
  },
  {
    n: 4,
    title: "Review your recommendations",
    text: "Get sized recommendations for battery capacity, solar wattage, inverter size and shore power, plus an indicative shopping list grouped by installation area.",
  },
];

export default function HowItWorks() {
  return (
    <SiteLayout
      title="How Vanlectric works — campervan electrical planning in 4 steps"
      description="Four-step campervan electrical planner: add appliances, choose 12V or 230V, pick your component tier, and get battery, solar and inverter sizing."
    >
      <PageHero
        eyebrow="How it works"
        title="From appliances to a sized system in 4 steps"
        subtitle="Vanlectric walks you through the same questions a van electrician would ask — but in plain English."
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <ol className="space-y-5">
          {steps.map((s) => (
            <li key={s.n} className="step-card p-5 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-bold flex items-center justify-center">
                {s.n}
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold px-7 py-3.5 rounded-lg hover:bg-[hsl(var(--primary-hover))]"
          >
            Open the planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
