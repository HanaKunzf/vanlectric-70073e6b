import { useEffect } from "react";
import { X, Lock } from "lucide-react";
import { SubscribeForm } from "@/components/ui/SubscribeForm";

import type { SubscribeSource } from "@/services/subscribe";

interface ProModalProps {
  open: boolean;
  onClose: () => void;
  source?: SubscribeSource;
}

export const ProModal = ({ open, onClose, source = "PRO coming soon" }: ProModalProps) => {
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
          <Lock className="w-6 h-6 text-primary" strokeWidth={1.75} />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            PRO features — coming soon
          </h2>
        </div>
        <div className="h-px w-12 bg-primary/40 mb-4" />

        <p className="text-sm text-foreground/90 leading-relaxed mb-5">
          PDF export, Excel shopping lists, saved designs and existing system analysis are
          planned for Vanlectric PRO. Leave your email and we'll let you know when it's ready.
          The calculator itself is free to test now.
        </p>

        <SubscribeForm source={source} submitLabel="Notify me when PRO is ready" />
      </div>
    </div>
  );
};
