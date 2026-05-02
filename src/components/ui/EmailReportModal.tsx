import { useEffect } from "react";
import { X, Mail } from "lucide-react";

interface EmailReportModalProps {
  open: boolean;
  onClose: () => void;
}

export const EmailReportModal = ({ open, onClose }: EmailReportModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md max-h-[80vh] overflow-y-auto bg-background rounded-xl shadow-xl border border-border p-6 sm:p-8"
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
            Email report — coming soon
          </h2>
        </div>
        <div className="h-px w-12 bg-primary/40 mb-4" />

        <p className="text-sm text-foreground/90 leading-relaxed mb-3">
          We're preparing email reports for the final Vanlectric launch. For now, your full
          result is available directly on this page.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          Once vanlectric.com is live, you'll be able to send the report to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px]"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors font-sans font-semibold text-sm min-h-[44px]"
          >
            Back to results
          </button>
        </div>
      </div>
    </div>
  );
};
