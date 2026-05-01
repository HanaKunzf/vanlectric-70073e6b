// Shared types for the wizard and calculation engine.

export type VehicleBrand =
  | "ducato"
  | "sprinter"
  | "transit"
  | "master"
  | "transporter"
  | "proace"
  | "other";

export type VehicleSize = "L1" | "L2" | "L3" | "L4";
export type VehicleYear = "pre-2010" | "2010-2014" | "2015-2019" | "2020+";
export type VehicleEngine = "petrol" | "diesel-old" | "diesel-euro6" | "unknown";

export interface VehicleStep {
  brand?: VehicleBrand;
  brandOther?: string;
  size?: VehicleSize;
  year?: VehicleYear;
  engine?: VehicleEngine;
}

export type UsageProfile = "weekendWarrior" | "traveller" | "fulltimer";
export type JourneyDuration = "1h" | "1-2h" | "2-4h" | "4h+";

export interface UsageStep {
  profile?: UsageProfile;
  journey?: JourneyDuration;
}

export type ClimateZone = "cold" | "temperate" | "warm" | "mixed";
export type Season = "summer" | "three-seasons" | "year-round" | "winter";
export type DrivingFrequency = "shore-power" | "off-grid" | "occasional" | "daily";
export type DrivingDuration = "1h" | "1-2h" | "2-4h" | "4h+";
export type ShorePowerAccess = "never" | "occasionally" | "regularly" | "home";
export type People = 1 | 2 | 3 | 4;
export type RemoteWork = "no" | "occasionally" | "partTime" | "fullTime";
export type Insulation = "full" | "basic" | "none";
export type Budget = "<500" | "500-1000" | "1000-2000" | "2000-3000" | "3000+" | "show-me";
export type RoofType = "flat" | "pop-top" | "high-top" | "unsure";
export type RoofObstacle =
  | "vents"
  | "antenna"
  | "ac"
  | "rails"
  | "skylight"
  | "satellite"
  | "rack"
  | "none";

export interface ClimateStep {
  climate?: ClimateZone;
}

export interface ApplianceEntry {
  enabled: boolean;
  hours?: number;
  watts?: number;
  wattsOverride?: boolean;
}

export interface AppliancesStep {
  appliances: Record<string, ApplianceEntry>;
}

export interface DrivingStep {
  frequency?: DrivingFrequency;
  duration?: DrivingDuration;
}

export interface ShoreStep {
  shorePower?: ShorePowerAccess;
}

export interface RoofStep {
  obstacles: RoofObstacle[];
  roofType?: RoofType;
  popTopHoursPerDay?: number;
}

export interface PeopleStep {
  people?: People;
}

export interface RemoteWorkStep {
  remoteWork?: RemoteWork;
}

export interface SeasonStep {
  season?: Season;
}

export interface InsulationStep {
  insulation?: Insulation;
}

export interface BudgetStep {
  budget?: Budget;
}

export interface WizardState {
  step1: VehicleStep;
  step2: UsageStep;
  step3: ClimateStep;
  step4: AppliancesStep;
  step5: DrivingStep;
  step6: ShoreStep;
  step7: RoofStep;
  step8: PeopleStep;
  step9: RemoteWorkStep;
  step10: SeasonStep;
  step11: InsulationStep;
  step12: BudgetStep;
}

export const initialWizardState: WizardState = {
  step1: {},
  step2: {},
  step3: {},
  step4: { appliances: {} },
  step5: {},
  step6: {},
  step7: { obstacles: [] },
  step8: {},
  step9: {},
  step10: {},
  step11: {},
  step12: {},
};

export const TOTAL_STEPS = 12;

// Default appliance catalog with categories and base wattage.
export interface ApplianceDef {
  id: string;
  label: string;
  watts: number;       // default wattage
  defaultHours: number;
  unit?: "h/day" | "uses/day" | "min/day";
  hint?: string;
}

