// Local-only persistence for the user's calculator progress (free tier).
// Stores the wizard state on this device/browser only.
// Designed to be replaceable later with a Supabase-backed user-account flow.

import { initialWizardState, type WizardState } from "@/types";

// New unified key (stores draft + current step + flags).
const DRAFT_KEY = "vanlectric_planner_draft";
// Legacy keys (older free-tier saves) — read on load for backward compat.
const LEGACY_STATE_KEY = "vanlectric_last_calculation";
const LEGACY_SAVED_AT_KEY = "vanlectric_last_calculation_saved_at";

export interface PlannerDraft {
  wizardState: WizardState;
  /** 1..TOTAL_STEPS — last step the user was working on */
  currentStep: number;
  /** Step numbers the user has clicked Next on at least once */
  completedSteps: number[];
  /** ISO timestamp */
  updatedAt: string;
  /** True once the user has reached the results page with this draft */
  hasResults: boolean;
}

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

/** Strip anything that isn't part of the calculator state (privacy: no email, etc.). */
function sanitize(state: WizardState): WizardState {
  return {
    step1: state.step1 ?? {},
    step2: state.step2 ?? {},
    step3: state.step3 ?? {},
    step4: state.step4 ?? { appliances: {} },
    step5: state.step5 ?? {},
    step6: state.step6 ?? {},
    step7: state.step7 ?? { obstacles: {} },
    step8: state.step8 ?? {},
    step9: state.step9 ?? {},
    step10: state.step10 ?? {},
    step11: state.step11 ?? {},
    step12: state.step12 ?? {},
    step13: state.step13 ?? {},
  };
}

function readDraft(): PlannerDraft | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlannerDraft>;
      if (parsed && parsed.wizardState) {
        return {
          wizardState: { ...initialWizardState, ...parsed.wizardState } as WizardState,
          currentStep: parsed.currentStep ?? 1,
          completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
          updatedAt: parsed.updatedAt ?? new Date().toISOString(),
          hasResults: !!parsed.hasResults,
        };
      }
    }
    // Legacy fallback: a previous version stored only the wizard state.
    const legacy = window.localStorage.getItem(LEGACY_STATE_KEY);
    if (legacy) {
      const ws = { ...initialWizardState, ...(JSON.parse(legacy) as Partial<WizardState>) } as WizardState;
      const at = window.localStorage.getItem(LEGACY_SAVED_AT_KEY) ?? new Date().toISOString();
      return { wizardState: ws, currentStep: 1, completedSteps: [], updatedAt: at, hasResults: false };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeDraft(d: PlannerDraft): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* quota / private mode */
  }
}

export interface SaveOptions {
  currentStep?: number;
  markStepCompleted?: number;
  hasResults?: boolean;
}

/**
 * Persist the current wizard progress. Merges with any existing draft so that
 * partial updates (e.g. only currentStep changed) don't drop other fields.
 */
export function saveLastCalculation(state: WizardState, opts: SaveOptions = {}): void {
  if (!isBrowser()) return;
  const existing = readDraft();
  const completed = new Set(existing?.completedSteps ?? []);
  if (opts.markStepCompleted) completed.add(opts.markStepCompleted);
  const draft: PlannerDraft = {
    wizardState: sanitize(state),
    currentStep: opts.currentStep ?? existing?.currentStep ?? 1,
    completedSteps: Array.from(completed).sort((a, b) => a - b),
    updatedAt: new Date().toISOString(),
    hasResults: opts.hasResults ?? existing?.hasResults ?? false,
  };
  writeDraft(draft);
}

export function loadLastCalculation(): WizardState | null {
  return readDraft()?.wizardState ?? null;
}

export function loadPlannerDraft(): PlannerDraft | null {
  return readDraft();
}

export function clearLastCalculation(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
    window.localStorage.removeItem(LEGACY_STATE_KEY);
    window.localStorage.removeItem(LEGACY_SAVED_AT_KEY);
  } catch {
    /* ignore */
  }
}

export function hasLastCalculation(): boolean {
  return readDraft() !== null;
}

export function getLastCalculationSavedAt(): Date | null {
  const d = readDraft();
  if (!d) return null;
  const date = new Date(d.updatedAt);
  return isNaN(date.getTime()) ? null : date;
}

export function markResultsReached(state: WizardState): void {
  saveLastCalculation(state, { hasResults: true });
}
