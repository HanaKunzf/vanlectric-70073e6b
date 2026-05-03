import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Compass, BookOpen, Home as HomeIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PlannerLink } from "@/components/ui/PlannerLink";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: route not found", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout
      title="Page not found — Vanlectric"
      description="That page doesn't exist. Head back to the planner, the electrical guide, or the home page."
      noindex
    >
      <section className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl text-center">
        <div className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
          404 — page not found
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight">
          This page wandered off the trail.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist, or the link may be out of date.
          Try one of these instead:
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 text-left">
          <Link
            to="/"
            className="step-card p-4 hover:border-primary/40 transition-colors group"
          >
            <HomeIcon className="w-5 h-5 text-accent mb-2" aria-hidden />
            <div className="font-display font-semibold text-primary">Home</div>
            <div className="text-xs text-muted-foreground mt-1">What Vanlectric does</div>
          </Link>
          <PlannerLink
            to="/planner"
            className="step-card p-4 hover:border-primary/40 transition-colors group"
          >
            <Compass className="w-5 h-5 text-accent mb-2" aria-hidden />
            <div className="font-display font-semibold text-primary">Planner</div>
            <div className="text-xs text-muted-foreground mt-1">Size your electrical system</div>
          </PlannerLink>
          <Link
            to="/electrical-guide"
            className="step-card p-4 hover:border-primary/40 transition-colors group"
          >
            <BookOpen className="w-5 h-5 text-accent mb-2" aria-hidden />
            <div className="font-display font-semibold text-primary">Electrical guide</div>
            <div className="text-xs text-muted-foreground mt-1">Learn the basics</div>
          </Link>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary font-sans font-semibold hover:text-accent"
          >
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
