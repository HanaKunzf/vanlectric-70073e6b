import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { en } from "@/i18n/en";
import { VanIllustration } from "@/components/illustrations/Illustrations";

export default function Landing() {
  const [hover, setHover] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* hero gradient + grid */}
      <div
        className="absolute inset-0 grid-bg opacity-40 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />

      <main className="relative container mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* tag chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-xs font-display tracking-widest uppercase text-muted-foreground mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          12V · Off-Grid · DIY
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight uppercase max-w-4xl">
          <span className="block">Vanlife Electrical</span>
          <span className="block text-primary">Calculator</span>
        </h1>

        <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {en.app.tagline}
        </p>

        {/* illustration */}
        <div className="my-10 w-full max-w-md text-primary">
          <VanIllustration className="w-full h-auto" />
        </div>

        {/* bullets */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full mb-10">
          {en.landing.bullets.map((b) => (
            <li
              key={b.text}
              className="step-card px-4 py-4 flex items-center gap-3 text-left"
            >
              <span className="text-2xl" aria-hidden>{b.icon}</span>
              <span className="text-sm text-foreground/90">{b.text}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/wizard"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-display uppercase tracking-widest font-semibold text-base sm:text-lg px-8 py-4 rounded-md amber-glow hover:brightness-110 active:scale-[0.98] transition-[filter,transform] min-h-[44px]"
        >
          {en.landing.cta}
          <ArrowRight
            className={`w-5 h-5 transition-transform ${hover ? "translate-x-1" : ""}`}
          />
        </Link>

        <p className="mt-5 text-xs sm:text-sm text-muted-foreground">
          {en.landing.note}
        </p>
      </main>
    </div>
  );
}
