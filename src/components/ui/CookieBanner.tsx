import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { readConsent, writeConsent } from "@/lib/consent";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setShow(readConsent() === null);
  }, []);

  if (!show) return null;

  const acceptAll = () => {
    writeConsent({ analytics: true });
    setShow(false);
  };
  const rejectAll = () => {
    writeConsent({ analytics: false });
    setShow(false);
  };
  const savePrefs = () => {
    writeConsent({ analytics });
    setShow(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card shadow-[0_-4px_12px_-6px_hsl(var(--foreground)/0.15)]"
      role="region"
      aria-label="Cookie and privacy preferences"
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        {!prefsOpen ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm font-sans text-primary flex-1 leading-relaxed inline-flex items-start gap-2">
              <BrandIcon name="cookie" size="sm" tone="primary" className="mt-0.5" />
              <span>
                We use cookies necessary for the calculator to work. With your consent we also use
                privacy-friendly analytics (Plausible) to improve the site. No advertising, no
                cross-site tracking.{" "}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-accent">
                  Read more
                </Link>
                .
              </span>
            </p>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:justify-end">
              <button
                type="button"
                onClick={() => setPrefsOpen(true)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-primary hover:bg-muted/50 transition-colors font-sans font-semibold text-sm min-h-[40px]"
              >
                Preferences
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-primary hover:bg-muted/50 transition-colors font-sans font-semibold text-sm min-h-[40px]"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[40px]"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="font-display font-semibold text-primary">Cookie preferences</div>
            <div className="grid gap-2 text-sm">
              <label className="flex items-start gap-3 p-3 rounded-md border border-border bg-background/50 cursor-not-allowed opacity-90">
                <input type="checkbox" checked readOnly className="mt-1" aria-label="Necessary cookies (always on)" />
                <div>
                  <div className="font-semibold text-foreground">Necessary</div>
                  <div className="text-xs text-muted-foreground">
                    Required for the planner to remember your inputs locally. Always on.
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-md border border-border bg-background/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-foreground">Anonymous analytics</div>
                  <div className="text-xs text-muted-foreground">
                    Plausible — page views only, no personal data, no cross-site tracking.
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPrefsOpen(false)}
                className="px-3 py-2 rounded-lg border border-border text-primary hover:bg-muted/50 font-sans font-semibold text-sm min-h-[40px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] font-sans font-semibold text-sm min-h-[40px]"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
