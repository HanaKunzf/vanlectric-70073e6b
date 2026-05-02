import { useEffect, useState } from "react";
import { X, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { sendReport, isValidEmail } from "@/services/subscribe";

interface EmailReportModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * The user's calculation result. Forwarded to /api/send-report.php so the
   * server can render and email the report. Typed as unknown because the
   * report payload shape is owned by the calculator, not this modal.
   */
  calculation?: unknown;
}

export const EmailReportModal = ({ open, onClose, calculation }: EmailReportModalProps) => {
  const [email, setEmail] = useState("");
  const [reportConsent, setReportConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset form when the modal closes so reopening starts fresh.
  useEffect(() => {
    if (!open) {
      setEmail("");
      setReportConsent(false);
      setMarketingConsent(false);
      setStatus("idle");
      setErrorMsg("");
    }
  }, [open]);

  if (!open) return null;

  const canSubmit =
    isValidEmail(email) && reportConsent && status !== "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setErrorMsg("");
    const result = await sendReport({
      email: email.trim(),
      calculation: calculation ?? null,
      reportConsent: true,
      marketingConsent,
    });
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
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
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-background rounded-xl shadow-xl border border-border p-6 sm:p-8"
        style={{ maxWidth: "min(28rem, calc(100vw - 32px))" }}
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

        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-6 h-6 text-primary" strokeWidth={1.75} />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Email me my calculation
          </h2>
        </div>
        <div className="h-px w-12 bg-primary/40 mb-4" />

        {status === "success" ? (
          <div
            className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground/90 font-sans">
                Thanks! Your calculation report is on its way to{" "}
                <span className="font-semibold">{email}</span>.
              </p>
              <p className="text-xs text-muted-foreground font-sans mt-2">
                If it doesn't arrive within a few minutes, please check your spam folder.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground/90 leading-relaxed mb-5">
              Enter your email and we'll send you a copy of this calculation report. We only
              use this address to deliver the report you just requested.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  disabled={status === "loading"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary min-h-[44px] disabled:opacity-60"
                />
              </label>

              {/* Required: transactional consent for the report itself */}
              <label className="flex items-start gap-2 text-xs text-muted-foreground font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportConsent}
                  onChange={(e) => setReportConsent(e.target.checked)}
                  disabled={status === "loading"}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                />
                <span>
                  I agree that Vanlectric may process my email address to send this calculation
                  report.{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* Optional: marketing opt-in for PRO updates */}
              <label className="flex items-start gap-2 text-xs text-muted-foreground font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  disabled={status === "loading"}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                />
                <span>
                  I also want to receive occasional Vanlectric PRO updates and tips. I can
                  unsubscribe anytime.{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {status === "error" && errorMsg && (
                <p className="text-xs text-destructive font-sans" role="alert">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send me my report"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
