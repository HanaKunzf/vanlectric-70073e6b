import { Link } from "react-router-dom";
import { ArrowRight, Battery, Sun, Plug, Calculator, ShieldCheck, BookOpen } from "lucide-react";
import { SiteLayout, Seo } from "@/components/site/SiteLayout";
import heroImage from "@/assets/hero-van-mountains.png";

export default function Home() {
  return (
    <SiteLayout>
      <Seo
        title="Vanlectric — Plan your campervan electrical system with confidence"
        description="Free campervan electrical planner. Size your battery, solar, inverter and shore power, with indicative component costs. Built for DIY van builders."
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="relative container mx-auto px-4 py-12 sm:py-20 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur text-xs font-sans tracking-wide text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            12V · Off-grid · DIY campervan electrics
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight">
            <span className="block text-primary italic">Vanlectric</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-3 text-foreground">
              Plan your campervan electrical system with confidence.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Vanlectric helps you size your <strong>battery capacity</strong>, <strong>solar array</strong>,{" "}
            <strong>inverter</strong> and <strong>shore power</strong> needs, and gives you an{" "}
            <strong>indicative component shopping list</strong> — all in about 10 minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-base px-7 py-3.5 rounded-lg hover:bg-[hsl(var(--primary-hover))] active:scale-[0.98] transition"
            >
              Start planning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-sans font-semibold text-base px-7 py-3.5 rounded-lg hover:bg-card/70 transition"
            >
              <BookOpen className="w-4 h-4" /> Read the guide
            </Link>
          </div>

          <div className="mt-10 flex justify-center">
            <img
              src={heroImage}
              alt="Pencil sketch of a campervan parked in a mountain landscape"
              className="w-auto max-h-[260px] sm:max-h-[340px] object-contain"
            />
          </div>
        </div>
      </section>

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
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-base px-7 py-3.5 rounded-lg hover:bg-[hsl(var(--primary-hover))]"
          >
            Start planning your van <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
