import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Mail, Check } from "lucide-react";

interface EmailReportModalProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "vec_email_report_requests";

export const EmailReportModal = ({ open, onClose }: EmailReportModalProps) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setConsent(false);
      setConfirmed(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !consent) return;
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (!existing.includes(trimmed)) existing.push(trimmed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([trimmed]));
    }
    setConfirmed(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-background rounded-xl shadow-xl border border-border p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-2 tracking-tight">
              Email me the report
            </h2>
            <div className="h-px w-12 bg-primary/40 mb-4" />
            <p className="text-sm text-foreground/90 leading-relaxed mb-5">
              We'll save your email and send you the full report when our PRO email feature
              launches. Free — no account required.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <label className="flex items-start gap-2 text-xs font-sans text-foreground/85 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                />
                <span>
                  I agree to receive occasional emails about Vanlectric PRO launch and updates.
                  I can unsubscribe anytime.{" "}
                  <Link to="/privacy" className="text-primary hover:underline" onClick={onClose}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                disabled={!consent || !email.includes("@")}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" /> Send me the report
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mb-3 flex justify-center" aria-hidden>
              <Check className="w-8 h-8 text-primary" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            </div>
            <p className="font-display text-xl font-bold text-primary mb-2">Thanks!</p>
            <p className="text-sm text-muted-foreground mb-5">
              We'll notify you when PRO launches with your full report.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
