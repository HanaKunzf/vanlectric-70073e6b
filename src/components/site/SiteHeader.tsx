import { Link } from "react-router-dom";
import { useState } from "react";
import { NavMenu } from "./NavMenu";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between gap-3">
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

          {/* Right side: Start planning + Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
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
