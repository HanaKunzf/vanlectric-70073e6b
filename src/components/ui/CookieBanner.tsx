import { useEffect, useState } from "react";

const KEY = "vanlectric-cookie-consent";
const LEGACY_KEY = "vanlectric_cookie_dismissed";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY) && !localStorage.getItem(LEGACY_KEY)) setShow(true);
    } catch {
      // ignore
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card shadow-[0_-4px_12px_-6px_hsl(var(--foreground)/0.15)]"
      role="region"
      aria-label="Cookie notice"
    >
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs sm:text-sm font-sans text-primary flex-1 leading-relaxed">
          🍪 Vanlectric uses only technical cookies necessary for the calculator to work.
          No tracking or advertising cookies.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[40px]"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
