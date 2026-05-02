import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
}

const mobilePrimary = [
  { to: "/planner", label: "Start planning" },
  { to: "/electrical-guide", label: "Electrical Guide" },
  { to: "/electrical-guide#basics", label: "Learn the basics" },
  { to: "/electrical-guide#big-picture", label: "Components & systems" },
  { to: "/electrical-guide#cable-chart", label: "Cable sizing" },
  { to: "/checklist", label: "Before you buy" },
];

const utility = [
  { to: "/about", label: "About" },
  { to: "mailto:hello@vanlectric.com", label: "Contact", external: true },
  { to: "/privacy", label: "Privacy" },
];

const learnLinks = [
  { to: "/electrical-guide", label: "Electrical Guide" },
  { to: "/electrical-guide#basics", label: "Learn the basics" },
  { to: "/electrical-guide#big-picture", label: "Components & systems" },
  { to: "/electrical-guide#cable-chart", label: "Cable sizing" },
  { to: "/checklist", label: "Before you buy" },
];

const planLinks = [
  { to: "/planner", label: "Start planning" },
  { to: "/planner", label: "Recalculate" },
  { to: "#", label: "Saved designs", muted: "PRO — coming soon" },
];

export const NavMenu = ({ open, onClose }: NavMenuProps) => {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  // ESC + body scroll lock + focus trap
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // initial focus
    setTimeout(() => firstFocusableRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isActive = (to: string) => {
    const [path] = to.split("#");
    return location.pathname === path;
  };

  const renderLink = (
    item: { to: string; label: string; external?: boolean },
    className: string,
    activeClass = "",
  ) => {
    if (item.external) {
      return (
        <a
          key={item.label}
          href={item.to}
          className={className}
          onClick={onClose}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link
        key={item.to + item.label}
        to={item.to}
        onClick={onClose}
        className={cn(className, isActive(item.to) && activeClass)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <button
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 w-full h-full",
          "bg-[hsl(var(--background)/0.55)] backdrop-blur-md",
          "transition-opacity duration-200 motion-reduce:transition-none",
        )}
      />

      {/* MOBILE: full-screen overlay */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "md:hidden absolute inset-0 flex flex-col bg-background",
          "transition-all duration-200 motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center"
            aria-label="Vanlectric home"
          >
            <img src="/logo-transparent.png" alt="Vanlectric" className="h-7 w-auto" />
          </Link>
          <button
            ref={firstFocusableRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 -mr-2 rounded-md text-primary hover:bg-card transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 flex flex-col px-6 py-2 min-h-0 overflow-y-auto">
          <ul className="flex-1 flex flex-col justify-center divide-y divide-border">
            {mobilePrimary.map((item) => (
              <li key={item.to + item.label}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "block py-2.5 font-display font-semibold text-[20px] leading-tight tracking-tight text-primary",
                    "transition-colors hover:text-[hsl(var(--primary-hover))]",
                    isActive(item.to) && "text-accent",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Utility */}
          <div className="pt-3 pb-2 mt-2 border-t border-border flex items-center justify-center gap-5 text-xs font-sans text-muted-foreground flex-shrink-0">
            {utility.map((u) =>
              u.external ? (
                <a key={u.label} href={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                  {u.label}
                </a>
              ) : (
                <Link key={u.to} to={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                  {u.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      </div>

      {/* TABLET: centered floating panel (2 columns) */}
      <div
        className={cn(
          "hidden md:flex lg:hidden absolute inset-0 items-start justify-center px-6 pt-20",
          "transition-all duration-200 motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="w-[90%] max-w-[760px] rounded-2xl border border-border bg-card shadow-[var(--shadow-card-hover)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 h-14 border-b border-border">
            <span className="font-display italic font-bold text-base text-primary">Vanlectric</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="p-2 -mr-2 rounded-md text-primary hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-8 p-7">
            <div>
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Learn
              </div>
              <ul className="space-y-2.5">
                {learnLinks.map((l) =>
                  renderLink(
                    l,
                    "block font-display font-semibold text-lg text-primary hover:text-[hsl(var(--primary-hover))] transition-colors",
                    "text-accent",
                  ),
                )}
              </ul>
            </div>
            <div className="flex flex-col">
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Featured
              </div>
              <p className="text-sm font-sans text-foreground/80 leading-relaxed mb-4">
                Plan your campervan electrical system with clear guidance, realistic sizing and a practical shopping list.
              </p>
              <Link
                to="/planner"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-sm px-4 py-2.5 rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors"
              >
                Start planning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/electrical-guide"
                onClick={onClose}
                className="mt-3 text-sm font-sans text-primary underline underline-offset-2 hover:text-[hsl(var(--primary-hover))]"
              >
                Read the Electrical Guide
              </Link>
              <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-x-4 gap-y-2 text-xs font-sans text-muted-foreground">
                {utility.map((u) =>
                  u.external ? (
                    <a key={u.label} href={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                      {u.label}
                    </a>
                  ) : (
                    <Link key={u.to} to={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                      {u.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP: floating mega-menu (3 columns) */}
      <div
        className={cn(
          "hidden lg:flex absolute inset-0 items-start justify-end px-6 pt-16",
          "transition-all duration-200 motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="w-full max-w-[920px] rounded-2xl border border-border bg-card shadow-[var(--shadow-card-hover)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-7 h-14 border-b border-border">
            <span className="font-display italic font-bold text-base text-primary">Vanlectric</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="p-2 -mr-2 rounded-md text-primary hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-8 p-8">
            {/* Plan */}
            <div>
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Plan
              </div>
              <ul className="space-y-2.5">
                {planLinks.map((p) =>
                  p.muted ? (
                    <li key={p.label}>
                      <span className="block font-display font-semibold text-lg text-foreground/40 cursor-not-allowed">
                        {p.label}
                        <span className="block text-[11px] font-sans uppercase tracking-[0.15em] text-accent/70 font-semibold mt-0.5">
                          {p.muted}
                        </span>
                      </span>
                    </li>
                  ) : (
                    <li key={p.to + p.label}>
                      <Link
                        to={p.to}
                        onClick={onClose}
                        className={cn(
                          "block font-display font-semibold text-lg text-primary hover:text-[hsl(var(--primary-hover))] transition-colors",
                          isActive(p.to) && "text-accent",
                        )}
                      >
                        {p.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Learn
              </div>
              <ul className="space-y-2.5">
                {learnLinks.map((l) =>
                  renderLink(
                    l,
                    "block font-display font-semibold text-lg text-primary hover:text-[hsl(var(--primary-hover))] transition-colors",
                    "text-accent",
                  ),
                )}
              </ul>
            </div>

            {/* Featured */}
            <div className="flex flex-col">
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Featured
              </div>
              <p className="text-sm font-sans text-foreground/80 leading-relaxed mb-4">
                Plan your campervan electrical system with clear guidance, realistic sizing and a practical shopping list.
              </p>
              <Link
                to="/planner"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-sans font-semibold text-sm px-4 py-2.5 rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors"
              >
                Start planning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/electrical-guide"
                onClick={onClose}
                className="mt-3 text-sm font-sans text-primary underline underline-offset-2 hover:text-[hsl(var(--primary-hover))]"
              >
                Read the Electrical Guide
              </Link>
            </div>
          </div>
          <div className="px-8 py-3 border-t border-border bg-background/40 flex flex-wrap gap-x-5 gap-y-2 text-xs font-sans text-muted-foreground">
            {utility.map((u) =>
              u.external ? (
                <a key={u.label} href={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                  {u.label}
                </a>
              ) : (
                <Link key={u.to} to={u.to} onClick={onClose} className="hover:text-primary transition-colors">
                  {u.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
