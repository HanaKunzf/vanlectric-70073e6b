import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  /** Extra bottom offset in px (e.g. when a sticky bottom action bar is present). */
  bottomOffset?: number;
}

/**
 * Mobile-only floating "Back to top" button.
 * Hidden on md+ screens (sticky header is enough there).
 */
export const BackToTop = ({ bottomOffset = 0 }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      style={{ bottom: `${16 + bottomOffset}px` }}
      className={`md:hidden fixed right-4 z-40 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-opacity duration-200 hover:bg-[hsl(var(--primary-hover))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
