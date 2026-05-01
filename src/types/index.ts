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

export interface WizardState {
  step1: VehicleStep;
  step2: UsageStep;
  // remaining steps populated later
  step3?: { climate?: ClimateZone };
  step4?: { appliances: Record<string, { enabled: boolean; hours?: number; watts?: number }> };
  step5?: { frequency?: DrivingFrequency; duration?: DrivingDuration };
  step6?: { shorePower?: ShorePowerAccess };
  step7?: Record<string, unknown>;
  step8?: { people?: People };
  step9?: { remoteWork?: RemoteWork };
  step10?: { season?: Season };
  step11?: { insulation?: Insulation };
  step12?: { budget?: Budget };
}

export const initialWizardState: WizardState = {
  step1: {},
  step2: {},
};

export const TOTAL_STEPS = 12;
