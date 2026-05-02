import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const guides = [
  {
    slug: "battery-sizing",
    title: "How to size a campervan battery system",
    excerpt: "Work out your daily Wh consumption, pick autonomy days, and translate it all into the right Ah at 12V.",
  },
  {
    slug: "solar-sizing",
    title: "Campervan solar sizing explained",
    excerpt: "How climate, season, panel orientation and roof space decide how many watts of solar you actually need.",
  },
  {
    slug: "shore-vs-inverter",
    title: "Shore power vs inverter in a campervan",
    excerpt: "When to add an inverter, when to rely on shore power, and how to combine the two cleanly.",
  },
  {
    slug: "12v-vs-230v",
    title: "12V vs 230V campervan appliances",
    excerpt: "A practical guide to picking 12V native appliances vs running 230V kit through an inverter.",
  },
  {
    slug: "tiers",
    title: "Low cost vs balanced vs premium campervan electrical setups",
    excerpt: "What you actually get when you spend more on batteries, MPPTs, inverters and DC-DC chargers.",
  },
];

export default function Guides() {
  return (
    <SiteLayout
      title="Vanlife Electrical Guides — Vanlectric"
      description="Simple guides explaining 12V systems, 230V shore power, cable sizing, fuses, batteries, solar panels and campervan electrical safety."
    >
      <PageHero
        eyebrow="Guides"
        title="Campervan electrical guides"
        subtitle="Practical, beginner-friendly articles for DIY van builders. Every guide links back to the planner so you can apply what you learn."
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl grid sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            className="step-card p-5 hover:bg-card/70 transition-colors group"
          >
            <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary">
              {g.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{g.excerpt}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-sans">
              Read more <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </SiteLayout>
  );
}
