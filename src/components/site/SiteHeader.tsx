import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/planner", label: "Planner" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/guides", label: "Guides" },
  { to: "/checklist", label: "Checklist" },
  { to: "/examples", label: "Examples" },
  { to: "/about", label: "About" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
          <Zap className="w-5 h-5" aria-hidden />
          <span className="italic">Vanlectric</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-sans text-foreground/80 hover:text-primary hover:bg-card transition-colors",
                  isActive && "text-primary bg-card",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/planner"
            className="ml-2 inline-flex items-center bg-primary text-primary-foreground text-sm font-sans font-semibold px-4 py-2 rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors"
          >
            Start planning
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-foreground hover:bg-card"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-sans text-foreground/85",
                    isActive ? "text-primary bg-card" : "hover:bg-card",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/planner"
              className="mt-2 inline-flex items-center justify-center bg-primary text-primary-foreground text-sm font-sans font-semibold px-4 py-2.5 rounded-md"
            >
              Start planning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
