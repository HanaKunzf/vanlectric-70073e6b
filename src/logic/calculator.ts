// Vanlife Electrical Calculator — calculation engine.
import {
  APPLIANCE_CATALOG,
  type ApplianceDef,
  type WizardState,
  type ClimateZone,
  type Insulation,
  type Season,
  type VehicleSize,
  type RoofType,
  type RoofObstacleId,
  type DrivingFrequency,
  type JourneyDuration,
  type UsageProfile,
  type ShorePowerAccess,
  type People,
  type RemoteWork,
  type Budget,
} from "@/types";

// ---------- helpers ----------
const FRIDGE_IDS = new Set(["fridge-small", "fridge-medium", "fridge-large", "fridge-freezer", "fridge-absorption", "freezer"]);

const fridgeDuty: Record<ClimateZone, Record<Insulation, number>> = {
  cold:      { full: 0.15, basic: 0.20, none: 0.25 },
  temperate: { full: 0.28, basic: 0.35, none: 0.44 },
  warm:      { full: 0.50, basic: 0.63, none: 0.78 },
  mixed:     { full: 0.50, basic: 0.63, none: 0.78 },
};

const heatingHoursMap: Record<ClimateZone, Record<Season, number>> = {
  cold:      { summer: 2, "three-seasons": 6, "year-round": 10, winter: 14 },
  temperate: { summer: 0, "three-seasons": 3, "year-round": 7,  winter: 10 },
  warm:      { summer: 0, "three-seasons": 0, "year-round": 2,  winter: 4 },
  mixed:     { summer: 2, "three-seasons": 5, "year-round": 9,  winter: 12 },
};

const remoteWorkWh: Record<RemoteWork, number> = {
  no: 0, occasionally: 50, partTime: 200, fullTime: 450,
};

const daysAutonomyMap: Record<UsageProfile, number> = {
  weekendWarrior: 2, traveller: 3, fulltimer: 4,
};

const journeyHoursMap: Record<JourneyDuration, number> = {
  "1h": 1, "1-2h": 1.5, "2-4h": 3, "4h+": 5,
};

const solarHoursMatrix: Record<ClimateZone, Record<Season, number>> = {
  cold:      { summer: 3.5, "three-seasons": 2.5, "year-round": 2.0, winter: 1.5 },
  temperate: { summer: 5.0, "three-seasons": 3.5, "year-round": 2.5, winter: 2.0 },
  warm:      { summer: 7.0, "three-seasons": 5.5, "year-round": 4.5, winter: 3.5 },
  mixed:     { summer: 2.5, "three-seasons": 2.5, "year-round": 2.0, winter: 1.5 },
};

const roofAreaMap: Record<VehicleSize, number> = { L1: 2.0, L2: 2.8, L3: 3.4, L4: 4.0 };

// Default footprints in m² per single unit (length × width converted from cm).
const obstacleDefaults: Record<RoofObstacleId, { l: number; w: number }> = {
  "small-window": { l: 50, w: 50 },
  "large-window": { l: 90, w: 50 },
  "fan": { l: 40, w: 40 },
  "gps-antenna": { l: 0, w: 0 },
  "satellite": { l: 60, w: 60 },
  "solar-shower": { l: 60, w: 30 },
  "rack": { l: 140, w: 100 },
  "ac": { l: 70, w: 40 },
  "tent": { l: 240, w: 120 },
  "other": { l: 0, w: 0 },
};

// ---------- result types ----------
export interface ApplianceLine {
  id: string;
  label: string;
  powerSource: ApplianceDef["powerSource"];
  watts: number;
  hours: number;
  wh: number;
  shoreOnly: boolean;
  informational: boolean;
  isDutyCycle?: boolean;
}

export interface RecommendedComponent {
  key: string;
  category: string;
  name: string;
  why: string;
  detail: string;
  price: number;
  note?: string;
}

