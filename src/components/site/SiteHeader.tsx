import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, Zap } from "lucide-react";
import { NavMenu } from "./NavMenu";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
            <Zap className="w-5 h-5" aria-hidden />
            <span className="italic">Vanlectric</span>
          </Link>

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
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-sans font-medium text-primary hover:bg-card transition-colors"
            >
              <Menu className="w-5 h-5" aria-hidden />
              <span className="hidden md:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <NavMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};
