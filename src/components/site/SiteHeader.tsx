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
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
            aria-label="Vanlectric home"
          >
            <img
              src="/logo-transparent.png"
              alt="Vanlectric"
              className="h-10 sm:h-11 lg:h-14 w-auto"
              decoding="async"
            />
            <span className="sr-only">Vanlectric</span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
            aria-label="Primary"
          >
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
                      "px-2.5 py-2 rounded-md text-sm font-sans font-medium outline-none",
                      "text-primary transition-colors duration-150",
                      "hover:text-accent",
                      "focus-visible:ring-2 focus-visible:ring-accent/40",
                      isActive && !hash && "text-accent",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              );
            })}
            <a
              href="mailto:hello@vanlectric.com"
              className="px-2.5 py-2 rounded-md text-sm font-sans font-medium text-primary transition-colors duration-150 hover:text-accent outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Contact
            </a>
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
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-primary transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
