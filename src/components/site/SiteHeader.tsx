import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavMenu } from "./NavMenu";
import { PlannerLink } from "@/components/ui/PlannerLink";
import { cn } from "@/lib/utils";

type DesktopLink = {
  to: string;
  label: string;
  planner?: boolean;
};

const desktopLinks: DesktopLink[] = [
  { to: "/planner", label: "Start planning", planner: true },
  { to: "/electrical-guide", label: "Electrical Guide" },
  { to: "/electrical-guide#basics", label: "Basics" },
  { to: "/electrical-guide#big-picture", label: "Components" },
  { to: "/electrical-guide#cable-chart", label: "Cable sizing" },
  { to: "/checklist", label: "Before you buy" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    const [path, hash] = to.split("#");
    if (hash) return location.pathname === path && location.hash === `#${hash}`;
    return location.pathname === path && !location.hash;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b transition-shadow duration-200",
          // Translucent warm cream + Apple-style blur
          "bg-[hsl(var(--background)/0.78)] supports-[backdrop-filter]:bg-[hsl(var(--background)/0.65)]",
          "backdrop-blur-md backdrop-saturate-150",
          scrolled
            ? "border-border/80 shadow-[0_1px_0_0_hsl(var(--border)),0_4px_14px_-8px_rgba(0,0,0,0.10)]"
            : "border-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="container mx-auto px-4 h-16 md:h-[72px] flex items-center justify-between gap-3 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
            aria-label="Vanlectric home"
          >
            <img
              src="/logo-transparent.png"
              alt="Vanlectric"
              className="h-9 sm:h-10 lg:h-12 w-auto"
              decoding="async"
            />
            <span className="sr-only">Vanlectric</span>
          </Link>

          {/* Desktop inline nav (lg+) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-1 min-w-0 flex-1 justify-end mr-2"
          >
            {desktopLinks.slice(1).map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-sans font-medium whitespace-nowrap",
                  "text-primary/85 hover:text-accent transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                  isActive(item.to) && "text-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <PlannerLink
              to="/planner"
              className="hidden sm:inline-flex items-center bg-primary text-primary-foreground text-sm font-sans font-semibold px-4 py-2 rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors whitespace-nowrap"
            >
              Start planning
            </PlannerLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-sans font-semibold text-primary transition-colors duration-150 hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <NavMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};