export interface MaterialItem { item: string; price: number; qty?: number }

export type MaterialGroupKey = "dc" | "solar" | "shore";

export interface MaterialGroup {
  key: MaterialGroupKey;
  title: string;
  items: MaterialItem[];
  total: number;
}

export type ShoreInstallMode = "none" | "charging-only" | "full-ac";

export interface CalculationResult {
  lines: ApplianceLine[];
  shoreLines: ApplianceLine[];
  applianceSubtotalWh: number;
  dailyWh12V: number;
  dailyWh230VInverter: number;
  inverterLossWh: number;
  remoteWorkWh: number;
  reserveWh: number;
  totalDailyWh: number;
  hasInverterLoad: boolean;
  /** Largest single 230V-inverter appliance, used to size the inverter (excludes shore-only). */
  inverterPeakW: number;
  /** Recommended inverter size in W (0 if not required). */
  inverterSizeRecommendedW: number;
  /** AC system recommendation key based on the user's appliance mix. */
  acRecommendation:
    | "none"
    | "shore-only"
    | "inverter-required"
    | "shore-and-inverter";
  /** High-power AC appliances flagged for warning, with their power source. */
  highPowerAcAppliances: Array<{ id: string; label: string; watts: number; shoreOnly: boolean }>;

  // Battery
  daysAutonomy: number;
  journeyWh: number;
  requiredWh: number;
  requiredAh: number;
  recommendedBatteryAh: number;
  usableBatteryWh: number;

  // Solar
  roofArea: number;
  obstacleArea: number;
  maxSolarW: number;
  solarHours: number;
  requiredSolarW: number;
  recommendedSolarW: number;
  panelType: string;
  solarDailyWh: number;

  // Alternator
  alternatorDailyWh: number;
  hasDCDC: boolean;

  components: RecommendedComponent[];
  materials: MaterialItem[];
  materialsTotal: number;
  materialGroups: MaterialGroup[];
  dcMaterialsTotal: number;
  solarMaterialsTotal: number;
  shoreMaterialsTotal: number;
  shoreInstallMode: ShoreInstallMode;
  hasInternal230VSockets: boolean;
  componentsTotal: number;
  subtotal: number;
  contingency: number;
  totalBudget: number;

  warnings: string[];
}

