import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { subscribeEmail, isValidEmail, type SubscribeSource } from "@/services/subscribe";

interface Props {
  source: SubscribeSource;
  submitLabel?: string;
  successMessage?: string;
  /** Called after a successful subscription. */
  onSuccess?: () => void;
}

/**
 * Shared subscribe form: email input + GDPR checkbox + submit.
 * - Submit is disabled until a valid email is entered AND the GDPR
 *   checkbox is ticked.
 * - GDPR checkbox is unchecked by default.
 * - Posts to /api/subscribe.php (PHP endpoint on Webkitty).
 */
export const SubscribeForm = ({
  source,
  submitLabel = "Notify me",
  successMessage = "Thanks! You're on the Vanlectric waitlist.",
  onSuccess,
}: Props) => {
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const canSubmit = isValidEmail(email) && gdpr && status !== "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setErrorMsg("");
    const result = await subscribeEmail(email.trim(), source);
    if (result.success) {
      setStatus("success");
      onSuccess?.();
    } else {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div
        className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90 font-sans">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
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

      <label className="flex items-start gap-2 text-xs text-muted-foreground font-sans cursor-pointer">
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          disabled={status === "loading"}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
        />
        <span>
          I agree to receive occasional emails about Vanlectric PRO launch and updates. I can
          unsubscribe anytime.{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
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
            Submitting…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};
