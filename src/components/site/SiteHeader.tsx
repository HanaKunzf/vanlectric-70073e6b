import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { NavMenu } from "./NavMenu";
import { cn } from "@/lib/utils";

const desktopLinks = [
  { to: "/electrical-guide", label: "Electrical Guide" },
  { to: "/electrical-guide#basics", label: "Learn the basics" },
  { to: "/electrical-guide#big-picture", label: "Components & systems" },
  { to: "/electrical-guide#cable-chart", label: "Cable sizing" },
  { to: "/checklist", label: "Before you buy" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 h-16 lg:h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Vanlectric home">
            <img
              src="/logo-transparent.png"
              alt="Vanlectric"
              className="h-8 lg:h-10 w-auto"
            />
            <span className="sr-only">Vanlectric</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Primary">
            {desktopLinks.map((l) => {
              const [path, hash] = l.to.split("#");
              const to = hash ? { pathname: path, hash: `#${hash}` } : l.to;
              return (
                <NavLink
                  key={l.label}
                  to={to as string}
                  end={!hash}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-sans font-medium transition-colors outline-none",
                      "text-primary hover:text-accent focus-visible:text-accent",
                      "focus-visible:ring-2 focus-visible:ring-accent/40",
                      isActive && !hash && "text-accent",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/planner"
              className="hidden sm:inline-flex items-center bg-primary text-primary-foreground text-sm font-sans font-semibold px-4 py-2 rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors"
            >
              Start planning
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors"
            >
              <Menu className="w-6 h-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <NavMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};
