import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Zap, Pencil } from "lucide-react";
import { saveLastCalculation, clearLastCalculation, hasLastCalculation } from "@/services/localCalculation";
import { ConfirmStartNewModal } from "@/components/ui/ConfirmStartNewModal";
import { BackToTop } from "@/components/ui/BackToTop";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Step01_Vehicle, isStep1Valid } from "@/components/wizard/Step01_Vehicle";
import { Step02_UsageProfile, isStep2Valid } from "@/components/wizard/Step02_UsageProfile";
import { Step03_Climate, isStep3Valid } from "@/components/wizard/Step03_Climate";
import { Step04_Appliances, isStep4Valid } from "@/components/wizard/Step04_Appliances";
import { Step05_Driving, isStep5Valid } from "@/components/wizard/Step05_Driving";
import { Step06_Shore, isStep6Valid } from "@/components/wizard/Step06_Shore";
import { Step07_Roof, isStep7Valid } from "@/components/wizard/Step07_Roof";
import { Step08_People, isStep8Valid } from "@/components/wizard/Step08_People";
import { Step09_RemoteWork, isStep9Valid } from "@/components/wizard/Step09_RemoteWork";
import { Step10_Season, isStep10Valid } from "@/components/wizard/Step10_Season";
import { Step11_Insulation, isStep11Valid } from "@/components/wizard/Step11_Insulation";
import { Step12_Budget, isStep12Valid } from "@/components/wizard/Step12_Budget";
import { Step13_Existing, isStep13Valid } from "@/components/wizard/Step13_Existing";
import { initialWizardState, TOTAL_STEPS, type WizardState } from "@/types";
import { en } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/site/SiteLayout";
import { NavMenu } from "@/components/site/NavMenu";

