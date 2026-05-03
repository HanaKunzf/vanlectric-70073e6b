import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Battery, Sun, Plug, Calculator, ShieldCheck, BookOpen } from "lucide-react";
import { SiteLayout, Seo } from "@/components/site/SiteLayout";
import heroImage from "@/assets/hero-van-mountains.png";
import { ContinueLastCard } from "@/components/ui/ContinueLastCard";
import { PlannerLink } from "@/components/ui/PlannerLink";
import { hasLastCalculation } from "@/services/localCalculation";

export default function Home() {
  const [hasSaved, setHasSaved] = useState<boolean>(() => hasLastCalculation());

  return (
    <SiteLayout>
      <Seo
        title="Vanlectric — Free Vanlife Electrical Calculator"
        description="Plan your campervan electrical system. Calculate battery size, solar panels, DC-DC charging, shore power and inverter needs."
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="relative container mx-auto px-4 pt-8 pb-6 sm:pt-12 sm:pb-10 max-w-5xl text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur text-xs font-sans tracking-wide text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              12V · Off-grid · DIY campervan electrics
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-xs font-sans tracking-wide text-accent font-semibold"
              title="Vanlectric is in public beta — built by vanlifers, refined with real builds."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden />
              Built by vanlifers · public beta
            </span>
          </div>
          <h1 className="font-display font-bold tracking-tight">
            <span className="block text-primary italic text-5xl sm:text-6xl md:text-7xl leading-[1.05]">
              Vanlectric
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl mt-2 text-foreground font-semibold leading-snug">
              Plan your campervan electrical system with confidence.
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Size your <strong>battery</strong>, <strong>solar</strong>, <strong>inverter</strong> and{" "}
            <strong>shore power</strong> — with an indicative component shopping list, in about 10 minutes.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <PlannerLink
              to="/planner"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-base px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary-hover))] active:scale-[0.98] transition"
            >
              Start planning <ArrowRight className="w-4 h-4" />
            </PlannerLink>
            <Link
              to="/electrical-guide"
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-sans font-semibold text-base px-6 py-3 rounded-lg hover:bg-card/70 transition"
            >
              <BookOpen className="w-4 h-4" /> Electrical Guide
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <img
              src={heroImage}
              alt="Pencil sketch of a campervan parked in a mountain landscape"
              className="w-auto max-h-[200px] sm:max-h-[260px] md:max-h-[300px] object-contain"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* CONTINUE LAST CALCULATION */}
      {hasSaved && (
        <section className="container mx-auto px-4 pt-8 pb-2 max-w-3xl">
          <ContinueLastCard onCleared={() => setHasSaved(false)} />
        </section>
      )}

      {/* WHAT IT CALCULATES */}
      <section className="container mx-auto px-4 py-14 max-w-5xl">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-8 tracking-tight">
          What Vanlectric calculates
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Battery, title: "Battery capacity", text: "Daily Wh consumption + autonomy days = recommended Ah at 12V." },
            { icon: Sun, title: "Solar size", text: "Panel wattage based on your climate, season and roof space." },
            { icon: Plug, title: "Inverter size", text: "Sized to your real 230V appliance peak loads — not guesswork." },
            { icon: Calculator, title: "Indicative cost", text: "Component shopping list with low-cost, balanced and premium tiers." },
          ].map((b) => (
            <div key={b.title} className="step-card p-5">
              <b.icon className="w-6 h-6 text-primary mb-3" />
              <div className="font-display font-semibold text-lg mb-1">{b.title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-card/40 border-y border-border">
        <div className="container mx-auto px-4 py-14 max-w-5xl">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-8 tracking-tight">
            Built for DIY van builders
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Plain English", d: "No engineering jargon. Clear explanations of every recommendation." },
              { t: "Realistic appliances", d: "Pick from typical fridges, induction hobs, laptops and heaters." },
              { t: "Three tiers", d: "Compare low-cost, balanced and premium component setups instantly." },
            ].map((b) => (
              <div key={b.t} className="step-card p-5">
                <div className="font-display font-semibold text-lg mb-1">{b.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY PREVIEW */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="step-card p-6 flex gap-4 items-start">
          <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-display font-semibold text-lg mb-1">Safety first</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vanlectric provides indicative sizing and shopping guidance only. It does not replace a
              qualified electrician or local legal requirements. Always verify cable sizing, fusing
              and component compatibility before installation.{" "}
              <Link to="/disclaimer" className="text-primary underline underline-offset-2">Read full disclaimer</Link>.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <PlannerLink
            to="/planner"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-base px-7 py-3.5 rounded-lg hover:bg-[hsl(var(--primary-hover))]"
          >
            Start planning your van <ArrowRight className="w-4 h-4" />
          </PlannerLink>
        </div>
      </section>
    </SiteLayout>
  );
}
