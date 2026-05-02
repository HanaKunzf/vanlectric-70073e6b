// Local-only persistence for the user's last calculation.
// Free-tier feature: stores the wizard state on this device/browser only.
// Designed to be replaceable later with a Supabase-backed user-account flow.

import { initialWizardState, type WizardState } from "@/types";

const STATE_KEY = "vanlectric_last_calculation";
const SAVED_AT_KEY = "vanlectric_last_calculation_saved_at";

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

export function saveLastCalculation(state: WizardState): void {
  if (!isBrowser()) return;
  try {
    const safe = sanitize(state);
    window.localStorage.setItem(STATE_KEY, JSON.stringify(safe));
    window.localStorage.setItem(SAVED_AT_KEY, new Date().toISOString());
  } catch {
    // Quota / private mode — fail silently.
  }
}

export function loadLastCalculation(): WizardState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WizardState>;
    // Merge with defaults to be resilient to schema additions.
    return { ...initialWizardState, ...parsed } as WizardState;
  } catch {
    return null;
  }
}

export function clearLastCalculation(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STATE_KEY);
    window.localStorage.removeItem(SAVED_AT_KEY);
  } catch {
    /* ignore */
  }
}

export function hasLastCalculation(): boolean {
  if (!isBrowser()) return false;
  try {
    return !!window.localStorage.getItem(STATE_KEY);
  } catch {
    return false;
  }
}

export function getLastCalculationSavedAt(): Date | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SAVED_AT_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}
