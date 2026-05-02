import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { clearLastCalculation, loadPlannerDraft } from "@/services/localCalculation";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the user fully confirms "Start new" so the host can clear local UI state. */
  onCleared?: () => void;
}

const formatSavedAt = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

export const PlannerEntryModal = ({ open, onOpenChange, onCleared }: Props) => {
  const navigate = useNavigate();
  const [confirmStartNew, setConfirmStartNew] = useState(false);
  const draft = loadPlannerDraft();

  const close = () => onOpenChange(false);

  const handleContinueEditing = () => {
    if (!draft) return;
    close();
    navigate("/planner", {
      state: { wizard: draft.wizardState, resumeAtStep: draft.currentStep ?? 1 },
    });
  };

  const handleViewResults = () => {
    if (!draft) return;
    close();
    navigate("/results", { state: { wizard: draft.wizardState } });
  };

  const handleStartNewClick = () => {
    setConfirmStartNew(true);
  };

  const handleConfirmStartNew = () => {
    clearLastCalculation();
    setConfirmStartNew(false);
    onCleared?.();
    close();
    navigate("/planner");
  };

  return (
    <>
      <Dialog open={open && !confirmStartNew} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-w-[calc(100vw-32px)] sm:max-w-md p-0 overflow-hidden",
            "bg-card border border-border rounded-2xl",
            "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]",
          )}
        >
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="font-display text-xl sm:text-2xl text-primary tracking-tight">
                Continue your calculation?
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/80 leading-relaxed">
                You already have a saved Vanlectric calculation. Would you like to continue where you
                left off, review the results, or start fresh?
              </DialogDescription>
            </DialogHeader>
            {draft && (
              <p className="mt-2 text-xs text-muted-foreground italic">
                Saved on this device. Last updated {formatSavedAt(draft.updatedAt)}
                {draft.currentStep ? ` · Step ${draft.currentStep} of 13` : ""}.
              </p>
            )}
          </div>

          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleContinueEditing}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors min-h-[44px] font-sans font-semibold text-sm"
            >
              Continue editing
              <ArrowRight className="w-4 h-4" />
            </button>

            {draft?.hasResults && (
              <button
                type="button"
                onClick={handleViewResults}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary/60 bg-card text-primary hover:bg-primary/5 transition-colors min-h-[44px] font-sans font-semibold text-sm"
              >
                <Eye className="w-4 h-4" />
                View results
              </button>
            )}

            <button
              type="button"
              onClick={handleStartNewClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-muted-foreground hover:border-accent hover:text-accent transition-colors min-h-[44px] font-sans font-semibold text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Start new
            </button>

            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-foreground/70 hover:text-primary transition-colors min-h-[40px] font-sans text-sm"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmStartNew} onOpenChange={setConfirmStartNew}>
        <AlertDialogContent className="max-w-[calc(100vw-32px)] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-primary">
              Start a new calculation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will clear your current saved calculation from this browser. You won't be able to
              restore it unless you saved it with a future PRO account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmStartNew(false)}>
              Keep current
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStartNew}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Yes, start new
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
