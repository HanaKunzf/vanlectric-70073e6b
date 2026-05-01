import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Step01_Vehicle, isStep1Valid } from "@/components/wizard/Step01_Vehicle";
import { Step02_UsageProfile, isStep2Valid } from "@/components/wizard/Step02_UsageProfile";
import { initialWizardState, TOTAL_STEPS, type WizardState } from "@/types";
import { en } from "@/i18n/en";
import { cn } from "@/lib/utils";

export default function Wizard() {
  const navigate = useNavigate();
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [step, setStep] = useState(1);

  const canAdvance = (() => {
    switch (step) {
      case 1: return isStep1Valid(state.step1);
      case 2: return isStep2Valid(state.step2);
      default: return true;
    }
  })();

  const goNext = () => {
    if (!canAdvance) return;
    if (step >= TOTAL_STEPS) return; // future: navigate to /results
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    if (step <= 1) {
      navigate("/");
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Zap className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline font-display uppercase tracking-widest text-sm">
              {en.app.name}
            </span>
          </Link>
          <div className="flex-1 max-w-md ml-auto">
            <ProgressBar current={step} />
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div key={step}>
          {step === 1 && (
            <Step01_Vehicle
              value={state.step1}
              onChange={(v) => setState((s) => ({ ...s, step1: v }))}
            />
          )}
          {step === 2 && (
            <Step02_UsageProfile
              value={state.step2}
              onChange={(v) => setState((s) => ({ ...s, step2: v }))}
            />
          )}
          {step > 2 && (
            <div className="step-card max-w-2xl mx-auto p-10 text-center animate-step-in">
              <h2 className="font-display text-2xl uppercase mb-3">Step {step}</h2>
              <p className="text-muted-foreground">
                Coming next — this step will be wired up shortly.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Nav */}
      <footer className="sticky bottom-0 border-t border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-md border border-border text-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] font-display uppercase tracking-widest text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {en.nav.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className={cn(
              "inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-md font-display uppercase tracking-widest text-sm min-h-[44px] transition-[filter,transform,opacity]",
              canAdvance
                ? "bg-primary text-primary-foreground amber-glow hover:brightness-110 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            {en.nav.next}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