export default function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state as { wizard?: WizardState; resumeAtStep?: number; editMode?: boolean }) || {};
  const [state, setState] = useState<WizardState>(
    incoming.wizard ? { ...initialWizardState, ...incoming.wizard } : initialWizardState,
  );
  const [step, setStep] = useState(incoming.resumeAtStep ?? 1);
  const [editMode] = useState(!!incoming.editMode);
  const [confirmStartNew, setConfirmStartNew] = useState(false);

  // Auto-save wizard state to localStorage on every change (free-tier persistence).
  // Also keeps `currentStep` in sync so we can resume at the right place.
  useEffect(() => {
    saveLastCalculation(state, { currentStep: step });
  }, [state, step]);

  const set = <K extends keyof WizardState>(key: K, v: WizardState[K]) =>
    setState((s) => ({ ...s, [key]: v }));

  const canAdvance = (() => {
    switch (step) {
      case 1: return isStep1Valid(state.step1);
      case 2: return isStep2Valid(state.step2);
      case 3: return isStep3Valid(state.step3);
      case 4: return isStep4Valid(state.step4);
      case 5: return isStep5Valid(state.step5);
      case 6: return isStep6Valid(state.step6);
      case 7: return isStep7Valid(state.step7);
      case 8: return isStep8Valid(state.step8);
      case 9: return isStep9Valid(state.step9);
      case 10: return isStep10Valid(state.step10);
      case 11: return isStep11Valid(state.step11);
      case 12: return isStep12Valid(state.step12);
      case 13: return isStep13Valid(state.step13);
      default: return true;
    }
  })();

  const isLast = step === TOTAL_STEPS;

  const goNext = () => {
    if (!canAdvance) return;
    // Persist progress on every Next click (per-step save).
    saveLastCalculation(state, { currentStep: step, markStepCompleted: step });
    if (editMode) {
      navigate("/results", { state: { wizard: state } });
      return;
    }
    if (isLast) {
      navigate("/results", { state: { wizard: state } });
      return;
    }
    const nextStep = Math.min(step + 1, TOTAL_STEPS);
    saveLastCalculation(state, { currentStep: nextStep, markStepCompleted: step });
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (editMode) {
      navigate("/results", { state: { wizard: state } });
      return;
    }
    if (step <= 1) {
      navigate("/");
      return;
    }
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Campervan Electrical System Calculator — Vanlectric"
        description="Answer simple questions about your van, appliances, travel style and roof space to get a practical electrical system recommendation."
      />
      <header className="relative md:sticky md:top-0 z-30 border-b border-border bg-background/85 md:backdrop-blur">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors" aria-label="Home">
            <Zap className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline font-display text-base font-semibold tracking-tight">
              {en.app.name}
            </span>
          </Link>
          <div className="flex-1 max-w-md ml-auto">
            <ProgressBar current={step} />
          </div>
          <button
            type="button"
            onClick={() => {
              if (hasLastCalculation()) {
                setConfirmStartNew(true);
              } else {
                clearLastCalculation();
                navigate("/", { replace: true });
              }
            }}
            className="text-xs sm:text-sm font-sans font-medium text-foreground/75 hover:text-primary hover:underline transition-colors whitespace-nowrap"
            aria-label="Start over"
          >
            Start over
          </button>
        </div>
      </header>

      <main
        className="flex-1 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10"
        style={{ paddingBottom: "calc(96px + env(safe-area-inset-bottom))" }}
      >
        {editMode && (
          <div className="mb-6 rounded-lg border-l-4 border-accent bg-accent/10 px-4 py-3 text-sm font-sans text-foreground inline-flex items-center gap-2">
            <Pencil className="w-4 h-4" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            <span>Editing — click {en.nav.next} to return to results</span>
          </div>
        )}
        <div key={step}>
          {step === 1 && <Step01_Vehicle value={state.step1} onChange={(v) => set("step1", v)} />}
          {step === 2 && <Step02_UsageProfile value={state.step2} onChange={(v) => set("step2", v)} />}
          {step === 3 && <Step03_Climate value={state.step3} onChange={(v) => set("step3", v)} />}
          {step === 4 && <Step04_Appliances value={state.step4} onChange={(v) => set("step4", v)} vehicleEngine={state.step1.engine} />}
          {step === 5 && <Step05_Driving value={state.step5} onChange={(v) => set("step5", v)} />}
          {step === 6 && <Step06_Shore value={state.step6} onChange={(v) => set("step6", v)} />}
          {step === 7 && <Step07_Roof value={state.step7} onChange={(v) => set("step7", v)} />}
          {step === 8 && <Step08_People value={state.step8} onChange={(v) => set("step8", v)} />}
          {step === 9 && <Step09_RemoteWork value={state.step9} onChange={(v) => set("step9", v)} />}
          {step === 10 && <Step10_Season value={state.step10} onChange={(v) => set("step10", v)} />}
          {step === 11 && <Step11_Insulation value={state.step11} onChange={(v) => set("step11", v)} />}
          {step === 12 && <Step12_Budget value={state.step12} onChange={(v) => set("step12", v)} />}
          {step === 13 && <Step13_Existing value={state.step13} onChange={(v) => set("step13", v)} wizardState={state} />}
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur shadow-[0_-2px_12px_-6px_rgba(45,74,62,0.15)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] font-sans font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {en.nav.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className={cn(
              "inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-sans font-semibold text-sm min-h-[44px] transition-[background-color,transform,opacity]",
              canAdvance
                ? "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] active:scale-[0.98]"
                : "bg-border text-foreground/50 cursor-not-allowed",
            )}
          >
            {editMode ? "Save & return" : isLast ? en.nav.finish : en.nav.next}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
      <BackToTop bottomOffset={72} />
      <ConfirmStartNewModal
        open={confirmStartNew}
        onOpenChange={setConfirmStartNew}
        onConfirm={() => {
          clearLastCalculation();
          setConfirmStartNew(false);
          setState(initialWizardState);
          navigate("/", { replace: true });
        }}
      />
    </div>
  );
}
