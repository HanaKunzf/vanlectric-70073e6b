import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlannerLink } from "@/components/ui/PlannerLink";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
}

type MenuItem = {
  to: string;
  label: string;
  description: string;
  external?: boolean;
  badge?: string;
  disabled?: boolean;
};

type MenuSection = {
  heading: string;
  items: MenuItem[];
};

const sections: MenuSection[] = [
  {
    heading: "Plan",
    items: [
      {
        to: "/planner",
        label: "Start planning",
        description: "Build your campervan electrical system estimate step by step.",
      },
      {
        to: "/planner",
        label: "Recalculate",
        description: "Adjust your previous inputs and update the result.",
      },
      {
        to: "#",
        label: "Saved designs",
        description: "Save and compare your electrical plans.",
        badge: "PRO — Coming soon",
        disabled: true,
      },
    ],
  },
  {
    heading: "Learn",
    items: [
      {
        to: "/electrical-guide",
        label: "Electrical Guide",
        description: "Understand the main parts of a campervan electrical system.",
      },
      {
        to: "/electrical-guide#basics",
        label: "Learn the basics",
        description: "A simple introduction to batteries, solar, chargers and inverters.",
      },
      {
        to: "/electrical-guide#big-picture",
        label: "Components & systems",
        description: "See what each component does and why it matters.",
      },
      {
        to: "/electrical-guide#cable-chart",
        label: "Cable sizing",
        description: "Learn why cable size, fuse size and distance matter.",
      },
      {
        to: "/checklist",
        label: "Before you buy",
        description: "Checklist of things to verify before ordering components.",
      },
    ],
  },
  {
    heading: "About",
    items: [
      {
        to: "/about",
        label: "About",
        description: "Why Vanlectric exists and what it helps you do.",
      },
      {
        to: "mailto:hello@vanlectric.com",
        label: "Contact",
        description: "Get in touch with questions or feedback.",
        external: true,
      },
      {
        to: "/privacy",
        label: "Privacy",
        description: "How Vanlectric handles data and cookies.",
      },
    ],
  },
];

export const NavMenu = ({ open, onClose }: NavMenuProps) => {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

    setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isActive = (to: string) => {
    if (!to || to === "#") return false;
    const [path, hash] = to.split("#");
    if (hash) return location.pathname === path && location.hash === `#${hash}`;
    return location.pathname === path && !location.hash;
  };

  const renderItem = (item: MenuItem) => {
    const baseTitle =
      "block font-display font-semibold text-[15px] sm:text-lg leading-snug transition-colors duration-150";
    const baseDesc =
      "mt-0.5 text-[11.5px] sm:text-sm font-sans leading-snug sm:leading-relaxed text-muted-foreground";

    if (item.disabled) {
      return (
        <div
          key={item.label}
          className="block py-2.5 px-2 -mx-2 rounded-md cursor-not-allowed select-none"
          aria-disabled="true"
        >
          <span className={cn(baseTitle, "text-foreground/40")}>
            {item.label}
            {item.badge && (
              <span className="ml-2 inline-block align-middle text-[10px] font-sans uppercase tracking-[0.15em] text-accent/80 font-semibold">
                {item.badge}
              </span>
            )}
          </span>
          <span className={cn(baseDesc, "text-muted-foreground/70")}>{item.description}</span>
        </div>
      );
    }

    const titleClass = cn(
      baseTitle,
      "text-primary group-hover:text-accent group-focus-visible:text-accent",
      isActive(item.to) && "text-accent",
    );

    const content = (
      <>
        <span className={titleClass}>
          {item.label}
          {item.badge && (
            <span className="ml-2 inline-block align-middle text-[10px] font-sans uppercase tracking-[0.15em] text-accent font-semibold">
              {item.badge}
            </span>
          )}
        </span>
        <span className={baseDesc}>{item.description}</span>
      </>
    );

    const linkClass =
      "group block py-2 sm:py-2.5 px-2 -mx-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors";

    if (item.external) {
      return (
        <a key={item.label} href={item.to} onClick={onClose} className={linkClass}>
          {content}
        </a>
      );
    }
    if (item.to === "/planner") {
      return (
        <PlannerLink key={item.to + item.label} to={item.to} onClick={onClose} className={linkClass}>
          {content}
        </PlannerLink>
      );
    }
    return (
      <Link key={item.to + item.label} to={item.to} onClick={onClose} className={linkClass}>
        {content}
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
        className="absolute inset-0 w-full h-full bg-[hsl(var(--background)/0.55)] backdrop-blur-md transition-opacity duration-200 motion-reduce:transition-none"
      />

      {/* Panel: floating overlay on mobile, compact dropdown on md+ */}
      <div
        className={cn(
          "absolute inset-0 flex items-start justify-center md:justify-end",
          "px-3 md:px-4 lg:px-6 pt-[max(env(safe-area-inset-top),0.75rem)] md:pt-20",
          "transition-all duration-250 ease-out motion-reduce:transition-none",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-3 md:-translate-y-2 opacity-0",
        )}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={cn(
            "w-full md:w-[400px] lg:w-[420px] md:max-w-[440px]",
            "bg-card rounded-2xl border border-border/70",
            "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] md:shadow-[var(--shadow-card-hover)]",
            "max-h-[80dvh] md:max-h-[calc(100vh-7rem)]",
            "flex flex-col overflow-hidden",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-12 sm:h-14 border-b border-border flex-shrink-0">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
              aria-label="Vanlectric home"
            >
              <img
                src="/logo-transparent.png"
                alt="Vanlectric"
                className="h-7 sm:h-8 w-auto"
                decoding="async"
              />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="p-2 -mr-2 rounded-md text-primary transition-colors duration-150 hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
          </div>

          {/* Scrollable content — single column on every breakpoint for the compact panel */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-3 sm:py-5">
            <div className="grid grid-cols-1 gap-y-5">
              {sections.map((section, idx) => {
                const isAbout = section.heading === "About";
                return (
                  <section
                    key={section.heading}
                    className={cn(isAbout && "hidden md:block")}
                  >
                    <h2 className="text-[10.5px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-accent font-semibold mb-2 sm:mb-3">
                      {section.heading}
                    </h2>
                    <ul className="divide-y divide-border/60 md:divide-y-0 md:space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label} className="md:py-0">
                          {renderItem(item)}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Compact footer (mobile only) — About / Contact / Privacy */}
          <div
            className="md:hidden flex-shrink-0 border-t border-border bg-card/80 px-4 py-3"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
              {sections
                .find((s) => s.heading === "About")
                ?.items.map((item) => {
                  const cls =
                    "text-[12px] font-sans text-muted-foreground hover:text-accent focus-visible:text-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded";
                  if (item.external) {
                    return (
                      <li key={item.label}>
                        <a href={item.to} onClick={onClose} className={cls}>
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      <Link to={item.to} onClick={onClose} className={cls}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