export interface ApplianceCategory {
  id: string;
  label: string;
  icon: string;
  items: ApplianceDef[];
}

export const APPLIANCE_CATALOG: ApplianceCategory[] = [
  {
    id: "fridge",
    label: "Refrigeration",
    icon: "❄️",
    items: [
      { id: "fridge-compressor", label: "Compressor fridge (12V)", watts: 45, defaultHours: 8, unit: "h/day", hint: "Average duty cycle ~33%" },
      { id: "fridge-absorption", label: "Absorption fridge (3-way)", watts: 120, defaultHours: 24, unit: "h/day" },
      { id: "freezer", label: "Separate freezer", watts: 60, defaultHours: 10, unit: "h/day" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    icon: "💡",
    items: [
      { id: "lights-led", label: "LED lights (interior)", watts: 15, defaultHours: 4, unit: "h/day" },
      { id: "lights-outdoor", label: "Outdoor / awning lights", watts: 10, defaultHours: 2, unit: "h/day" },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: "🍳",
    items: [
      { id: "induction", label: "Induction hob (single)", watts: 1500, defaultHours: 0.5, unit: "h/day" },
      { id: "kettle", label: "Electric kettle", watts: 1200, defaultHours: 0.2, unit: "h/day" },
      { id: "coffee", label: "Coffee machine", watts: 800, defaultHours: 0.15, unit: "h/day" },
      { id: "microwave", label: "Microwave", watts: 800, defaultHours: 0.2, unit: "h/day" },
      { id: "toaster", label: "Toaster", watts: 800, defaultHours: 0.1, unit: "h/day" },
    ],
  },
  {
    id: "water",
    label: "Water",
    icon: "🚿",
    items: [
      { id: "water-pump", label: "Water pump (12V)", watts: 60, defaultHours: 0.5, unit: "h/day" },
      { id: "water-heater", label: "Electric water heater", watts: 1000, defaultHours: 0.5, unit: "h/day" },
      { id: "shower-pump", label: "Shower / grey pump", watts: 50, defaultHours: 0.2, unit: "h/day" },
    ],
  },
  {
    id: "climate",
    label: "Heating & cooling",
    icon: "🌡️",
    items: [
      { id: "diesel-heater", label: "Diesel heater (fan only)", watts: 25, defaultHours: 6, unit: "h/day" },
      { id: "fan", label: "Roof fan / Maxxfan", watts: 30, defaultHours: 6, unit: "h/day" },
      { id: "ac", label: "Air conditioner", watts: 800, defaultHours: 2, unit: "h/day" },
      { id: "electric-heater", label: "Electric heater", watts: 1500, defaultHours: 1, unit: "h/day" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: "💻",
    items: [
      { id: "phones", label: "Phone charging", watts: 10, defaultHours: 3, unit: "h/day" },
      { id: "laptop", label: "Laptop", watts: 60, defaultHours: 4, unit: "h/day" },
      { id: "tablet", label: "Tablet / e-reader", watts: 15, defaultHours: 2, unit: "h/day" },
      { id: "tv", label: "TV (12V)", watts: 35, defaultHours: 2, unit: "h/day" },
      { id: "router", label: "4G/5G router", watts: 12, defaultHours: 12, unit: "h/day" },
      { id: "starlink", label: "Starlink", watts: 60, defaultHours: 8, unit: "h/day" },
      { id: "speakers", label: "Bluetooth speakers", watts: 15, defaultHours: 2, unit: "h/day" },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: "🔧",
    items: [
      { id: "hairdryer", label: "Hair dryer", watts: 1200, defaultHours: 0.1, unit: "h/day" },
      { id: "vacuum", label: "12V vacuum", watts: 100, defaultHours: 0.1, unit: "h/day" },
      { id: "tools", label: "Power tools (occasional)", watts: 600, defaultHours: 0.2, unit: "h/day" },
      { id: "ebike", label: "E-bike charger", watts: 100, defaultHours: 3, unit: "h/day" },
    ],
  },
];
