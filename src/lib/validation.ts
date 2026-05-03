// Centralised numeric validation for planner inputs.
// All ranges and category caps live here so the wizard, results UI and
// any future tests share one source of truth.

export type WattsCategory =
  | "lights"
  | "fridge"
  | "fans"
  | "pumps"
  | "remote-work"
  | "high-load"
  | "generic";

export const WATT_CAPS: Record<WattsCategory, number> = {
  lights: 200,
  fridge: 300,
  fans: 150,
  pumps: 250,
  "remote-work": 300,
  "high-load": 3000,
  generic: 5000,
};

export const HOURS_MIN = 0;
export const HOURS_MAX = 24;
export const QUANTITY_MIN = 0;
export const QUANTITY_MAX = 20;
export const ROOF_DIM_MIN_CM = 1;
export const ROOF_DIM_MAX_CM = 400;

export function categoryForApplianceId(id: string): WattsCategory {
  if (/^lights/.test(id)) return "lights";
  if (/^fridge|^freezer$/.test(id)) return "fridge";
  if (id === "fan") return "fans";
  if (/pump/.test(id)) return "pumps";
  if (/laptop|monitor|router|starlink|cpap|tablet/.test(id)) return "remote-work";
  if (
    /induction|kettle|coffee|microwave|toaster|oven|electric-heater|hairdryer|water-heater|flow-heater|^ac$/.test(
      id,
    )
  ) {
    return "high-load";
  }
  return "generic";
}

export interface ValidationIssue {
  fieldId: string;
  label: string;
  message: string;
}

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  /** When true, allow at most one decimal place. */
  oneDecimal?: boolean;
  /** When true, only integers are accepted. */
  integer?: boolean;
  /** Field is required to be a finite number > min when true (defaults true). */
  required?: boolean;
  /** Human-readable field label for messages. */
  label: string;
}

/** Validate a numeric input. Returns an error message, or null if valid. */
export function validateNumber(
  raw: number | string | undefined | null,
  opts: NumberValidationOptions,
): string | null {
  const { min, max, oneDecimal, integer, required = true, label } = opts;
  if (raw === undefined || raw === null || raw === "") {
    return required ? `${label} is required.` : null;
  }
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return `${label} must be a number.`;
  if (integer && !Number.isInteger(n)) return `${label} must be a whole number.`;
  if (oneDecimal) {
    // Reject more than 1 decimal place.
    const rounded = Math.round(n * 10) / 10;
    if (Math.abs(rounded - n) > 1e-9) return `${label} can have at most one decimal.`;
  }
  if (min !== undefined && n < min) return `${label} must be at least ${min}.`;
  if (max !== undefined && n > max) return `${label} must not exceed ${max}.`;
  return null;
}

export function validateHoursPerDay(raw: number | string | undefined): string | null {
  return validateNumber(raw, {
    label: "Hours per day",
    min: HOURS_MIN,
    max: HOURS_MAX,
    oneDecimal: true,
  });
}

export function validateWatts(
  raw: number | string | undefined,
  category: WattsCategory,
): string | null {
  return validateNumber(raw, {
    label: "Wattage",
    min: 0,
    max: WATT_CAPS[category],
    integer: false,
  });
}

export function validateRoofDim(raw: number | string | undefined): string | null {
  return validateNumber(raw, {
    label: "Dimension",
    min: ROOF_DIM_MIN_CM,
    max: ROOF_DIM_MAX_CM,
    integer: true,
  });
}
