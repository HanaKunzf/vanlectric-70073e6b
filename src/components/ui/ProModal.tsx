import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Mail } from "lucide-react";

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "vec_pro_notify_email";

export const ProModal = ({ open, onClose }: ProModalProps) => {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setShowInput(false);
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
    if (!trimmed || !trimmed.includes("@")) return;
    if (!consent) return;
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

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-2 tracking-tight">
          PRO — Coming Soon
        </h2>
        <div className="h-px w-12 bg-primary/40 mb-4" />

        {!confirmed ? (
          <>
            <p className="text-sm text-foreground/90 leading-relaxed mb-5">
              We're working on PRO features including PDF export, saved designs, and existing system
              analysis. The calculator is free to use and your results are always available on screen.
            </p>
            <p className="text-sm font-sans font-semibold text-foreground mb-4">
              Want to know when PRO launches?
            </p>

            {!showInput ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowInput(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px]"
                >
                  <Mail className="w-4 h-4" /> Notify me
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors font-sans font-semibold text-sm min-h-[44px]"
                >
                  Maybe later
                </button>
              </div>
            ) : (
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
                    I agree to receive occasional emails about the Vanlectric PRO launch and
                    updates. I can unsubscribe anytime.{" "}
                    <Link to="/privacy" className="text-primary hover:underline" onClick={onClose}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!consent}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-3" aria-hidden>✉️</div>
            <p className="font-display text-xl font-bold text-primary mb-2">We'll let you know!</p>
            <p className="text-sm text-muted-foreground mb-5">
              Thanks — we've saved your email and will reach out when PRO launches.
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
