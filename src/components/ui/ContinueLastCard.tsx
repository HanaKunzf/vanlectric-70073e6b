import { useNavigate } from "react-router-dom";
import { ArrowRight, Pencil, RotateCcw } from "lucide-react";
import {
  clearLastCalculation,
  getLastCalculationSavedAt,
  loadLastCalculation,
} from "@/services/localCalculation";

interface Props {
  /** Called after the saved state is cleared (e.g. so the host can hide the card). */
  onCleared?: () => void;
}

const formatSavedAt = (d: Date): string => {
  try {
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d.toDateString();
  }
};

export const ContinueLastCard = ({ onCleared }: Props) => {
  const navigate = useNavigate();
  const savedAt = getLastCalculationSavedAt();

  const handleContinue = () => {
    const wizard = loadLastCalculation();
    if (!wizard) return;
    navigate("/results", { state: { wizard } });
  };

  const handleEdit = () => {
    const wizard = loadLastCalculation();
    if (!wizard) return;
    navigate("/planner", { state: { wizard, resumeAtStep: 1 } });
  };

  const handleStartNew = () => {
    clearLastCalculation();
    onCleared?.();
  };

  return (
    <section
      className="step-card p-5 sm:p-6 bg-card/80 border-primary/30"
      aria-labelledby="continue-last-title"
    >
      <h2
        id="continue-last-title"
        className="font-display font-semibold text-lg sm:text-xl text-primary mb-1"
      >
        Continue your last calculation
      </h2>
      <p className="text-sm text-foreground/80 leading-relaxed">
        Vanlectric found a calculation saved on this device.
        {savedAt && (
          <span className="text-muted-foreground"> Last saved {formatSavedAt(savedAt)}.</span>
        )}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground italic">
        Saved locally in this browser. Not synced across devices.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors min-h-[44px] font-sans font-semibold text-sm"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] font-sans font-semibold text-sm"
        >
          <Pencil className="w-4 h-4" /> Edit inputs
        </button>
        <button
          type="button"
          onClick={handleStartNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] font-sans font-semibold text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Start new
        </button>
      </div>
    </section>
  );
};