// ---------- main ----------
export function calculate(state: WizardState): CalculationResult {
  const { step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12 } = state;

  const climate: ClimateZone = step3.climate ?? "temperate";
  const insulation: Insulation = step11.insulation ?? "basic";
  const season: Season = step10.season ?? "three-seasons";
  const people: People = step8.people ?? 2;

  const allAppliances: ApplianceDef[] = APPLIANCE_CATALOG.flatMap((c) => c.items);
  const byId = new Map(allAppliances.map((a) => [a.id, a]));

  const lines: ApplianceLine[] = [];
  const shoreLines: ApplianceLine[] = [];
  let applianceSubtotalWh = 0;
  let dailyWh12V = 0;
  let dailyWh230VInverter = 0; // battery-side Wh after inverter losses
  let inverterLossWh = 0;
  let hasInverterLoad = false;

  for (const [id, entry] of Object.entries(step4.appliances)) {
    if (!entry.enabled) continue;
    const def = byId.get(id);
    if (!def) continue;

    const watts = entry.watts ?? def.watts;
    const hours = entry.hours ?? def.defaultHours;

    if (def.powerSource === "230v-shore" || entry.shoreOnly) {
      shoreLines.push({
        id, label: def.label, powerSource: def.powerSource,
        watts, hours, wh: 0, shoreOnly: true, informational: !!def.informational,
      });
      continue;
    }

    if (def.informational) {
      lines.push({
        id, label: def.label, powerSource: def.powerSource,
        watts: 0, hours: 0, wh: 0, shoreOnly: false, informational: true,
      });
      continue;
    }

    let baseWh = watts * hours;
    let displayHours = hours;

    // Fridge duty cycle
    if (FRIDGE_IDS.has(id)) {
      const duty = fridgeDuty[climate][insulation];
      baseWh = watts * 24 * duty;
      displayHours = 24 * duty;
    }

    // Diesel heater
    if (id === "diesel-heater") {
      const h = heatingHoursMap[climate][season];
      baseWh = 15 * h + 120 * 0.033;
    }

    // People corrections
    if (id === "phones") baseWh += (people - 1) * 10 * 3;
    if (id === "lights-led") baseWh *= 1 + (people - 1) * 0.1;
    if (id === "water-pump") baseWh *= 1 + (people - 1) * 0.2;

    // Inverter losses — assume 90% inverter efficiency: battery draw = AC Wh / 0.9
    if (def.powerSource === "230v-inverter") {
      hasInverterLoad = true;
      const before = baseWh;
      baseWh = baseWh / 0.9;
      inverterLossWh += baseWh - before;
    }

    lines.push({
      id, label: def.label, powerSource: def.powerSource,
      watts, hours: displayHours, wh: baseWh, shoreOnly: false, informational: false,
      isDutyCycle: FRIDGE_IDS.has(id),
    });
    applianceSubtotalWh += baseWh;
    if (def.powerSource === "230v-inverter") {
      dailyWh230VInverter += baseWh;
    } else {
      dailyWh12V += baseWh;
    }
  }

  const rwWh = remoteWorkWh[step9.remoteWork ?? "no"];
  const beforeReserve = applianceSubtotalWh + rwWh;
  const totalDailyWh = beforeReserve * 1.25;
  const reserveWh = totalDailyWh - beforeReserve;

  // ----- Battery -----
  const profile = step2.profile ?? "traveller";
  const daysAutonomy = daysAutonomyMap[profile];
  const frequency: DrivingFrequency = step5.frequency ?? "off-grid";
  const hasDCDC = frequency === "occasional" || frequency === "daily";
  const journey = step2.journey;
  let journeyWh = 0;
  if (profile !== "fulltimer" && !hasDCDC && journey) {
    const jh = journeyHoursMap[journey];
    journeyWh = totalDailyWh * (jh / 24);
  }
  const requiredWh = totalDailyWh * daysAutonomy + journeyWh;
  const requiredAh = requiredWh / 12 / 0.9;

  // ----- Solar -----
  const size = step1.size ?? "L2";
  const roofArea = roofAreaMap[size];
  const obstacleEntries = Object.entries(step7.obstacles ?? {}) as Array<[RoofObstacleId, import("@/types").RoofObstacleEntry]>;
  let obstacleArea = 0;
  let rackMountingArea = 0; // added back when rack used as platform
  for (const [id, entry] of obstacleEntries) {
    if (!entry || !entry.count) continue;
    const def = obstacleDefaults[id];
    const lCm = entry.customSize && entry.lengthCm != null ? entry.lengthCm : def.l;
    const wCm = entry.customSize && entry.widthCm != null ? entry.widthCm : def.w;
    const m2 = (lCm * wCm) / 10000;
    const total = m2 * entry.count;
    if (id === "rack" && entry.panelsOnRack) {
      // rack is a mounting platform, not an obstacle
      rackMountingArea += total;
      continue;
    }
    if (id === "tent" && entry.solarAlongside === "yes-mc4") {
      // tent leaves space alongside — deduct only half its footprint
      obstacleArea += total * 0.5;
      continue;
    }
    obstacleArea += total;
  }
  const availableArea = Math.max(0, roofArea - obstacleArea - 0.4);
  const maxSolarW = (availableArea + rackMountingArea) * 200;
  const solarHours = solarHoursMatrix[climate][season];
  const requiredSolarW = totalDailyWh / Math.max(0.5, solarHours);
  const recommendedSolarW = Math.max(50, Math.min(requiredSolarW, maxSolarW));
  const panelType = step7.roofType === "pop-top" ? "flexible monocrystalline" : "rigid monocrystalline";
  const solarDailyWh = recommendedSolarW * solarHours;

  // ----- Alternator -----
  let alternatorDailyWh = 0;
  if (frequency === "occasional" || frequency === "daily") {
    const dh = step5.duration ? journeyHoursMap[step5.duration] : 1;
    alternatorDailyWh = dh * 360 * 0.85;
    if (frequency === "occasional") alternatorDailyWh /= 2.5;
  }

  // ----- Components -----
  const components: RecommendedComponent[] = [];

  // Battery
  let battery: RecommendedComponent;
  let recommendedBatteryAh: number;
  if (requiredAh < 100) { recommendedBatteryAh = 100; battery = { key: "battery", category: "Battery", name: "1× 100Ah LiFePO4", why: "Sized for ~2 days off-grid autonomy.", detail: `Required ~${Math.round(requiredAh)}Ah — fits one 100Ah battery.`, price: 120 }; }
  else if (requiredAh < 200) { recommendedBatteryAh = 200; battery = { key: "battery", category: "Battery", name: "1× 200Ah LiFePO4", why: "Single battery covers your daily needs with reserve.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 220 }; }
  else if (requiredAh < 300) { recommendedBatteryAh = 300; battery = { key: "battery", category: "Battery", name: "2× 150Ah LiFePO4", why: "Two batteries in parallel for higher capacity.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 320 }; }
  else if (requiredAh < 400) { recommendedBatteryAh = 400; battery = { key: "battery", category: "Battery", name: "2× 200Ah LiFePO4", why: "Large bank for full-time / heavy daily loads.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 440 }; }
  else { recommendedBatteryAh = 600; battery = { key: "battery", category: "Battery", name: "3× 200Ah LiFePO4", why: "Maximum bank for extended off-grid use.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 660 }; }
  // LiFePO4 usable energy ~90% DoD at 12V
  const usableBatteryWh = recommendedBatteryAh * 12 * 0.9;

  if (profile === "weekendWarrior" && requiredAh > 300) {
    battery.note = "As a weekend warrior, you recharge at home between trips. If your system seems oversized, consider whether you really need worst-case winter sizing — or adjust your climate/season settings to match your typical travel conditions.";
  }
  components.push(battery);

  // Solar panel — €0.50 per watt
  components.push({
    key: "solar",
    category: "Solar panels",
    name: `${Math.round(recommendedSolarW)}W ${panelType}`,
    why: `Replaces your daily consumption with ~${solarHours}h of effective sun.`,
    detail: `Roof area available: ${roofArea.toFixed(1)}m². After obstacles & margin: ~${maxSolarW.toFixed(0)}W max. Required: ${Math.round(requiredSolarW)}W.`,
    price: Math.round(recommendedSolarW * 0.5),
  });

  // MPPT
  let mppt: RecommendedComponent;
  if (recommendedSolarW < 150) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 75/15", why: "Matches small solar arrays up to ~150W.", detail: "12V system, up to 15A solar input.", price: 65 };
  else if (recommendedSolarW < 250) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/20", why: "Right size for 150–250W panels.", detail: "Bluetooth, 20A output.", price: 95 };
  else if (recommendedSolarW < 500) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/30", why: "Handles 250–500W of solar comfortably.", detail: "30A output, smart networking.", price: 145 };
  else mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/50", why: "For 500W+ arrays — maximum harvest.", detail: "50A output, smart networking.", price: 195 };
  components.push(mppt);

  // DC-DC charger
  if (frequency !== "shore-power" && frequency !== "off-grid") {
    components.push({
      key: "dcdc", category: "DC-DC charger",
      name: "Victron Orion-Tr Smart 12/12-30A Isolated",
      why: "Recharges your house battery from the alternator while driving.",
      detail: `Estimated ~${Math.round(alternatorDailyWh)}Wh/day from driving.`,
      price: 190,
    });
  }

  // Shore battery charger — only when user explicitly wants battery charging from shore,
  // or is unsure (then labelled optional). "ac-only" or "never" → no charger.
  const shore: ShorePowerAccess = step6.shorePower ?? "never";
  const shoreCharging = step6.shoreCharging ?? (shore === "never" ? "none" : "charge-battery");
  const wantsShoreCharger = shoreCharging === "charge-battery" || shoreCharging === "not-sure";
  if (wantsShoreCharger && shore !== "never") {
    const optional = shoreCharging === "not-sure";
    const fast = shore === "frequent" || shore === "home-between-trips";
    const charger: RecommendedComponent = fast
      ? { key: "shore", category: "Shore battery charger", name: "Victron Blue Smart IP67 12/25A", why: "Charges your leisure battery from 230V shore power.", detail: "Faster recharge for frequent shore-power use. Waterproof, 25A.", price: 110 }
      : { key: "shore", category: "Shore battery charger", name: "Victron Blue Smart IP67 12/17A", why: "Charges your leisure battery from 230V shore power.", detail: "Tops up your bank when you connect to a plug. Waterproof, compact.", price: 90 };
    if (optional) {
      charger.note = "Recommended / optional — you can omit this if you only want 230V sockets and do not need to charge the leisure battery from shore power.";
    }
    components.push(charger);
  }

  // Inverter — sized only from 230V appliances run from the battery (excludes shore-only)
  const max230VInverter = lines
    .filter((l) => l.powerSource === "230v-inverter")
    .reduce((m, l) => Math.max(m, l.watts), 0);
  let inverterSizeRecommendedW = 0;
  if (max230VInverter > 0) {
    if (max230VInverter < 1000) { inverterSizeRecommendedW = 1000; components.push({ key: "inverter", category: "Inverter", name: "1000W pure sine inverter", why: "Minimum recommended size — covers laptops, kettles, small appliances cleanly.", detail: `Largest 230V load: ${max230VInverter}W. Sized only from battery-powered 230V appliances.`, price: 80 }); }
    else if (max230VInverter < 2500) { inverterSizeRecommendedW = 2000; components.push({ key: "inverter", category: "Inverter", name: "2000W pure sine inverter", why: "Handles high-draw 230V appliances.", detail: `Largest 230V load: ${max230VInverter}W. Sized only from battery-powered 230V appliances.`, price: 150 }); }
    else { inverterSizeRecommendedW = 3000; components.push({ key: "inverter", category: "Inverter", name: "3000W pure sine inverter", why: "Very high 230V draw — heavy loads.", detail: `Largest 230V load: ${max230VInverter}W. Cable sizing critical. Sized only from battery-powered 230V appliances.`, price: 250 }); }
  }

  // ----- Shore-only appliances detection -----
  const hasShoreOnlyAppliances = shoreLines.some((l) => !l.informational);

  // ----- 230V shore power circuit (separate from shore battery charger) -----
  if (hasShoreOnlyAppliances || shore !== "never") {
    const required = hasShoreOnlyAppliances;
    components.push({
      key: "shore-circuit",
      category: "230V shore power circuit",
      name: "230V shore hookup + protected AC circuit",
      why: required
        ? "Required for shore-only appliances and campsite/home hookup use."
        : "Useful for campsite/home hookup — adds 230V sockets in the van.",
      detail:
        "Includes: external shore inlet, RCD/RCBO protection, MCB / circuit breaker, 230V sockets, 3-core cable, protective earth and an installation enclosure. 230V AC installation should be designed or checked by a qualified electrician.",
      price: 130,
      note: required
        ? "Required: you selected shore-only appliances, which can only run when plugged into 230V."
        : undefined,
    });
  }

  // ----- AC system recommendation -----
  const hasInverterAc = dailyWh230VInverter > 0;
  const hasShoreOnlyAc = shoreLines.some((l) => !l.informational);
  const acRecommendation: CalculationResult["acRecommendation"] =
    !hasInverterAc && !hasShoreOnlyAc ? "none"
    : hasInverterAc && hasShoreOnlyAc ? "shore-and-inverter"
    : hasInverterAc ? "inverter-required"
    : "shore-only";

  // ----- High-power AC appliances (for warning) -----
  const HIGH_POWER_AC_IDS = new Set([
    "induction", "kettle", "electric-heater", "hairdryer", "microwave",
    "toaster", "oven", "water-heater", "flow-heater", "ac",
  ]);
  const highPowerAcAppliances: CalculationResult["highPowerAcAppliances"] = [];
  for (const [id, entry] of Object.entries(step4.appliances)) {
    if (!entry.enabled) continue;
    const def = byId.get(id);
    if (!def) continue;
    const watts = entry.watts ?? def.watts;
    if (HIGH_POWER_AC_IDS.has(id) || (def.powerSource !== "12v" && watts >= 1000)) {
      highPowerAcAppliances.push({
        id, label: def.label, watts,
        shoreOnly: def.powerSource === "230v-shore" || !!entry.shoreOnly,
      });
    }
  }

  // ----- Installation materials (categorised) -----
  const hasSolar = recommendedSolarW > 0;
  const hasDcDc = frequency !== "shore-power" && frequency !== "off-grid";
  const hasInternal230VSockets = max230VInverter > 0; // inverter implies internal 230V sockets (informational)
  const shoreOnlyAppliances = hasShoreOnlyAppliances;
  // Determine the shore install scope:
  //  - "full-ac": user has shore-only appliances, OR explicitly chose "ac-only" (sockets in van)
  //  - "charging-only": shore charger only (charge battery from a plug)
  //  - "none": neither
  const needsFullAc = shoreOnlyAppliances || (shore !== "never" && shoreCharging === "ac-only");
  const shoreInstallMode: ShoreInstallMode = needsFullAc
    ? "full-ac"
    : wantsShoreCharger
    ? "charging-only"
    : "none";

  // 1. DC protection and distribution
  const dcItems: MaterialItem[] = [
    { item: "Main battery fuse (ANL / MEGA / Class T)", price: 18 },
    { item: "Battery disconnect switch", price: 20 },
    { item: "Positive busbar", price: 15 },
    { item: "Negative busbar", price: 12 },
    { item: "12V fuse box (blade fuses)", price: 20 },
  ];
  if (max230VInverter > 0) dcItems.push({ item: "Fuse for inverter feed", price: 12 });
  if (hasSolar) dcItems.push({ item: "Fuse: MPPT → battery", price: 8 });
  if (hasDcDc) {
    dcItems.push({ item: "Fuse: DC-DC charger input (alternator side)", price: 8 });
    dcItems.push({ item: "Fuse: DC-DC charger output (battery side)", price: 8 });
  }
  dcItems.push({ item: "SmartShunt 500A / battery monitor", price: 60 });
  if (climate === "cold" || season === "winter" || season === "year-round") {
    dcItems.push({ item: "Battery temperature sensor", price: 18 });
  }
  dcItems.push(
    { item: "Cable lugs, heat shrink & labels", price: 25 },
    { item: "Main cable 35–70mm²", price: 40 },
    { item: "12V wiring (mixed gauges)", price: 50 },
    { item: "WAGO / Anderson connectors", price: 20 },
    { item: "Cable management & mounting hardware", price: 25 },
  );

  // 2. Solar installation
  const solarItems: MaterialItem[] = [];
  if (hasSolar) {
    solarItems.push(
      { item: "Solar mounting hardware (brackets / adhesive)", price: 35 },
      { item: "Roof cable gland", price: 12 },
      { item: "MC4 connectors", price: 10 },
      { item: "Solar cable 4–6mm²", price: 20 },
      { item: "Solar isolator / DC breaker", price: 18 },
      { item: "MPPT controller fuse", price: 8 },
    );
  }

  // 3. 230V shore-power installation
  const shoreItems: MaterialItem[] = [];
  if (shoreInstallMode === "charging-only") {
    shoreItems.push(
      { item: "CEE shore inlet", price: 25 },
      { item: "Shore power hookup cable", price: 30 },
      { item: "Small AC protection box / enclosure", price: 25 },
      { item: "30mA RCD / RCCB", price: 35 },
      { item: "MCB for shore charger", price: 12 },
      { item: "Protective earth wiring", price: 15 },
      { item: "AC cable, glands & conduits", price: 25 },
      { item: "Professional electrician check", price: 80 },
    );
  } else if (shoreInstallMode === "full-ac") {
    shoreItems.push(
      { item: "CEE shore inlet", price: 25 },
      { item: "Shore power hookup cable", price: 30 },
      { item: "AC consumer unit / protection box", price: 45 },
      { item: "30mA RCD or RCBO", price: 40 },
      { item: "MCB for socket circuit", price: 12 },
    );
    if (wantsShoreCharger) {
      shoreItems.push({ item: "MCB for shore charger", price: 12 });
    }
    if (max230VInverter >= 2000 || shoreOnlyAppliances) {
      shoreItems.push({ item: "MCB for high-load shore appliances", price: 15 });
    }
    shoreItems.push(
      { item: "Protective earth wiring", price: 15 },
      { item: "Internal 230V sockets (×3)", price: 30 },
      { item: "AC cable, conduits & junction boxes", price: 35 },
      { item: "Labels / warning stickers", price: 8 },
      { item: "Professional electrician inspection", price: 120 },
    );
  }

  const dcMaterialsTotal = dcItems.reduce((s, m) => s + m.price, 0);
  const solarMaterialsTotal = solarItems.reduce((s, m) => s + m.price, 0);
  const shoreMaterialsTotal = shoreItems.reduce((s, m) => s + m.price, 0);

  const shoreTitle = shoreInstallMode === "charging-only"
    ? "Shore charging setup"
    : "230V shore-power installation";
  const materialGroups: MaterialGroup[] = [
    { key: "dc", title: "DC protection and distribution", items: dcItems, total: dcMaterialsTotal },
    { key: "solar", title: "Solar installation", items: solarItems, total: solarMaterialsTotal },
    { key: "shore", title: shoreTitle, items: shoreItems, total: shoreMaterialsTotal },
  ];

  // Flat materials list (legacy + shopping list)
  const materials: MaterialItem[] = materialGroups.flatMap((g) => g.items);
  const materialsTotal = dcMaterialsTotal + solarMaterialsTotal + shoreMaterialsTotal;
  const componentsTotal = components.reduce((s, c) => s + c.price, 0);
  const subtotal = componentsTotal + materialsTotal;
  const contingency = subtotal * 0.15;
  const totalBudget = subtotal + contingency;

  // ----- Warnings -----
  const warnings: string[] = [];
  if (step1.year === "2015-2019" || step1.year === "2020+") {
    if (frequency === "occasional" || frequency === "daily") {
      warnings.push("Modern Euro 6 vans typically have a smart alternator. A DC-DC charger with engine-running detection is essential — verify your model before buying.");
    }
  }
  if ((season === "winter" || season === "year-round") && climate === "cold") {
    warnings.push("LiFePO4 batteries cannot be charged below 0°C without a built-in heater. Choose a battery with low-temp protection or low-temp heating.");
  }
  if (recommendedSolarW < requiredSolarW * 0.9) {
    warnings.push(
      `Your climate and season combination (${climate} / ${season}) uses a conservative worst-case of ${solarHours} solar hours/day. Your solar panels (~${maxSolarW.toFixed(0)}W) will cover your needs on sunny days. For cloudy periods, plan for alternator top-ups or shore power. If you travel mainly in summer, reconsider your season selection for a more realistic estimate.`
    );
  }
  if (hasShoreOnlyAppliances && shore === "never") {
    warnings.push("You selected shore-only appliances, but also selected that you will never use shore power. These appliances will not be usable unless you add a 230V shore hookup or remove them from your list.");
  }
  if (shore !== "never" && shoreCharging === "ac-only") {
    warnings.push("You selected a 230V shore circuit only. Your leisure battery will not recharge from shore power unless you add a shore battery charger.");
  }
  if (shore === "frequent") {
    warnings.push("Your system can rely more on shore recharging, so off-grid autonomy requirements are lower.");
  } else if (shore === "never") {
    warnings.push("Your system is sized more conservatively because you do not plan to rely on shore power.");
  } else if (shore === "home-between-trips") {
    warnings.push("Your system assumes you can recharge at home between trips, but still needs to cover your off-grid stay.");
  }
  // High-power AC appliance warnings
  const highBattery = highPowerAcAppliances.filter((a) => !a.shoreOnly);
  const highShore = highPowerAcAppliances.filter((a) => a.shoreOnly);
  if (highBattery.length > 0) {
    const names = highBattery.map((a) => a.label).join(", ");
    warnings.push(`High-power 230V appliances selected (${names}) — these may require a much larger inverter, battery bank and heavy-gauge cabling. Consider running them only on shore power.`);
  }
  if (highShore.length > 0) {
    const names = highShore.map((a) => a.label).join(", ");
    warnings.push(`Shore-only high-power appliances selected (${names}) — these will only work when plugged into external 230V power and are excluded from battery and inverter sizing.`);
  }
  if (max230VInverter > 2500) {
    warnings.push("Inverter loads above 2500W draw >200A from the battery. Use 70mm² cables and a Class T fuse.");
  }
  // Diesel heater + petrol vehicle: heater can't draw from main tank.
  const dieselHeaterEnabled = !!step4.appliances?.["diesel-heater"]?.enabled;
  if (dieselHeaterEnabled && step1.engine === "petrol") {
    warnings.push(
      "Diesel heater with petrol vehicle: your heater will likely need a separate diesel fuel tank. Plan space, safe mounting and refilling access.",
    );
  }
  const budget: Budget = step12.budget ?? "show-me";
  const budgetMaxMap: Record<Budget, number> = {
    "<500": 500, "500-1000": 1000, "1000-2000": 2000, "2000-3000": 3000, "3000+": Infinity, "show-me": Infinity,
  };
  if (budget !== "show-me" && totalBudget > budgetMaxMap[budget]) {
    warnings.push(`Recommended system (~€${Math.round(totalBudget)}) exceeds your stated budget. Consider a smaller battery bank or reducing 230V appliances.`);
  }

  return {
    lines, shoreLines,
    applianceSubtotalWh, dailyWh12V, dailyWh230VInverter,
    inverterLossWh, remoteWorkWh: rwWh, reserveWh, totalDailyWh, hasInverterLoad,
    inverterPeakW: max230VInverter, inverterSizeRecommendedW,
    acRecommendation, highPowerAcAppliances,
    daysAutonomy, journeyWh, requiredWh, requiredAh, recommendedBatteryAh, usableBatteryWh,
    roofArea, obstacleArea, maxSolarW, solarHours, requiredSolarW, recommendedSolarW, panelType, solarDailyWh,
    alternatorDailyWh, hasDCDC,
    components,
    materials, materialsTotal,
    materialGroups, dcMaterialsTotal, solarMaterialsTotal, shoreMaterialsTotal,
    shoreInstallMode, hasInternal230VSockets,
    componentsTotal, subtotal, contingency, totalBudget,
    warnings,
  };
}
