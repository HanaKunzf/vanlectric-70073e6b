import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Mail } from "lucide-react";
import { subscribeToMailerLite } from "@/services/mailerlite";

interface NotifyModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const NotifyModal = ({
  open,
  onClose,
  title = "Stay in the loop",
  description = "Enter your email and we'll notify you when Vanlectric PRO launches — with PDF export, saved designs, and more.",
}: NotifyModalProps) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setConsent(false);
      setSubmitting(false);
      setConfirmed(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!confirmed) return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [confirmed, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !consent || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await subscribeToMailerLite(trimmed);
      setConfirmed(true);
    } catch (err) {
      console.error("MailerLite subscribe failed:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
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
              {title}
            </h2>
            <div className="h-px w-12 bg-primary/40 mb-4" />
            <p className="text-sm text-foreground/90 leading-relaxed mb-5">{description}</p>

            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
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
                  I agree to receive occasional emails about Vanlectric PRO. Unsubscribe anytime.{" "}
                  <Link to="/privacy" className="text-primary hover:underline" onClick={onClose}>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {error && (
                <p className="text-sm text-destructive font-sans" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!consent || !email.includes("@") || submitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  {submitting ? "Sending…" : "Notify me"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors font-sans font-semibold text-sm min-h-[44px]"
                >
                  Maybe later
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-3" aria-hidden>
              ✓
            </div>
            <p className="font-display text-xl font-bold text-primary mb-2">
              Got it! We'll be in touch when PRO launches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
